"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Clock, 
  DollarSign,
  Edit,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { formatCurrency, getCurrency } from '@/utils/currency';
import { useServicesTanStack, useTransactionsTanStack } from '@/hooks/index';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/hooks/index';
import { useToast } from '@/hooks/index';
import { usePersistentStorage } from '@/hooks/usePersistentStorage';
import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import { BeeZeeConfirmDialog, useBeeZeeConfirm } from '@/components/ui/BeeZeeConfirmDialog';
import { INDUSTRY_CONFIG } from '@/config/industryConfig';

export default function ServicesPage() {
  const params = useParams();
  const router = useRouter();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const { t } = useLanguage();

  const safeT = (key: string, fallback?: string) => {
    try {
      const result = t(key, fallback);
      if (typeof result === 'string' && result.startsWith('t(')) return fallback || key;
      return result;
    } catch {
      return fallback || key;
    }
  };

  const { confirm, DialogComponent } = useBeeZeeConfirm();
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);
  const hasInitializedServices = useRef(false);
  const { business } = useSupabaseAuth();

  const [persistentServices, setPersistentServices] = usePersistentStorage<any[]>(
    `services_${business?.id || 'default'}`, []
  );

  const { showSuccess, showError, showInfo } = useToast();
  const {
    data: services, isLoading, addService, updateService,
    deleteService: deleteServiceFn, isOffline, refetch: refetchServices
  } = useServicesTanStack({ industry, businessId: business?.id });

  const { addTransaction } = useTransactionsTanStack({ industry, businessId: business?.id });
  const queryClient = useQueryClient();
  const safeServices = Array.isArray(services) ? services : [];

  // Sync services with localStorage
  useEffect(() => {
    let isMounted = true;
    if (isMounted && services && services.length > 0 && !hasInitializedServices.current) {
      setPersistentServices(services);
      hasInitializedServices.current = true;
    }
    return () => { isMounted = false; };
  }, [services]);

  // Restore from persistent storage when offline
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();
    const shouldRestore = !navigator.onLine &&
      (!services || services.length === 0) &&
      persistentServices?.length > 0 &&
      !hasInitializedServices.current;

    if (shouldRestore) {
      const restoreServices = async () => {
        for (const item of persistentServices) {
          if (!isMounted || abortController.signal.aborted) break;
          try {
            const exists = services?.some(s => s.id === item.id);
            if (!exists) await addService(item);
          } catch (error) {
            console.error('Failed to restore service:', error);
          }
        }
        if (isMounted) hasInitializedServices.current = true;
      };
      restoreServices();
    }
    return () => { isMounted = false; abortController.abort(); };
  }, [services, persistentServices, addService]);

  // Periodic sync
  useEffect(() => {
    if (!business?.id) return;
    const syncInterval = setInterval(async () => {
      try {
        const { syncManager } = await import('@/lib/sync-manager');
        await syncManager.requestSync('services-periodic');
      } catch (error) {
        console.warn('Periodic sync failed:', error);
      }
    }, 30000);
    return () => clearInterval(syncInterval);
  }, [business?.id]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showServiceDetail, setShowServiceDetail] = useState<string | null>(null);
  const [showKmModal, setShowKmModal] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);

  const industryCategories: Record<string, string[]> = {
    retail: ['all', 'electronics', 'clothing', 'food', 'beauty', 'household', 'toys'],
    food: ['all', 'appetizers', 'mains', 'desserts', 'beverages', 'sides', 'specials'],
    transport: ['all', 'local', 'long_distance', 'airport', 'corporate', 'special', 'delivery'],
    salon: ['all', 'hair', 'nails', 'skincare', 'wellness', 'makeup', 'massage'],
    tailor: ['all', 'fabrics', 'threads', 'zippers_fasteners', 'buttons_accessories', 'elastic_trims'],
    repairs: ['all', 'electronics', 'appliances', 'vehicles', 'phones', 'computers', 'general'],
    freelance: ['all', 'web_design', 'writing', 'consulting', 'design', 'development', 'marketing']
  };

  const categories = industryCategories[industry] || industryCategories.retail;

  const totalServices = safeServices.length;
  const availableServices = safeServices.filter((s: any) => s.is_active).length;
  const totalRevenue = safeServices.reduce((sum: number, s: any) => sum + (s.price || 0), 0);
  const averageServicePrice = availableServices > 0 ? totalRevenue / availableServices : 0;

  const filteredServices = safeServices.filter((service: any) => {
    const matchesSearch = service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddService = async (newService: any) => {
    try {
      if (!business?.id) return;
      const currency = getCurrency(business.country || country);
      await addService({ ...newService, business_id: business.id, industry, currency, is_active: true });
      setShowAddModal(false);
      showSuccess(safeT('services.add_success', `Successfully added "${newService.service_name}"`));
    } catch {
      showError(safeT('services.add_error', 'Failed to add service. Please try again.'));
    }
  };

  const handleUpdateService = async (serviceId: string, updates: any) => {
    try {
      await updateService(serviceId, updates);
      showSuccess(t('services.update_success', 'Service updated successfully'));
    } catch {
      showError(t('services.update_error', 'Failed to update service'));
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    const service = safeServices.find((s: any) => s.id === serviceId);
    const serviceName = service?.service_name || 'Unknown service';

    const confirmed = await confirm(
      t('services.confirm_delete_service', 'Permanently Delete Service?'),
      t('services.confirm_delete_service_message', `Are you sure you want to permanently delete "${serviceName}"? This action cannot be undone.`),
      {
        confirmText: t('services.confirm_delete_permanently', 'Yes, Delete Permanently'),
        cancelText: t('common.cancel', 'Cancel'),
        type: 'danger'
      }
    );

    if (!confirmed) return;
    setDeletingServiceId(serviceId);

    try {
      await deleteServiceFn(serviceId);
      localStorage.removeItem(`services_${business?.id}`);
      setPersistentServices((prev: any[]) => prev.filter((s: any) => s.id !== serviceId));
      queryClient.removeQueries({ queryKey: ['services', industry, business?.id] });
      await refetchServices();
      showSuccess(t('services.delete_success', `"${serviceName}" permanently deleted`));
      setShowServiceDetail(null);
    } catch {
      showError(t('services.delete_error', 'Failed to delete service. Please try again.'));
    } finally {
      setDeletingServiceId(null);
    }
  };

  const handleKmConfirm = async (km: string, useBase: boolean, tips: string, location?: string) => {
    const service = safeServices.find((s: any) => s.id === showKmModal);
    if (!service || !business?.id) return;

    try {
      const totalFare = useBase
        ? (service.price || 0) + (parseFloat(tips) || 0)
        : ((parseFloat(km) || 0) * (service.price || 0)) + (service.price || 0) + (parseFloat(tips) || 0);

      const transactionData = {
        business_id: business.id,
        industry,
        amount: totalFare,
        category: 'transport_trip',
        description: location
          ? `${service.service_name} (${location})${useBase ? ' (Base only)' : ` (${km} km)`}${tips ? ' + tips' : ''}`
          : `${service.service_name}${useBase ? ' (Base only)' : ` (${km} km)`}${tips ? ' + tips' : ''}`,
        customer_name: 'Walk-in Customer',
        payment_method: 'cash' as const,
        transaction_date: new Date().toISOString().split('T')[0],
        type: 'money_in' as const,
        metadata: {
          service_id: service.id,
          service_name: service.service_name,
          distance: parseFloat(km) || 0,
          use_base_amount: useBase,
          tips: parseFloat(tips) || 0,
          location,
          price_per_km: service.price || 0,
          base_amount: service.price || 0,
          calculated_fare: totalFare
        }
      };

      try {
        await addTransaction(transactionData);
      } catch {
        showInfo(t('services.transport_offline', "Transport trip queued - will sync when you're back online"));
      }
    } catch {
      alert(t('services.trip_failed', 'Failed to complete trip. Please try again.'));
    }

    setShowKmModal(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header industry={industry} country={country} />

      <div className="p-4 max-w-md mx-auto mt-8">

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <Package size={14} />
              {t('services.total_services', 'Total')}
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalServices}</div>
            <div className="text-xs text-gray-500">{availableServices} {t('services.available', 'active')}</div>
          </div>

          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-1.5 text-xs text-green-700 mb-1">
              <DollarSign size={14} />
              {safeT('services.total_service_value', 'Value')}
            </div>
            <div className="text-lg font-bold text-green-600">{formatCurrency(totalRevenue, country)}</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center gap-1.5 text-xs text-purple-700 mb-1">
              <TrendingUp size={14} />
              {safeT('services.avg_price', 'Avg')}
            </div>
            <div className="text-lg font-bold text-purple-600">
              {formatCurrency(Math.round(averageServicePrice * 100) / 100, country)}
            </div>
          </div>
        </div>

        {/* Add Service Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full mt-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          {t('services.add_service')}
        </button>

        {/* Search and Filter */}
        <div className="mt-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('services.search_services', 'Search services...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto mt-4 pb-1">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filterCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {category === 'all'
                  ? t('filters.all_services', 'All Services')
                  : t(`filters.${category}`, category.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))}
              </button>
            ))}
          </div>
        </div>

        {/* Services List */}
        <div className="mt-6 space-y-3">
          {filteredServices.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <Package size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600 font-medium">{t('services.no_services_found', 'No services found')}</p>
              <p className="text-sm text-gray-500 mt-1">{t('services.start_by_adding_first_service', 'Start by adding your first service')}</p>
            </div>
          ) : (
            filteredServices.map((service: any) => (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => industry === 'transport' ? setShowKmModal(service.id) : setShowServiceDetail(service.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{service.service_name}</h3>
                      {!service.is_active && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full shrink-0">
                          {t('services.unavailable', 'Unavailable')}
                        </span>
                      )}
                    </div>
                    {service.description && (
                      <p className="text-sm text-gray-500 mb-1 line-clamp-2">{service.description}</p>
                    )}
                    {service.duration && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={12} />
                        {service.duration}min
                      </span>
                    )}
                  </div>

                  <div className="text-right ml-4 shrink-0">
                    <div className="text-xl font-bold text-green-600">
                      {formatCurrency(
                        industry === 'transport'
                          ? (service.metadata?.base_amount || service.price || 0)
                          : (service.price > 0 ? service.price : service.metadata?.price || 0),
                        country
                      )}
                    </div>
                    {service.price === 0 && (
                      <div className="text-xs text-orange-500 mt-0.5">{t('services.update_price', 'Update price')}</div>
                    )}
                    <div className="flex items-center gap-1 mt-2 justify-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowEditModal(service.id); }}
                        className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Edit size={15} className="text-blue-600" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteService(service.id); }}
                        disabled={deletingServiceId === service.id}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deletingServiceId === service.id
                          ? <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          : <Trash2 size={15} className="text-red-600" />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{t('services.add_service')}</h2>
            <AddServiceForm
              onSubmit={handleAddService}
              onCancel={() => setShowAddModal(false)}
              country={country}
              industry={industry}
            />
          </div>
        </div>
      )}

      {/* KM Modal for Transport */}
      {showKmModal && (
        <KmInputModal
          service={safeServices.find((s: any) => s.id === showKmModal)}
          onClose={() => setShowKmModal(null)}
          onConfirm={handleKmConfirm}
          country={country}
          t={t}
        />
      )}

      {/* Edit Service Modal */}
      {showEditModal && (
        <EditServiceModal
          service={safeServices.find((s: any) => s.id === showEditModal)}
          onClose={() => setShowEditModal(null)}
          onUpdate={handleUpdateService}
          country={country}
          industry={industry}
          t={t}
        />
      )}

      <BottomNav industry={industry} country={country} />
      <DialogComponent />
    </div>
  );
}

