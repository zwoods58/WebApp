"use client";

import React, { useState } from 'react';
import { formatCurrency } from '@/utils/currency';
import { useCreditItems } from '@/hooks/useCreditItems';
import { useLanguage } from '@/hooks/LanguageContext';
import { useToast } from '@/hooks/useToast';

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
      showError('Please enter a valid payment amount');
      return;
    }
    
    if (amount > remainingAmount) {
      showError(`Payment amount cannot exceed remaining balance of ${formatCurrency(remainingAmount, country)}`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newPaidAmount = lineItem.paid_amount + amount;
      const newStatus = newPaidAmount >= lineItem.amount ? 'paid' : 'partial';
      
      // Update line item
      const updateResult = await updateCreditItemAsync({
        id: lineItem.id,
        data: {
          paid_amount: newPaidAmount,
          status: newStatus,
          updated_at: new Date().toISOString()
        }
      });
      
      if (!updateResult) {
        throw new Error('Failed to update line item');
      }
      
      showSuccess(`Payment of ${formatCurrency(amount, country)} applied successfully`);
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      console.error('Payment failed:', error);
      showError(error.message || 'Payment failed. Please try again.');
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
          <h2 className="text-xl font-bold text-gray-900">Make Payment</h2>
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
              <p className="text-sm text-gray-600">{lineItem.description || 'Credit Purchase'}</p>
              <p className="text-xs text-gray-500 mt-1">
                Due: {new Date(lineItem.due_date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Original:</p>
              <p className="font-bold text-gray-900">{formatCurrency(lineItem.amount, country)}</p>
              {lineItem.paid_amount > 0 && (
                <p className="text-xs text-green-600">
                  Paid: {formatCurrency(lineItem.paid_amount, country)}
                </p>
              )}
            </div>
          </div>
          
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Remaining:</span>
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
              Payment Amount ({formatCurrency(remainingAmount, country)} max)
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
                placeholder="Enter amount"
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
              Full Payment
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !paymentAmount || parseFloat(paymentAmount) <= 0}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : `Pay ${paymentAmount ? formatCurrency(parseFloat(paymentAmount), country) : ''}`}
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
