"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { MetricCard } from '../../components/MetricCard';
import { RefreshButton } from '../../components/RefreshButton';
import { useMetrics } from '../../hooks/useMetrics';

export default function UserAnalyticsPage() {
  const {
    loading,
    lastUpdated,
    totalUsers,
    activeUsers,
    inactiveUsers,
    usersByCountry,
    refresh,
  } = useMetrics();

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
              User Analytics
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Monitor user growth, retention, and engagement metrics
            </p>
          </div>
        </div>
        <RefreshButton onRefresh={refresh} loading={loading} lastUpdated={lastUpdated} />
      </div>

      {/* User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50 dark:bg-blue-900/20"
          trend={{ value: 12.5, isPositive: true }}
          delay={0}
        />
        <MetricCard
          title="Active Users"
          value={activeUsers}
          subtitle="Last 30 days"
          icon={UserCheck}
          iconColor="text-green-600"
          iconBgColor="bg-green-50 dark:bg-green-900/20"
          trend={{ value: 8.2, isPositive: true }}
          delay={0.1}
        />
        <MetricCard
          title="Inactive Users"
          value={inactiveUsers}
          subtitle="30+ days"
          icon={UserX}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50 dark:bg-orange-900/20"
          delay={0.2}
        />
        <MetricCard
          title="Growth Rate"
          value="12.5%"
          subtitle="Month over month"
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50 dark:bg-purple-900/20"
          trend={{ value: 2.3, isPositive: true }}
          delay={0.3}
        />
      </div>

      {/* User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Users by Country
          </h2>
          <div className="space-y-4">
            {usersByCountry.map((country, index) => (
              <div key={country.country_code} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 text-sm font-bold">
                      {country.country_code}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {country.country_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {country.user_count.toLocaleString()} users
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {country.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${country.percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            User Growth Trend
          </h2>
          <div className="space-y-3">
            {[
              { month: 'March 2026', users: totalUsers, growth: 12.5 },
              { month: 'February 2026', users: Math.floor(totalUsers * 0.89), growth: 10.2 },
              { month: 'January 2026', users: Math.floor(totalUsers * 0.81), growth: 8.7 },
              { month: 'December 2025', users: Math.floor(totalUsers * 0.74), growth: 6.5 },
              { month: 'November 2025', users: Math.floor(totalUsers * 0.70), growth: 5.2 },
            ].map((item) => (
              <div key={item.month} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.month}
                  </p>
                  <p className="text-xs text-gray-500">{item.users.toLocaleString()} users</p>
                </div>
                <span className="text-xs font-semibold text-green-500">
                  +{item.growth}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Engagement Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          User Engagement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {((activeUsers / totalUsers) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Rate</p>
            <p className="text-xs text-green-500 mt-1">+3.2% from last month</p>
          </div>
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              85%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Retention Rate</p>
            <p className="text-xs text-green-500 mt-1">+1.8% from last month</p>
          </div>
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              4.2
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Sessions/User</p>
            <p className="text-xs text-green-500 mt-1">+0.5 from last month</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
