"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface SystemCardProps {
    catalogId: string;
    children: React.ReactNode;
    className?: string;
    isCompact?: boolean;
}

const SystemCard: React.FC<SystemCardProps> = ({
    catalogId,
    children,
    className = "",
    isCompact = false
}) => {
    return (
        <motion.div
            className={`relative rounded-xl bg-obsidian text-white shadow-flight hover:shadow-diffusion overflow-hidden group transition-all duration-500 will-change-transform hover:-translate-y-1 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
        >
            <div className="absolute top-0 left-0 p-3 font-mono text-[10px] text-white/50 bg-white/5 rounded-br-lg z-10 border-b border-r border-white/10">
                {catalogId}
            </div>

            {/* Soft light wash on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-system-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className={`
        ${isCompact ? 'p-6 pt-12' : 'p-8 pt-16 md:p-10 md:pt-20'}
        h-full w-full
      `}>
                {children}
            </div>
        </motion.div>
    );
};

export default SystemCard;
