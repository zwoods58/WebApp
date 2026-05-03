"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const regions = [
    {
        id: 'kenya',
        code: 'KE',
        name: 'Kenya',
        city: 'Nairobi',
        flag: '🇰🇪',
        href: '/kenya/app',
        coords: { x: 72, y: 51 }
    },
    {
        id: 'south-africa',
        code: 'ZA',
        name: 'South Africa',
        city: 'Johannesburg',
        flag: '🇿🇦',
        href: '/south-africa/app',
        coords: { x: 54, y: 81 }
    },
    {
        id: 'nigeria',
        code: 'NG',
        name: 'Nigeria',
        city: 'Lagos',
        flag: '🇳🇬',
        href: '/nigeria/app',
        coords: { x: 39, y: 41 }
    },
    {
        id: 'ghana',
        code: 'GH',
        name: 'Ghana',
        city: 'Accra',
        flag: '🇬🇭',
        href: '/ghana/app',
        coords: { x: 33, y: 44 }
    },
    {
        id: 'uganda',
        code: 'UG',
        name: 'Uganda',
        city: 'Kampala',
        flag: '🇺🇬',
        href: '/uganda/app',
        coords: { x: 67, y: 49 }
    },
    {
        id: 'rwanda',
        code: 'RW',
        name: 'Rwanda',
        city: 'Kigali',
        flag: '🇷🇼',
        href: '/rwanda/app',
        coords: { x: 65, y: 54 }
    },
    {
        id: 'tanzania',
        code: 'TZ',
        name: 'Tanzania',
        city: 'Dar es Salaam',
        flag: '🇹🇿',
        href: '/tanzania/app',
        coords: { x: 70, y: 59 }
    },
    {
        id: 'cote-divoire',
        code: 'CI',
        name: "Côte d'Ivoire",
        city: 'Abidjan',
        flag: '🇨🇮',
        href: '/cote-divoire/app',
        coords: { x: 28, y: 43 }
    }
];

const GlobalPulseCTA = () => {
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
    const router = useRouter();

    const handleGetStarted = () => {
        window.open('https://beezee.atarwebb.com', '_blank');
    };

    return (
        <section id="pwa-selection" className="relative bg-studio-white py-32 overflow-hidden border-t border-glass-border">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

                    {/* Content Side */}
                    <div className="lg:w-2/5">
                        <h2 className="text-5xl md:text-6xl font-bold text-obsidian mb-6 tracking-[-0.03em] leading-tight">
                            Start Your Business.
                        </h2>
                        <p className="text-lg text-obsidian/60 mb-12 max-w-md leading-relaxed">
                            Choose your country to get started.<br />
                            Track sales, manage stock, and grow your business—all in one app.
                        </p>

                        <div className="flex flex-col gap-4">
                            <div
                                onClick={handleGetStarted}
                                className="group relative cursor-pointer"
                            >
                                <div className="relative z-10 flex items-center justify-between px-8 py-6 bg-white/50 backdrop-blur-md border border-glass-border rounded-xl transition-all duration-300 ease-[0.25,1,0.5,1] group-hover:bg-white/80 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group-hover:-translate-y-0.5 group-hover:border-system-blue/30">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 rounded-full bg-system-blue flex items-center justify-center text-white transition-all duration-300">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-mono font-medium text-obsidian/40 mb-1 group-hover:text-system-blue transition-colors uppercase tracking-[0.1em]">
                                                [ APP // START ]
                                            </div>
                                            <div className="text-xl font-bold text-obsidian tracking-tight group-hover:tracking-wide transition-all duration-300">
                                                GET STARTED
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowRight className="text-obsidian/20 group-hover:text-system-blue group-hover:translate-x-1 transition-all duration-300" />
                                </div>

                                {/* Fill Effect */}
                                <motion.div
                                    className="absolute inset-0 bg-white"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "0%" }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Map Side (Ghost Map) */}
                    <div className="lg:w-3/5 relative h-[600px] lg:h-[800px] w-full flex items-center justify-center">
                        {/* Professional Map Image */}
                        <div className="relative w-full h-full max-w-[800px] max-h-[800px]">
                            <img
                                src="/africa-map-professional.png"
                                alt="Africa Network Map"
                                className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity duration-700 drop-shadow-2xl"
                            />

                            {/* Overlay Nodes on top of the image */}
                            <div className="absolute inset-0">
                                {regions.map((region) => {
                                    const isHovered = hoveredRegion === region.id;
                                    return (
                                        <div
                                            key={region.id}
                                            onClick={handleGetStarted}
                                            onMouseEnter={() => setHoveredRegion(region.id)}
                                            onMouseLeave={() => setHoveredRegion(null)}
                                            className="absolute cursor-pointer"
                                            style={{ left: `${region.coords.x}%`, top: `${region.coords.y}%` }}
                                        >
                                            <div className="relative -translate-x-1/2 -translate-y-1/2">

                                                {/* Outer pulse ring — always visible */}
                                                <motion.div
                                                    className="absolute rounded-full bg-system-blue/20"
                                                    animate={{ scale: [1, 3], opacity: [0.6, 0] }}
                                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                                                    style={{ width: 12, height: 12, top: 0, left: 0 }}
                                                />

                                                {/* Second pulse ring offset for depth */}
                                                <motion.div
                                                    className="absolute rounded-full bg-system-blue/10"
                                                    animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
                                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
                                                    style={{ width: 12, height: 12, top: 0, left: 0 }}
                                                />

                                                {/* Node Dot */}
                                                <motion.div
                                                    animate={isHovered ? { scale: 1.8 } : { scale: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                    className={`w-3 h-3 rounded-full border-2 border-white transition-colors duration-300 ${isHovered ? 'bg-system-blue shadow-[0_0_12px_4px_rgba(0,102,255,0.5)]' : 'bg-obsidian'}`}
                                                />

                                                {/* Hover card */}
                                                <AnimatePresence>
                                                    {isHovered && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 6, scale: 0.92, filter: 'blur(4px)' }}
                                                            animate={{ opacity: 1, y: -8, scale: 1, filter: 'blur(0px)' }}
                                                            exit={{ opacity: 0, y: 4, scale: 0.92, filter: 'blur(4px)' }}
                                                            transition={{ duration: 0.2 }}
                                                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-30 pointer-events-none"
                                                        >
                                                            <div className="bg-white border border-glass-border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-4 py-3 flex items-center gap-3 whitespace-nowrap">
                                                                <span className="text-2xl">{region.flag}</span>
                                                                <div>
                                                                    <div className="text-[11px] font-bold text-obsidian leading-tight">{region.name}</div>
                                                                    <div className="text-[9px] font-mono text-system-blue uppercase tracking-widest">{region.city}</div>
                                                                </div>
                                                            </div>
                                                            {/* Arrow tip */}
                                                            <div className="w-2.5 h-2.5 bg-white border-r border-b border-glass-border rotate-45 mx-auto -mt-1.5 relative z-10" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default GlobalPulseCTA;