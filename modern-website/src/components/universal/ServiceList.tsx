"use client";

import React from 'react';
import { Wrench, Car, Package, Plus, DollarSign } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';
import { formatCurrency } from '@/utils/currency';

interface ServiceListProps {
  industry: string;
  country: string;
  services?: any[];
  onManageServices?: () => void;
  onAddService?: () => void;
}

export default function ServiceList({ 
  industry, 
  country, 
  services = [], 
  onManageServices,
  onAddService 
}: ServiceListProps) {
  const { t } = useLanguage();
  
  // Filter active services
  const activeServices = services.filter(service => service.is_active !== false);

  const getServiceIcon = () => {
    switch (industry) {
      case 'transport': return Car;
      default: return Wrench;
    }
  };

  const getIndustryLabel = () => {
    switch (industry) {
      case 'transport': return 'SERVICES';
      case 'salon': return 'SERVICES';
      case 'tailor': return 'SERVICES';
      case 'freelance': return 'SERVICES';
      case 'repairs': return 'SERVICES';
      default: return 'SERVICES';
    }
  };

  const getServicePricing = (service: any) => {
    if (industry === 'transport' && service.metadata) {
      const base = service.metadata.base_amount || 0;
      const pricePerKm = service.metadata.price_per_km || 0;
      if (pricePerKm > 0) {
        return `${formatCurrency(base, country)} + KM`;
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
          <h3 className="text-lg font-semibold text-gray-900">{t('nav.services')}</h3>
          <p className="text-sm text-gray-500">{activeServices.length} active</p>
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
                    {industry === 'transport' ? 'Base + KM pricing' : 
                     (industry === 'salon' || industry === 'freelance') ? 
                     `${service.duration || 30} ${industry === 'salon' ? 'minutes' : 'days'}` :
                     service.category || 'Service'}
                  </p>
                </div>
              </div>
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
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon className="text-gray-400" size={24} />
          </div>
          <p className="text-gray-500 text-sm">{t('calendar.no_services')}</p>
          <p className="text-gray-400 text-xs">{t('services.add_first')}</p>
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
    </div>
  );
}
