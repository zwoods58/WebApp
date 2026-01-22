
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    TrendingUp,
    Globe,
    ArrowUpRight,
    MoreHorizontal,
    Search,
    Filter,
    Download
} from 'lucide-react';
import { useAdminData } from '../lib/useAdminData';

export default function AdminDashboard() {
    const { loading, stats, users, totalUsers, totalRevenue, isMockData } = useAdminData();

    const formatMoney = (amount: number, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {isMockData && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <span>⚠️ Showing mock data (Unable to fetch real data due to permissions)</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Platform performance across all regions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Download size={16} />
                        Export Report
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {/* Total Users */}
                <motion.div variants={item} className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={100} className="text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <Users size={20} />
                        </div>
                        <span className="flex items-center text-green-500 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                            +12% <ArrowUpRight size={12} className="ml-1" />
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{totalUsers.toLocaleString()}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Users</p>
                </motion.div>

                {/* Total Revenue */}
                <motion.div variants={item} className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={100} className="text-green-600" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                            <TrendingUp size={20} />
                        </div>
                        <span className="flex items-center text-green-500 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                            +8.4% <ArrowUpRight size={12} className="ml-1" />
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{formatMoney(totalRevenue)}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Estimated Monthly Revenue (USD)</p>
                </motion.div>

                {/* Active Regions */}
                <motion.div variants={item} className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Globe size={100} className="text-indigo-600" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Globe size={20} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.length}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Countries</p>
                    <div className="flex gap-2 mt-4">
                        {stats.map(s => (
                            <span key={s.code} className="text-[10px] font-bold px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                {s.code}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Country Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-1 bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Regional Performance</h2>
                    <div className="space-y-6">
                        {stats.map((stat) => (
                            <div key={stat.code}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-xs font-bold">
                                            {stat.code}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{stat.name}</p>
                                            <p className="text-xs text-gray-500">{stat.userCount.toLocaleString()} users</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">{formatMoney(stat.revenue, stat.currency)}</p>
                                        <p className="text-xs text-green-500">+4.2%</p>
                                    </div>
                                </div>
                                {/* Progress Bar */}
                                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(stat.userCount / totalUsers) * 100}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: stat.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Users Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Users</h2>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-4 pl-4">User</th>
                                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-4">Country</th>
                                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-4">Status</th>
                                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-4">Date</th>
                                    <th className="pb-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {users.slice(0, 10).map((user) => (
                                    <tr key={user.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-4 pl-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                                    {user.email ? user.email[0].toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email || 'No Email'}</p>
                                                    <p className="text-xs text-gray-500">{user.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.country === 'Nigeria'
                                                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50'
                                                    : user.country === 'Kenya'
                                                        ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50'
                                                        : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/50'
                                                }`}>
                                                {user.country}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${user.status === 'active'
                                                    ? 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
                                                    : user.status === 'trial'
                                                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                                                        : 'text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
                                                }`}>
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm text-gray-500">
                                            {new Date(user.joinedAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 text-right pr-4">
                                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
