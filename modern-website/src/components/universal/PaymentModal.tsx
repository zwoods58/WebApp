"use client";

import React, { useState, useEffect } from 'react';
import { X, DollarSign, CheckCircle, Clock, AlertCircle, Calendar, Plus, History } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { useLanguage } from '@/hooks/LanguageContext';
import { useCreditItems, applyPaymentFIFO, calculateTotalOwed } from '@/hooks/useCreditItems';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

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
    type?: 'receivable' | 'payable';
  };
  country: string;
  industry?: string;
  onPayment: (creditId: string, paymentAmount: number) => Promise<void>;
  onAddNewCredit?: () => void;
}

export default function PaymentModal({ isOpen, onClose, customer, country, industry = 'retail', onPayment, onAddNewCredit }: PaymentModalProps) {
  const { t } = useLanguage();
  const { business } = useUnifiedAuth();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // Fetch credit line items for this customer
  const { 
    data: lineItems = [], 
    isLoading: itemsLoading,
    updateCreditItem,
    updateCreditItemAsync,
    refetch: refetchItems
  } = useCreditItems({ 
    businessId: business?.id,
    industry,
    creditId: customer.id 
  });

  // Calculate remaining balance from line items if they exist, otherwise use legacy calculation
  const remainingBalance = lineItems.length > 0 
    ? calculateTotalOwed(lineItems)
    : customer.status === 'paid' ? 0 :
      customer.status === 'partial' 
      ? customer.amount - (customer.paid_amount || 0)
      : customer.amount;
  
  // Separate active and paid line items
  const activeItems = lineItems.filter(item => item.status !== 'paid');
  const paidItems = lineItems.filter(item => item.status === 'paid');
  
  const isPaidInFull = remainingBalance === 0;

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
      // If line items exist, apply FIFO payment logic
      if (lineItems.length > 0) {
        const { updates } = applyPaymentFIFO(lineItems, amount);
        
        // Update each line item with new payment amounts
        for (const update of updates) {
          await updateCreditItemAsync({
            id: update.id,
            data: {
              paid_amount: update.paid_amount,
              status: update.status,
              updated_at: new Date().toISOString()
            }
          });
        }
        
        // Refresh line items
        await refetchItems();
      }
      
      // Call the parent payment handler (updates credit record and creates transaction)
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
      // If line items exist, mark all as paid using FIFO
      if (lineItems.length > 0) {
        const { updates } = applyPaymentFIFO(lineItems, remainingBalance);
        
        for (const update of updates) {
          await updateCreditItemAsync({
            id: update.id,
            data: {
              paid_amount: update.paid_amount,
              status: update.status,
              updated_at: new Date().toISOString()
            }
          });
        }
        
        await refetchItems();
      }
      
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
  
  const handleAddNewCredit = () => {
    onClose();
    if (onAddNewCredit) {
      onAddNewCredit();
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
              {t('payment.record_payment')}
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
                {t('payment.payment_recorded')}
              </h3>
              <p className="text-black/70">
                {t('payment.payment_success_message')}
              </p>
            </div>
          ) : isPaidInFull ? (
            // Paid customer view - show option to add new credit
            <>
              <p className="text-sm text-black/70 mb-6">
                {t('payment.for_customer')}: <span className="font-semibold text-black">{customer.customer_name}</span>
              </p>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-center">
                <CheckCircle size={48} className="text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-green-900 mb-2">
                  {t('credit.account_paid_in_full', 'Account Paid in Full')}
                </h3>
                <p className="text-sm text-green-700">
                  {t('credit.no_outstanding_balance', 'This customer has no outstanding balance')}
                </p>
              </div>

              {/* Line Items History */}
              {lineItems.length > 0 && (
                <div className="mb-6">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <History size={18} />
                      <span className="font-medium">{t('credit.payment_history', 'Payment History')}</span>
                    </div>
                    <span className="text-sm text-gray-600">{lineItems.length} {t('credit.items', 'items')}</span>
                  </button>
                  
                  {showHistory && (
                    <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                      {lineItems.map((item) => (
                        <div key={item.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {item.description || t('credit.credit_purchase', 'Credit Purchase')}
                            </span>
                            <span className="text-sm font-bold text-green-600">
                              {formatCurrency(item.amount, country)}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{new Date(item.date_given).toLocaleDateString()}</span>
                            <span className="text-green-600 font-medium">{t('credit.paid', 'Paid')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {onAddNewCredit && (
                  <button
                    onClick={handleAddNewCredit}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    {t('credit.add_new_credit', 'Add New Credit')}
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gray-200/50 text-black font-semibold rounded-xl hover:bg-gray-300/50 transition-colors"
                >
                  {t('modal.close', 'Close')}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-black/70 mb-6">
                {t('payment.for_customer')}: <span className="font-semibold text-black">{customer.customer_name}</span>
              </p>

              {/* Line Items Display */}
              {lineItems.length > 0 && activeItems.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-black mb-3">
                    {t('credit.active_credits', 'Active Credits')} ({activeItems.length})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {activeItems.map((item, index) => {
                      const itemRemaining = item.amount - (item.paid_amount || 0);
                      const isOverdueItem = new Date(item.due_date) < new Date() && item.status !== 'paid';
                      
                      return (
                        <div 
                          key={item.id} 
                          className={`p-3 rounded-lg border ${
                            isOverdueItem 
                              ? 'bg-red-50 border-red-200' 
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                                <span className="text-sm font-medium text-gray-900">
                                  {item.description || t('credit.credit_purchase', 'Credit Purchase')}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {t('credit.due', 'Due')}: {new Date(item.due_date).toLocaleDateString()}
                                {isOverdueItem && (
                                  <span className="text-red-600 font-medium ml-2">
                                    ({t('credit.overdue', 'Overdue')})
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm font-bold ${
                                isOverdueItem ? 'text-red-600' : 'text-orange-600'
                              }`}>
                                {formatCurrency(itemRemaining, country)}
                              </div>
                              {item.status === 'partial' && (
                                <div className="text-xs text-gray-500">
                                  {t('credit.paid', 'Paid')}: {formatCurrency(item.paid_amount || 0, country)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {paidItems.length > 0 && (
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="w-full mt-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {showHistory ? t('credit.hide_history', 'Hide History') : `${t('credit.show_history', 'Show History')} (${paidItems.length})`}
                    </button>
                  )}
                  
                  {showHistory && paidItems.length > 0 && (
                    <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                      {paidItems.map((item) => (
                        <div key={item.id} className="p-2 bg-green-50 border border-green-200 rounded-lg opacity-75">
                          <div className="flex justify-between items-start">
                            <span className="text-xs text-gray-700">
                              {item.description || t('credit.credit_purchase', 'Credit Purchase')}
                            </span>
                            <span className="text-xs font-medium text-green-600">
                              {formatCurrency(item.amount, country)} ✓
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Balance Info */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/30">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-black/70">{t('payment.original_amount')}</span>
                  <span className="font-bold text-black">{formatCurrency(customer.amount, country)}</span>
                </div>
                
                {customer.status === 'partial' && (
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-black/70">{t('payment.paid_so_far')}</span>
                    <span className="font-bold text-green-600">{formatCurrency(customer.paid_amount, country)}</span>
                  </div>
                )}

                {/* Due Date and Overdue Status */}
                {customer.due_date && (
                  <div className={`flex justify-between items-center mb-3 ${overdue ? 'text-red-600' : 'text-black/70'}`}>
                    <span className="text-sm flex items-center gap-1">
                      <Calendar size={14} />
                      {t('payment.due_date')}
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
                        {t('payment.overdue_by')}: {daysOverdue} {t('payment.days')}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-white/30">
                  <span className="text-sm font-semibold text-black">
                    {customer.type === 'payable' 
                      ? t('payment.total_you_owe', 'Total You Owe')
                      : t('payment.remaining_balance', 'Remaining Balance')}
                  </span>
                  <span className={`text-xl font-bold ${overdue ? 'text-red-600' : 'text-orange-600'}`}>
                    {formatCurrency(remainingBalance, country)}
                  </span>
                </div>
                
                {lineItems.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/30">
                    <p className="text-xs text-gray-500">
                      {t('credit.fifo_payment_note', 'Payments are applied to oldest debts first (FIFO)')}
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    {t('payment.payment_amount')}
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
                    {t('payment.max_payment')}: {formatCurrency(remainingBalance, country)}
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
                    {loading ? t('modal.processing') : 
                      customer.type === 'payable' 
                        ? t('payment.record_payment_made', 'Record Payment Made')
                        : t('payment.record_partial_payment', 'Record Payment Received')}
                  </button>

                  <button
                    type="button"
                    onClick={handleMarkAsPaid}
                    disabled={loading}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    {loading ? t('modal.processing') : t('payment.mark_as_paid', 'Mark as Paid in Full')}
                  </button>
                  
                  {onAddNewCredit && (
                    <button
                      type="button"
                      onClick={handleAddNewCredit}
                      disabled={loading}
                      className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      {t('credit.add_new_credit', 'Add New Credit')}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="w-full py-3 bg-gray-200/50 text-black font-semibold rounded-xl hover:bg-gray-300/50 transition-colors"
                  >
                    {t('modal.cancel')}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    
  );
}
