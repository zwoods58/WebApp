"use client";

import React from 'react';
import { Package, AlertTriangle, TrendingDown, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { useLanguage } from '@/hooks/LanguageContext';

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

export default function InventoryList({ industry, country, items }: InventoryListProps) {
  const { t } = useLanguage();
  const labels = industryLabels[industry as keyof typeof industryLabels] || industryLabels.retail;
  
  const lowStockItems = items.filter(item => item.quantity <= item.threshold);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

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
          <p className="text-sm">{t('inventory.no_items', 'No items in inventory')}</p>
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
    </div>
  );
}
