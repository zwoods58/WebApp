"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCcw, Languages } from 'lucide-react';

const CapabilitiesBar = () => {
    return (
        <section className="bg-studio-white py-12 border-b border-glass-border overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-system-blue/5 border border-system-blue/10 flex items-center justify-center text-system-blue group-hover:scale-110 transition-transform">
                            <WifiOff size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-obsidian uppercase tracking-wider">Offline First</h4>
                            <p className="text-xs text-obsidian/50 mt-0.5">Operate in areas with zero connectivity.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-4 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                            <RefreshCcw size={20} className="animate-spin-slow" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-obsidian uppercase tracking-wider">Auto Sync</h4>
                            <p className="text-xs text-obsidian/50 mt-0.5">Secure cloud backup the moment you're online.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-4 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-violet-600/5 border border-violet-600/10 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform">
                            <Languages size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-obsidian uppercase tracking-wider">Regional Languages</h4>
                            <p className="text-xs text-obsidian/50 mt-0.5">Zulu, Swahili, Igbo, & localized business logic.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CapabilitiesBar;
