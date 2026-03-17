"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import Link from 'next/link';
import { MetricCard } from '../../components/MetricCard';
import { RefreshButton } from '../../components/RefreshButton';

export default function RevenueAnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    refresh();
  }, []);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/analytics">
            <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Revenue Analytics
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Track revenue trends, MRR breakdown, and financial metrics
            </p>
          </div>
        </div>
        <RefreshButton onRefresh={refresh} loading={loading} lastUpdated={lastUpdated} />
      </div>

      {/* MRR Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total MRR"
          value={formatMoney(10000)}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50 dark:bg-emerald-900/20"
          trend={{ value: 8.4, isPositive: true }}
          delay={0}
        />
        <MetricCard
          title="New MRR"
          value={formatMoney(1200)}
          subtitle="From new customers"
          icon={TrendingUp}
          iconColor="text-green-600"
          iconBgColor="bg-green-50 dark:bg-green-900/20"
          delay={0.1}
        />
        <MetricCard
          title="Expansion MRR"
          value={formatMoney(300)}
          subtitle="From upgrades"
          icon={TrendingUp}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50 dark:bg-blue-900/20"
          delay={0.2}
        />
        <MetricCard
          title="Churned MRR"
          value={formatMoney(500)}
          subtitle="From cancellations"
          icon={TrendingDown}
          iconColor="text-red-600"
          iconBgColor="bg-red-50 dark:bg-red-900/20"
          delay={0.3}
        />
      </div>

      {/* Revenue by Country */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Revenue by Country
        </h2>
        
        <div className="space-y-4">
          {[
            { country: 'Kenya', code: 'KE', currency: 'KES', revenue: 50000, percentage: 30 },
            { country: 'Nigeria', code: 'NG', currency: 'NGN', revenue: 150000, percentage: 25 },
            { country: 'South Africa', code: 'ZA', currency: 'ZAR', revenue: 30000, percentage: 20 },
            { country: 'Ghana', code: 'GH', currency: 'GHS', revenue: 25000, percentage: 15 },
            { country: 'Uganda', code: 'UG', currency: 'UGX', revenue: 80000, percentage: 10 },
          ].map((item, index) => (
            <div key={item.code} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 text-sm font-bold">
                    {item.code}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.country}</p>
                    <p className="text-xs text-gray-500">
                      {item.currency} {item.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {item.percentage}%
                  </p>
                  <p className="text-xs text-green-500">+4.2%</p>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ARPU Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            ARPU by Country
          </h2>
          <div className="space-y-3">
            {[
              { country: 'South Africa', arpu: 8.5 },
              { country: 'Kenya', arpu: 6.2 },
              { country: 'Nigeria', arpu: 5.8 },
              { country: 'Ghana', arpu: 4.5 },
              { country: 'Uganda', arpu: 3.8 },
            ].map((item) => (
              <div key={item.country} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.country}
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {formatMoney(item.arpu)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Monthly Trends
          </h2>
          <div className="space-y-3">
            {[
              { month: 'March 2026', mrr: 10000, growth: 8.4 },
              { month: 'February 2026', mrr: 9200, growth: 6.2 },
              { month: 'January 2026', mrr: 8650, growth: 5.1 },
              { month: 'December 2025', mrr: 8230, growth: 3.8 },
              { month: 'November 2025', mrr: 7930, growth: 2.5 },
            ].map((item) => (
              <div key={item.month} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.month}
                  </p>
                  <p className="text-xs text-gray-500">{formatMoney(item.mrr)}</p>
                </div>
                <span className="text-xs font-semibold text-green-500">
                  +{item.growth}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
