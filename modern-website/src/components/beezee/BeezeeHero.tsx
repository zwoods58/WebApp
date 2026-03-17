"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguageSafe } from '@/hooks/useLanguageSafe';

const BeezeeHero = () => {
    const { t } = useLanguageSafe();
    const [hoveredDemo, setHoveredDemo] = useState(false);
    const [showCoachTip, setShowCoachTip] = useState(true);

    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-studio-white pt-32 pb-20">
            {/* Background Gradients (Refractive Ghost Gradients) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50 md:opacity-100">
                {/* Massive subtle radial gradient for atmosphere */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-[radial-gradient(circle,rgba(200,210,255,0.03)_0%,transparent_70%)]" />
                <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-system-blue/5 rounded-full blur-[60px] md:blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-[#00FFFF]/5 rounded-full blur-[50px] md:blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 z-10 flex flex-col items-center text-center">
                {/* Badge */}


                {/* Headlines */}
                <motion.h1
                    initial={{ opacity: 0, scale: 1.02, y: 12, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
                    className="text-4xl sm:text-5xl md:text-[64px] font-bold text-obsidian tracking-[-0.022em] leading-[1.1] mb-1 max-w-5xl px-4"
                >
                    <em>Your Digital Black Book</em> <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-obsidian to-ghost-text">
                        & Smart Money Tips for African Shops.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 12, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                    className="text-base md:text-[18px] text-obsidian/60 max-w-2xl mb-12 leading-[1.5]"
                >
                    The easy app that helps you track your sales, manage your stock, <br className="hidden md:block" />
                    and gives you smart business advice automatically.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    className="flex flex-col items-center justify-center gap-4 mb-20 w-full md:w-auto"
                >
                    <button
                        onClick={() => document.getElementById('pwa-selection')?.scrollIntoView({ behavior: 'smooth' })}
                        className="w-full sm:w-auto px-14 py-6 bg-[#0A0A0B] text-white rounded-full font-black text-xl hover:scale-[1.02] transition-all shadow-[0_30px_60px_rgba(0,0,0,0.25)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.35)] flex items-center justify-center gap-4 active:scale-[0.96] group relative z-20"
                    >
                        {t('hero.get_started', 'Get Started')}
                        <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </motion.div>

                            </div>
        </section>
    );
};

export default BeezeeHero;
