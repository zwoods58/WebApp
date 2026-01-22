"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const GlobalNavigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-black/5"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="flex items-center gap-4">
                    <Link href="/" className="font-mono font-bold text-xl tracking-tight text-obsidian flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-system-blue" />
                        AtarWebb
                    </Link>
                </div>

                {/* Desktop Links (Clean Layout) */}
                <div className="hidden md:flex items-center gap-8">

                    <div className="flex items-center gap-3 font-mono text-xs text-system-success">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-system-success opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-system-success"></span>
                        </span>
                        SYSTEM STATUS: OPTIMAL
                    </div>

                    {/* Hamburger (Global) to access Beezee */}
                    <button
                        className="text-obsidian p-2 hover:bg-black/5 rounded-full transition-colors ml-4"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Mobile Toggle (Hamburger) - Visible on mobile */}
                <button
                    className="md:hidden text-obsidian p-2"
                    onClick={() => setIsMenuOpen(true)}
                >
                    <Menu size={24} />
                </button>
            </motion.nav>

            {/* Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-[60] bg-white flex flex-col p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span className="font-heading font-bold text-xl tracking-tight text-obsidian">MENU</span>
                            <button onClick={() => setIsMenuOpen(false)} className="text-obsidian p-2">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-8">
                            {/* Beezee Link */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Link
                                    href="/beezee"
                                    className="text-3xl font-heading font-bold text-system-blue hover:text-obsidian transition-colors flex items-center gap-4"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Beezee
                                    <span className="text-xs font-mono bg-mist-gray px-2 py-1 rounded text-obsidian">APP</span>
                                </Link>
                            </motion.div>
                        </div>

                        <div className="mt-auto pt-12 border-t border-white/10">
                            <div className="flex items-center gap-3 font-mono text-xs text-system-success">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-system-success opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-system-success"></span>
                                </span>
                                SYSTEM CONNECTION: STABLE
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default GlobalNavigation;
