"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguageSafe } from '@/hooks/useLanguageSafe';

interface ComingSoonModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguageSafe();
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
                                            <Lock size={40} strokeWidth={1.5} />
                                        </div>
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            className="absolute -top-2 -right-2 bg-pure-white p-2 rounded-xl shadow-lg text-system-blue"
                                        >
                                            <ArrowRight size={20} />
                                        </motion.div>
                                    </div>
                                </div>

                                <h3 className="text-3xl font-bold text-obsidian mb-4 tracking-[-0.02em]">
                                    {t('modal.request_access', 'Request Access.')}
                                </h3>

                                <p className="text-obsidian/60 text-lg leading-relaxed mb-10">
                                    {t('modal.early_access_description', 'Get early access to the BeeZee financial operating system.')}
                                    <br /><span className="font-semibold text-system-blue">{t('modal.join_waitlist', 'Join the waitlist for exclusive access.')}</span>
                                </p>

                                <div className="space-y-3">
                                    <Link
                                        href="/Beezee-App/auth/signup"
                                        onClick={onClose}
                                        className="w-full py-4 bg-system-blue text-pure-white font-bold rounded-2xl hover:bg-system-blue/90 transition-all active:scale-[0.98] shadow-lg shadow-system-blue/20 flex items-center justify-center gap-2"
                                    >
                                        {t('modal.gain_access', 'GAIN ACCESS')}
                                        <ArrowRight size={18} />
                                    </Link>
                                    
                                    <button
                                        onClick={onClose}
                                        className="w-full py-4 bg-mist-gray text-obsidian font-bold rounded-2xl hover:bg-mist-gray/80 transition-all active:scale-[0.98]"
                                    >
                                        {t('modal.maybe_later', 'MAYBE LATER')}
                                    </button>
                                </div>

                                <div className="mt-8 flex items-center justify-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-system-blue rounded-full animate-pulse" />
                                    <span className="text-[10px] font-mono font-black text-obsidian/30 tracking-widest uppercase">
                                        {t('modal.system_status', 'System Status: Accepting Requests')}
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
