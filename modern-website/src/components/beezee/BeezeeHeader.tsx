"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const BeezeeHeader = () => {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-glass-border"
        >
            <div className="container mx-auto px-6 py-4 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <Image 
                        src="/beezee-logo.png" 
                        alt="BeeZee Logo" 
                        width={80} 
                        height={80}
                        className="h-16 w-auto"
                    />
                    <span className="text-xl font-bold text-obsidian">BeeZee</span>
                </div>
            </div>
        </motion.header>
    );
};

export default BeezeeHeader;
