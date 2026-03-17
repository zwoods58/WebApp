"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, FileText } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';
import { formatCurrency } from '@/utils/currency';
import WhatsAppShare from './WhatsAppShare';

interface ReceiptGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    amount: number;
    description?: string;
    customer_name?: string;
    transaction_date: string;
    payment_method?: string;
    metadata?: {
      inventory_items?: Array<{
        name: string;
        quantity: number;
        unit_price: number;
        total_price: number;
      }>;
      subtotal?: number;
      tax?: number;
      total?: number;
    };
  };
  businessName: string;
  country: string;
  customerPhone?: string;
}

export default function ReceiptGenerator({
  isOpen,
  onClose,
  transaction,
  businessName,
  country,
  customerPhone
}: ReceiptGeneratorProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const generateReceiptText = (): string => {
    const date = new Date(transaction.transaction_date);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    let receipt = `📄 RECEIPT\n`;
    receipt += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    receipt += `${businessName}\n`;
    receipt += `${formattedDate}\n`;
    receipt += `${formattedTime}\n\n`;
    
    if (transaction.customer_name) {
      receipt += `Customer: ${transaction.customer_name}\n`;
      receipt += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    } else {
      receipt += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    }

    // Check for itemized breakdown in metadata
    const items = transaction.metadata?.inventory_items;
    
    if (items && items.length > 0) {
      // Itemized receipt
      items.forEach(item => {
        receipt += `${item.name}\n`;
        receipt += `  ${item.quantity} x ${formatCurrency(item.unit_price, country)} = ${formatCurrency(item.total_price, country)}\n\n`;
      });
      
      receipt += `━━━━━━━━━━━━━━━━━━━━\n`;
      
      if (transaction.metadata?.subtotal !== undefined) {
        receipt += `Subtotal: ${formatCurrency(transaction.metadata.subtotal, country)}\n`;
      }
      
      if (transaction.metadata?.tax !== undefined && transaction.metadata.tax > 0) {
        receipt += `Tax: ${formatCurrency(transaction.metadata.tax, country)}\n`;
      }
      
      receipt += `TOTAL: ${formatCurrency(transaction.metadata?.total || transaction.amount, country)}\n`;
    } else if (transaction.description) {
      // Simple receipt with description
      receipt += `${transaction.description}\n`;
      receipt += `${formatCurrency(transaction.amount, country)}\n\n`;
      
      receipt += `━━━━━━━━━━━━━━━━━━━━\n`;
      receipt += `TOTAL: ${formatCurrency(transaction.amount, country)}\n`;
    } else {
      // Fallback - just amount
      receipt += `Payment Received\n`;
      receipt += `${formatCurrency(transaction.amount, country)}\n\n`;
      
      receipt += `━━━━━━━━━━━━━━━━━━━━\n`;
      receipt += `TOTAL: ${formatCurrency(transaction.amount, country)}\n`;
    }
    
    if (transaction.payment_method) {
      receipt += `Payment: ${transaction.payment_method}\n`;
    }
    
    receipt += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    receipt += `Thank you for your business!\n`;
    receipt += `Powered by Beezee 🐝`;

    return receipt;
  };

  const receiptText = generateReceiptText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(receiptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText size={20} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {t('receipt.title', 'Receipt')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Receipt Preview */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="bg-gray-50 rounded-xl p-6 font-mono text-sm whitespace-pre-wrap border border-gray-200">
              {receiptText}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-3">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 bg-white rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check size={18} className="text-green-600" />
                  <span className="text-green-600">{t('receipt.copied', 'Copied!')}</span>
                </>
              ) : (
                <>
                  <Copy size={18} />
                  <span>{t('receipt.copy', 'Copy to Clipboard')}</span>
                </>
              )}
            </button>

            {/* WhatsApp Share Button */}
            <WhatsAppShare
              message={receiptText}
              phoneNumber={customerPhone}
              buttonText={t('receipt.share_whatsapp', 'Share via WhatsApp')}
              buttonClassName="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
