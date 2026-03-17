"use client";

import React from 'react';
import { Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/currency';
import { useLanguage } from '@/hooks/LanguageContext';

interface CreditListProps {
  industry: string;
  country: string;
  credit: Array<{
    id: string | number;
    customer_name: string;
    amount: number;
    status: string;
    due_date?: string;
    paid_amount?: number;
  }>;
}

const industryLabels = {
  retail: { titleKey: 'retail.customers_who_owe', unitKey: 'common.customer' },
  food: { titleKey: 'food.credit_customers', unitKey: 'common.customer' },
  transport: { titleKey: 'transport.fares_owed', unitKey: 'transport.passenger' },
  salon: { titleKey: 'salon.clients_who_owe', unitKey: 'common.client' },
  tailor: { titleKey: 'tailor.balance_due', unitKey: 'common.client' },
  repairs: { titleKey: 'repairs.customers_who_owe', unitKey: 'common.customer' },
  freelance: { titleKey: 'freelance.unpaid_invoices', unitKey: 'common.client' }
};

export default function CreditList({ industry, country, credit }: CreditListProps) {
  const { t } = useLanguage();
  const labels = industryLabels[industry as keyof typeof industryLabels] || industryLabels.retail;
  
  const outstandingCredit = credit.filter(c => c.status === 'outstanding');
  const partialCredit = credit.filter(c => c.status === 'partial');
  const totalOwed = outstandingCredit.reduce((sum, c) => sum + c.amount, 0) +
                   partialCredit.reduce((sum, c) => sum + (c.amount - (c.paid_amount || 0)), 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'outstanding':
        return <AlertCircle size={16} className="text-[var(--powder-dark)]" />;
      case 'partial':
        return <Clock size={16} className="text-[var(--powder)]" />;
      case 'paid':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'outstanding':
        return 'text-[var(--powder-dark)] bg-[var(--powder)]/10 border-[var(--powder)]/20';
      case 'partial':
        return 'text-[var(--powder-dark)] bg-[var(--powder)]/5 border-[var(--powder)]/10';
      case 'paid':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (credit.length === 0) {
    return (
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 glass-regular rounded-xl flex items-center justify-center">
            <Users className="text-[var(--text-2)]" size={20} />
          </div>
          <h3 className="font-semibold text-[var(--text-1)]">{t(labels.titleKey)}</h3>
        </div>
        <div className="text-center py-6 text-[var(--text-3)]">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">{t('credit.no_outstanding', 'No outstanding credit')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 border border-[var(--border)]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[var(--powder)]/15 rounded-2xl flex items-center justify-center">
            <Users className="text-[var(--powder-dark)]" size={22} strokeWidth={2.5} />
          </div>
          <h3 className="font-semibold text-[var(--text-1)] text-base tracking-tight">{t(labels.titleKey)}</h3>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold text-[var(--text-3)] uppercase tracking-wider">{t('credit.total_owed', 'Total Owed')}</div>
          <div className="font-bold text-[var(--powder-dark)] text-base mt-0.5">{formatCurrency(totalOwed, country)}</div>
        </div>
      </div>

      <div className="bg-[var(--bg2)] rounded-2xl overflow-hidden">
        {credit.map((item, index) => {
          const remainingAmount = item.status === 'partial' 
            ? item.amount - (item.paid_amount || 0) 
            : item.amount;
          const isLast = index === credit.length - 1;

          return (
            <div 
              key={item.id} 
              className={`p-4 ${!isLast ? 'border-b border-[var(--border-soft)]' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <div className="font-semibold text-[var(--text-1)] leading-tight">{item.customer_name}</div>
                    {item.due_date && (
                      <div className="text-[11px] font-medium text-[var(--text-3)] mt-1">
                        {t('credit.due', 'Due:')} {formatDate(item.due_date)}
                      </div>
                    )}
                    {item.status === 'partial' && (
                      <div className="text-[11px] font-semibold text-[var(--powder-dark)] mt-1">
                        {t('credit.paid', 'Paid:')} {formatCurrency(item.paid_amount || 0, country)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end gap-1.5">
                  <div className="font-bold text-[var(--text-1)] text-base">
                    {formatCurrency(remainingAmount, country)}
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${getStatusColor(item.status)}`}>
                    {item.status}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {credit.length > 0 && (
        <div className="mt-5 pt-5 border-t border-[var(--border-soft)] text-center">
          <button className="text-sm text-[var(--powder-dark)] hover:text-[var(--powder-mid)] font-bold transition-colors no-select button-touch">
            {t('credit.view_all_history', 'View All Credit History')}
          </button>
        </div>
      )}
    </div>
  );
}
