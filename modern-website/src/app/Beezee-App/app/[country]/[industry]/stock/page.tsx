"use client";

import React, { useState, useEffect } from 'react';
import { Package, Plus, AlertTriangle, Search, Filter, TrendingDown, DollarSign, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { formatCurrency, getCurrency } from '@/utils/currency';
import Header from '@/components/universal/Header';
import { useInventoryTanStack, useTransactionsTanStack } from '@/hooks';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useLanguage } from '@/hooks/LanguageContext';
import { useToast } from '@/hooks/useToast';
import BottomNav from '@/components/universal/BottomNav';
import { BeeZeeConfirmDialog, useBeeZeeConfirm } from '@/components/ui/BeeZeeConfirmDialog';

export default function StockPage() {
  // ✅ STEP 1: Basic hooks (always called) - LIKE OTHER PAGES
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { confirm, DialogComponent } = useBeeZeeConfirm();
  
  const { business, loading: businessLoading } = useUnifiedAuth();
  const businessId = business?.id;

  // ✅ STEP 2: Toast hook (always called) - LIKE OTHER PAGES
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  // ✅ STEP 3: Simple data hook (always called) - LIKE OTHER PAGES
  const inventoryHook = useInventoryTanStack({ 
    businessId,
    industry,
    country
  });
  
  // ✅ STEP 4: Safe data extraction with fallbacks - LIKE OTHER PAGES
  const inventory = inventoryHook?.data || [];
  const isLoading = inventoryHook?.isLoading || false;
  const isOffline = inventoryHook?.isOffline || false;
  const addInventory = inventoryHook?.addInventory || (() => Promise.resolve());
  const updateInventory = inventoryHook?.updateInventory || (() => Promise.resolve());
  const deleteInventory = inventoryHook?.deleteInventory || (() => Promise.resolve());
  
  // ✅ STEP 5: Transactions hook (always called) - LIKE OTHER PAGES
  const transactionsHook = useTransactionsTanStack({ 
    industry,
    businessId 
  });
  const addTransaction = transactionsHook?.addTransaction || (() => Promise.resolve());

  // ✅ STEP 6: Simple state management - LIKE OTHER PAGES
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = ['all', ...Array.from(new Set(inventory.map((item: any) => item.category || 'uncategorized')))] as string[];
  
  const lowStockItems = inventory.filter((item: any) => item.threshold !== undefined && item.quantity <= item.threshold);
  const totalItems = inventory.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const totalValue = inventory.reduce((sum: number, item: any) => sum + (item.quantity * (item.cost_price || 0)), 0);

  const filteredInventory = inventory.filter((item: any) => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || (item.category || 'uncategorized') === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // ✅ STEP 7: Simple operations with error handling - LIKE OTHER PAGES
  const handleAddItem = async (newItem: any) => {
    try {
      if (!businessId) {
        console.error('No business ID found');
        showError('Please set up your business profile first');
        return;
      }
      
      const itemData = {
        ...newItem,
        business_id: businessId,
        industry,
        last_ordered: new Date().toISOString().split('T')[0]
      };
      
      console.log('🔧 [StockPage] Adding item:', itemData);
      
      // ✅ SIMPLE: Use basic hook like other pages
      await addInventory(itemData);
      
      setShowAddModal(false);
      showSuccess(t('inventory.add_success', `Successfully added "${newItem.item_name}" to inventory`));
    } catch (error) {
      console.error('Failed to add inventory item:', error);
      showError(t('inventory.add_error', 'Failed to add item. Please try again.'));
    }
  };

  const handleSellItem = (item: any) => {
    if (!businessId) {
      showWarning(t('business.setup_required', 'Please set up your business profile first before selling items.'));
      return;
    }
    setSelectedItem(item);
    setShowSellModal(true);
  };

  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDeleteItem = async (item: any) => {
    // BeeZee Confirm - Custom styled dialog
    const confirmed = await confirm(
      'Delete Inventory Item?',
      `Are you sure you want to delete "${item.item_name}"? This action cannot be undone.`,
      {
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        type: 'danger'
      }
    );
    if (!confirmed) return;
    
    setIsDeleting(true);
    
    try {
      console.log('🔍 Deleting item with ID:', item.id, 'Type:', typeof item.id);
      console.log('🔍 Business ID:', businessId, 'Industry:', industry, 'Country:', country);
      
      const isValidUUID = (id: string) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
      };
      
      if (!isValidUUID(item.id)) {
        showWarning(t('inventory.delete_offline_item', 'This item was created offline and will be removed from your local view.'));
        console.log(`🗑️ Removing offline item: ${item.item_name}`);
        
        // ✅ SIMPLE: Remove from cache for offline items - LIKE OTHER PAGES
        const queryKey = ['inventory', industry, country, businessId];
        const currentData = (queryClient.getQueryData(queryKey) as any[]) || [];
        const updatedData = currentData.filter(i => i.id !== item.id);
        queryClient.setQueryData(queryKey, updatedData);
        
        setIsDeleting(false);
        return;
      }
      
      console.log('🔍 Calling delete with ID:', item.id);
      
      // ✅ SIMPLE: Use basic hook like other pages
      await deleteInventory(item.id);
      
      // ✅ SIMPLE: Update cache immediately - LIKE OTHER PAGES
      const queryKey = ['inventory', industry, country, businessId];
      const currentData = (queryClient.getQueryData(queryKey) as any[]) || [];
      const updatedData = currentData.filter(i => i.id !== item.id);
      queryClient.setQueryData(queryKey, updatedData);
      
      showSuccess(t('inventory.delete_success', `Successfully deleted "${item.item_name}"`));
      console.log(`✅ Item deleted: ${item.item_name}`);
      
    } catch (error: any) {
      console.error('Failed to delete item:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        itemId: item.id,
        businessId
      });
      showError(t('inventory.delete_error', 'Failed to delete item. Please try again.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSubmit = async (editData: any) => {
    if (!selectedItem || !businessId) return;
    
    try {
      const updates: any = {
        item_name: editData.item_name,
        category: editData.category,
        quantity: parseFloat(editData.quantity),
        threshold: parseFloat(editData.threshold),
        unit: editData.unit,
        supplier: editData.supplier
      };

      if (editData.cost_price && editData.cost_price !== '') {
        updates.cost_price = parseFloat(editData.cost_price);
      }
      if (editData.selling_price && editData.selling_price !== '') {
        updates.selling_price = parseFloat(editData.selling_price);
      }

      console.log('🔧 [StockPage] Updating item:', { id: selectedItem.id, updates });
      
      // ✅ SIMPLE: Use basic hook like other pages
      await updateInventory({ id: selectedItem.id, data: updates });
      
      setShowEditModal(false);
      setSelectedItem(null);
      showSuccess(t('inventory.edit_success', `Successfully updated "${selectedItem.item_name}"`));
    } catch (error) {
      console.error('Failed to update item:', error);
      showError(t('inventory.edit_error', 'Failed to update item. Please try again.'));
    }
  };

  const handleSellSubmit = async (sellData: any) => {
    if (!selectedItem || !businessId) return;
    
    try {
      const quantity = parseInt(sellData.quantity);
      const totalPrice = quantity * selectedItem.selling_price;
      const newQuantity = selectedItem.quantity - quantity;
      
      console.log('🔧 [StockPage] SELL DEBUG:');
      console.log('  - Item ID:', selectedItem.id);
      console.log('  - Item Name:', selectedItem.item_name);
      console.log('  - Current Quantity:', selectedItem.quantity);
      console.log('  - Quantity to Sell:', quantity);
      console.log('  - New Quantity:', newQuantity);
      
      // Create transaction data
      const transactionData = {
        business_id: businessId,
        industry,
        amount: totalPrice,
        currency: getCurrency(country),
        category: 'sale',
        description: `Sale of ${quantity} ${selectedItem.unit || 'units'} of ${selectedItem.item_name}`,
        customer_name: sellData.customerName,
        payment_method: sellData.paymentMethod,
        transaction_date: new Date().toISOString().split('T')[0],
        metadata: {
          inventory_item_id: selectedItem.id,
          quantity_sold: quantity,
          unit_price: selectedItem.selling_price
        }
      };

      console.log('🔧 [StockPage] Adding transaction:', transactionData);
      
      // ✅ SIMPLE: Add transaction using basic hook - LIKE OTHER PAGES
      await addTransaction(transactionData);
      console.log('✅ [StockPage] Transaction recorded');
      
      // ✅ SIMPLE: Update inventory quantity using basic hook - LIKE OTHER PAGES
      console.log('🔧 [StockPage] Updating inventory quantity to:', newQuantity);
      await updateInventory({ id: selectedItem.id, data: { quantity: newQuantity } });
      console.log('✅ [StockPage] Inventory updated');

      setShowSellModal(false);
      setSelectedItem(null);
      showSuccess(t('inventory.sell_success', `Successfully sold ${quantity} ${selectedItem.unit || 'units'} of "${selectedItem.item_name}"`));
    } catch (error) {
      console.error('❌ [StockPage] Failed to process sale:', error);
      showError(t('inventory.sell_error', 'Failed to process sale. Please try again.'));
    }
  };

  const getStockStatus = (item: any) => {
    const percentage = (item.quantity / (item.threshold * 2)) * 100;
    if (item.quantity <= item.threshold) {
      return { status: 'low', color: 'text-red-600 bg-red-50', barColor: 'bg-red-500' };
    } else if (percentage < 50) {
      return { status: 'medium', color: 'text-yellow-600 bg-yellow-50', barColor: 'bg-yellow-500' };
    } else {
      return { status: 'good', color: 'text-green-600 bg-green-50', barColor: 'bg-green-500' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header industry={industry} country={country} />

      <div className="flex-1 p-4 max-w-md mx-auto">

        {!businessId ? (
          <div className="text-center py-8">
            <Package className="mx-auto mb-4 text-gray-400" size={48} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Business Setup Required
            </h2>
            <p className="text-gray-600 mb-4">
              Please complete your business profile before accessing inventory.
            </p>
            <Link 
              href="/Beezee-App/app/ke/retail/more"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Go to Settings
            </Link>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Loading inventory...</span>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6 mt-8">
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">{t('inventory.total_items', 'Total Items')}</div>
                <div className="text-xl font-bold text-gray-900">{inventory.length}</div>
              </div>
              
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">{t('inventory.total_qty', 'Total Qty')}</div>
                <div className="text-xl font-bold text-gray-900">{totalItems}</div>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-xl border border-orange-200">
                <div className="text-sm text-orange-700 mb-1">{t('inventory.low_stock', 'Low Stock')}</div>
                <div className="text-xl font-bold text-orange-600">{lowStockItems.length}</div>
              </div>
            </div>

            {/* Total Value */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-blue-700 mb-1">{t('inventory.total_stock_value', 'Total Stock Value')}</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(totalValue, country)}
                  </div>
                </div>
                <Package className="text-blue-500" size={32} />
              </div>
            </div>

            {/* Add Item Button */}
            <div className="mb-4 mt-6">
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                {t('inventory.add_new_item', 'Add New Item')}
              </button>
            </div>

            {/* Search and Filter */}
            <div className="mb-4 space-y-3 mt-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('inventory.search_items', 'Search items...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category: string) => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      filterCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    {category === 'all' ? t('common.all', 'All') : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Low Stock Alerts */}
            {lowStockItems.length > 0 && (
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 mb-4">
                <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                  <AlertTriangle size={20} />
                  {t('inventory.running_low', 'Running Low')}
                </h3>
                <div className="space-y-2">
                  {lowStockItems.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-gray-900">{item.item_name}</span>
                        <span className="text-sm text-gray-500 ml-2">({item.unit})</span>
                      </div>
                      <span className="font-bold text-red-600">{item.quantity} {t('inventory.left', 'left')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Inventory */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">{t('common.all', 'All')} {t('inventory.items', 'Items')}</h3>
              
              {filteredInventory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <Package size={48} className="mx-auto" />
                  </div>
                  <p className="text-gray-600">{t('services.no_inventory_found', 'No items found')}</p>
                  <p className="text-sm text-gray-500 mt-1">{t('repairs.try_adjusting', 'Try adjusting your search or filters')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredInventory.map((item: any, index: number) => {
                    const stockStatus = getStockStatus(item);
                    const stockPercentage = item.threshold ? (item.quantity / (item.threshold * 2)) * 100 : 100;
                    
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border ${
                          item.threshold !== undefined && item.quantity <= item.threshold 
                            ? 'bg-orange-50 border-orange-200' 
                            : 'bg-gray-50 border-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.item_name}</div>
                            <div className="text-sm text-gray-500">
                              {item.category || 'uncategorized'} • {item.unit} • {formatCurrency(item.cost_price || 0, country)} → {formatCurrency(item.selling_price || 0, country)}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`font-bold ${
                              item.threshold !== undefined && item.quantity <= item.threshold ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {item.quantity} {item.unit}
                            </div>
                            <div className="text-xs text-gray-500">
                              {t('inventory.min', 'Min:')} {item.threshold ?? 0}
                            </div>
                            
                            <div className="flex gap-1 mt-1">
                              <button
                                onClick={() => handleEditItem(item)}
                                className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                title="Edit item"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleSellItem(item)}
                                className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={item.quantity === 0 || !businessId}
                                title={!businessId ? 'Please set up your business profile first' : item.quantity === 0 ? 'Out of stock' : 'Sell item'}
                              >
                                <DollarSign size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item)}
                                disabled={isDeleting}
                                className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete item"
                              >
                                {isDeleting ? (
                                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${stockStatus.barColor}`}
                            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                          />
                        </div>

                        {item.threshold !== undefined && item.quantity <= item.threshold && (
                          <div className="mt-2 text-xs text-orange-600 font-medium flex items-center gap-1">
                            <TrendingDown size={12} />
                            {t('services.running_low', 'Stock running low - reorder soon')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <BottomNav industry={industry} country={country} />
      
      {/* BeeZee Confirmation Dialog */}
      <DialogComponent />

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('inventory.add_new_item', 'Add New Item')}</h3>
            <AddItemForm onSubmit={handleAddItem} onCancel={() => setShowAddModal(false)} t={t} industry={industry} />
          </div>
        </div>
      )}

      {/* Sell Item Modal */}
      {showSellModal && selectedItem && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('sell', 'Sell')} {t('inventory.items', 'Item')}</h3>
            
            <SellItemForm 
              item={selectedItem} 
              onSubmit={handleSellSubmit} 
              onCancel={() => {
                setShowSellModal(false);
                setSelectedItem(null);
              }} 
              t={t}
              country={country}
            />
          </div>
        </div>
      )}
      
      {/* Edit Item Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('inventory.edit_item', 'Edit Item')}</h3>
            <EditItemForm 
              item={selectedItem} 
              onSubmit={handleEditSubmit} 
              onCancel={() => {
                setShowEditModal(false);
                setSelectedItem(null);
              }} 
              t={t}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function EditItemForm({ item, onSubmit, onCancel, t }: { 
  item: any; 
  onSubmit: (data: any) => void; 
  onCancel: () => void; 
  t: (key: string, fallback?: string) => string;
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
    onSubmit({
      ...formData,
      quantity: parseFloat(formData.quantity),
      threshold: parseFloat(formData.threshold),
      cost_price: parseFloat(formData.cost_price),
      selling_price: parseFloat(formData.selling_price)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('item_name', 'Item Name')}</label>
        <input
          type="text"
          required
          value={formData.item_name}
          onChange={(e) => setFormData(prev => ({ ...prev, item_name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Coke 500ml"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('quantity', 'Quantity')}</label>
          <input
            type="number"
            required
            value={formData.quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('retail.inventory.min_stock', 'Min Stock')}</label>
          <input
            type="number"
            required
            value={formData.threshold}
            onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.unit', 'Unit')}</label>
          <input
            type="text"
            required
            value={formData.unit}
            onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., bottles"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('category', 'Category')}</label>
          <input
            type="text"
            required
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('enter_category', 'Enter category')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('cost_price', 'Cost Price')}</label>
          <input
            type="number"
            value={formData.cost_price}
            onChange={(e) => setFormData(prev => ({ ...prev, cost_price: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('selling_price', 'Selling Price')}</label>
          <input
            type="number"
            value={formData.selling_price}
            onChange={(e) => setFormData(prev => ({ ...prev, selling_price: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('business.suppliers', 'Supplier')} ({t('common.optional', 'Optional')})</label>
        <input
          type="text"
          value={formData.supplier}
          onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Supplier name"
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
  const totalPrice = parseInt(formData.quantity || '0') * (item.selling_price || 0);

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
          {formatCurrency(item.selling_price || 0, country)} per {item.unit}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('quantity', 'Quantity')}</label>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('customerName', 'Customer Name')} ({t('common.optional', 'Optional')})</label>
        <input
          type="text"
          value={formData.customerName}
          onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter customer name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('paymentMethod', 'Payment Method')}</label>
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
        <div className="text-sm text-blue-700">{t('common.total_amount', 'Total Amount')}</div>
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
          {t('sell', 'Sell Item')}
        </button>
      </div>
    </form>
  );
}

function AddItemForm({ onSubmit, onCancel, t, industry }: { 
  onSubmit: (data: any) => void; 
  onCancel: () => void; 
  t: (key: string, fallback?: string) => string;
  industry: string;
}) {
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
      quantity: parseInt(formData.quantity),
      threshold: parseInt(formData.threshold),
      cost_price: parseFloat(formData.cost_price),
      selling_price: parseFloat(formData.selling_price)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('item_name', 'Item Name')}</label>
        <input
          type="text"
          required
          value={formData.item_name}
          onChange={(e) => setFormData(prev => ({ ...prev, item_name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Coke 500ml"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('quantity', 'Quantity')}</label>
          <input
            type="number"
            required
            value={formData.quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('retail.inventory.min_stock', 'Min Stock')}</label>
          <input
            type="number"
            required
            value={formData.threshold}
            onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.unit', 'Unit')}</label>
          <input
            type="text"
            required
            value={formData.unit}
            onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., bottles"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('category', 'Category')}</label>
          <input
            type="text"
            required
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('enter_category', 'Enter category')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('cost_price', 'Cost Price')}</label>
          <input
            type="number"
            required
            value={formData.cost_price}
            onChange={(e) => setFormData(prev => ({ ...prev, cost_price: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('selling_price', 'Selling Price')}</label>
          <input
            type="number"
            required
            value={formData.selling_price}
            onChange={(e) => setFormData(prev => ({ ...prev, selling_price: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('business.suppliers', 'Supplier')} ({t('common.optional', 'Optional')})</label>
        <input
          type="text"
          value={formData.supplier}
          onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Supplier name"
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
          Add Item
        </button>
      </div>
    </form>
  );
}