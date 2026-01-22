"use client";

import React from 'react';
import { motion } from 'framer-motion';

const LeadershipSection = () => {
    return (
        <section id="leadership" className="min-h-screen bg-zen-white py-32 border-t border-mist-gray">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mb-24">
                    <p className="font-mono text-system-blue mb-8 tracking-widest text-sm uppercase">
                        {'// THE ARCHITECTS //'}
                    </p>
                    <h2 className="font-sans font-bold text-5xl md:text-6xl text-obsidian tracking-tight">
                        Those who design <br /> the invisible.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">

                    {/* CEO Profile */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center md:items-start text-center md:text-left"
                    >
                        <div className="w-full aspect-[4/5] bg-mist-gray rounded-sm overflow-hidden mb-8 relative group border border-glass-border">
                            <img
                                src="/WesleyProfilePhoto.jpeg"
                                alt="Wesley Woods"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-6 font-mono text-[9px] text-white uppercase tracking-widest bg-black/40 px-2 py-1 backdrop-blur-sm">
                                [ ASSET_ID: CEO_WWOODS ]
                            </div>
                        </div>

                        <h3 className="text-3xl font-bold text-obsidian mb-2 tracking-tight">Wesley Woods</h3>
                        <p className="font-mono text-[10px] text-system-blue mb-6 font-bold tracking-[0.2em] uppercase">CEO & Founder</p>

                        <p className="text-base text-obsidian/70 leading-relaxed max-w-lg">
                            An orchestrator of systemic evolution. Wesley has spent decades refining the invisible frameworks that allow complex organizations to operate with intuitive precision. His vision is defined by the elimination of friction at the intersection of human ambition and digital reality.
                        </p>
                    </motion.div>

                    {/* CFO Profile */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center md:items-start text-center md:text-left mt-12 md:mt-0"
                    >
                        <div className="w-full aspect-[4/5] bg-mist-gray rounded-sm overflow-hidden mb-8 relative group border border-glass-border">
                            <img
                                src="/ZebProfilePhoto.jpeg"
                                alt="Zebulun Juan Woods"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-6 font-mono text-[9px] text-white uppercase tracking-widest bg-black/40 px-2 py-1 backdrop-blur-sm">
                                [ ASSET_ID: CFO_ZWOODS ]
                            </div>
                        </div>

                        <h3 className="text-3xl font-bold text-obsidian mb-2 tracking-tight">Zebulun Juan Woods</h3>
                        <p className="font-mono text-[10px] text-system-blue mb-6 font-bold tracking-[0.2em] uppercase">CFO & Co-Founder</p>

                        <p className="text-base text-obsidian/70 leading-relaxed max-w-lg">
                            Architecting the future of distributed intelligence. Zebulun leads the design of AtarWebb’s most sensitive infrastructure, ensuring that every node in our global network adheres to the highest standards of integrity, resilience, and industrial elegance.
                        </p>
                    </motion.div>

                </div>

            </div>
        </section>
    );
};

export default LeadershipSection;
