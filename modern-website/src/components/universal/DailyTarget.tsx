"use client";

import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { useLanguageSafe } from '@/hooks/useLanguageSafe';

interface DailyTargetProps {
  industry: string;
  country: string;
  today_total: number;
  daily_target: number;
}

export default function DailyTarget({ industry, country, today_total, daily_target }: DailyTargetProps) {
  const { t } = useLanguageSafe();
  const percentage = (today_total / daily_target) * 100;
  const remaining = daily_target - today_total;
  const isTargetMet = percentage >= 100;

  return (
    <div className="glass-card p-6 border border-[var(--border)]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[var(--powder)]/15 rounded-2xl flex items-center justify-center">
            <Target className="text-[var(--powder-dark)]" size={22} strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-base text-[var(--text-1)] tracking-tight">{t(`${industry}.daily_target`)}</span>
        </div>
        <span className="font-bold text-[var(--text-1)] text-lg">{formatCurrency(daily_target, country)}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-3 bg-[var(--bg2)] rounded-full overflow-hidden mb-5 shadow-inner">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isTargetMet 
              ? 'bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder)]' 
              : 'bg-gradient-to-r from-[var(--powder-darker)] to-[var(--powder-dark)]'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      {/* Stats */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] font-semibold text-[var(--text-3)] uppercase tracking-wider">{t('country.current')}</span>
          <div className="font-bold text-[var(--text-1)] text-xl leading-tight mt-1">{formatCurrency(today_total, country)}</div>
        </div>
        
        <div className="text-right">
          <span className={`text-sm font-bold ${
            remaining > 0 
              ? 'text-[var(--powder-dark)]' 
              : 'text-[var(--color-success)]'
          }`}>
            {remaining > 0 ? `${formatCurrency(remaining, country)} ${t('common.to_go', 'to go')}` : t('staff_performance.target_met', 'Target met!')}
          </span>
          <div className="text-[11px] font-semibold text-[var(--text-3)] mt-1">{Math.round(percentage)}%</div>
        </div>
      </div>

      {/* Motivational Message */}
      {isTargetMet && (
        <div className="mt-5 p-4 bg-[var(--color-success)]/10 rounded-2xl text-center border border-[var(--color-success)]/30">
          <div className="text-[var(--color-success)] font-bold text-sm flex items-center justify-center gap-2">
            <TrendingUp size={18} strokeWidth={2.5} />
            {t('common.success', 'Great job!')} {t('target.daily_achieved', "You've hit your daily target!")}
          </div>
        </div>
      )}
    </div>
  );
}
