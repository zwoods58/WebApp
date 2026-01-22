"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface PhoneFrameProps {
    children: React.ReactNode;
    className?: string;
    animate?: boolean;
}

const PhoneFrame = ({ children, className = "", animate = true }: PhoneFrameProps) => {
    const frameContent = (
        <div className={`relative w-full max-w-[320px] mx-auto group ${className}`}>
            {/* Background Spotlight Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[110%] bg-system-blue/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10">
                {/* Glassmorphic Phone Frame with Premium Multi-layer Shadow */}
                <div className="relative rounded-[3rem] border-[10px] border-white/60 bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.5)] overflow-hidden aspect-[9/19]">

                    {/* Inner Screen Content */}
                    <div className="absolute inset-0 bg-gray-50 flex flex-col font-sans overflow-hidden">

                        {/* Status Bar & Notch */}
                        <div className="absolute top-0 left-0 right-0 z-50 h-8 flex items-center justify-between px-6">
                            <span className="text-[10px] font-bold text-gray-900">9:41</span>
                            {/* Dynamic Island Notch */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-2 w-20 h-5 bg-black rounded-full" />
                            <div className="flex items-center gap-1.5 pt-0.5">
                                <div className="flex gap-0.5 items-end">
                                    <div className="w-[2.5px] h-[3px] bg-gray-900 rounded-[0.5px]" />
                                    <div className="w-[2.5px] h-[5px] bg-gray-900 rounded-[0.5px]" />
                                    <div className="w-[2.5px] h-[7px] bg-gray-900 rounded-[0.5px]" />
                                    <div className="w-[2.5px] h-[9px] bg-gray-400 rounded-[0.5px]" />
                                </div>
                                <div className="w-5 h-2.5 border-[1px] border-gray-400 rounded-[2px] relative">
                                    <div className="absolute left-0.5 top-0.5 bottom-0.5 right-1.5 bg-gray-900 rounded-[1px]" />
                                    <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1.5px] h-[3px] bg-gray-400 rounded-r-[0.5px]" />
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 relative">
                            {children}
                        </div>
                    </div>

                    {/* Surface Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none opacity-50" />
                </div>
            </div>
        </div>
    );

    if (!animate) return frameContent;

    return (
        <motion.div
            animate={{ y: [0, -15, 0], rotateZ: [0, -1, 0, 1, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
            {frameContent}
        </motion.div>
    );
};

export default PhoneFrame;
