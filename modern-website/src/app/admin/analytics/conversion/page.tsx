"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Percent, TrendingUp, UserX, Clock } from 'lucide-react';
import Link from 'next/link';
import { MetricCard } from '../../components/MetricCard';
import { RefreshButton } from '../../components/RefreshButton';

export default function ConversionAnalyticsPage() {
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
              Conversion Analytics
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Track conversion funnels, trial-to-paid rates, and retention
            </p>
          </div>
        </div>
        <RefreshButton onRefresh={refresh} loading={loading} lastUpdated={lastUpdated} />
      </div>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Trial to Paid"
          value="60%"
          subtitle="Conversion Rate"
          icon={Percent}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50 dark:bg-purple-900/20"
          trend={{ value: 5.2, isPositive: true }}
          delay={0}
        />
        <MetricCard
          title="Weekly Churn"
          value="2.5%"
          subtitle="Last 7 days"
          icon={UserX}
          iconColor="text-red-600"
          iconBgColor="bg-red-50 dark:bg-red-900/20"
          trend={{ value: 0.3, isPositive: false }}
          delay={0.1}
        />
        <MetricCard
          title="Monthly Churn"
          value="8.0%"
          subtitle="Last 30 days"
          icon={UserX}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50 dark:bg-orange-900/20"
          delay={0.2}
        />
        <MetricCard
          title="Avg Time to Convert"
          value="4.2 days"
          subtitle="Trial to Paid"
          icon={Clock}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50 dark:bg-blue-900/20"
          delay={0.3}
        />
      </div>

      {/* Conversion Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Conversion Funnel
        </h2>
        <div className="space-y-4">
          {[
            { stage: 'Signups', count: 1000, percentage: 100, color: 'bg-blue-500' },
            { stage: 'Trial Started', count: 850, percentage: 85, color: 'bg-indigo-500' },
            { stage: 'Active Trial Users', count: 720, percentage: 72, color: 'bg-purple-500' },
            { stage: 'Paid Subscribers', count: 510, percentage: 51, color: 'bg-green-500' },
          ].map((item, index) => (
            <div key={item.stage}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{item.stage}</p>
                  <p className="text-sm text-gray-500">{item.count.toLocaleString()} users</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {item.percentage}%
                  </p>
                  {index > 0 && (
                    <p className="text-xs text-gray-500">
                      {((item.count / 1000) * 100).toFixed(1)}% of signups
                    </p>
                  )}
                </div>
              </div>
              <div className="h-12 w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: index * 0.2 }}
                  className={`h-full ${item.color} flex items-center justify-center text-white font-semibold text-sm`}
                >
                  {item.percentage}%
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Conversion by Country */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Conversion Rate by Country
          </h2>
          <div className="space-y-3">
            {[
              { country: 'South Africa', code: 'ZA', rate: 68.5 },
              { country: 'Kenya', code: 'KE', rate: 62.3 },
              { country: 'Nigeria', code: 'NG', rate: 58.7 },
              { country: 'Ghana', code: 'GH', rate: 55.2 },
              { country: 'Uganda', code: 'UG', rate: 52.8 },
            ].map((item) => (
              <div key={item.code} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 text-xs font-bold">
                    {item.code}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.country}
                  </span>
                </div>
                <span className="text-sm font-bold text-purple-600">
                  {item.rate}%
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
            Churn Rate by Country
          </h2>
          <div className="space-y-3">
            {[
              { country: 'Uganda', code: 'UG', rate: 12.5 },
              { country: 'Ghana', code: 'GH', rate: 10.2 },
              { country: 'Nigeria', code: 'NG', rate: 8.7 },
              { country: 'Kenya', code: 'KE', rate: 7.3 },
              { country: 'South Africa', code: 'ZA', rate: 5.8 },
            ].map((item) => (
              <div key={item.code} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 text-xs font-bold">
                    {item.code}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.country}
                  </span>
                </div>
                <span className="text-sm font-bold text-red-600">
                  {item.rate}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Retention Cohorts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Retention by Cohort
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-4 px-4">
                  Cohort
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-4 px-4">
                  Week 1
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-4 px-4">
                  Week 2
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-4 px-4">
                  Week 4
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-4 px-4">
                  Week 8
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { month: 'March 2026', w1: 95, w2: 88, w4: 82, w8: 75 },
                { month: 'February 2026', w1: 94, w2: 86, w4: 80, w8: 73 },
                { month: 'January 2026', w1: 93, w2: 85, w4: 78, w8: 70 },
              ].map((cohort) => (
                <tr key={cohort.month} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                    {cohort.month}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                      {cohort.w1}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold">
                      {cohort.w2}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full text-sm font-semibold">
                      {cohort.w4}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-full text-sm font-semibold">
                      {cohort.w8}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
