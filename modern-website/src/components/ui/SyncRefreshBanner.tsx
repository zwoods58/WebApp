/**
 * Sync Refresh Banner Component
 * Shows manual refresh prompt after Background Sync completion
 * User-controlled dismissal with smooth animations
 */

"use client"

import { useEffect, useState } from 'react'
import { onSyncComplete } from '@/utils/registerSW'

export function SyncRefreshBanner() {
  const [visible, setVisible] = useState(false)
  const [syncData, setSyncData] = useState<{ successCount: number; failureCount: number; total: number } | null>(null)

  useEffect(() => {
    // Listen for sync completion events
    const unsubscribe = onSyncComplete((data) => {
      if (data && data.successCount > 0) {
        setSyncData(data)
        setVisible(true)
      }
    })

    return () => {
      // Cleanup - remove callback
      // Note: In a real implementation, we'd need an unsubscribe function
    }
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleDismiss = () => {
    setVisible(false)
  }

  if (!visible || !syncData) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        animation: 'slideDown 0.3s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>
          ✓ Back online — refresh to see your latest data
        </div>
        {syncData.total > 1 && (
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            Synced {syncData.successCount} of {syncData.total} items
            {syncData.failureCount > 0 && ` (${syncData.failureCount} failed)`}
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
        <button
          onClick={handleRefresh}
          style={{
            backgroundColor: '#fff',
            color: '#1a1a1a',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f0f0'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#fff'
          }}
        >
          Refresh Now
        </button>
        
        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '4px',
            padding: '6px 10px',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease, border-color 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
          }}
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes slideDown {
          from { 
            transform: translateY(-100%); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0); 
            opacity: 1; 
          }
        }
      `}</style>
    </div>
  )
}
