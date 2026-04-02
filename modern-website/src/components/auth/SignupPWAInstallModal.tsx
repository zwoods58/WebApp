"use client";

import React, { useEffect } from 'react';
import { X, Download, Smartphone, Zap, Wifi, Home, ArrowRight } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

interface SignupPWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const SignupPWAInstallModal: React.FC<SignupPWAInstallModalProps> = ({ isOpen, onClose, onContinue }) => {
  const { canInstall, isInstalling, install, skipInstall } = usePWAInstall();

  // Auto-continue when PWA install is not available
  useEffect(() => {
    if (!canInstall && isOpen) {
      onContinue();
    }
  }, [canInstall, isOpen, onContinue]);

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      // Installation successful, continue with signup after a short delay
      setTimeout(() => {
        onContinue();
      }, 2000);
    }
  };

  const handleSkip = () => {
    skipInstall();
    onClose();
    onContinue();
  };

  const handleContinue = () => {
    onClose();
    onContinue();
  };

  if (!isOpen || !canInstall) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-white animate-fade-in" onClick={onClose} />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[110] p-4">
            <div className="animate-scale-in">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 active:scale-95 transition-all"
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              <div className="p-10 text-center">
                {/* Icon Header */}
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600">
                      <Download size={40} strokeWidth={1.5} />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-white p-2 rounded-xl shadow-lg text-blue-600 animate-fade-in">
                      <Smartphone size={20} />
                    </div>
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-[-0.02em]">
                  Install BeeZee App
                </h3>

                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Get the full BeeZee experience on your device
                  <br /><span className="font-semibold text-blue-600">Install for faster access and offline features</span>
                </p>

                {/* Benefits */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-700 font-medium">Lightning Fast</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Wifi className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-700 font-medium">Works Offline</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Home className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-xs text-gray-700 font-medium">Home Screen</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isInstalling ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                    className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98]"
                  >
                    SKIP, CONTINUE TO SIGNUP
                  </button>

                  <button
                    onClick={handleContinue}
                    className="w-full py-3 text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm"
                  >
                    Continue without installing
                  </button>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono font-black text-gray-300 tracking-widest uppercase">
                    SECURE • FAST • RELIABLE
                  </span>
                </div>
              </div>
            </div>
          </div>
    </>
  );
};

export default SignupPWAInstallModal;
