"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Zap, Box } from 'lucide-react';

const triads = [
    {
        id: 'reporting',
        title: 'Real-time Reporting',
        description: 'Instant financial clarity with automated statement generation and trend analysis.',
        icon: <Box size={22} />,
        visual: () => (
            <div className="relative w-full h-48 flex items-center justify-center">
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 w-48">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">%</div>
                        <div className="text-xs font-bold text-gray-800">Weekly Report</div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 bg-gray-100 rounded-full w-full">
                            <div className="h-full bg-blue-500 rounded-full w-[75%]"></div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full w-full">
                            <div className="h-full bg-green-500 rounded-full w-[60%]"></div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full w-full">
                            <div className="h-full bg-orange-400 rounded-full w-[40%]"></div>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between text-[10px] text-gray-400">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'inventory',
        title: 'Inventory & Booking',
        description: 'Seamlessly manage stock levels and client appointments in one unified flow.',
        icon: <LineChart size={22} />,
        visual: () => (
            <div className="relative w-full h-48 flex items-end justify-center px-8 pb-8">
                <svg className="w-full h-28 overflow-visible" viewBox="0 0 120 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="triadChartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#005DFF" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#005DFF" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <motion.path
                        d="M0,70 C30,60 50,20 80,40 S120,10 120,10 L120,100 L0,100 Z"
                        fill="url(#triadChartGrad)"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />
                    <motion.path
                        d="M0,70 C30,60 50,20 80,40 S120,10 120,10"
                        fill="none"
                        stroke="#005DFF"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
                    />
                    <circle cx="80" cy="40" r="4" fill="#005DFF" stroke="white" strokeWidth="2" />
                </svg>

                {/* Floating Tags */}
                <motion.div
                    className="absolute top-10 right-10 bg-white/80 backdrop-blur shadow-lg border border-glass-border px-3 py-1 rounded-full text-[10px] font-mono font-bold text-system-success"
                    animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    +$840.00
                </motion.div>
            </div>
        )
    },
    {
        id: 'coaching',
        title: 'AI Coaching',
        description: 'Smart business advice that works offline and syncs automatically when online.',
        icon: <Zap size={22} />,
        visual: () => (
            <div className="relative w-full h-48 flex items-center justify-center">
                <div className="relative w-64 h-32 bg-white/70 backdrop-blur-md rounded-2xl border border-glass-border shadow-xl p-4 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5" />

                    <div className="flex justify-between items-start mb-4">
                        <div className="text-[9px] font-mono font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded tracking-widest">[ INSIGHT_READY ]</div>
                    </div>

                    <div className="space-y-2">
                        <div className="w-full h-2 bg-mist-gray rounded relative overflow-hidden">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-violet-500 rounded"
                                initial={{ width: "0%" }}
                                whileInView={{ width: "70%" }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                            />
                        </div>
                        <div className="text-[11px] font-mono text-obsidian/40 uppercase tracking-tighter">Optimization potential detected.</div>
                    </div>

                    {/* Glowing Ring Effect on Hover */}
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-violet-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
            </div>
        )
    }
];

const SystemTriad = () => {
    return (
        <section className="bg-studio-white py-32 border-t border-glass-border">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {triads.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] }}
                            className="group"
                        >
                            {/* Visual Container */}
                            <div className="bg-mist-gray/30 rounded-3xl border border-glass-border overflow-hidden mb-8 relative group-hover:bg-mist-gray/40 transition-colors duration-500">
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <item.visual />
                            </div>

                            {/* Content */}
                            <div className="px-4">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-glass-border flex items-center justify-center text-system-blue mb-5 shadow-sm group-hover:shadow-md group-hover:shadow-system-blue/5 transition-all duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-[24px] font-semibold text-obsidian mb-3 tracking-tight">{item.title}</h3>
                                <p className="text-base text-obsidian/60 leading-[1.5]">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SystemTriad;
