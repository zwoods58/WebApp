"use client";

import React, { useState } from 'react';
import { X, Package } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { formatCurrency, getCurrency } from '@/utils/currency';

interface AddInventoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  country: string;
  industry: string;
}

export default function AddInventoryForm({ isOpen, onClose, onSubmit, country, industry }: AddInventoryFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    item_name: '',
    category: '',
    quantity: '',
    threshold: '',
    unit: '',
    cost_price: '',
    selling_price: '',
    supplier: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      quantity: parseFloat(formData.quantity),
      threshold: parseFloat(formData.threshold),
      cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
      selling_price: formData.selling_price ? parseFloat(formData.selling_price) : null
    });
    // Reset form
    setFormData({
      item_name: '',
      category: '',
      quantity: '',
      threshold: '',
      unit: '',
      cost_price: '',
      selling_price: '',
      supplier: ''
    });
    onClose();
  };

  const getItemPlaceholder = () => {
    switch (industry) {
      case 'food': return t('inventory.example_vegetables', 'e.g., Fresh Vegetables');
      case 'retail': return t('inventory.example_headphones', 'e.g., Premium Headphones');
      case 'transport': return t('inventory.example_fuel', 'e.g., Fuel Can');
      case 'freelance': return t('inventory.example_software', 'e.g., Software License');
      default: return t('inventory.example_item', 'e.g., Item Name');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-white z-40 backdrop-fade transform-gpu"
        onClick={onClose}
        style={{ 
          willChange: 'opacity',
          transition: 'opacity 0.3s ease-out'
        }}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full h-full min-h-0 overflow-y-auto scale-in shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="text-green-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{t('inventory.add_item')}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.item_name')}</label>
                <input
                  type="text"
                  required
                  value={formData.item_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, item_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={getItemPlaceholder()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.category')}</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={t('inventory.enter_category')}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.quantity')}</label>
                  <input
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={t('inventory.example_quantity', '10')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.min_stock')}</label>
                  <input
                    type="number"
                    required
                    value={formData.threshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={t('inventory.example_threshold', '5')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.units')}</label>
                  <select
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">{t('inventory.select_unit')}</option>
                    <option value="pieces">{t('inventory.pieces')}</option>
                    <option value="kg">{t('inventory.kg')}</option>
                    <option value="liters">{t('inventory.liters')}</option>
                    <option value="meters">{t('inventory.meters')}</option>
                    <option value="boxes">{t('inventory.boxes')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.supplier')}</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={t('inventory.supplier_name')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.cost_price')} ({getCurrency(country)})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost_price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={t('inventory.example_price', '0.00')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.selling_price')} ({getCurrency(country)})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.selling_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, selling_price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={t('inventory.example_price', '0.00')}
                  />
                </div>
              </div>

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
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  {t('inventory.add_item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

