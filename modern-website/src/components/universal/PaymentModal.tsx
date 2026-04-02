"use client";

import React, { useState } from 'react';
import { X, DollarSign, CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
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

  // Calculate overdue status
  const isOverdue = () => {
    if (customer.status === 'paid' || !customer.due_date) return false;
    
    const dueDateTime = new Date(customer.due_date);
    const currentDateTime = new Date();
    const daysPastDue = Math.ceil((currentDateTime.getTime() - dueDateTime.getTime()) / (1000 * 60 * 60 * 24));
    
    // Only consider overdue after 1 full day past due date
    return daysPastDue >= 1;
  };

  const daysOverdue = customer.due_date ? Math.max(0, Math.ceil((new Date().getTime() - new Date(customer.due_date).getTime()) / (1000 * 60 * 60 * 24))) : 0;
  const overdue = isOverdue();

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
    
      <div className="fixed inset-0 bg-white flex items-center justify-center z-[70] p-4">
        <div className="animate-fade-in">
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
              <div className="w-20 h-20 bg-green-100/50 rounded-full flex items-center justify-center mx-auto mb-4 animate-fade-in">
                <CheckCircle size={48} className="text-green-600" />
              </div>
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

                {/* Due Date and Overdue Status */}
                {customer.due_date && (
                  <div className={`flex justify-between items-center mb-3 ${overdue ? 'text-red-600' : 'text-black/70'}`}>
                    <span className="text-sm flex items-center gap-1">
                      <Calendar size={14} />
                      {t('credit.due_date', 'Due Date')}
                    </span>
                    <span className={`font-semibold ${overdue ? 'text-red-600' : 'text-black'}`}>
                      {new Date(customer.due_date).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Overdue Alert */}
                {overdue && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle size={16} />
                      <span className="text-sm font-medium">
                        {t('credit.overdue_by', 'Overdue by')}: {daysOverdue} {t('credit.days', 'days')}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-white/30">
                  <span className="text-sm font-semibold text-black">{t('credit.remaining_balance', 'Remaining Balance')}</span>
                  <span className={`text-xl font-bold ${overdue ? 'text-red-600' : 'text-orange-600'}`}>
                    {formatCurrency(remainingBalance, country)}
                  </span>
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
        </div>
      </div>
    
  );
}
