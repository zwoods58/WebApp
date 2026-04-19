"use client";

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCreditItems } from '@/hooks/useCreditItems';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { getCurrency } from '@/utils/currency';

interface AddCreditLineItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditId: string;
  customerName: string;
  industry: string;
  country: string;
  onSuccess?: () => void;
}

export default function AddCreditLineItemModal({ 
  isOpen, 
  onClose, 
  creditId, 
  customerName,
  industry,
  country,
  onSuccess 
}: AddCreditLineItemModalProps) {
  const { t } = useLanguage();
  const { business } = useUnifiedAuth();
  const { addCreditItemAsync } = useCreditItems({ 
    businessId: business?.id,
    industry 
  });

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!business?.id) {
      alert(t('error.no_business_id', 'No business ID found'));
      return;
    }

    setLoading(true);
    try {
      const currency = getCurrency(business.country || country);
      
      await addCreditItemAsync({
        credit_id: creditId,
        business_id: business.id,
        industry,
        description: formData.description,
        amount: parseFloat(formData.amount),
        paid_amount: 0,
        currency,
        status: 'outstanding',
        due_date: formData.due_date,
        date_given: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Reset form
      setFormData({
        description: '',
        amount: '',
        due_date: ''
      });

      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to add credit line item:', error);
      alert(t('credit.failed_to_add_item', 'Failed to add credit item. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[80] p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('credit.add_new_credit', 'Add New Credit')}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200/50 hover:bg-gray-300/50 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-black" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          {t('credit.for_customer', 'For')}: <span className="font-semibold text-gray-900">{customerName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('credit.description', 'Description')}
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('credit.description_placeholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('credit.amount', 'Amount')}
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('credit.due_date', 'Due Date')}
            </label>
            <input
              type="date"
              required
              value={formData.due_date}
              onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {t('modal.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              {loading ? t('modal.processing', 'Processing...') : t('credit.add_credit', 'Add Credit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

