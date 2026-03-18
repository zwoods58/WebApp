/**
 * Failed Sync Modal Component
 * Shows failed operations with retry and discard options
 */

"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, RefreshCw, Trash2, X, AlertTriangle } from 'lucide-react';
import { OfflineOperation } from '@/types/offlineTypes';

interface FailedSyncModalProps {
  isOpen: boolean;
  failedOperations: OfflineOperation[];
  onClose: () => void;
  onRetryAll: () => void;
  onRetryOne: (operationId: string) => void;
  onDiscardOne: (operationId: string) => void;
  onDiscardAll: () => void;
}

const FailedSyncModal: React.FC<FailedSyncModalProps> = ({
  isOpen,
  failedOperations,
  onClose,
  onRetryAll,
  onRetryOne,
  onDiscardOne,
  onDiscardAll
}) => {
  if (!isOpen) return null;

  const getFeatureName = (feature: string): string => {
    const names: Record<string, string> = {
      cash: 'Cash',
      inventory: 'Inventory',
      calendar: 'Calendar',
      credit: 'Credit',
      beehive: 'Beehive'
    };
    return names[feature] || feature;
  };

  const getOperationLabel = (operation: OfflineOperation): string => {
    const labels: Record<string, Record<string, string>> = {
      cash: {
        sale: 'Sale Transaction',
        expense: 'Expense',
        transfer: 'Transfer'
      },
      inventory: {
        add_item: 'Add Item',
        update_stock: 'Stock Update',
        stock_adjustment: 'Stock Adjustment'
      },
      calendar: {
        create_appointment: 'New Appointment',
        reschedule: 'Reschedule',
        cancel: 'Cancellation'
      },
      credit: {
        issue_credit: 'Issue Credit',
        repayment: 'Repayment'
      },
      beehive: {
        create_post: 'New Post',
        comment: 'Comment',
        like: 'Like'
      }
    };
    
    return labels[operation.feature]?.[operation.type] || operation.type;
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-[90] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-red-500 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle size={24} />
                <div>
                  <h2 className="text-lg font-bold">Failed to Sync</h2>
                  <p className="text-sm opacity-90">{failedOperations.length} items need attention</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-red-600 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto p-6">
              <div className="space-y-4">
                {failedOperations.map((operation) => (
                  <div
                    key={operation.id}
                    className="border border-red-200 rounded-lg p-4 bg-red-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-semibold rounded">
                            {getFeatureName(operation.feature)}
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            {getOperationLabel(operation)}
                          </span>
                        </div>
                        
                        {operation.errorDetails && (
                          <p className="text-sm text-red-700 mb-2">
                            <span className="font-semibold">Error:</span> {operation.errorDetails}
                          </p>
                        )}
                        
                        <p className="text-xs text-gray-500">
                          Attempted {operation.retryCount} times • 
                          {new Date(operation.timestamp).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => onRetryOne(operation.id)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                          title="Retry this operation"
                        >
                          <RefreshCw size={16} />
                        </button>
                        <button
                          onClick={() => onDiscardOne(operation.id)}
                          className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                          title="Discard this operation"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex gap-3">
              <button
                onClick={onRetryAll}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Retry All
              </button>
              <button
                onClick={onDiscardAll}
                className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Discard All
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FailedSyncModal;
