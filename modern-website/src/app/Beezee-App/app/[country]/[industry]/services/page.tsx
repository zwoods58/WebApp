"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  DollarSign,
  Settings,
  Edit,
  RefreshCw,
  Trash2,
  AlertTriangle,
  Box,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { formatCurrency, getCurrency } from '@/utils/currency';
import { useServicesTanStack, useInventoryTanStack, useTransactionsTanStack } from '@/hooks';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useLanguage } from '@/hooks/LanguageContext';
import { useToast } from '@/hooks/useToast';
import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';

export default function ServicesPage() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const { t } = useLanguage();
  
  // Redirect retail users to stock page - retail doesn't use services
  useEffect(() => {
    if (industry === 'retail') {
      window.location.href = `/Beezee-App/app/${country}/${industry}/stock`;
    }
  }, [industry, country]);
  
  const { business } = useUnifiedAuth();
  
  // TanStack Query handles online/offline automatically
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const { data: services, isLoading, addService, updateService, deleteService: deleteServiceFn, isOffline, isPending } = useServicesTanStack({ industry });
  const { data: inventory, isLoading: inventoryLoading, addInventory: addInventoryItemFn, updateInventory: updateInventoryItemFn, isOffline: inventoryOffline } = useInventoryTanStack({ industry });
  const { data: transactions, isLoading: transactionsLoading, addTransaction, isPaused: transactionsOffline } = useTransactionsTanStack({ industry });
  
  // Ensure services is always an array
  const safeServices = Array.isArray(services) ? services : [];
  const safeInventory = Array.isArray(inventory) ? inventory : [];
  
  // Debug inventory changes
  useEffect(() => {
    console.log('📦 Services page inventory updated:', {
      inventoryLength: safeInventory.length,
      inventoryItems: safeInventory.slice(0, 3), // First 3 items for debugging
      timestamp: new Date().toISOString()
    });
  }, [safeInventory]);
  
  const addInventoryItem = industry === 'transport' ? () => {} : addInventoryItemFn;
  const updateInventoryItem = industry === 'transport' ? () => {} : updateInventoryItemFn;
  const deleteInventoryItem = industry === 'transport' ? 
    () => {} : 
    (id: string) => console.log('Delete item:', id); // Simplified for TanStack version
  
  // Tab state for split screen (only show tabs for non-transport industries)
  const [activeTab, setActiveTab] = useState<'services' | 'inventory'>('services');
  
  // Check if industry should show services tab (food and retail should not, transport only services)
  const shouldShowServicesTab = !['food', 'retail'].includes(industry);
  const shouldShowInventoryTab = !['transport'].includes(industry); // Transport doesn't show inventory
  const pageTitle = shouldShowServicesTab ? t('services') : t('services.inventory_tab', 'Inventory');
  
  // Force inventory tab for food and retail industries
  useEffect(() => {
    if (!shouldShowServicesTab) {
      setActiveTab('inventory');
    }
  }, [shouldShowServicesTab]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showServiceDetail, setShowServiceDetail] = useState<string | null>(null);
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);
  const [showKmModal, setShowKmModal] = useState<string | null>(null); // For transport KM input
  const [kmInput, setKmInput] = useState('');
  const [showEditModal, setShowEditModal] = useState<string | null>(null); // For editing service price
  const [showSellModal, setShowSellModal] = useState(false); // For selling inventory
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<any>(null);
  const [showEditInventoryModal, setShowEditInventoryModal] = useState(false); // For editing inventory

  // Universal industry-specific categories and labels
  const industryConfig = {
    retail: {
      categories: ['all', 'electronics', 'clothing', 'food', 'beauty', 'household', 'toys'],
      serviceLabel: 'products',
      itemLabel: 'product',
      icon: Package
    },
    food: {
      categories: ['all', 'appetizers', 'mains', 'desserts', 'beverages', 'sides', 'specials'],
      serviceLabel: 'dishes',
      itemLabel: 'dish',
      icon: Package
    },
    transport: {
      categories: ['all', 'local', 'long_distance', 'airport', 'corporate', 'special', 'delivery'],
      serviceLabel: 'trips',
      itemLabel: 'trip',
      icon: Package
    },
    salon: {
      categories: ['all', 'hair', 'nails', 'skincare', 'wellness', 'makeup', 'massage'],
      serviceLabel: 'services',
      itemLabel: 'service',
      icon: Package
    },
    tailor: {
      categories: ['all', 'fabrics', 'threads', 'zippers_fasteners', 'buttons_accessories', 'interfacing_linings', 'elastic_trims', 'measuring_tools', 'cutting_tools', 'sewing_tools', 'patterns_templates', 'dyes_chemicals', 'packaging_materials', 'other'],
      serviceLabel: 'materials',
      itemLabel: 'material',
      icon: Package
    },
    repairs: {
      categories: ['all', 'electronics', 'appliances', 'vehicles', 'phones', 'computers', 'general'],
      serviceLabel: 'repairs',
      itemLabel: 'repair',
      icon: Package
    },
    freelance: {
      categories: ['all', 'web_design', 'writing', 'consulting', 'design', 'development', 'marketing'],
      serviceLabel: 'projects',
      itemLabel: 'project',
      icon: Package
    }
  };

  const config = industryConfig[industry as keyof typeof industryConfig] || industryConfig.retail;
  const categories = config.categories;
  
  // Calculate summary statistics from real data
  const totalServices = safeServices.length;
  const availableServices = safeServices.filter((s: any) => s.is_active).length;
  
  // Calculate total revenue from actual service prices (not reviews)
  const totalRevenue = safeServices.reduce((sum: number, s: any) => sum + (s.price || 0), 0);
  
  // Calculate average service price for active services with proper formatting
  const averageServicePrice = availableServices > 0 
    ? totalRevenue / availableServices 
    : 0;
  
  // Debug the calculations to identify formatting issues
  console.log('💰 Service Price Calculations:', {
    totalServices,
    availableServices,
    totalRevenue,
    averageServicePrice,
    servicePrices: safeServices.map(s => ({ name: s.service_name, price: s.price }))
  });

  // Calculate inventory statistics
  const totalInventoryItems = inventory.length;
  const lowStockItems = inventory.filter((item: any) => item.threshold !== undefined && item.quantity <= item.threshold).length;
  const totalInventoryValue = inventory.reduce((sum: number, item: any) => sum + ((item.selling_price || item.cost_price || 0) * item.quantity), 0);

  // Filter functions
  const filteredServices = safeServices.filter((service: any) => {
    const matchesSearch = service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredInventory = inventory.filter((item: any) => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddService = async (newService: any) => {
    try {
      if (!business?.id) {
        console.error('No business ID found');
        return;
      }
      
      // Get currency from business country
      const currency = getCurrency(business.country || country);
      
      await addService({
        ...newService,
        business_id: business.id,
        industry,
        currency,
        is_active: true
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add service:', error);
    }
  };

  const handleAddInventoryItem = async (newItem: any) => {
    try {
      if (!business?.id) {
        alert('Please wait for business data to load or refresh the page to log in properly.');
        return;
      }
      
      // Get currency from business country
      const currency = getCurrency(business.country || country);
      
      await addInventoryItem({
        ...newItem,
        business_id: business.id,
        industry,
        currency
      });
      setShowAddInventoryModal(false);
    } catch (error) {
      console.error('Failed to add inventory item:', error);
      alert('Failed to add item. Please try again.');
    }
  };

  const handleUpdateService = async (serviceId: string, updates: any) => {
    try {
      updateService({ id: serviceId, updates });
      showSuccess('Service updated successfully');
    } catch (error) {
      console.error('Failed to update service:', error);
      showError('Failed to update service');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }
    
    try {
      await deleteServiceFn(serviceId);
      setShowServiceDetail(null);
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  // Inventory item handlers
  const handleSellInventoryItem = (item: any) => {
    setSelectedInventoryItem(item);
    setShowSellModal(true);
  };

  const handleSellSubmit = async (sellData: any) => {
    if (!selectedInventoryItem || !business?.id) return;
    
    try {
      const quantity = parseInt(sellData.quantity);
      const totalPrice = quantity * (selectedInventoryItem.selling_price || selectedInventoryItem.cost_price || 0);
      
      // Create transaction for the sale
      const transactionData = {
        business_id: business.id,
        industry: industry,
        amount: totalPrice,
        category: 'inventory_sale',
        description: `${quantity} ${selectedInventoryItem.unit} ${selectedInventoryItem.item_name}`,
        customer_name: sellData.customerName || 'Walk-in Customer',
        payment_method: sellData.paymentMethod || 'cash',
        transaction_date: new Date().toISOString().split('T')[0],
        metadata: {
          inventory_item_id: selectedInventoryItem.id,
          item_name: selectedInventoryItem.item_name,
          quantity_sold: quantity,
          unit_price: selectedInventoryItem.selling_price || selectedInventoryItem.cost_price || 0,
          total_price: totalPrice
        }
      };

      if (!isOffline) {
        // Try online first
        try {
          console.log('📦 Starting inventory sale:', { 
            itemName: selectedInventoryItem.item_name, 
            currentQuantity: selectedInventoryItem.quantity, 
            quantityToSell: quantity 
          });
          
          await addTransaction(transactionData);
          console.log('✅ Transaction added successfully');
          
          // Update inventory quantity
          const updatedQuantity = selectedInventoryItem.quantity - quantity;
          console.log('📉 Updating inventory quantity:', { 
            from: selectedInventoryItem.quantity, 
            to: updatedQuantity 
          });
          
          await updateInventoryItem({ id: selectedInventoryItem.id, updates: { quantity: updatedQuantity } });
          console.log('✅ Inventory updated successfully');
          
          console.log(`💰 Sold ${quantity} ${selectedInventoryItem.unit} of ${selectedInventoryItem.item_name} for ${formatCurrency(totalPrice, country)}`);
        } catch (onlineError) {
          console.warn('⚠️ Online sale failed, using offline mode:', onlineError);
          showInfo(t('services.sell_offline', 'Sale queued - will sync when you\'re back online'));
          console.log(`✅ Sale queued for sync: ${quantity} ${selectedInventoryItem.unit} of ${selectedInventoryItem.item_name}`);
        }
      } else {
        // Offline mode - TanStack Query handles this automatically
        console.log('📴 Offline mode: TanStack Query will queue for later sync');
        showInfo(t('services.sell_offline_mode', 'Offline mode: Sale queued for sync'));
        console.log(`✅ Sale queued for sync: ${quantity} ${selectedInventoryItem.unit} of ${selectedInventoryItem.item_name}`);
      }
      
      // Close modal and reset selection
      setShowSellModal(false);
      setSelectedInventoryItem(null);
    } catch (error) {
      console.error('Failed to create inventory sale:', error);
      alert('Failed to complete sale. Please try again.');
    }
  };

  const handleEditInventoryItem = (item: any) => {
    setSelectedInventoryItem(item);
    setShowEditInventoryModal(true);
  };

  const handleEditInventorySubmit = async (editData: any) => {
    if (!selectedInventoryItem) return;
    
    try {
      const updates: any = {
        item_name: editData.item_name,
        category: editData.category,
        quantity: parseFloat(editData.quantity),
        threshold: parseFloat(editData.threshold),
        unit: editData.unit,
        supplier: editData.supplier
      };

      // Only include price fields if they have values
      if (editData.cost_price && editData.cost_price !== '') {
        updates.cost_price = parseFloat(editData.cost_price);
      }
      if (editData.selling_price && editData.selling_price !== '') {
        updates.selling_price = parseFloat(editData.selling_price);
      }

      await updateInventoryItem({ id: selectedInventoryItem.id, updates });
      console.log('Inventory item updated successfully');
      
      // Close modal and reset selection
      setShowEditInventoryModal(false);
      setSelectedInventoryItem(null);
    } catch (error) {
      console.error('Failed to update inventory item:', error);
      alert('Failed to update item. Please try again.');
    }
  };

  const handleDeleteInventoryItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this inventory item?')) {
      return;
    }
    
    try {
      await deleteInventoryItem(itemId);
      console.log('Inventory item deleted successfully');
    } catch (error) {
      console.error('Failed to delete inventory item:', error);
    }
  };

  const handleKmConfirm = async (km: string, useBase: boolean, tips: string, location?: string) => {
    const service = safeServices.find((s: any) => s.id === showKmModal);
    if (!service || !business?.id) {
      console.error('Service or business not found');
      return;
    }

    try {
      // Calculate the fare
      const totalFare = useBase ? 
        (service.price || 0) + (parseFloat(tips) || 0) :
        ((parseFloat(km) || 0) * (service.price || 0)) + (service.price || 0) + (parseFloat(tips) || 0);

      // Create the transaction
      const transactionData = {
        business_id: business.id,
        industry: industry,
        amount: totalFare,
        category: 'transport_trip',
        description: location ? 
          `${service.service_name} (${location})${useBase ? ' (Base only)' : ` (${km} km)`}${tips ? ' + tips' : ''}` :
          `${service.service_name}${useBase ? ' (Base only)' : ` (${km} km)`}${tips ? ' + tips' : ''}`,
        customer_name: 'Walk-in Customer',
        payment_method: 'cash' as const,
        transaction_date: new Date().toISOString().split('T')[0],
        metadata: {
          service_id: service.id,
          service_name: service.service_name,
          distance: parseFloat(km) || 0,
          use_base_amount: useBase,
          tips: parseFloat(tips) || 0,
          location: location,
          price_per_km: service.price || 0,
          base_amount: service.price || 0,
          calculated_fare: totalFare
        }
      };

      console.log('Creating transport transaction:', transactionData);
      
      if (!isOffline) {
        // Try online first
        try {
          await addTransaction(transactionData);
          console.log('Transport transaction created successfully');
        } catch (onlineError) {
          console.warn('⚠️ Online transaction failed, using offline mode:', onlineError);
          showInfo(t('services.transport_offline', 'Transport trip queued - will sync when you\'re back online'));
          console.log(`✅ Transport trip queued for sync: ${service.service_name}`);
        }
      } else {
        // Offline mode - TanStack Query handles this automatically
        console.log('📴 Offline mode: TanStack Query will queue for later sync');
        showInfo(t('services.transport_offline_mode', 'Offline mode: Transport trip queued for sync'));
        console.log(`✅ Transport trip queued for sync: ${service.service_name}`);
      }
      
    } catch (error) {
      console.error('Failed to create transport transaction:', error);
      alert('Failed to complete trip. Please try again.');
    }
    
    setShowKmModal(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header industry={industry} country={country} />

      <div className="p-4 max-w-md mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900 mb-6"
        >
          {pageTitle}
        </motion.h1>

        {/* Tab Slider - Only show for industries that have services */}
        {shouldShowServicesTab && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="bg-gray-100 rounded-xl p-1 flex">
              <button
                onClick={() => setActiveTab('services')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  activeTab === 'services'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Package size={18} />
                  {t('services.services_tab', 'Services')}
                </div>
              </button>
              {shouldShowInventoryTab && (
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    activeTab === 'inventory'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Box size={18} />
                    {t('services.inventory_tab', 'Inventory')}
                  </div>
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Services View - Only show for industries that have services */}
        {shouldShowServicesTab && activeTab === 'services' && (
          <motion.div
            initial={{ opacity: 0, x: activeTab === 'services' ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Summary Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-3 mb-6"
            >
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Package className="text-gray-600" size={16} />
                  {t('services.total_services')}
                </div>
                <div className="text-2xl font-bold text-gray-900">{totalServices}</div>
                <div className="text-xs text-gray-500">{availableServices} {t('services.available')}</div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <div className="flex items-center gap-2 text-sm text-orange-700 mb-1">
                  <AlertTriangle size={16} />
                  {t('services.low_stock')}
                </div>
                <div className="text-2xl font-bold text-orange-600">{lowStockItems}</div>
                <div className="text-xs text-orange-500">{t('services.products_need_restock')}</div>
              </div>
            </motion.div>

            {/* Revenue & Rating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-3 mb-6"
            >
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 text-sm text-green-700 mb-1">
                  <DollarSign size={16} />
                  Total Service Value
                </div>
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(totalRevenue, country)}
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 text-sm text-purple-700 mb-1">
                  <TrendingUp size={16} />
                  Avg Price
                </div>
                <div className="text-xl font-bold text-purple-600">
                  {formatCurrency(Math.round(averageServicePrice * 100) / 100, country)}
                </div>
              </div>
            </motion.div>

            {/* Add Service Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                {t('services.add_service')}
              </button>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-4 space-y-3"
            >
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('services.search_services')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
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
                    {category === 'all' ? t('services.all') : category.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Services List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              {filteredServices.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                  <div className="text-gray-400 mb-2">
                    <Package size={48} className="mx-auto" />
                  </div>
                  <p className="text-gray-600">{t('services.no_services_found')}</p>
                  <p className="text-sm text-gray-500 mt-1">{t('services.start_by_adding_first_service')}</p>
                </div>
              ) : (
                filteredServices.map((service: any, index: number) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    {/* Service Header */}
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => industry === 'transport' ? setShowKmModal(service.id) : setShowServiceDetail(service.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{service.service_name}</h3>
                            {!service.is_active && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                Unavailable
                              </span>
                            )}
                          </div>
                          {service.description && (
                            <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {service.duration && (
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {service.duration}min
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {(() => {
                              let displayPrice = 0;
                              
                              if (industry === 'transport') {
                                // For transport, use base_amount from metadata or price
                                displayPrice = service.metadata?.base_amount || service.price || 0;
                              } else {
                                // For non-transport industries like salon
                                // First try direct price field
                                if (service.price && service.price > 0) {
                                  displayPrice = service.price;
                                }
                                // Fallback to metadata if direct price is 0 or missing
                                else if (service.metadata?.price) {
                                  displayPrice = service.metadata.price;
                                }
                                // Fallback to base_amount for transport-like metadata
                                else if (service.metadata?.base_amount) {
                                  displayPrice = service.metadata.base_amount;
                                }
                                // Fallback to price_per_km for transport-like metadata
                                else if (service.metadata?.price_per_km) {
                                  displayPrice = service.metadata.price_per_km + (service.metadata.base_amount || 0);
                                }
                                // Try to find any numeric value in metadata
                                else if (service.metadata) {
                                  const numericValues = Object.values(service.metadata).filter(val => 
                                    typeof val === 'number' && val > 0
                                  );
                                  if (numericValues.length > 0) {
                                    displayPrice = numericValues[0] as number;
                                  }
                                }
                                // If all else fails and price is 0, show a placeholder
                                else if (service.price === 0) {
                                  displayPrice = 0; // This will show "0" indicating the service needs price update
                                }
                              }
                              
                              return formatCurrency(displayPrice, country);
                            })()}
                          </div>
                          {service.price === 0 && (
                            <div className="text-xs text-orange-500 mt-1">
                              Update price
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setShowServiceDetail(service.id)}
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <ChevronRight size={20} className="text-gray-400" />
                            </button>
                            {(service.price === 0 || industry !== 'transport') && (
                              <button
                                onClick={() => setShowEditModal(service.id)}
                                className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                title="Edit price"
                              >
                                <Edit size={16} className="text-blue-600" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete service"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Inventory View - Only show for non-transport industries */}
        {shouldShowInventoryTab && (!shouldShowServicesTab || activeTab === 'inventory') && (
          <motion.div
            initial={{ opacity: 0, x: activeTab === 'inventory' ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Summary Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-3 mb-6"
            >
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Box className="text-gray-600" size={16} />
                  {t('inventory.total_items')}
                </div>
                <div className="text-2xl font-bold text-gray-900">{totalInventoryItems}</div>
                <div className="text-xs text-gray-500">{t('inventory.left', 'in stock')}</div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <div className="flex items-center gap-2 text-sm text-orange-700 mb-1">
                  <AlertTriangle size={16} />
                  {t('inventory.low_stock')}
                </div>
                <div className="text-2xl font-bold text-orange-600">{lowStockItems}</div>
                <div className="text-xs text-orange-500">{t('inventory.reorder_soon', 'items need restock')}</div>
              </div>
            </motion.div>

            {/* Inventory Value Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 text-sm text-green-700 mb-1">
                  <DollarSign size={16} />
                  {t('inventory.total_stock_value')}
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalInventoryValue, country)}
                </div>
              </div>
            </motion.div>

            {/* Add Inventory Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              <button
                onClick={() => setShowAddInventoryModal(true)}
                disabled={!business?.id}
                className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                {business?.id ? t('inventory.add_new_item') : 'Loading business data...'}
              </button>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('inventory.search_items')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </motion.div>

            {/* Inventory List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {filteredInventory.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                  <div className="text-gray-400 mb-2">
                    <Box size={48} className="mx-auto" />
                  </div>
                  <p className="text-gray-600">{t('services.no_inventory_found', 'No inventory items found')}</p>
                  <p className="text-sm text-gray-500 mt-1">{t('services.start_by_adding_first_item', 'Start by adding your first inventory item')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInventory.map((item: any, index: number) => {
                    const isLowStock = item.threshold !== undefined && item.quantity <= item.threshold;
                    const stockPercentage = item.threshold ? (item.quantity / (item.threshold * 2)) * 100 : 100;
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                        className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${
                          isLowStock ? 'border-orange-200' : ''
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {isLowStock && <AlertTriangle size={18} className="text-orange-500" />}
                              <div>
                                <div className="font-semibold text-gray-900">{item.item_name}</div>
                                {item.category && (
                                  <div className="text-xs text-gray-500">{item.category}</div>
                                )}
                                {item.cost_price && item.selling_price && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {formatCurrency(item.cost_price, country)} → {formatCurrency(item.selling_price, country)}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className={`font-bold text-lg ${
                                isLowStock ? 'text-orange-600' : 'text-gray-900'
                              }`}>
                                {item.quantity} <span className="text-xs font-medium text-gray-500">{item.unit}</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {t('inventory.min')}: {item.threshold}
                              </div>
                            </div>
                          </div>

                          {/* Stock Level Bar */}
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                isLowStock 
                                  ? 'bg-gradient-to-r from-orange-400 to-red-500' 
                                  : stockPercentage > 50 
                                    ? 'bg-gradient-to-r from-green-400 to-green-500' 
                                    : 'bg-gradient-to-r from-yellow-400 to-orange-400'
                              }`}
                              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                            />
                          </div>

                          {isLowStock && (
                            <div className="mt-2 text-xs text-orange-600 font-bold flex items-center gap-1.5">
                              <TrendingDown size={14} />
                              {t('inventory.running_low')}
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="px-4 pb-4 flex gap-2">
                          <button
                            onClick={() => handleSellInventoryItem(item)}
                            className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <DollarSign size={16} />
                            Sell
                          </button>
                          <button
                            onClick={() => handleEditInventoryItem(item)}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            title="Edit item"
                          >
                            <Edit size={16} className="text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteInventoryItem(item.id)}
                            className="p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete item"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{t('services.add_service')}</h2>
            <AddServiceForm 
              onSubmit={handleAddService}
              onCancel={() => setShowAddModal(false)}
              country={country}
              industry={industry}
              config={config}
            />
          </div>
        </div>
      )}

      {showAddInventoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{t('services.add_inventory_item', 'Add Item')}</h2>
            <AddInventoryForm 
              onSubmit={handleAddInventoryItem}
              onCancel={() => setShowAddInventoryModal(false)}
              country={country}
              industry={industry}
              config={config}
              t={t}
            />
          </div>
        </div>
      )}

      {/* KM Input Modal for Transport Services */}
      {showKmModal && (
        <KmInputModal
          service={safeServices.find((s: any) => s.id === showKmModal)}
          onClose={() => setShowKmModal(null)}
          onConfirm={handleKmConfirm}
          country={country}
        />
      )}

      {/* Edit Service Price Modal */}
      {showEditModal && (
        <EditServiceModal
          service={safeServices.find((s: any) => s.id === showEditModal)}
          onClose={() => setShowEditModal(null)}
          onUpdate={handleUpdateService}
          country={country}
          industry={industry}
        />
      )}

      {/* Sell Inventory Modal */}
      {showSellModal && selectedInventoryItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sell Item</h3>
            
            <SellItemForm 
              item={selectedInventoryItem} 
              onSubmit={handleSellSubmit} 
              onCancel={() => {
                setShowSellModal(false);
                setSelectedInventoryItem(null);
              }} 
              t={t}
              country={country}
            />
          </div>
        </div>
      )}

      {/* Edit Inventory Modal */}
      {showEditInventoryModal && selectedInventoryItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Inventory Item</h3>
            
            <EditInventoryForm 
              item={selectedInventoryItem} 
              onSubmit={handleEditInventorySubmit} 
              onCancel={() => {
                setShowEditInventoryModal(false);
                setSelectedInventoryItem(null);
              }} 
              t={t}
              country={country}
            />
          </div>
        </div>
      )}

      <BottomNav industry={industry} country={country} />
    </div>
  );
}

function EditServiceModal({ service, onClose, onUpdate, country, industry }: {
  service: any;
  onClose: () => void;
  onUpdate: (serviceId: string, updates: any) => void;
  country: string;
  industry: string;
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
      description: formData.description
    };

    // Add duration for salon and freelance industries
    if ((industry === 'salon' || industry === 'freelance') && formData.duration) {
      updates.duration = parseInt(formData.duration);
    }

    // Update metadata for consistency
    updates.metadata = {
      ...service?.metadata,
      price: parseFloat(formData.price) || 0,
      ...(formData.duration && { duration: parseInt(formData.duration) })
    };

    onUpdate(service.id, updates);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Service</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
              <input
                type="text"
                value={service?.service_name || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ({getCurrency(country)})</label>
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
            
            {(industry === 'salon' || industry === 'freelance') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {industry === 'salon' ? 'Duration (minutes)' : 'Duration (days)'}
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={industry === 'freelance' ? '7' : '30'}
                  step="1"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Describe your service..."
              />
            </div>

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
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Update Service
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function SellItemForm({ item, onSubmit, onCancel, t, country }: { 
  item: any; 
  onSubmit: (data: any) => void; 
  onCancel: () => void;
  t: (key: string, fallback?: string) => string;
  country: string;
}) {
  const [formData, setFormData] = useState({
    quantity: '1',
    customerName: '',
    paymentMethod: 'cash'
  });

  const maxQuantity = item.quantity;
  const totalPrice = parseInt(formData.quantity || '0') * (item.selling_price || item.cost_price || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="font-medium text-gray-900">{item.item_name}</div>
        <div className="text-sm text-gray-500">Available: {item.quantity} {item.unit}</div>
        <div className="text-sm font-medium text-green-600">
          {formatCurrency(item.selling_price || item.cost_price || 0, country)} per {item.unit}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
        <input
          type="number"
          required
          min="1"
          max={maxQuantity}
          value={formData.quantity}
          onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="1"
        />
        {parseInt(formData.quantity) > maxQuantity && (
          <p className="text-red-500 text-xs mt-1">Cannot exceed available quantity</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name (Optional)</label>
        <input
          type="text"
          value={formData.customerName}
          onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter customer name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
        <select
          value={formData.paymentMethod}
          onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="transfer">Bank Transfer</option>
          <option value="mobile_money">Mobile Money</option>
        </select>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <div className="text-sm text-blue-700">Total Amount</div>
        <div className="text-xl font-bold text-blue-600">
          {formatCurrency(totalPrice, country)}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={parseInt(formData.quantity) > maxQuantity || parseInt(formData.quantity) <= 0}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Sell Item
        </button>
      </div>
    </form>
  );
}

function EditInventoryForm({ item, onSubmit, onCancel, t, country }: { 
  item: any; 
  onSubmit: (data: any) => void; 
  onCancel: () => void;
  t: (key: string, fallback?: string) => string;
  country: string;
}) {
  const [formData, setFormData] = useState({
    item_name: item.item_name || '',
    category: item.category || '',
    quantity: item.quantity?.toString() || '',
    threshold: item.threshold?.toString() || '',
    unit: item.unit || '',
    cost_price: item.cost_price?.toString() || '',
    selling_price: item.selling_price?.toString() || '',
    supplier: item.supplier || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
        <input
          type="text"
          required
          value={formData.item_name}
          onChange={(e) => setFormData(prev => ({ ...prev, item_name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Shampoo"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Hair Care"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            required
            value={formData.quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="10"
            min="0"
            step="1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
          <input
            type="number"
            required
            value={formData.threshold}
            onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="2"
            min="0"
            step="1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
        <select
          required
          value={formData.unit}
          onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Unit</option>
          <option value="pieces">Pieces</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price ({getCurrency(country)})</label>
          <input
            type="number"
            value={formData.cost_price}
            onChange={(e) => setFormData(prev => ({ ...prev, cost_price: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price ({getCurrency(country)})</label>
          <input
            type="number"
            value={formData.selling_price}
            onChange={(e) => setFormData(prev => ({ ...prev, selling_price: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
        <input
          type="text"
          value={formData.supplier}
          onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Supplier Name"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Update Item
        </button>
      </div>
    </form>
  );
}

function AddInventoryForm({ onSubmit, onCancel, country, industry, config, t }: { onSubmit: (data: any) => void, onCancel: () => void, country: string, industry: string, config: any, t: (key: string, fallback?: string) => string }) {
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('item_name')}</label>
        <input
          type="text"
          required
          value={formData.item_name}
          onChange={(e) => setFormData(prev => ({ ...prev, item_name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder={industry === 'food' ? 'e.g., Fresh Vegetables' : industry === 'retail' ? 'e.g., Premium Headphones' : industry === 'transport' ? 'e.g., Fuel Can' : industry === 'freelance' ? 'e.g., Software License' : 'e.g., Item Name'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
        <input
          type="text"
          required
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder={t('enter_category', 'Enter category')}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('quantity')}</label>
          <input
            type="number"
            required
            value={formData.quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="10"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.min')} {t('stock', 'Stock')}</label>
          <input
            type="number"
            required
            value={formData.threshold}
            onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="5"
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
            <option value="">{t('select_category')}</option>
            <option value="pieces">{t('inventory.pieces')}</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('common.suppliers')}</label>
          <input
            type="text"
            value={formData.supplier}
            onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Supplier name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price ({getCurrency(country)})</label>
          <input
            type="number"
            step="0.01"
            value={formData.cost_price}
            onChange={(e) => setFormData(prev => ({ ...prev, cost_price: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price ({getCurrency(country)})</label>
          <input
            type="number"
            step="0.01"
            value={formData.selling_price}
            onChange={(e) => setFormData(prev => ({ ...prev, selling_price: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          {t('inventory.add_new_item')}
        </button>
      </div>
    </form>
  );
}

function AddServiceForm({ onSubmit, onCancel, country, industry, config }: { onSubmit: (data: any) => void, onCancel: () => void, country: string, industry: string, config: any }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    duration: '',
    pricePerKm: '',
    baseAmount: '',
    description: ''
  });

  // Calculate total fare (simplified without distance)
  const calculateTotalFare = () => {
    if (industry === 'transport') {
      const pricePerKm = parseFloat(formData.pricePerKm) || 0;
      const baseAmount = parseFloat(formData.baseAmount) || 0;
      return pricePerKm + baseAmount;
    } else {
      // For non-transport industries, use the direct price
      return parseFloat(formData.price) || 0;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData: any = {
      service_name: formData.name,
      category: formData.category,
      price: calculateTotalFare(),
      description: formData.description
    };

    // Add transport-specific data to metadata for transport industry
    if (industry === 'transport') {
      serviceData.metadata = {
        price_per_km: parseFloat(formData.pricePerKm) || 0,
        base_amount: parseFloat(formData.baseAmount) || 0
      };
    } else {
      // For non-transport industries, store price in metadata for compatibility
      const calculatedPrice = calculateTotalFare();
      serviceData.metadata = {
        price: calculatedPrice
      };
      
      // Add duration for other industries if provided
      if (formData.duration) {
        serviceData.duration = parseInt(formData.duration);
        serviceData.metadata.duration = parseInt(formData.duration);
      }
    }

    onSubmit(serviceData);
  };

  // Industry-specific placeholders
  const placeholders = {
    retail: 'e.g., Premium Headphones',
    food: 'e.g., Special Pasta Dish',
    transport: 'e.g., Airport Transfer',
    salon: 'e.g., Haircut & Styling',
    tailor: 'e.g., Custom Suit Alteration',
    repairs: 'e.g., Phone Screen Repair',
    freelance: 'e.g., Website Design Project'
  };

  const placeholder = placeholders[industry as keyof typeof placeholders] || 'e.g., Service Name';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <input
          type="text"
          required
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter category"
        />
      </div>

      {industry === 'transport' ? (
        // Transport-specific fare calculation fields (simplified)
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per km ({getCurrency(country)})</label>
              <input
                type="number"
                required
                value={formData.pricePerKm}
                onChange={(e) => setFormData(prev => ({ ...prev, pricePerKm: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Amount ({getCurrency(country)})</label>
              <input
                type="number"
                value={formData.baseAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, baseAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>

          {/* Total Fare Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900">Total Fare:</span>
              <span className="text-lg font-bold text-blue-900">
                {getCurrency(country)} {calculateTotalFare().toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {getCurrency(country)} {formData.pricePerKm || '0'} (per km) + {getCurrency(country)} {formData.baseAmount || '0'} (base amount)
            </div>
          </div>
        </div>
      ) : (
        // Original fields for other industries
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ({getCurrency(country)})</label>
            <input
              type="number"
              required
              value={formData.price || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          
          {(industry === 'salon' || industry === 'freelance') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {industry === 'salon' ? 'Duration (min)' : 'Duration (days)'}
              </label>
              <input
                type="number"
                value={formData.duration || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={industry === 'freelance' ? '7' : '30'}
                step="1"
              />
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          placeholder="Describe your service..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Service
        </button>
      </div>
    </form>
  );
}

// KM Input Modal for Transport Services
function KmInputModal({ service, onClose, onConfirm, country }: { service: any, onClose: () => void, onConfirm: (km: string, useBase: boolean, tips: string, location?: string) => void, country: string }) {
  const [km, setKm] = useState('');
  const [useBaseOnly, setUseBaseOnly] = useState(false);
  const [tips, setTips] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

  const calculateFare = () => {
    if (useBaseOnly) {
      return (service.metadata?.base_amount || 0) + (parseFloat(tips) || 0);
    }
    const kmValue = parseFloat(km) || 0;
    const pricePerKm = service.metadata?.price_per_km || 0;
    const baseAmount = service.metadata?.base_amount || 0;
    const tipsAmount = parseFloat(tips) || 0;
    return (kmValue * pricePerKm) + baseAmount + tipsAmount;
  };

  const handleSubmit = () => {
    onConfirm(km, useBaseOnly, tips, `${pickupLocation} → ${dropoffLocation}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Package className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{service.service_name}</h3>
            <p className="text-sm text-gray-600">Calculate trip fare</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distance (km)
            </label>
            <input
              type="number"
              value={km}
              onChange={(e) => setKm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.0"
              step="0.1"
              disabled={useBaseOnly}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="baseOnly"
              checked={useBaseOnly}
              onChange={(e) => setUseBaseOnly(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="baseOnly" className="text-sm text-gray-700">
              Use base amount only
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tips (optional)
            </label>
            <input
              type="number"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
            />
          </div>

          {/* Location Tracking */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Location
            </label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Nairobi CBD"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Drop-off Location
            </label>
            <input
              type="text"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Airport Terminal 3"
            />
          </div>

          {/* Fare Breakdown */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900">Total Fare:</span>
              <span className="text-lg font-bold text-blue-900">
                {getCurrency(country)} {calculateFare().toFixed(2)}
              </span>
            </div>
            {!useBaseOnly && (
              <div className="text-xs text-blue-600 mt-1">
                ({km || '0'} km × {getCurrency(country)} {service.metadata?.price_per_km || 0}) + {getCurrency(country)} {service.metadata?.base_amount || 0}{tips && ` + ${getCurrency(country)} ${tips} tips`}
              </div>
            )}
            {useBaseOnly && (
              <div className="text-xs text-blue-600 mt-1">
                Base amount only{tips && ` + ${getCurrency(country)} ${tips} tips`}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Confirm Fare
          </button>
        </div>
      </div>
    </div>
  );
}
