
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  DollarSign, 
  Users, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  CreditCard, 
  Activity,
  BarChart3,
  PieChart,
  UserPlus,
  Target,
  Zap,
  Shield,
  Clock,
  Star,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Store
} from 'lucide-react';
import Link from 'next/link';
import { useMetrics } from './hooks/useMetrics';
import { supabase } from './lib/supabase';

// Get real overview stats for admin dashboard (user-focused)
async function getOverviewStats() {
  try {
    // Get beehive stats
    const { data: beehiveStats } = await supabase.rpc('admin_get_beehive_stats');
    const activeRequests = beehiveStats?.[0]?.total_requests || 0;
    
    // Get user stats instead of subscription revenue
    const { count: totalActiveUsers } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    
    // Get new users this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const { count: newUsersThisWeek } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .gte('created_at', oneWeekAgo.toISOString());
    
    // Calculate user growth rate (simplified)
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const { count: usersLastMonth } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .lte('created_at', oneMonthAgo.toISOString());
    
    const growthRate = (totalActiveUsers && totalActiveUsers > 0 && usersLastMonth && usersLastMonth > 0) 
      ? ((totalActiveUsers - usersLastMonth) / usersLastMonth) * 100 
      : 0;
    
    return {
      beehive: activeRequests,
      totalUsers: totalActiveUsers || 0,
      growthRate: growthRate,
      newUsers: newUsersThisWeek || 0
    };
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    return {
      beehive: 0,
      totalUsers: 0,
      growthRate: 0,
      newUsers: 0
    };
  }
}

const OVERVIEW_CARDS = [
  {
    title: 'Beehive',
    description: 'Community requests and engagement',
    icon: MessageSquare,
    path: '/admin/beehive',
    color: 'violet',
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    bgGradient: 'from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20',
    stats: { icon: Star, value: '0', label: 'Active Requests' }
  },
  {
    title: 'Users',
    description: 'Total active businesses on platform',
    icon: Users,
    path: '/admin/users',
    color: 'blue',
    gradient: 'from-blue-600 via-cyan-600 to-sky-600',
    bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    stats: { icon: TrendingUp, value: '0', label: 'Total Users' }
  },
  {
    title: 'Growth',
    description: 'User acquisition and growth metrics',
    icon: UserPlus,
    path: '/admin/growth',
    color: 'emerald',
    gradient: 'from-emerald-600 via-green-600 to-teal-600',
    bgGradient: 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
    stats: { icon: TrendingUp, value: '0%', label: 'Growth Rate' }
  },
  {
    title: 'Marketing',
    description: 'Industry access and marketing management',
    icon: Store,
    path: '/admin/marketing',
    color: 'orange',
    gradient: 'from-orange-600 via-red-600 to-pink-600',
    bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
    stats: { icon: Target, value: '7', label: 'Industries' }
  },
];

const AFRICAN_COUNTRIES = [
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', color: 'from-red-500 to-orange-500' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', color: 'from-green-500 to-teal-500' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', color: 'from-green-600 to-emerald-500' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS', color: 'from-yellow-500 to-orange-500' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', currency: 'UGX', color: 'from-purple-500 to-pink-500' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'TZS', color: 'from-blue-500 to-indigo-500' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', currency: 'RWF', color: 'from-cyan-500 to-blue-500' },
];

