
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X,
    Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: 'Users', icon: Users, path: '/admin/users' },
        { name: 'Revenue', icon: CreditCard, path: '/admin/revenue' },
        { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-[#F4F4F5] dark:bg-black font-sans text-slate-900 dark:text-white flex overflow-hidden">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 260, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="fixed md:relative z-30 h-screen bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-xl md:shadow-none"
                    >
                        <div className="p-6 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                                B
                            </div>
                            <span className="text-xl font-bold tracking-tight">BeeZee Admin</span>
                        </div>

                        <nav className="flex-1 px-4 py-4 space-y-1">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        <item.icon size={20} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'} />
                                        <span>{item.name}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-gray-100 dark:border-gray-800/50">
                            <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-2xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                        <Globe size={16} />
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Multi-Region</span>
                                </div>
                                <div className="flex gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                                    <span className="px-1.5 py-0.5 rounded bg-white dark:bg-black/20">NG</span>
                                    <span className="px-1.5 py-0.5 rounded bg-white dark:bg-black/20">KE</span>
                                    <span className="px-1.5 py-0.5 rounded bg-white dark:bg-black/20">ZA</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <button className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors text-sm font-medium">
                                <LogOut size={18} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen relative">
                <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#000000]/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex items-center justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800" />
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
