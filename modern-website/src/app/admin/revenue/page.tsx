"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Globe, Calendar, CreditCard, ArrowUpRight, ArrowDownRight, PieChart, BarChart3, Info } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { RefreshButton } from '../components/RefreshButton';
import { getSubscriptionRevenue, TARGET_COUNTRIES } from '../lib/subscriptions';
import type { CountrySubscriptionStats } from '../lib/subscriptions';

export default function RevenuePage() {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<CountrySubscriptionStats | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getSubscriptionRevenue();
      setSubscriptionData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching subscription revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const formatMoney = (amount: number, currency: string = 'USD') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(amount);
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCountryFlag = (countryCode: string) => {
    const flags = {
      KE: '🇰🇪',
      ZA: '🇿🇦', 
      NG: '🇳🇬',
      GH: '🇬🇭',
      UG: '🇺🇬',
      TZ: '🇹🇿',
      RW: '🇷🇼',
    };
    return flags[countryCode as keyof typeof flags] || '🌍';
  };

  // Tooltip component
  const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Revenue Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Total app revenue and performance across all target countries
          </p>
        </div>
        <RefreshButton onRefresh={refresh} loading={loading} lastUpdated={lastUpdated} />
      </div>

      {/* Total App Revenue Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 to-green-600 p-8 rounded-3xl text-white shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Total App Revenue</h2>
            <p className="text-emerald-100">Combined revenue from all subscriptions across all countries</p>
          </div>
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
            <DollarSign size={32} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-emerald-100 text-sm">Total Monthly Revenue</p>
              <Tooltip text="Combined revenue from all subscriptions across all countries converted to USD">
                <Info className="text-emerald-200 cursor-help" size={14} />
              </Tooltip>
            </div>
            <p className="text-4xl font-bold">{formatMoney(subscriptionData?.total_mrr || 0)}</p>
            <p className="text-emerald-200 text-sm mt-1">Across all markets</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-emerald-100 text-sm">Active Subscriptions</p>
              <Tooltip text="Total number of paying customers across all countries">
                <Info className="text-emerald-200 cursor-help" size={14} />
              </Tooltip>
            </div>
            <p className="text-4xl font-bold">{subscriptionData?.total_subscriptions || 0}</p>
            <p className="text-emerald-200 text-sm mt-1">Total paying customers</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-emerald-100 text-sm">Average Revenue Per User</p>
              <Tooltip text="Average monthly revenue generated per paying customer">
                <Info className="text-emerald-200 cursor-help" size={14} />
              </Tooltip>
            </div>
            <p className="text-4xl font-bold">{formatMoney(subscriptionData?.total_arpu || 0)}</p>
            <p className="text-emerald-200 text-sm mt-1">Per customer monthly</p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Monthly Growth"
          value="+12.5%"
          subtitle="Month over month"
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50 dark:bg-emerald-900/20"
          trend={{ value: 12.5, isPositive: true }}
          delay={0}
          tooltip="Revenue growth compared to the previous month"
        />
        <MetricCard
          title="Countries Active"
          value={subscriptionData?.countries.length || 0}
          subtitle="Markets with revenue"
          icon={Globe}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50 dark:bg-blue-900/20"
          delay={0.1}
          tooltip="Number of countries currently generating revenue"
        />
        <MetricCard
          title="Top Market"
          value={subscriptionData?.countries.reduce((max, country) => country.mrr > max.mrr ? country : max, subscriptionData.countries[0])?.country_name || 'N/A'}
          subtitle="Highest revenue"
          icon={BarChart3}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50 dark:bg-purple-900/20"
          delay={0.2}
          tooltip="Country generating the highest monthly revenue"
        />
        <MetricCard
          title="Revenue Range"
          value={`${formatMoney(Math.min(...(subscriptionData?.countries.map(c => c.mrr) || [0])))} - ${formatMoney(Math.max(...(subscriptionData?.countries.map(c => c.mrr) || [0])))}`}
          subtitle="Per country"
          icon={PieChart}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50 dark:bg-orange-900/20"
          delay={0.3}
          tooltip="Range of monthly revenue across all countries"
        />
      </div>

      {/* Revenue by Country - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-[#121212] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Revenue Per Country
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Detailed breakdown of revenue performance by market
            </p>
          </div>
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Globe className="text-white" size={20} />
          </div>
        </div>
        
        {/* Country Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {subscriptionData?.countries.map((country, index) => {
            const percentage = subscriptionData.total_mrr > 0 
              ? (country.mrr / subscriptionData.total_mrr) * 100 
              : 0;
            const isTopPerformer = subscriptionData.countries.reduce((max, c) => c.mrr > max.mrr ? c : max, subscriptionData.countries[0]).country_code === country.country_code;
            
            return (
              <motion.div
                key={country.country_code}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className={`relative p-6 rounded-2xl border ${isTopPerformer ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212]'} hover:shadow-lg transition-all`}
              >
                {isTopPerformer && (
                  <div className="absolute -top-2 -right-2 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                    TOP
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 text-xl shadow-md">
                    {getCountryFlag(country.country_code)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {country.country_name}
                    </p>
                    <p className="text-xs text-gray-500">{country.currency}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Revenue</p>
                      <Tooltip text="Revenue generated by this country in USD per month">
                        <Info className="text-gray-400 cursor-help" size={12} />
                      </Tooltip>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatMoney(country.mrr)}
                    </p>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}% of total</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <p className="text-xs text-gray-500">Subscriptions</p>
                        <Tooltip text="Number of active paying customers in this country">
                          <Info className="text-gray-400 cursor-help" size={10} />
                        </Tooltip>
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {country.active_subscriptions}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <p className="text-xs text-gray-500">ARPU</p>
                        <Tooltip text="Average Revenue Per User in this country">
                          <Info className="text-gray-400 cursor-help" size={10} />
                        </Tooltip>
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatMoney(country.arpu)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {country.growth_rate >= 0 ? (
                      <ArrowUpRight className="text-green-500" size={16} />
                    ) : (
                      <ArrowDownRight className="text-red-500" size={16} />
                    )}
                    <span className={`text-sm font-semibold ${country.growth_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {country.growth_rate > 0 ? '+' : ''}{country.growth_rate.toFixed(1)}%
                    </span>
                    <span className="text-xs text-gray-500">growth</span>
                    <Tooltip text="Monthly growth rate compared to previous month">
                      <Info className="text-gray-400 cursor-help" size={10} />
                    </Tooltip>
                  </div>
                </div>
                
                <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                    className={`h-full ${isTopPerformer ? 'bg-emerald-500' : 'bg-blue-500'} rounded-full`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Revenue Distribution Chart */}
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Distribution</h3>
            <Tooltip text="Countries ranked by monthly revenue contribution">
              <Info className="text-gray-400 cursor-help" size={14} />
            </Tooltip>
          </div>
          <div className="space-y-3">
            {subscriptionData?.countries
              .sort((a, b) => b.mrr - a.mrr)
              .map((country, index) => {
                const percentage = subscriptionData.total_mrr > 0 
                  ? (country.mrr / subscriptionData.total_mrr) * 100 
                  : 0;
                
                return (
                  <div key={country.country_code} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-lg">{getCountryFlag(country.country_code)}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {country.country_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white min-w-0 text-right">
                        {formatMoney(country.mrr)}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
