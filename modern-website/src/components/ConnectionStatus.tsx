// src/components/ConnectionStatus.tsx
'use client'

import { onlineManager } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Wifi, WifiOff, AlertCircle, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [showOfflinePopup, setShowOfflinePopup] = useState(false)
  const [showOnlinePopup, setShowOnlinePopup] = useState(false)
  const queryClient = useQueryClient()
  
  useEffect(() => {
    // Subscribe to TanStack Query's online state
    const unsubscribe = onlineManager.subscribe(() => {
      const wasOnline = isOnline;
      const nowOnline = onlineManager.isOnline();
      setIsOnline(nowOnline);
      
      // Show popup when status changes
      if (wasOnline && !nowOnline) {
        // Going offline
        setShowOfflinePopup(true);
        setTimeout(() => setShowOfflinePopup(false), 3000);
      } else if (!wasOnline && nowOnline) {
        // Coming back online
        setShowOnlinePopup(true);
        setTimeout(() => setShowOnlinePopup(false), 3000);
      }
    })
    
    // Count paused mutations (offline queue)
    const updatePendingCount = () => {
      const mutations = queryClient.getMutationCache().getAll()
      const paused = mutations.filter(m => m.state.isPaused).length
      setPendingCount(paused)
    }
    
    updatePendingCount()
    const unsubscribeMutations = queryClient.getMutationCache().subscribe(updatePendingCount)
    
    return () => {
      unsubscribe()
      unsubscribeMutations()
    }
  }, [queryClient, isOnline])
  
  return (
    <>
      {/* Universal Offline Popup */}
      <AnimatePresence>
        {showOfflinePopup && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-20 left-0 right-0 z-[70] flex justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-red-500 text-white px-8 py-6 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-auto"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <WifiOff size={24} />
              </motion.div>
              <div className="text-center">
                <div className="text-xl font-bold mb-1">Offline Mode</div>
                <div className="text-sm opacity-90">Changes will sync when connected</div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Clock size={20} className="animate-pulse" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Universal Online Popup */}
      <AnimatePresence>
        {showOnlinePopup && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-20 left-0 right-0 z-[70] flex justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-green-500 text-white px-8 py-6 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-auto"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Wifi size={24} />
              </motion.div>
              <div className="text-center">
                <div className="text-xl font-bold mb-1">Connection Restored</div>
                <div className="text-sm opacity-90">You're back online</div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: 2 }}
              >
                <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Badges for ongoing status */}
      <div className="fixed top-4 right-4 z-[60] pointer-events-none">
        <div className="flex gap-2 items-center">
          {/* Pending Items Badge */}
          <AnimatePresence>
            {pendingCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="pointer-events-auto"
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full shadow-sm">
                  <AlertCircle size={12} className="text-amber-600 animate-pulse" />
                  <span className="text-xs font-medium text-amber-700">
                    {pendingCount}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