// ─── Edit Service Modal ───────────────────────────────────────
function EditServiceModal({ service, onClose, onUpdate, country, industry, t }: {
  service: any; onClose: () => void;
  onUpdate: (serviceId: string, updates: any) => void;
  country: string; industry: string;
  t: (key: string, fallback?: string) => string;
}) {
  const [formData, setFormData] = useState({
    price: service?.price ? service.price.toString() : '',
    duration: service?.duration ? service.duration.toString() : '',
    description: service?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: any = {
      price: parseFloat(formData.price) || 0,
      description: formData.description,
      metadata: { ...service?.metadata, price: parseFloat(formData.price) || 0 }
    };
    if ((industry === 'salon' || industry === 'freelance') && formData.duration) {
      updates.duration = parseInt(formData.duration);
      updates.metadata.duration = parseInt(formData.duration);
    }
    onUpdate(service.id, updates);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('services.edit_service', 'Edit Service')}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('services.service_name', 'Service Name')}</label>
            <input type="text" value={service?.service_name || ''} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('services.price', 'Price')} ({getCurrency(country)})</label>
            <input
              type="number" required value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0.00" step="0.01" min="0"
            />
          </div>
          {(industry === 'salon' || industry === 'freelance') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('services.duration_minutes', 'Duration (minutes)')}</label>
              <input
                type="number" value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="30" min="15" max="480" step="5"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('services.description', 'Description')}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3} placeholder={t('services.describe_service', 'Describe your service...')}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              {t('common.cancel', 'Cancel')}
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              {t('services.update_service', 'Update Service')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Add Service Form ─────────────────────────────────────────
function AddServiceForm({ onSubmit, onCancel, country, industry }: {
  onSubmit: (data: any) => void; onCancel: () => void;
  country: string; industry: string;
}) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', duration: '',
    pricePerKm: '', baseAmount: '', description: ''
  });

  const calculateTotalFare = () =>
    industry === 'transport'
      ? (parseFloat(formData.pricePerKm) || 0) + (parseFloat(formData.baseAmount) || 0)
      : parseFloat(formData.price) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData: any = {
      service_name: formData.name,
      category: formData.category,
      price: calculateTotalFare(),
      description: formData.description
    };
    if (industry === 'transport') {
      serviceData.metadata = {
        price_per_km: parseFloat(formData.pricePerKm) || 0,
        base_amount: parseFloat(formData.baseAmount) || 0
      };
    } else {
      serviceData.metadata = { price: calculateTotalFare() };
      if (formData.duration) {
        serviceData.duration = parseInt(formData.duration);
        serviceData.metadata.duration = parseInt(formData.duration);
      }
    }
    onSubmit(serviceData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('services.service_name')}</label>
        <input
          type="text" required value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder={t('services.enter_service_name', 'Enter service name')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('services.category')}</label>
        <input
          type="text" required value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder={t('services.enter_category', 'Enter category')}
        />
      </div>

      {industry === 'transport' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('services.price_per_km', 'Price/km')} ({getCurrency(country)})</label>
              <input
                type="number" required value={formData.pricePerKm}
                onChange={(e) => setFormData(prev => ({ ...prev, pricePerKm: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.00" step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('services.base_amount', 'Base Amount')} ({getCurrency(country)})</label>
              <input
                type="number" value={formData.baseAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, baseAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.00" step="0.01"
              />
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-center">
            <span className="text-sm font-medium text-blue-900">{t('services.total_fare', 'Total Fare')}:</span>
            <span className="text-lg font-bold text-blue-900">{getCurrency(country)} {calculateTotalFare().toFixed(2)}</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('services.price')} ({getCurrency(country)})</label>
            <input
              type="number" required value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          {(industry === 'salon' || industry === 'freelance') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('services.duration_min', 'Duration (min)')}</label>
              <input
                type="number" value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="30" min="15" max="480" step="5"
              />
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('services.description')}</label>
        <textarea
          required value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3} placeholder={t('services.describe_service', 'Describe your service...')}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
          {t('common.cancel', 'Cancel')}
        </button>
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          {t('services.add_service', 'Add Service')}
        </button>
      </div>
    </form>
  );
}

