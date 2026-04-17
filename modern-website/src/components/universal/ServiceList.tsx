"use client";

import React, { useState } from 'react';
import { Wrench, Car, Package, Plus, DollarSign, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { formatCurrency } from '@/utils/currency';
import { useServicesTanStack } from '@/hooks';

interface ServiceListProps {
  industry: string;
  country: string;
  services?: any[];
  onManageServices?: () => void;
  onAddService?: () => void;
  businessId?: string;
}

export default function ServiceList({ 
  industry, 
  country, 
  services = [], 
  onManageServices,
  onAddService,
  businessId
}: ServiceListProps) {
  const { t } = useLanguage();
  const { deleteService, updateService } = useServicesTanStack({ businessId, industry });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDeleteService = async (serviceId: string) => {
    try {
      // Use soft delete by setting is_active = false
      await updateService({ id: serviceId, data: { is_active: false } });
      setConfirmDelete(null);
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const handleEditService = (serviceId: string) => {
    // TODO: Implement edit modal - for now just log
    console.log('Edit service:', serviceId);
  };
  
  // Filter active services
  const activeServices = services.filter(service => service.is_active !== false);

  const getServiceIcon = () => {
    switch (industry) {
      case 'transport': return Car;
      default: return Wrench;
    }
  };

  const getIndustryLabel = () => {
    return t('services.title');
  };

  const getServicePricing = (service: any) => {
    if (industry === 'transport' && service.metadata) {
      const base = service.metadata.base_amount || 0;
      const pricePerKm = service.metadata.price_per_km || 0;
      if (pricePerKm > 0) {
        return `${formatCurrency(base, country)} + ${t('services.base_km_pricing').split(' ')[2]}`;
      }
      return formatCurrency(base, country);
    }
    return formatCurrency(service.price || 0, country);
  };

  const Icon = getServiceIcon();

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t('common.services')}</h3>
          <p className="text-sm text-gray-500">{activeServices.length} {t('common.active', 'active')}</p>
        </div>
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Icon className="text-green-600" size={20} />
        </div>
      </div>

      {/* Service Items */}
      {activeServices.length > 0 ? (
        <div className="space-y-3 mb-4">
          {activeServices.slice(0, 3).map((service, index) => (
            <div key={service.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon className="text-green-600" size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {service.service_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {industry === 'transport' ? t('services.base_km_pricing', 'Base + KM pricing') : 
                     (industry === 'salon' || industry === 'freelance') ? 
                     `${service.duration || 30} ${t(`services.${industry === 'salon' ? 'minutes' : 'days'}`, industry === 'salon' ? 'minutes' : 'days')}` :
                     service.category || t('services.service', 'Service')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm">
                    {getServicePricing(service)}
                  </p>
                  {service.price && service.price !== service.selling_price && (
                    <p className="text-xs text-gray-500">
                      → {formatCurrency(service.selling_price || service.price, country)}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditService(service.id)}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title={t('services.edit_service', 'Edit service')}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(service.id)}
                    className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title={t('services.delete_service', 'Delete service')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon className="text-gray-400" size={24} />
          </div>
          <p className="text-gray-500 text-sm">{t('common.no_services', 'No services available')}</p>
          <p className="text-gray-400 text-xs">{t('common.add_first_service', 'Add your first service to get started')}</p>
        </div>
      )}

      {/* Action Links */}
      <div className="flex gap-3 pt-3 border-t border-gray-100">
        <button
          onClick={onManageServices}
          className="flex-1 py-2 px-3 text-blue-600 font-medium text-sm hover:bg-blue-50 rounded-lg transition-colors"
        >
          {t('inventory.manage')}
        </button>
        <button
          onClick={onAddService}
          className="flex-1 py-2 px-3 bg-green-500 text-white font-medium text-sm hover:bg-green-600 rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <Plus size={16} />
          {t('common.add')}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('common.delete_service', 'Delete Service')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('common.delete_confirm', 'Are you sure you want to delete this service? This can be undone.')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                onClick={() => handleDeleteService(confirmDelete)}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('common.delete', 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

