"use client";

import { useState, useEffect } from 'react';

export default function UpdateProgress() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const handleUpdateStart = () => {
      setIsUpdating(true);
      setProgress(0);
      
      // Simulate progress for UX
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);
      
      // Store interval for cleanup
      (handleUpdateStart as any).interval = interval;
    };
    
    const handleUpdateComplete = () => {
      setProgress(100);
      setTimeout(() => setIsUpdating(false), 500);
      
      // Clear interval if exists
      if ((handleUpdateStart as any).interval) {
        clearInterval((handleUpdateStart as any).interval);
      }
    };
    
    window.addEventListener('app-update-start', handleUpdateStart);
    window.addEventListener('app-update-complete', handleUpdateComplete);
    
    return () => {
      window.removeEventListener('app-update-start', handleUpdateStart);
      window.removeEventListener('app-update-complete', handleUpdateComplete);
      
      // Clear interval on cleanup
      if ((handleUpdateStart as any).interval) {
        clearInterval((handleUpdateStart as any).interval);
      }
    };
  }, []);
  
  if (!isUpdating) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-blue-100">
        <div 
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-center text-xs text-gray-500 py-1 bg-white/90 backdrop-blur-sm">
        Updating app...
      </div>
    </div>
  );
}