export default function AdminPage() {
  const { 
    totalUsers, 
    activeUsers, 
    topBeehiveRequests, 
    usersByCountry, 
    loading,
    dailyRevenue,
    weeklyRevenue,
    monthlyRevenue,
    revenueByCountry,
    conversionMetrics,
    churnMetrics,
    arpu,
    mrr
  } = useMetrics();

  const [overviewStats, setOverviewStats] = useState({
    beehive: 0,
    totalUsers: 0,
    growthRate: 0,
    newUsers: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch overview stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const stats = await getOverviewStats();
        setOverviewStats(stats);
      } catch (error) {
        console.error('Error fetching overview stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Update overview cards with real data
  const overviewCards = OVERVIEW_CARDS.map((card, index) => {
    switch (card.title) {
      case 'Beehive':
        return {
          ...card,
          stats: { 
            icon: Star, 
            value: statsLoading ? '...' : overviewStats.beehive.toString(), 
            label: 'Active Requests' 
          }
        };
      case 'Users':
        return {
          ...card,
          stats: { 
            icon: TrendingUp, 
            value: statsLoading ? '...' : overviewStats.totalUsers.toString(), 
            label: 'Total Users' 
          }
        };
      case 'Growth':
        return {
          ...card,
          stats: { 
            icon: TrendingUp, 
            value: statsLoading ? '...' : `${overviewStats.growthRate.toFixed(1)}%`, 
            label: 'Growth Rate' 
          }
        };
      default:
        return card;
    }
  });

  const calculateTotalRevenue = (revenueData: any[]) => {
    return revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0);
  };

  const getLatestRevenue = (revenueData: any[]) => {
    if (revenueData.length === 0) return 0;
    return revenueData[revenueData.length - 1]?.revenue || 0;
  };

  const getRevenueGrowth = (revenueData: any[]) => {
    if (revenueData.length < 2) return 0;
    const latest = revenueData[revenueData.length - 1]?.revenue || 0;
    const previous = revenueData[revenueData.length - 2]?.revenue || 0;
    return previous > 0 ? ((latest - previous) / previous) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl opacity-10 blur-3xl"></div>
          <div className="relative">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent mb-4">
              Admin Dashboard
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
              Real-time insights for your African business platform
            </p>
          </div>
        </motion.div>

      {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Revenue Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>
            <div className="relative bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg hover:shadow-2xl transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg">
                  <DollarSign className="text-white" size={20} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  getRevenueGrowth(monthlyRevenue) >= 0 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {getRevenueGrowth(monthlyRevenue) >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(getRevenueGrowth(monthlyRevenue)).toFixed(1)}%
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  ${loading ? '...' : calculateTotalRevenue(monthlyRevenue).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">This month</p>
              </div>
              
              <div className="mt-4 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-600"
                  initial={{ width: 0 }}
                  animate={{ width: loading ? '0%' : `${Math.min((calculateTotalRevenue(monthlyRevenue) / 10000) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Active Users Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>
            <div className="relative bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg hover:shadow-2xl transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg">
                  <Users className="text-white" size={20} />
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Live</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Users</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {loading ? '...' : activeUsers.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Last 30 days</p>
              </div>
              
              <div className="mt-4 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-600"
                  initial={{ width: 0 }}
                  animate={{ width: loading ? '0%' : `${Math.min((activeUsers / 200) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </div>
            </div>
          </motion.div>

          {/* MRR Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>
            <div className="relative bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg hover:shadow-2xl transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                  <CreditCard className="text-white" size={20} />
                </div>
                <div className="px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">MRR</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly Recurring</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  ${loading ? '...' : mrr.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Per month</p>
              </div>
              
              <div className="mt-4 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-600"
                  initial={{ width: 0 }}
                  animate={{ width: loading ? '0%' : `${Math.min((mrr / 1000) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Conversion Rate Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>
            <div className="relative bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg hover:shadow-2xl transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-lg">
                  <Target className="text-white" size={20} />
                </div>
                <div className="px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">Weekly</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Conversion Rate</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {loading ? '...' : `${conversionMetrics?.weekly_conversion_rate?.toFixed(1) || 0}%`}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">New subscribers</p>
              </div>
              
              <div className="mt-4 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: loading ? '0%' : `${Math.min((conversionMetrics?.weekly_conversion_rate || 0) * 2, 100)}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

      {/* Revenue Overview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Revenue Overview</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Track your financial performance across different time periods</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg">
                <BarChart3 className="text-white" size={20} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { period: 'Daily', revenue: getLatestRevenue(dailyRevenue), subtext: 'Last 24h', color: 'from-blue-500 to-cyan-500' },
                { period: 'Weekly', revenue: getLatestRevenue(weeklyRevenue), subtext: 'Last 7 days', color: 'from-purple-500 to-pink-500' },
                { period: 'Monthly', revenue: getLatestRevenue(monthlyRevenue), subtext: 'This month', color: 'from-emerald-500 to-green-500' },
                { period: 'ARPU', revenue: arpu, subtext: 'Per user', color: 'from-orange-500 to-red-500' },
              ].map((item, index) => (
                <motion.div
                  key={item.period}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">{item.period}</p>
                    <p className={`text-3xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-2`}>
                      {item.period === 'ARPU' ? `$${item.revenue.toFixed(2)}` : `$${item.revenue.toLocaleString()}`}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.subtext}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      {/* African Markets Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">African Markets</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Performance across your target countries</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Globe className="text-white" size={20} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {AFRICAN_COUNTRIES.map((country, index) => {
                const countryUsers = usersByCountry.find(c => c.country_code === country.code);
                const countryRev = revenueByCountry.find(r => r.country_code === country.code);
                
                return (
                  <motion.div
                    key={country.code}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="group relative"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${country.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl`}></div>
                    <div className="relative p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:shadow-lg transition-all cursor-pointer">
                      <div className="text-3xl mb-3 text-center">{country.flag}</div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white text-center mb-3">
                        {country.name}
                      </p>
                      <div className="space-y-2">
                        <div className="text-center">
                          <p className="text-lg font-bold text-slate-900 dark:text-white">
                            {countryUsers?.user_count || 0}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">users</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            ${countryRev?.revenue?.toFixed(0) || 0}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">revenue</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

      {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {overviewCards.map((card, index) => {
            const Icon = card.icon;
            const StatsIcon = card.stats.icon;
            
            return (
              <motion.div
                key={card.path}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                <Link href={card.path}>
                  <div className="group relative overflow-hidden">
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-110`}></div>
                    
                    {/* Card Content */}
                    <div className={`relative bg-gradient-to-br ${card.bgGradient} rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform group-hover:scale-105`}>
                      
                      {/* Header */}
                      <div className="flex items-start justify-between mb-8">
                        <div className={`p-4 bg-gradient-to-br ${card.gradient} rounded-2xl shadow-lg`}>
                          <Icon className="text-white" size={28} />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                          <StatsIcon className="text-white" size={14} />
                          <span className="text-xs font-semibold text-white">{card.stats.value}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/80 transition-all">
                          {card.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-all">
                          {card.description}
                        </p>
                        
                        {/* Stats Badge */}
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <span>{card.stats.label}</span>
                          <ArrowRight className="group-hover:translate-x-2 transition-transform" size={16} />
                        </div>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                      <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-lg"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Recent Beehive Activity</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Latest community requests and engagement</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg">
              <Clock className="text-white" size={20} />
            </div>
          </div>
          
          <div className="space-y-4">
            {topBeehiveRequests.slice(0, 3).map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                      <MessageSquare className="text-white" size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {request.title}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {request.country} • {request.industry}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30">
                      <Star className="text-violet-600 dark:text-violet-400" size={14} />
                      <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                        {request.upvote_count} votes
                      </span>
                    </div>
                    <ArrowRight className="text-slate-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
            
            {topBeehiveRequests.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="text-center py-12"
              >
                <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4">
                  <MessageSquare className="text-slate-400" size={32} />
                </div>
                <p className="text-slate-500 dark:text-slate-400">No recent Beehive activity</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Community requests will appear here</p>
              </motion.div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
