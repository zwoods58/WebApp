"use client";

import React from 'react';
import { Users, Plus, DollarSign, Calendar } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';
import { formatCurrency, formatDate } from '@/utils/currency';

interface CustomerListProps {
  industry: string;
  country: string;
  customers?: any[];
  onViewAll?: () => void;
  onAddCustomer?: () => void;
}

export default function CustomerList({ 
  industry, 
  country, 
  customers = [], 
  onViewAll,
  onAddCustomer 
}: CustomerListProps) {
  const { t } = useLanguage();
  
  // Filter active customers (those with outstanding credit or recent activity)
  const activeCustomers = customers.filter(customer => {
    return customer.amount > 0 || customer.status === 'active';
  });

  const getOutstandingAmount = (customer: any) => {
    const total = customer.amount || 0;
    const paid = customer.paid_amount || 0;
    return total - paid;
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t('nav.customers')}</h3>
          <p className="text-sm text-gray-500">{activeCustomers.length} active</p>
        </div>
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Users className="text-blue-600" size={20} />
        </div>
      </div>

      {/* Customer Items */}
      {activeCustomers.length > 0 ? (
        <div className="space-y-3 mb-4">
          {activeCustomers.slice(0, 3).map((customer, index) => {
            const outstanding = getOutstandingAmount(customer);
            return (
              <div key={customer.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {customer.customer_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {customer.phone || 'No phone'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {outstanding > 0 ? (
                    <>
                      <p className="font-semibold text-red-600 text-sm">
                        {formatCurrency(outstanding, country)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Due: {formatDate(customer.due_date)}
                      </p>
                    </>
                  ) : (
                    <p className="font-semibold text-green-600 text-sm">
                      Paid
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Users className="text-gray-400" size={24} />
          </div>
          <p className="text-gray-500 text-sm">{t('credit.no_customers')}</p>
          <p className="text-gray-400 text-xs">{t('credit.add_first')}</p>
        </div>
      )}

      {/* Action Links */}
      <div className="flex gap-3 pt-3 border-t border-gray-100">
        <button
          onClick={onViewAll}
          className="flex-1 py-2 px-3 text-blue-600 font-medium text-sm hover:bg-blue-50 rounded-lg transition-colors"
        >
          {t('common.view_all')}
        </button>
        <button
          onClick={onAddCustomer}
          className="flex-1 py-2 px-3 bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <Plus size={16} />
          {t('common.add')}
        </button>
      </div>
    </div>
  );
}