// ─── KM Input Modal (Transport) ───────────────────────────────
function KmInputModal({ service, onClose, onConfirm, country, t }: {
  service: any; onClose: () => void;
  onConfirm: (km: string, useBase: boolean, tips: string, location?: string) => void;
  country: string;
  t: (key: string, fallback?: string) => string;
}) {
  const [km, setKm] = useState('');
  const [useBaseOnly, setUseBaseOnly] = useState(false);
  const [tips, setTips] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

  const calculateFare = () => {
    if (useBaseOnly) return (service.metadata?.base_amount || 0) + (parseFloat(tips) || 0);
    return ((parseFloat(km) || 0) * (service.metadata?.price_per_km || 0)) +
      (service.metadata?.base_amount || 0) + (parseFloat(tips) || 0);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Package className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{service.service_name}</h3>
            <p className="text-sm text-gray-500">{t('services.calculate_trip_fare', 'Calculate trip fare')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('services.distance_km', 'Distance (km)')}</label>
            <input
              type="number" value={km} onChange={(e) => setKm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0.0" step="0.1" disabled={useBaseOnly}
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="baseOnly" checked={useBaseOnly} onChange={(e) => setUseBaseOnly(e.target.checked)} className="rounded border-gray-300 text-blue-600" />
            <label htmlFor="baseOnly" className="text-sm text-gray-700">{t('services.use_base_amount', 'Use base amount only')}</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('services.tips_optional', 'Tips (optional)')}</label>
            <input
              type="number" value={tips} onChange={(e) => setTips(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0.00" step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('services.pickup_location', 'Pickup Location')}</label>
            <input
              type="text" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Nairobi CBD"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('services.dropoff_location', 'Drop-off Location')}</label>
            <input
              type="text" value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Airport Terminal 3"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900">{t('services.total_fare', 'Total Fare')}:</span>
              <span className="text-lg font-bold text-blue-900">{getCurrency(country)} {calculateFare().toFixed(2)}</span>
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {useBaseOnly
                ? `${t('services.base_amount_only', 'Base amount only')}${tips ? ` + ${getCurrency(country)} ${tips} tips` : ''}`
                : `(${km || '0'} km × ${getCurrency(country)} ${service.metadata?.price_per_km || 0}) + ${getCurrency(country)} ${service.metadata?.base_amount || 0}${tips ? ` + ${getCurrency(country)} ${tips} tips` : ''}`
              }
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            {t('common.cancel', 'Cancel')}
          </button>
          <button
            onClick={() => { onConfirm(km, useBaseOnly, tips, `${pickupLocation} → ${dropoffLocation}`); onClose(); }}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {t('services.confirm_fare', 'Confirm Fare')}
          </button>
        </div>
      </div>
    </div>
  );
}