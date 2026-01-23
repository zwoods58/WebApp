"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Sparkles } from 'lucide-react';

interface ComingSoonModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[110] p-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="w-full max-w-md bg-pure-white rounded-3xl overflow-hidden shadow-2xl pointer-events-auto border border-glass-border relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-mist-gray transition-colors text-obsidian/40 hover:text-obsidian active:scale-95 transition-all"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>

                            <div className="p-10 text-center">
                                {/* Icon Header */}
                                <div className="mb-8 flex justify-center">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-system-blue/10 rounded-3xl flex items-center justify-center text-system-blue">
                                            <Clock size={40} strokeWidth={1.5} />
                                        </div>
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            className="absolute -top-2 -right-2 bg-pure-white p-2 rounded-xl shadow-lg text-system-blue"
                                        >
                                            <Sparkles size={20} fill="currentColor" />
                                        </motion.div>
                                    </div>
                                </div>

                                <h3 className="text-3xl font-bold text-obsidian mb-4 tracking-[-0.02em]">
                                    Feature Node Initializing.
                                </h3>

                                <p className="text-obsidian/60 text-lg leading-relaxed mb-10">
                                    We are currently synchronizing this regional node for public access.
                                    <br /><span className="font-semibold text-system-blue">Deployment starting soon.</span>
                                </p>

                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-system-blue text-pure-white font-bold rounded-2xl hover:bg-system-blue/90 transition-all active:scale-[0.98] shadow-lg shadow-system-blue/20"
                                >
                                    ACKNOWLEDGE
                                </button>

                                <div className="mt-8 flex items-center justify-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-system-blue rounded-full animate-pulse" />
                                    <span className="text-[10px] font-mono font-black text-obsidian/30 tracking-widest uppercase">
                                        System Status: Pending Deployment
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ComingSoonModal;
