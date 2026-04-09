"use client";

import React, { useState } from 'react';
import { Package, AlertTriangle, TrendingDown, RefreshCw, Edit2, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { useLanguage } from '@/hooks/LanguageContext';
import { useInventoryTanStack } from '@/hooks';

interface InventoryListProps {
  industry: string;
  country: string;
  items: Array<{
    id: string | number;
    item_name: string;
    quantity: number;
    threshold: number;
    unit: string;
    cost_price?: number;
    selling_price?: number;
  }>;
  businessId?: string;
}

// Consistent formatting functions
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const industryLabels = {
  retail: { titleKey: 'nav.inventory', unitKey: 'inventory.items' },
  food: { titleKey: 'nav.ingredients', unitKey: 'inventory.kg' },
  transport: { titleKey: 'transport.fuel', unitKey: 'inventory.liters' },
  salon: { titleKey: 'nav.products', unitKey: 'inventory.units' },
  tailor: { titleKey: 'tailor.materials', unitKey: 'inventory.meters' },
  repairs: { titleKey: 'repairs.parts', unitKey: 'inventory.pieces' },
  freelance: { titleKey: 'freelance.digital_assets', unitKey: 'inventory.files' }
};

export default function InventoryList({ industry, country, items, businessId }: InventoryListProps) {
  const { t } = useLanguage();
  const labels = industryLabels[industry as keyof typeof industryLabels] || industryLabels.retail;
  const { deleteInventory, updateInventory } = useInventoryTanStack({ businessId, industry });
  const [confirmDelete, setConfirmDelete] = useState<string | number | null>(null);
  
  const lowStockItems = items.filter(item => item.quantity <= item.threshold);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleDeleteInventory = async (itemId: string | number) => {
    try {
      await deleteInventory(itemId.toString());
      setConfirmDelete(null);
    } catch (error) {
      console.error('Failed to delete inventory item:', error);
    }
  };

  const handleEditInventory = (itemId: string | number) => {
    // TODO: Implement edit modal - for now just log
    console.log('Edit inventory item:', itemId);
  };

  if (items.length === 0) {
    return (
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 glass-regular rounded-xl flex items-center justify-center">
            <Package className="text-[var(--text-2)]" size={20} />
          </div>
          <h3 className="font-semibold text-[var(--text-1)]">{t(labels.titleKey)}</h3>
        </div>
        <div className="text-center py-6 text-[var(--text-3)]">
          <Package size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">{t('common.no_items_in_inventory', 'No items in inventory')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 border border-[var(--border)]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[var(--powder)]/15 rounded-2xl flex items-center justify-center">
            <Package className="text-[var(--powder-dark)]" size={22} strokeWidth={2.5} />
          </div>
          <h3 className="font-semibold text-[var(--text-1)] text-base tracking-tight">{t(labels.titleKey)}</h3>
        </div>
        <div className="flex items-center gap-2">
          {lowStockItems.length > 0 && (
            <div className="flex items-center gap-1 text-[var(--color-warning)] bg-[var(--color-warning-light)] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
              <AlertTriangle size={12} strokeWidth={2.5} />
              {lowStockItems.length} {t('inventory.low_stock', 'Low')}
            </div>
          )}
          <div className="text-right">
            <div className="text-[10px] font-semibold text-[var(--text-3)] uppercase tracking-wider">{t('inventory.total_items', 'Total Items')}</div>
            <div className="font-bold text-[var(--text-1)] text-base mt-0.5">{formatNumber(totalItems)} <span className="text-xs font-medium text-[var(--text-3)]">{t(labels.unitKey)}</span></div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg2)] rounded-2xl overflow-hidden">
        {items.map((item, index) => {
          const isLowStock = item.quantity <= item.threshold;
          const stockPercentage = (item.quantity / (item.threshold * 2)) * 100;
          const isLast = index === items.length - 1;
          
          return (
            <div 
              key={item.id} 
              className={`p-4 ${!isLast ? 'border-b border-[var(--border-soft)]' : ''} ${
                isLowStock ? 'bg-[var(--color-warning-light)]' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {isLowStock && <AlertTriangle size={18} className="text-[var(--color-warning)]" strokeWidth={2.5} />}
                  <div>
                    <div className="font-semibold text-[var(--text-1)] leading-tight">{item.item_name}</div>
                    {item.cost_price && item.selling_price && (
                      <div className="text-[11px] font-medium text-[var(--text-3)] mt-1">
                        {formatCurrency(item.cost_price, country)} → {formatCurrency(item.selling_price, country)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-right flex flex-col items-end">
                    <div className={`font-bold text-base ${
                      isLowStock ? 'text-[var(--color-warning)]' : 'text-[var(--text-1)]'
                    }`}>
                      {formatNumber(item.quantity)} <span className="text-xs font-medium text-[var(--text-3)]">{item.unit}</span>
                    </div>
                    <div className="text-[10px] font-semibold text-[var(--text-3)] mt-1">
                      {t('inventory.min', 'Min:')} {formatNumber(item.threshold)}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditInventory(item.id)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title={t('inventory.edit_item', 'Edit item')}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(item.id)}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title={t('inventory.delete_item', 'Delete item')}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stock Level Bar */}
              <div className="w-full h-2 bg-[var(--bg)] rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    isLowStock 
                      ? 'bg-gradient-to-r from-[var(--color-warning)] to-[var(--color-danger)]' 
                      : stockPercentage > 50 
                        ? 'bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder)]' 
                        : 'bg-gradient-to-r from-[var(--powder-darker)] to-[var(--powder-mid)]'
                  }`}
                  style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                />
              </div>

              {isLowStock && (
                <div className="mt-2.5 text-xs text-[var(--color-warning)] font-bold flex items-center gap-1.5">
                  <TrendingDown size={14} strokeWidth={2.5} />
                  {t('inventory.running_low', 'Stock running low')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {items.length > 0 && (
        <div className="mt-5 pt-5 border-t border-[var(--border-soft)] flex justify-between items-center">
          <div className="flex gap-2">
            <button className="text-sm text-[var(--powder-dark)] hover:text-[var(--powder-mid)] font-bold transition-colors no-select button-touch">
              {t('inventory.manage', 'Manage Inventory')}
            </button>
          </div>
          <button className="text-sm text-[var(--powder-dark)] hover:text-[var(--powder-mid)] font-bold transition-colors no-select button-touch flex items-center gap-1.5">
            {t('inventory.quick_add', 'Quick Add +')}
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('common.delete_inventory', 'Delete Item')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('common.delete_confirm', 'Are you sure you want to delete this item? This action cannot be undone.')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                onClick={() => handleDeleteInventory(confirmDelete)}
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
