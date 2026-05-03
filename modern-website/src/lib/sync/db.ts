// Database sync utilities
export interface SyncRecord {
  id: string
  table: string
  action: 'create' | 'update' | 'delete'
  data: any
  timestamp: string
  synced: boolean
}

export class SyncDB {
  private static instance: SyncDB
  private records: SyncRecord[] = []

  static getInstance(): SyncDB {
    if (!SyncDB.instance) {
      SyncDB.instance = new SyncDB()
    }
    return SyncDB.instance
  }

  addRecord(record: Omit<SyncRecord, 'id' | 'timestamp' | 'synced'>): string {
    const id = crypto.randomUUID()
    const syncRecord: SyncRecord = {
      ...record,
      id,
      timestamp: new Date().toISOString(),
      synced: false
    }
    this.records.push(syncRecord)
    return id
  }

  getPendingRecords(): SyncRecord[] {
    return this.records.filter(r => !r.synced)
  }

  markAsSynced(id: string): void {
    const record = this.records.find(r => r.id === id)
    if (record) {
      record.synced = true
    }
  }

  clearSyncedRecords(): void {
    this.records = this.records.filter(r => !r.synced)
  }
}

export const syncDB = SyncDB.getInstance()
