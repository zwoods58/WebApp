"use client";

import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Globe, Check } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  canInstall: boolean;
}

export default function PWAInstallModal({ isOpen, onClose, onInstall, canInstall }: PWAInstallModalProps) {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Detect platform
      const userAgent = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(userAgent)) {
        setPlatform('ios');
      } else if (/android/.test(userAgent)) {
        setPlatform('android');
      } else {
        setPlatform('desktop');
      }
    }
  }, [isOpen]);

  const getInstallInstructions = () => {
    switch (platform) {
      case 'ios':
        return {
          icon: <Smartphone className="w-6 h-6" />,
          title: "Install on iOS",
          steps: [
            "Tap the Share button in Safari",
            "Scroll down and tap 'Add to Home Screen'",
            "Tap 'Add' to install BeeZee"
          ]
        };
      case 'android':
        return {
          icon: <Smartphone className="w-6 h-6" />,
          title: "Install on Android",
          steps: [
            "Tap the menu button (three dots)",
            "Tap 'Install app' or 'Add to Home screen'",
            "Tap 'Install' to confirm"
          ]
        };
      default:
        return {
          icon: <Globe className="w-6 h-6" />,
          title: "Install on Desktop",
          steps: [
            "Click the install button below",
            "Confirm the installation in your browser",
            "BeeZee will be available in your applications"
          ]
        };
    }
  };

  if (!isOpen || !platform) return null;

  const instructions = getInstallInstructions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Download className="w-8 h-8 text-orange-500" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Install BeeZee
          </h3>
          
          <p className="text-gray-600">
            Get the full app experience on your {platform === 'desktop' ? 'computer' : 'device'}
          </p>
        </div>

        {/* Platform Specific Instructions */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
              {instructions.icon}
            </div>
            <h4 className="font-semibold text-gray-900">{instructions.title}</h4>
          </div>

          <div className="space-y-3">
            {instructions.steps.map((step, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-3">Why install?</h4>
          <div className="space-y-2">
            {[
              "Offline access to your data",
              "Faster loading and performance",
              "Native app experience",
              "Push notifications (coming soon)"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {canInstall && platform === 'desktop' && (
            <button
              onClick={onInstall}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
          )}
          
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Maybe Later
          </button>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Free installation. No additional costs.
          </p>
        </div>
      </div>
    </div>
  );
}
