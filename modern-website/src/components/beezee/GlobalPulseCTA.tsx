"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ComingSoonModal from './ComingSoonModal';

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
    }
];

const GlobalPulseCTA = () => {
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
    const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

    return (
        <section id="pwa-selection" className="relative bg-studio-white py-32 overflow-hidden border-t border-glass-border">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

                    {/* Content Side */}
                    <div className="lg:w-2/5">
                        <h2 className="text-5xl md:text-6xl font-bold text-obsidian mb-6 tracking-[-0.03em] leading-tight">
                            Deploy Your Vision.
                        </h2>
                        <p className="text-lg text-obsidian/60 mb-12 max-w-md leading-relaxed">
                            Select your operational node to initiate the system.<br />
                            Inventory, transactions, and coaching—unified across the continent.
                        </p>

                        <div className="flex flex-col gap-4">
                            {regions.map((region) => (
                                <div
                                    key={region.id}
                                    onClick={() => setIsComingSoonOpen(true)}
                                    onMouseEnter={() => setHoveredRegion(region.id)}
                                    onMouseLeave={() => setHoveredRegion(null)}
                                    className="group relative cursor-pointer"
                                >
                                    <div className="relative z-10 flex items-center justify-between px-8 py-6 bg-white/50 backdrop-blur-md border border-glass-border rounded-xl transition-all duration-300 ease-[0.25,1,0.5,1] group-hover:bg-white/80 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group-hover:-translate-y-0.5 group-hover:border-system-blue/30">
                                        <div className="flex items-center gap-6">
                                            <div className="w-10 h-10 rounded-full bg-mist-gray flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all duration-300">
                                                {region.flag}
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-mono font-medium text-obsidian/40 mb-1 group-hover:text-system-blue transition-colors uppercase tracking-[0.1em]">
                                                    [ NODE_{region.code} // {hoveredRegion === region.id ? 'ACTIVE' : 'ACCESS'} ]
                                                </div>
                                                <div className="text-xl font-bold text-obsidian tracking-tight group-hover:tracking-wide transition-all duration-300">
                                                    {region.name.toUpperCase()}
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
                            ))}
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
                                {regions.map((region) => (
                                    <div
                                        key={region.id}
                                        className="absolute text-center"
                                        style={{ left: `${region.coords.x}%`, top: `${region.coords.y}%` }}
                                        onClick={() => setIsComingSoonOpen(true)}
                                    >
                                        <div className="relative -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                                            {/* Pulse */}
                                            <motion.div
                                                className={`absolute inset-0 rounded-full ${hoveredRegion === region.id ? 'bg-system-blue/30' : 'bg-transparent'}`}
                                                animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                style={{ width: '100%', height: '100%' }}
                                            />

                                            {/* Node Dot */}
                                            <div
                                                className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 ${hoveredRegion === region.id ? 'bg-system-blue scale-125 shadow-lg shadow-system-blue/40' : 'bg-gray-300'}`}
                                                onMouseEnter={() => setHoveredRegion(region.id)}
                                                onMouseLeave={() => setHoveredRegion(null)}
                                            />

                                            {/* Label */}
                                            <AnimatePresence>
                                                {hoveredRegion === region.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                                                        animate={{ opacity: 1, y: -25, filter: 'blur(0px)' }}
                                                        exit={{ opacity: 0, y: 0, filter: 'blur(5px)' }}
                                                        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-white text-obsidian text-[10px] font-mono font-bold px-3 py-1.5 rounded-sm shadow-xl border border-glass-border whitespace-nowrap z-20"
                                                    >
                                                        {region.city.toUpperCase()}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ComingSoonModal
                isOpen={isComingSoonOpen}
                onClose={() => setIsComingSoonOpen(false)}
            />
        </section>
    );
};

export default GlobalPulseCTA;
