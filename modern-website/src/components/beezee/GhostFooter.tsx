"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Lock, Activity } from 'lucide-react';

const GhostFooter = () => {
    const [latency, setLatency] = useState(12);

    // Simulate subtle latency fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(prev => {
                const change = Math.floor(Math.random() * 5) - 2;
                return Math.max(8, Math.min(24, prev + change));
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="bg-mist-gray pt-24 pb-12 border-t border-glass-border">
            <div className="container mx-auto px-6">

                {/* 3-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">

                    {/* Column 1: Integrity Node */}
                    <div className="space-y-6">
                        <div className="font-mono text-[10px] font-medium text-ghost-gray uppercase tracking-[0.1em]">[ TRUST_INFRASTRUCTURE ]</div>
                        <ul className="space-y-4">
                            <li>
                                <div className="flex items-center gap-2 group cursor-help">
                                    <Shield size={14} className="text-obsidian/40 group-hover:text-system-blue transition-colors" />
                                    <span className="text-[13px] text-obsidian/60 group-hover:text-system-blue transition-colors">End-to-End Encryption</span>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center gap-2 group cursor-help">
                                    <Lock size={14} className="text-obsidian/40 group-hover:text-system-blue transition-colors" />
                                    <span className="text-[13px] text-obsidian/60 group-hover:text-system-blue transition-colors">Privacy First Protocol</span>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center gap-2 group cursor-default">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-system-success opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-system-success"></span>
                                    </span>
                                    <span className="text-[13px] text-obsidian/60 font-mono">BEEZEE_NET: <span className="text-system-success">ACTIVE</span></span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Governance */}
                    <div className="space-y-6">
                        <div className="font-mono text-[10px] font-medium text-ghost-gray uppercase tracking-[0.1em]">[ GOVERNANCE ]</div>
                        <ul className="space-y-4 text-[13px] text-obsidian/60">
                            <li><Link href="/beezee/terms" className="hover:text-system-blue transition-colors">Terms of Service</Link></li>
                            <li><Link href="/beezee/privacy" className="hover:text-system-blue transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/beezee/refunds" className="hover:text-system-blue transition-colors">Refund & Cancellation</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Global Access */}
                    <div className="space-y-6">
                        <div className="font-mono text-[10px] font-medium text-ghost-gray uppercase tracking-[0.1em]">[ GLOBAL_ACCESS ]</div>
                        <ul className="space-y-4 text-[13px] text-obsidian/60">
                            <li><Link href="/kenya/app" className="hover:text-system-blue transition-colors">Region: Kenya (KES)</Link></li>
                            <li><Link href="/south-africa/app" className="hover:text-system-blue transition-colors">Region: South Africa (ZAR)</Link></li>
                            <li><Link href="/nigeria/app" className="hover:text-system-blue transition-colors">Region: Nigeria (NGN)</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Financial Vault Bar */}
                <div className="border-t border-glass-border pt-8 pb-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[11px] text-obsidian/40 max-w-md text-center md:text-left leading-relaxed font-mono uppercase tracking-tighter">
                        Beezee is a proprietary SaaS platform owned and operated by Atarwebb Ltd (Rwanda Company Code: 153223137).
                        Activity Code J6311: AI-driven data processing and financial insights.
                    </p>
                    <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-all duration-500">
                        <div className="rotate-[-2deg] px-2 py-1 text-[11px] font-black font-mono text-obsidian/60 tracking-[0.1em] border-2 border-obsidian/20 rounded-sm">SECURE</div>
                        <div className="rotate-[1deg] px-2 py-1 text-[11px] font-black font-mono text-obsidian/60 tracking-[0.1em] border-2 border-obsidian/20 rounded-sm">AFRICA_FIRST</div>
                    </div>
                </div>

                {/* The Ghost Signature */}
                <div className="border-t border-glass-border pt-8 flex justify-center">
                    <div className="group relative">
                        <div className="font-mono text-[10px] text-ghost-gray tracking-[0.2em] hover:text-system-blue transition-colors cursor-help uppercase italic">
                            © 2026 BEEZEE // EMPOWERING THE ENTERPRISING // {latency}MS LATENCY
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default GhostFooter;
