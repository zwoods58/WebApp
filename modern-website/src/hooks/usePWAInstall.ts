"use client";

import { useState, useEffect } from 'react';

export interface UsePWAInstallReturn {
  canInstall: boolean;
  isInstalled: boolean;
  isInstalling: boolean;
  install: () => Promise<boolean>;
  skipInstall: () => void;
}

export const usePWAInstall = (): UsePWAInstallReturn => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      // Check if running in standalone mode (already installed PWA)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
      
      // Check if app is in iOS standalone mode
      if ('standalone' in window.navigator && (window.navigator as any).standalone) {
        setIsInstalled(true);
      }
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    checkIfInstalled();
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!installPrompt || isInstalled) {
      return false;
    }

    setIsInstalling(true);
    
    try {
      // Show the install prompt
      const result = await installPrompt.prompt();
      
      // Wait for the user's response
      const choiceResult = await result.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setInstallPrompt(null);
        setIsInstalling(false);
        return true;
      } else {
        setIsInstalling(false);
        return false;
      }
    } catch (error) {
      console.error('PWA installation failed:', error);
      setIsInstalling(false);
      return false;
    }
  };

  const skipInstall = () => {
    setInstallPrompt(null);
  };

  return {
    canInstall: !!installPrompt && !isInstalled,
    isInstalled,
    isInstalling,
    install,
    skipInstall,
  };
};
