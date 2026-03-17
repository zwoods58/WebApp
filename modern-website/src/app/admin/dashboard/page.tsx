
"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    TrendingUp,
    Globe,
    DollarSign,
    UserCheck,
    UserX,
    Percent,
    MessageSquare,
} from 'lucide-react';
import { useMetrics } from '../hooks/useMetrics';
import { MetricCard } from '../components/MetricCard';
import { RefreshButton } from '../components/RefreshButton';
import { BeehiveCard } from '../components/BeehiveCard';

export default function AdminDashboard() {
    const {
        loading,
        lastUpdated,
        totalUsers,
        activeUsers,
        inactiveUsers,
        arpu,
        mrr,
        usersByCountry,
        topBeehiveRequests,
        refresh,
    } = useMetrics();

    useEffect(() => {
        refresh();
    }, []);

    const formatMoney = (amount: number, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        BeeZee Admin Dashboard
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Real-time monitoring across all African markets
                    </p>
                </div>
                <RefreshButton onRefresh={refresh} loading={loading} lastUpdated={lastUpdated} />
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Users"
                    value={totalUsers}
                    icon={Users}
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-50 dark:bg-blue-900/20"
                    trend={{ value: 12, isPositive: true }}
                    delay={0}
                />
                <MetricCard
                    title="Active Users"
                    value={activeUsers}
                    subtitle="Last 30 days"
                    icon={UserCheck}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-50 dark:bg-green-900/20"
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
                    title="Active Countries"
                    value={usersByCountry.length}
                    icon={Globe}
                    iconColor="text-indigo-600"
                    iconBgColor="bg-indigo-50 dark:bg-indigo-900/20"
                    delay={0.3}
                />
            </div>

            {/* Business Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Monthly Recurring Revenue"
                    value={formatMoney(mrr)}
                    icon={DollarSign}
                    iconColor="text-emerald-600"
                    iconBgColor="bg-emerald-50 dark:bg-emerald-900/20"
                    trend={{ value: 8.4, isPositive: true }}
                    delay={0}
                />
                <MetricCard
                    title="ARPU"
                    value={formatMoney(arpu)}
                    subtitle="Average Revenue Per User"
                    icon={TrendingUp}
                    iconColor="text-cyan-600"
                    iconBgColor="bg-cyan-50 dark:bg-cyan-900/20"
                    delay={0.1}
                />
                <MetricCard
                    title="Trial to Paid"
                    value="60%"
                    subtitle="Conversion Rate"
                    icon={Percent}
                    iconColor="text-purple-600"
                    iconBgColor="bg-purple-50 dark:bg-purple-900/20"
                    delay={0.2}
                />
                <MetricCard
                    title="Churn Rate"
                    value="2.5%"
                    subtitle="Weekly"
                    icon={UserX}
                    iconColor="text-red-600"
                    iconBgColor="bg-red-50 dark:bg-red-900/20"
                    delay={0.3}
                />
            </div>

            {/* Beehive & Country Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top 5 Beehive Requests */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Beehive Requests</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Most upvoted across all countries</p>
                        </div>
                        <MessageSquare className="text-blue-500" size={24} />
                    </div>
                    
                    <div className="space-y-3">
                        {topBeehiveRequests.length > 0 ? (
                            topBeehiveRequests.map((request, index) => (
                                <BeehiveCard key={request.id} request={request} index={index} />
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                                No Beehive requests yet
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Country Performance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Country Performance</h2>
                    <div className="space-y-4">
                        {usersByCountry.map((country) => (
                            <div key={country.country_code} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 text-sm font-bold">
                                            {country.country_code}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{country.country_name}</p>
                                            <p className="text-xs text-gray-500">{country.user_count.toLocaleString()} users</p>
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
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-blue-500 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
