"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import BusinessTrackerApp from './BusinessTrackerApp';
import SimplePhoneMockup from './SimplePhoneMockup';
import { ArrowRight } from 'lucide-react';

const TransactionPrism = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen py-32 bg-studio-white border-t border-glass-border overflow-hidden"
        >
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">

                    {/* Left: Professional Content Block */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                        className="relative z-20"
                    >
                        <div className="space-y-12">
                            {/* Monotech Identifier */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-[1px] bg-system-blue/30" />
                                <span className="font-mono text-[10px] text-system-blue font-bold tracking-[0.3em] uppercase">
                                    TRANS_LEDGER_SYSTEM
                                </span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-4xl md:text-6xl font-black text-obsidian tracking-[-0.03em] leading-[1.05]">
                                    One click to <br />
                                    <span className="text-obsidian/20 italic">record it all.</span>
                                </h2>
                                <p className="text-lg text-obsidian/50 max-w-md leading-relaxed">
                                    From daily inventory restocks to complex sales logs.
                                    Beezee transforms fragmented data into a cohesive industrial narrative.
                                </p>
                            </div>

                            <button
                                onClick={() => document.getElementById('pwa-selection')?.scrollIntoView({ behavior: 'smooth' })}
                                className="group relative z-30 flex items-center gap-6 bg-blue-600 py-6 px-12 rounded-full text-white hover:bg-blue-700 transition-all duration-500 shadow-[0_20px_50px_-12px_rgba(37,99,235,0.5)] hover:shadow-[0_20px_50px_-12px_rgba(29,78,216,0.8)] active:scale-[0.98]"
                            >
                                <span className="text-base font-black uppercase tracking-widest">Start Recording</span>
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white transition-all">
                                    <ArrowRight className="w-5 h-5 text-white group-hover:text-blue-600 transition-colors" />
                                </div>
                            </button>
                        </div>
                    </motion.div>

                    {/* Right: Phone Visualization */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                        className="relative z-20 flex justify-center md:justify-end"
                    >
                        <div className="scale-90 md:scale-100 origin-center transition-transform duration-700 relative">
                            <SimplePhoneMockup>
                                <div className="absolute inset-0 top-8 pb-4">
                                    <BusinessTrackerApp />
                                </div>
                            </SimplePhoneMockup>

                            {/* Orbiting Data Nodes (Duplicate from Hero) */}
                            <DataNode className="absolute -left-12 top-1/4" delay={0} label="SYS_01" />
                            <DataNode className="absolute -right-8 top-1/3" delay={2} label="TX_90" />
                            <DataNode className="absolute -left-4 bottom-1/4" delay={1} label="INSIGHT_HUD" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

const DataNode = ({ className, delay, label }: { className: string, delay: number, label: string }) => (
    <motion.div
        className={`${className} px-3 py-1 rounded-full bg-white/80 backdrop-blur border border-glass-border shadow-md flex items-center gap-2`}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
    >
        <div className="w-1.5 h-1.5 rounded-full bg-system-blue animate-pulse" />
        <span className="text-[9px] font-mono text-ghost-text uppercase tracking-widest">{label}</span>
    </motion.div>
);

export default TransactionPrism;
