"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, AlertTriangle, Search, Filter, TrendingDown, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { formatCurrency } from '@/utils/currency';
import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import { useInventory, useTransactions } from '@/hooks';
import { useBusiness } from '@/contexts/BusinessContext';
import { useLanguage } from '@/hooks/LanguageContext';

export default function StockPage() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const { t } = useLanguage();
  
  // Use Supabase hook instead of mock data
  const { business, loading: businessLoading } = useBusiness();
  const { inventory, loading, insert: addInventoryItem, update: updateInventoryItem, remove: deleteInventoryItem } = useInventory({ 
    industry,
    businessId: business?.id 
  });
  const { insert: addTransaction } = useTransactions({ 
    industry,
    businessId: business?.id 
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const categories = ['all', ...Array.from(new Set(inventory.map(item => item.category || 'uncategorized')))];
  
  const lowStockItems = inventory.filter(item => item.threshold !== undefined && item.quantity <= item.threshold);
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * (item.cost_price || 0)), 0);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || (item.category || 'uncategorized') === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = async (newItem: any) => {
    try {
      if (!business?.id) {
        console.error('No business ID found');
        return;
      }
      
      await addInventoryItem({
        ...newItem,
        business_id: business.id,
        industry,
        last_ordered: new Date().toISOString().split('T')[0]
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add inventory item:', error);
    }
  };

  const handleSellItem = (item: any) => {
    if (!business?.id) {
      alert('Please set up your business profile first before selling items.');
      return;
    }
    setSelectedItem(item);
    setShowSellModal(true);
  };

  const handleSellSubmit = async (sellData: any) => {
    if (!selectedItem || !business?.id) return;
    
    try {
      // Create transaction record
      await addTransaction({
        business_id: business.id,
        industry,
        amount: sellData.quantity * selectedItem.selling_price,
        category: 'sale',
        description: `Sale of ${sellData.quantity} ${selectedItem.unit} of ${selectedItem.item_name}`,
        customer_name: sellData.customerName,
        payment_method: sellData.paymentMethod,
        transaction_date: new Date().toISOString().split('T')[0],
        metadata: {
          inventory_item_id: selectedItem.id,
          quantity_sold: sellData.quantity,
          unit_price: selectedItem.selling_price
        }
      });

      // Update inventory quantity
      const newQuantity = selectedItem.quantity - sellData.quantity;
      await updateInventoryItem(selectedItem.id, { quantity: newQuantity });

      setShowSellModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Failed to process sale:', error);
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header industry={industry} country={country} />

      <div className="p-4 max-w-md mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900 mb-6"
        >
          {t('nav.inventory', 'Stock')}
        </motion.h1>

        {/* Business Setup Warning */}
        {!business && !businessLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="text-yellow-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800">Business Setup Required</h3>
                <p className="text-xs text-yellow-700 mt-1">Please complete your business profile to start selling inventory items.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
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
        </motion.div>

        {/* Total Value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-700 mb-1">{t('inventory.total_stock_value', 'Total Stock Value')}</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalValue, country)}
              </div>
            </div>
            <Package className="text-blue-500" size={32} />
          </div>
        </motion.div>

        {/* Add Item Button */}
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
            {t('inventory.add_new_item', 'Add New Item')}
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
              placeholder={t('inventory.search_items', 'Search items...')}
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
        </motion.div>

        {/* Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-orange-50 p-4 rounded-xl border border-orange-200 mb-4"
          >
            <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
              <AlertTriangle size={20} />
              {t('inventory.running_low', 'Running Low')}
            </h3>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">{item.item_name}</span>
                    <span className="text-sm text-gray-500 ml-2">({item.unit})</span>
                  </div>
                  <span className="font-bold text-red-600">{item.quantity} {t('inventory.left', 'left')}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Inventory */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-4 border border-gray-200"
        >
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
              {filteredInventory.map((item, index) => {
                const stockStatus = getStockStatus(item);
                const stockPercentage = item.threshold ? (item.quantity / (item.threshold * 2)) * 100 : 100;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
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
                      </div>
                      
                      <button
                        onClick={() => handleSellItem(item)}
                        className="ml-2 p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled={item.quantity === 0 || !business?.id}
                        title={!business?.id ? 'Please set up your business profile first' : item.quantity === 0 ? 'Out of stock' : 'Sell item'}
                      >
                        <DollarSign size={16} />
                      </button>
                    </div>

                    {/* Stock Level Bar */}
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
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <BottomNav industry={industry} country={country} />

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🧵 TAILOR ADD NEW ITEM TEST</h3>
            
            {/* Test element to verify changes are applied */}
            <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-sm">
              🧵 TEST: If you see this, changes are being applied!
            </div>
            
            <AddItemFormTailor onSubmit={handleAddItem} onCancel={() => setShowAddModal(false)} t={t} industry={industry} />
          </div>
        </div>
      )}

      {/* Sell Item Modal */}
      {showSellModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SellItemForm({ item, onSubmit, onCancel, t }: { 
  item: any; 
  onSubmit: (data: any) => void; 
  onCancel: () => void;
  t: (key: string, fallback?: string) => string;
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
          {formatCurrency(item.selling_price || 0, 'ke')} per {item.unit}
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
          {formatCurrency(totalPrice, 'ke')}
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

function AddItemFormTailor({ onSubmit, onCancel, t, industry }: { 
  onSubmit: (data: any) => void; 
  onCancel: () => void; 
  t: (key: string, fallback?: string) => string;
  industry: string;
}) {
  console.log('🧵 AddItemFormTailor rendered with industry:', industry);
  
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

  // Tailor-specific categories
  const tailorCategories = [
    'Fabrics',
    'Threads',
    'Zippers & Fasteners',
    'Buttons & Accessories',
    'Interfacing & Linings',
    'Elastic & Trims',
    'Measuring Tools',
    'Cutting Tools',
    'Sewing Tools',
    'Patterns & Templates',
    'Dyes & Chemicals',
    'Packaging Materials',
    'Other'
  ];

  // Default categories for other industries
  const defaultCategories = [
    'Raw Materials',
    'Finished Goods',
    'Supplies',
    'Equipment',
    'Packaging',
    'Other'
  ];

  // Always use tailor categories if industry contains 'tailor', otherwise use default
  const isTailorIndustry = industry?.toLowerCase().includes('tailor');
  console.log('🧵 Industry detected:', industry);
  console.log('🧵 Is tailor industry:', isTailorIndustry);
  
  // Force tailor categories for now
  const finalCategories = tailorCategories;
  console.log('🧵 Using categories:', finalCategories);

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
