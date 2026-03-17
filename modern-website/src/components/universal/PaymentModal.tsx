"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { useLanguage } from '@/hooks/LanguageContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: {
    id: string;
    customer_name: string;
    amount: number;
    paid_amount: number;
    status: string;
    due_date?: string;
  };
  country: string;
  onPayment: (creditId: string, paymentAmount: number) => Promise<void>;
}

export default function PaymentModal({ isOpen, onClose, customer, country, onPayment }: PaymentModalProps) {
  const { t } = useLanguage();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const remainingBalance = customer.status === 'partial' 
    ? customer.amount - customer.paid_amount 
    : customer.amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount);
    
    if (amount <= 0 || amount > remainingBalance) {
      alert(t('credit.invalid_payment_amount', 'Invalid payment amount'));
      return;
    }

    setLoading(true);
    try {
      await onPayment(customer.id, amount);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setPaymentAmount('');
      }, 1500);
    } catch (error) {
      console.error('Payment failed:', error);
      alert(t('credit.payment_failed', 'Payment failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    setLoading(true);
    try {
      await onPayment(customer.id, remainingBalance);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setPaymentAmount('');
      }, 1500);
    } catch (error) {
      console.error('Payment failed:', error);
      alert(t('credit.payment_failed', 'Payment failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-xl flex items-center justify-center z-[70] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-100/80 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md relative border border-white/20"
        >
          {/* Apple-style Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-16" />
            <h3 className="text-lg font-semibold text-black">
              {t('credit.record_payment', 'Record Payment')}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-200/50 hover:bg-gray-300/50 flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-black" />
            </button>
          </div>

          {/* Success State */}
          {success ? (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-100/50 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle size={48} className="text-green-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-black mb-2">
                {t('credit.payment_recorded', 'Payment Recorded!')}
              </h3>
              <p className="text-black/70">
                {t('credit.payment_success_message', 'Payment has been successfully recorded')}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-black/70 mb-6">
                {t('credit.for_customer', 'For')}: <span className="font-semibold text-black">{customer.customer_name}</span>
              </p>

              {/* Balance Info */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/30">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-black/70">{t('credit.original_amount', 'Original Amount')}</span>
                  <span className="font-bold text-black">{formatCurrency(customer.amount, country)}</span>
                </div>
                
                {customer.status === 'partial' && (
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-black/70">{t('credit.paid_so_far', 'Paid So Far')}</span>
                    <span className="font-bold text-green-600">{formatCurrency(customer.paid_amount, country)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-white/30">
                  <span className="text-sm font-semibold text-black">{t('credit.remaining_balance', 'Remaining Balance')}</span>
                  <span className="text-xl font-bold text-orange-600">{formatCurrency(remainingBalance, country)}</span>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    {t('credit.payment_amount', 'Payment Amount')}
                  </label>
                  <div className="relative">
                    <DollarSign size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50" />
                    <input
                      type="number"
                      step="0.01"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      max={remainingBalance}
                    />
                  </div>
                  <p className="text-xs text-black/50 mt-1">
                    {t('credit.max_payment', 'Maximum')}: {formatCurrency(remainingBalance, country)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading || !paymentAmount}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Clock size={20} />
                    {loading ? t('common.processing', 'Processing...') : t('credit.record_partial_payment', 'Record Partial Payment')}
                  </button>

                  <button
                    type="button"
                    onClick={handleMarkAsPaid}
                    disabled={loading}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    {loading ? t('common.processing', 'Processing...') : t('credit.mark_as_paid', 'Mark as Fully Paid')}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="w-full py-3 bg-gray-200/50 text-black font-semibold rounded-xl hover:bg-gray-300/50 transition-colors"
                  >
                    {t('common.cancel', 'Cancel')}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
