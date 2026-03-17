
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X,
    Globe,
    MessageSquare,
    Database,
    Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminAuth } from './lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { name: 'Overview', icon: LayoutDashboard, path: '/admin' },
        { name: 'Beehive', icon: MessageSquare, path: '/admin/beehive' },
        { name: 'Revenue', icon: CreditCard, path: '/admin/revenue' },
        { name: 'Users', icon: Users, path: '/admin/users' },
        { name: 'Marketing', icon: Store, path: '/admin/marketing' },
        { name: 'Data', icon: Database, path: '/admin/data' },
    ];

    const handleSignOut = () => {
        // Clear the admin session cookie
        document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/admin-login');
    };

    return (
        <div className="min-h-screen bg-studio-white font-sans text-obsidian flex overflow-hidden">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 260, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="fixed md:relative z-30 h-screen bg-white/80 backdrop-blur-md border-r border-glass-border flex flex-col shadow-xl md:shadow-none"
                    >
                        <div className="p-6 flex items-center gap-3">
                        <span className="text-xl font-bold tracking-tight text-obsidian">Busy Admin</span>
                    </div>

                        <nav className="flex-1 px-4 py-4 space-y-1">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                                ? 'bg-blue-50 text-blue-600 font-medium'
                                                : 'text-gray-500 hover:bg-[#F4F4F5] hover:text-obsidian'
                                            }`}
                                    >
                                        <item.icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-obsidian'} />
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

                        <div className="p-4 border-t border-glass-border">
                            <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-2xl p-4 border border-glass-border">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-600">
                                        <Globe size={16} />
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Multi-Region</span>
                                </div>
                                <div className="flex gap-2 text-xs font-medium text-gray-500">
                                    <span className="px-1.5 py-0.5 rounded bg-white border border-glass-border">NG</span>
                                    <span className="px-1.5 py-0.5 rounded bg-white border border-glass-border">KE</span>
                                    <span className="px-1.5 py-0.5 rounded bg-white border border-glass-border">ZA</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <button 
                                onClick={handleSignOut}
                                className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
                            >
                                <LogOut size={18} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen relative">
                <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-glass-border px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-obsidian">Admin Panel</span>
                        </div>
                    </div>
                </header>

                <div className="pt-20 p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
