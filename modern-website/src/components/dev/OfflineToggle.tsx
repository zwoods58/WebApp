/**
 * Offline Toggle Component (Development Only)
 * Allows developers to simulate offline mode for testing
 */

"use client";

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, Zap } from 'lucide-react';

const OfflineToggle: React.FC = () => {
  const [isSimulatingOffline, setIsSimulatingOffline] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development mode
    setIsVisible(process.env.NODE_ENV === 'development');
  }, []);

  const toggleOfflineMode = () => {
    setIsSimulatingOffline(!isSimulatingOffline);
    
    if (!isSimulatingOffline) {
      // Simulate going offline
      console.log('🔧 DEV: Simulating offline mode');
      window.dispatchEvent(new Event('offline'));
    } else {
      // Simulate coming back online
      console.log('🔧 DEV: Simulating online mode');
      window.dispatchEvent(new Event('online'));
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      <button
        onClick={toggleOfflineMode}
        className={`
          px-4 py-2 rounded-lg shadow-lg font-semibold text-sm
          flex items-center gap-2 transition-all duration-200
          ${isSimulatingOffline 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-green-500 hover:bg-green-600 text-white'
          }
        `}
        title={isSimulatingOffline ? 'Click to go online' : 'Click to go offline'}
      >
        <Zap size={16} />
        {isSimulatingOffline ? (
          <>
            <WifiOff size={16} />
            <span>Offline Mode</span>
          </>
        ) : (
          <>
            <Wifi size={16} />
            <span>Online Mode</span>
          </>
        )}
      </button>
      <div className="mt-2 text-xs text-gray-500 text-center bg-white px-2 py-1 rounded shadow">
        Dev Tool
      </div>
    </div>
  );
};

export default OfflineToggle;
