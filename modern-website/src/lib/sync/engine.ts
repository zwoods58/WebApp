import { syncDB, type SyncRecord } from './db'
import { createClient } from '@/lib/supabase/client'

export class SyncEngine {
  private static instance: SyncEngine
  private isOnline = true
  private syncInterval: NodeJS.Timeout | null = null

  static getInstance(): SyncEngine {
    if (!SyncEngine.instance) {
      SyncEngine.instance = new SyncEngine()
    }
    return SyncEngine.instance
  }

  start(): void {
    if (this.syncInterval) return

    this.syncInterval = setInterval(() => {
      this.syncPendingRecords()
    }, 30000) // Sync every 30 seconds
  }

  stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  setOnlineStatus(status: boolean): void {
    this.isOnline = status
    if (status) {
      this.syncPendingRecords()
    }
  }

  private async syncPendingRecords(): Promise<void> {
    if (!this.isOnline) return

    const pendingRecords = syncDB.getPendingRecords()
    if (pendingRecords.length === 0) return

    const supabase = createClient()

    for (const record of pendingRecords) {
      try {
        await this.syncRecord(record, supabase)
        syncDB.markAsSynced(record.id)
      } catch (error) {
        console.error('Failed to sync record:', record.id, error)
      }
    }

    syncDB.clearSyncedRecords()
  }

  private async syncRecord(record: SyncRecord, supabase: any): Promise<void> {
    switch (record.action) {
      case 'create':
        await supabase.from(record.table).insert(record.data)
        break
      case 'update':
        await supabase.from(record.table).update(record.data).eq('id', record.data.id)
        break
      case 'delete':
        await supabase.from(record.table).delete().eq('id', record.data.id)
        break
    }
  }

  addRecord(table: string, action: 'create' | 'update' | 'delete', data: any): string {
    return syncDB.addRecord({ table, action, data })
  }
}

export const syncEngine = SyncEngine.getInstance()
