"use client";

import React, { useState } from 'react';
import { X, Save, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { formatCurrency, getCurrency } from '@/utils/currency';
import { INDUSTRY_CONFIG } from '@/config/industryConfig';

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (serviceId: string, updates: any) => void;
  service?: any;
  country: string;
  industry: string;
  isAddMode?: boolean; // For adding new services
}

export default function EditServiceModal({ 
  isOpen, 
  onClose, 
  onUpdate, 
  service, 
  country, 
  industry,
  isAddMode = false 
}: EditServiceModalProps) {
  const { t } = useLanguage();
  const featureConfig = INDUSTRY_CONFIG[industry as keyof typeof INDUSTRY_CONFIG];
  const [formData, setFormData] = useState({
    service_name: service?.service_name || '',
    price: service?.price ? service.price.toString() : '',
    duration: service?.duration ? service.duration.toString() : '',
    description: service?.description || '',
    category: service?.category || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates: any = {
      service_name: formData.service_name,
      price: parseFloat(formData.price) || 0,
      description: formData.description,
      category: formData.category
    };

    // Add duration for industries that support it
    if (featureConfig.services && formData.duration) {
      updates.duration = parseInt(formData.duration);
    }

    // Update metadata for consistency
    updates.metadata = {
      ...service?.metadata,
      price: parseFloat(formData.price) || 0,
      ...(formData.duration && { duration: parseInt(formData.duration) })
    };

    if (isAddMode) {
      // For adding new services, generate a temporary ID
      onUpdate('new', updates);
    } else {
      onUpdate(service.id, updates);
    }
    onClose();
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
        <div className="bg-[var(--color-background-primary)] rounded-2xl max-w-md w-full h-full min-h-0 overflow-y-auto scale-in shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {isAddMode ? t('services.add_service') : t('services.edit_service')}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('services.service_name')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.service_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, service_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('services.enter_service_name')}
                  disabled={!isAddMode}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('services.price')} ({getCurrency(country)})
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('services.category')}
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('services.enter_category')}
                />
              </div>
              
              {featureConfig.services && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('services.duration_minutes', 'Duration (minutes)')}
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="30"
                    min="15"
                    max="480"
                    step="5"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('services.description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder={t('services.describe_service')}
                />
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
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {isAddMode ? t('services.add_service') : t('services.update_service')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

