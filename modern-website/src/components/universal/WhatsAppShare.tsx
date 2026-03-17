"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';

interface WhatsAppShareProps {
  message: string;
  phoneNumber?: string;
  onShare?: () => void;
  buttonText?: string;
  buttonClassName?: string;
  showIcon?: boolean;
}

export default function WhatsAppShare({
  message,
  phoneNumber,
  onShare,
  buttonText,
  buttonClassName = "flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors",
  showIcon = true
}: WhatsAppShareProps) {
  const { t } = useLanguage();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const cleanPhoneNumber = (phoneNum: string): string => {
    // Remove all non-numeric characters except +
    let cleaned = phoneNum.replace(/[^\d+]/g, '');
    
    // If starts with 0, remove it (common in many countries)
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    // If doesn't start with +, add it
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  };

  const validatePhoneNumber = (phoneNum: string): boolean => {
    const cleaned = cleanPhoneNumber(phoneNum);
    // Basic validation: should start with + and have at least 10 digits
    return /^\+\d{10,15}$/.test(cleaned);
  };

  const generateWhatsAppLink = (phoneNum: string): string => {
    const cleaned = cleanPhoneNumber(phoneNum);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleaned.substring(1)}?text=${encodedMessage}`;
  };

  const handleShare = () => {
    if (phoneNumber) {
      // Phone number provided, share directly
      const link = generateWhatsAppLink(phoneNumber);
      window.open(link, '_blank');
      if (onShare) onShare();
    } else {
      // No phone number, show modal to collect it
      setShowPhoneModal(true);
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone.trim()) {
      setError(t('receipt.error_phone_required', 'Phone number is required'));
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setError(t('receipt.error_phone_invalid', 'Please enter a valid phone number with country code'));
      return;
    }

    const link = generateWhatsAppLink(phone);
    window.open(link, '_blank');
    setShowPhoneModal(false);
    setPhone('');
    if (onShare) onShare();
  };

  return (
    <>
      <button
        onClick={handleShare}
        className={buttonClassName}
      >
        {showIcon && (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        )}
        <span>{buttonText || t('receipt.share_whatsapp', 'Share via WhatsApp')}</span>
      </button>

      {/* Phone Number Modal */}
      <AnimatePresence>
        {showPhoneModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPhoneModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {t('receipt.enter_phone', 'Enter customer phone number')}
                </h3>
                <button
                  onClick={() => setShowPhoneModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('receipt.phone_label', 'Phone Number')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254712345678"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      error ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {error && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                      <AlertCircle size={12} />
                      <span>{error}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {t('receipt.phone_hint', 'Include country code (e.g., +254 for Kenya)')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPhoneModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {t('common.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                  >
                    <Send size={18} />
                    <span>{t('common.send', 'Send')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
