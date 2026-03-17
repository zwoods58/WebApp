"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Handshake, Globe, Users, Target } from 'lucide-react';
import Image from 'next/image';

const PartnershipSection = () => {
    return (
        <section className="py-24 bg-studio-white border-t border-glass-border">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-system-blue/10 border border-system-blue/20 rounded-full mb-6">
                            <Handshake className="w-4 h-4 text-system-blue" />
                            <span className="text-sm font-mono text-system-blue font-semibold">PARTNERSHIP</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-bold text-obsidian mb-6 leading-tight">
                            African Expansion <span className="text-system-blue">powered by Start Button</span>
                        </h2>
                        
                                            </motion.div>

                    {/* Partnership Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-system-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Globe className="w-8 h-8 text-system-blue" />
                            </div>
                            <h3 className="font-bold text-obsidian mb-2">Reach More Countries</h3>
                            <p className="text-sm text-obsidian/60">
                                Growing to new areas and regions across Africa
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-system-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-system-blue" />
                            </div>
                            <h3 className="font-bold text-obsidian mb-2">Local Knowledge</h3>
                            <p className="text-sm text-obsidian/60">
                                Using our deep understanding of African businesses
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-system-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Target className="w-8 h-8 text-system-blue" />
                            </div>
                            <h3 className="font-bold text-obsidian mb-2">Same Goal</h3>
                            <p className="text-sm text-obsidian/60">
                                Working together to help African business owners succeed
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-system-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Handshake className="w-8 h-8 text-system-blue" />
                            </div>
                            <h3 className="font-bold text-obsidian mb-2">Fast Growth</h3>
                            <p className="text-sm text-obsidian/60">
                                Quick expansion to reach more customers
                            </p>
                        </motion.div>
                    </div>

                    {/* Partnership Statement */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center p-8 bg-gradient-to-b from-system-blue/5 to-transparent rounded-2xl"
                    >
                                                <div className="flex items-center justify-center gap-6">
                            <div className="flex items-center gap-3">
                                <Image 
                                    src="/beezee-logo.png" 
                                    alt="BeeZee Logo" 
                                    width={120} 
                                    height={40}
                                    className="h-10 w-auto"
                                />
                                <span className="text-2xl font-bold text-obsidian">×</span>
                                <Image 
                                    src="/Startbutton.png" 
                                    alt="Start Button Logo" 
                                    width={120} 
                                    height={40}
                                    className="h-10 w-auto"
                                />
                            </div>
                        </div>
                        <div className="text-sm text-obsidian/60 mt-2">Helping African Businesses Grow</div>
                    </motion.div>
                    
                    {/* Partnership Link - Moved outside the card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mt-8"
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-block"
                        >
                            <a
                                href="https://www.startbutton.africa/about-us"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-system-blue text-black rounded-lg font-semibold hover:bg-system-blue/90 transition-colors"
                            >
                                <Globe className="w-4 h-4" />
                                Learn More About Start Button
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </motion.div>
                        
                        <p className="text-xs text-obsidian/40 mt-3">
                            Visit our partner's website to learn more about their mission
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PartnershipSection;
