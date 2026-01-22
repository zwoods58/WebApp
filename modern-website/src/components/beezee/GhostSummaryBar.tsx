"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const SCROLL_MILESTONES = [
    { percent: 0, text: 'SYSTEM_READY // ORCHESTRATOR_ACTIVE', color: 'text-ghost-gray' },
    { percent: 25, text: 'INVENTORY_STREAM // OPTIMIZED', color: 'text-system-blue' },
    { percent: 50, text: 'TX_LEDGER // RECONCILED', color: 'text-system-blue' },
    { percent: 75, text: 'GHOST_ADVISOR // INSIGHT_READY', color: 'text-violet-500' },
];

const GhostSummaryBar = () => {
    const [scrollPercent, setScrollPercent] = useState(0);
    const [currentMilestone, setCurrentMilestone] = useState(SCROLL_MILESTONES[0]);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const percent = (scrolled / documentHeight) * 100;

            setScrollPercent(percent);

            const milestone = SCROLL_MILESTONES.slice()
                .reverse()
                .find(m => percent >= m.percent) || SCROLL_MILESTONES[0];

            if (milestone.text !== currentMilestone.text) {
                setCurrentMilestone(milestone);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentMilestone.text]);

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-studio-white/80 backdrop-blur-xl border-b border-glass-border">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Left: Navigation / Status */}
                <div className="flex items-center gap-4 md:gap-12">
                    <a href="/" className="font-mono text-[9px] md:text-[10px] text-ghost-text hover:text-system-blue font-bold tracking-[0.2em] transition-colors border-r border-glass-border pr-4 md:pr-8">
                        [ BACK<span className="hidden sm:inline">_TO_SITE</span> ]
                    </a>

                    <div className="flex items-center gap-2 md:gap-4">
                        <motion.div
                            className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-system-blue"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentMilestone.text}
                                initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                                className={`font-mono text-[9px] md:text-[10px] font-bold tracking-[0.1em] uppercase hidden sm:block ${currentMilestone.color}`}
                            >
                                {currentMilestone.text}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Middle: Beezee Branding */}
                <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-2">
                    <Image src="/bezze.png" alt="Beezee Logo" width={20} height={20} className="md:w-6 md:h-6" />
                    <span className="text-lg md:text-xl font-bold tracking-[-0.04em] text-obsidian">Beezee</span>
                </div>

                {/* Right: Progress Indicator */}
                <div className="flex items-center gap-3 md:gap-6">
                    <div className="flex flex-col items-end">
                        <span className="font-mono text-[8px] md:text-[9px] text-ghost-gray tracking-widest uppercase mb-1 hidden sm:block">LATENCY_8MS</span>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] md:text-[10px] text-obsidian font-bold">
                                {Math.round(scrollPercent)}%
                            </span>
                            <div className="w-12 md:w-24 h-[1.5px] md:h-[2px] bg-mist-gray rounded-full overflow-hidden hidden md:block">
                                <motion.div
                                    className="h-full bg-system-blue"
                                    animate={{ width: `${scrollPercent}%` }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GhostSummaryBar;
