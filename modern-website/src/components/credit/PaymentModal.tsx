"use client";

import React, { useState } from 'react';
import { formatCurrency } from '@/utils/currency';
import { useCreditItems } from '@/hooks/useCreditItems';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { makePaymentOnLineItem } from '@/app/Beezee-App/services/creditService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lineItem: any;
  credit: any;
  country: string;
  onSuccess?: () => void;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  lineItem, 
  credit, 
  country,
  onSuccess 
}: PaymentModalProps) {
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const remainingAmount = lineItem.amount - lineItem.paid_amount;
  const { updateCreditItemAsync } = useCreditItems({ 
    businessId: credit.business_id,
    industry: credit.industry 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      showError(t('credit.invalid_payment_amount', 'Please enter a valid payment amount'));
      return;
    }
    
    if (amount > remainingAmount) {
      showError(t('credit.payment_exceeds_balance').replace('{amount}', formatCurrency(remainingAmount, country)));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use unified credit service for payment
      const result = await makePaymentOnLineItem(lineItem.id, amount);
      
      if (!result) {
        throw new Error(t('credit.payment_failed', 'Failed to process payment'));
      }
      
      showSuccess(t('credit.payment_success_message', 'Payment has been successfully recorded'));
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      console.error('Payment failed:', error);
      showError(error.message || t('credit.payment_failed', 'Payment failed. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFullPayment = () => {
    setPaymentAmount(remainingAmount.toString());
  };

  const handlePartialPayment = () => {
    setPaymentAmount((remainingAmount / 2).toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{t('credit.make_payment')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Credit Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-medium text-gray-900">{credit.customer_name}</p>
              <p className="text-sm text-gray-600">{lineItem.description || t('credit.credit_purchase')}</p>
              <p className="text-xs text-gray-500 mt-1">
                Due: {new Date(lineItem.due_date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{t('credit.original')}</p>
              <p className="font-bold text-gray-900">{formatCurrency(lineItem.amount, country)}</p>
              {lineItem.paid_amount > 0 && (
                <p className="text-xs text-green-600">
                  {t('credit.paid')}: {formatCurrency(lineItem.paid_amount, country)}
                </p>
              )}
            </div>
          </div>
          
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">{t('credit.remaining')}</span>
              <span className="font-bold text-lg text-orange-600">
                {formatCurrency(remainingAmount, country)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('credit.payment_amount_max').replace('{amount}', formatCurrency(remainingAmount, country))}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={remainingAmount}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('credit.enter_amount')}
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                {getCurrency(country)}
              </span>
            </div>
          </div>
          
          {/* Quick Payment Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePartialPayment}
              className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              50%
            </button>
            <button
              type="button"
              onClick={handleFullPayment}
              className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
            >
              {t('credit.mark_as_paid', 'Full Payment')}
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !paymentAmount || parseFloat(paymentAmount) <= 0}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('credit.processing') : t('credit.pay_amount', 'Pay {amount}').replace('{amount}', paymentAmount ? formatCurrency(parseFloat(paymentAmount), country) : '')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper function to get currency symbol
function getCurrency(country: string): string {
  const currencies: Record<string, string> = {
    'ke': 'KES',
    'ng': 'NGN',
    'za': 'ZAR',
    'gh': 'GHS',
    'ug': 'UGX',
    'rw': 'RWF',
    'tz': 'TZS',
    'us': '$',
    'gb': '£',
    'eu': '£'
  };
  return currencies[country.toLowerCase()] || '$';
}

