"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Download, X } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';

export const OfflineBanner: React.FC = () => {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check initial state safely
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-orange-500 text-white px-4 py-2 pt-safe flex items-center justify-center gap-2 text-sm font-medium shadow-md"
        >
          <WifiOff size={16} />
          {t('pwa.offline_message', 'You are currently offline. Some features may be unavailable.')}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const PWAInstallPrompt: React.FC = () => {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handler = (e: Event) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        setDeferredPrompt(e);
        // Update UI notify the user they can install the PWA
        
        // Only show if we haven't dismissed it recently
        const dismissed = localStorage.getItem('pwaPromptDismissed');
        if (!dismissed || Date.now() - parseInt(dismissed) > 86400000) { // 24 hours
          setTimeout(() => setShowPrompt(true), 3000); // Show after 3 seconds
        }
      };

      window.addEventListener('beforeinstallprompt', handler);

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pwaPromptDismissed', Date.now().toString());
    }
  };

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-[90] glass-regular rounded-2xl p-4 shadow-float border border-[var(--border)]"
        >
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-[var(--text-3)] p-1"
          >
            <X size={16} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--powder-dark)] rounded-xl flex items-center justify-center text-white shrink-0 shadow-inner">
              <Download size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[var(--text-1)] text-sm">{t('pwa.install_title', 'Install Beezee App')}</h4>
              <p className="text-xs text-[var(--text-2)] leading-tight mt-0.5">{t('pwa.install_description', 'Add to home screen for quick access and offline use.')}</p>
            </div>
          </div>
          
          <button
            onClick={handleInstall}
            className="w-full mt-3 py-2 bg-[var(--powder-dark)] hover:bg-[var(--powder)] text-white rounded-lg font-medium text-sm transition-colors"
          >
            {t('pwa.add_to_home', 'Add to Home Screen')}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
