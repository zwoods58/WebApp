'use client'

import { onlineManager } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

interface PendingBadgeProps {
  show?: boolean
  className?: string
}

export function PendingBadge({ show, className = '' }: PendingBadgeProps) {
  const [isOnline, setIsOnline] = useState(true)
  
  useEffect(() => {
    const unsubscribe = onlineManager.subscribe(() => {
      setIsOnline(onlineManager.isOnline())
    })
    return unsubscribe
  }, [])
  
  if (!show) return null
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full 
                      bg-yellow-100 text-yellow-800 text-xs font-medium ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full 
                         rounded-full bg-yellow-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 
                         bg-yellow-500"></span>
      </span>
      {!isOnline ? 'Pending (Offline)' : 'Syncing...'}
    </span>
  )
}
