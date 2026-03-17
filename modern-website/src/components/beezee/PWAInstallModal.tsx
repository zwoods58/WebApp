"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone, Zap, Wifi, Home } from 'lucide-react';
import Link from 'next/link';
import { usePWAInstall } from '@/hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { canInstall, isInstalling, install, skipInstall } = usePWAInstall();

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      // Installation successful, redirect to signup after a short delay
      setTimeout(() => {
        window.location.href = '/Beezee-App/auth/signup';
      }, 2000);
    }
  };

  const handleSkip = () => {
    skipInstall();
    onClose();
  };

  const handleDirectSignup = () => {
    onClose();
    // Direct navigation to signup
    window.location.href = '/Beezee-App/auth/signup';
  };

  if (!canInstall && isOpen) {
    // If PWA install is not available, just redirect to signup
    handleDirectSignup();
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && canInstall && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[110] p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-pure-white rounded-3xl overflow-hidden shadow-2xl pointer-events-auto border border-glass-border relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-mist-gray transition-colors text-obsidian/40 hover:text-obsidian active:scale-95 transition-all"
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              <div className="p-10 text-center">
                {/* Icon Header */}
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-system-blue/10 rounded-3xl flex items-center justify-center text-system-blue">
                      <Download size={40} strokeWidth={1.5} />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -top-2 -right-2 bg-pure-white p-2 rounded-xl shadow-lg text-system-blue"
                    >
                      <Smartphone size={20} />
                    </motion.div>
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-obsidian mb-4 tracking-[-0.02em]">
                  Install BeeZee App
                </h3>

                <p className="text-obsidian/60 text-lg leading-relaxed mb-8">
                  Get the full BeeZee experience on your device
                  <br /><span className="font-semibold text-system-blue">Install for faster access and offline features</span>
                </p>

                {/* Benefits */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-xs text-obsidian/70 font-medium">Lightning Fast</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Wifi className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-xs text-obsidian/70 font-medium">Works Offline</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Home className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-xs text-obsidian/70 font-medium">Home Screen</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="w-full py-4 bg-system-blue text-pure-white font-bold rounded-2xl hover:bg-system-blue/90 transition-all active:scale-[0.98] shadow-lg shadow-system-blue/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isInstalling ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Installing...
                      </>
                    ) : (
                      <>
                        <Download size={18} />
                        INSTALL APP
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleSkip}
                    className="w-full py-4 bg-mist-gray text-obsidian font-bold rounded-2xl hover:bg-mist-gray/80 transition-all active:scale-[0.98]"
                  >
                    SKIP, CONTINUE TO SIGNUP
                  </button>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-system-blue rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono font-black text-obsidian/30 tracking-widest uppercase">
                    SECURE • FAST • RELIABLE
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallModal;
