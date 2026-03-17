"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';

const GlobalNavigation = () => {
    const { t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between transition-all duration-300 ${
                    isScrolled 
                        ? 'bg-white/90 backdrop-blur-md border-b border-black/10 shadow-sm' 
                        : 'bg-transparent border-b border-transparent'
                }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="flex items-center gap-4">
                    <Link href="/" className={`font-mono font-bold text-xl tracking-tight flex items-center gap-2 transition-colors duration-300 ${
                    isScrolled ? 'text-black hover:opacity-70' : 'text-black hover:opacity-80'
                }`}>
                        AtarWebb
                    </Link>
                </div>

                {/* Desktop Links (Clean Layout) */}
                <div className="hidden md:flex items-center gap-8">

                    <div className="flex items-center gap-3 font-mono text-xs transition-colors duration-300">
                        <span className={`relative flex h-2 w-2 ${
                            isScrolled ? 'bg-system-success' : 'bg-green-600'
                        }`}>
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                                isScrolled ? 'bg-system-success opacity-75' : 'bg-green-600 opacity-75'
                            }`}></span>
                            <span className="relative inline-flex rounded-full h-2 w-2"></span>
                        </span>
                        <span className={isScrolled ? 'text-system-success' : 'text-black'}>
                            {t('nav.system_status', 'SYSTEM STATUS: OPTIMAL')}
                        </span>
                    </div>
                </div>
            </motion.nav>
        </>
    );
};

export default GlobalNavigation;
