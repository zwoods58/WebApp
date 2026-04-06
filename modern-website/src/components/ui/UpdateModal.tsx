"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X, Download } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onLater: () => void;
  isUpdating: boolean;
  currentVersion: string;
  newVersion: string;
}

export default function UpdateModal({
  isOpen,
  onClose,
  onUpdate,
  onLater,
  isUpdating,
  currentVersion,
  newVersion
}: UpdateModalProps) {
  const { t } = useLanguage();
  
  const handleUpdate = () => {
    if (!isUpdating) {
      onUpdate();
    }
  };

  const handleLater = () => {
    if (!isUpdating) {
      onLater();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="glass-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[var(--border)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[var(--powder)]/10 border-b border-[var(--border)] px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-[var(--powder-dark)]">
                    <Download size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[var(--text-1)]">
                      {t('modal.update_available')}
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
                    disabled={isUpdating}
                  >
                    <X size={20} className="text-[var(--text-3)]" />
                  </button>
                </div>
              </div>
              
              {/* Body */}
              <div className="px-6 py-4">
                <p className="text-[var(--text-2)] leading-relaxed mb-4">
                  {t('modal.update_description')}
                </p>
                
                {/* Version Info */}
                <div className="bg-[var(--bg2)] rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-3)]">{t('modal.current_version')}</span>
                    <span className="font-medium text-[var(--text-2)]">{currentVersion}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-[var(--text-3)]">{t('modal.new_version')}</span>
                    <span className="font-medium text-[var(--powder-dark)]">{newVersion}</span>
                  </div>
                </div>

                {/* 24-hour notice for Later button */}
                {!isUpdating && (
                  <p className="text-xs text-[var(--text-3)] text-center">
                    {t('modal.reminder_24h')}
                  </p>
                )}
              </div>
              
              {/* Footer */}
              <div className="px-6 py-4 bg-[var(--bg)] border-t border-[var(--border)]">
                <div className="flex gap-3">
                  <button
                    onClick={handleLater}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-2.5 bg-white border border-[var(--border)] text-[var(--text-1)] rounded-lg font-medium hover:bg-[var(--bg2)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('modal.later')}
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-2.5 bg-[var(--powder-dark)] text-white rounded-lg font-medium hover:bg-[var(--powder-darker)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t('modal.updating')}
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} />
                        {t('modal.update_now')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
