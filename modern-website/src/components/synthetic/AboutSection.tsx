"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const AboutSection = () => {
    return (
        <section id="about" className="relative bg-zen-white">
            {/* Hero-like intro for About */}
            <div className="min-h-[80vh] flex items-center justify-center sticky top-0 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center px-6 max-w-4xl"
                >
                    <p className="font-mono text-system-blue mb-8 tracking-widest text-sm uppercase">
                        {'// MISSION //'}
                    </p>
                    <h2 className="font-sans font-bold text-5xl md:text-7xl text-obsidian mb-8 leading-tight">
                        Building the future, <span className="text-black/20">simply.</span>
                    </h2>
                </motion.div>
            </div>

            {/* Content Layers */}
            <div className="relative z-10 bg-zen-white/90 backdrop-blur-xl border-t border-mist-gray">
                {[
                    {
                        title: "Our Identity",
                        body: "We are a technology company dedicated to building premium digital infrastructure. We operate in the spaces between complex technology and human potential."
                    },
                    {
                        title: "Our Purpose",
                        body: "We exist to remove barriers. To bridge the gap between what is possible and what is accessible. We don't just build software; we build opportunity."
                    },
                    {
                        title: "The Result",
                        body: "A world where technology is a seamless extension of your will. Where the tools you need are ready, reliable, and remarkably simple."
                    }
                ].map((item, index) => (
                    <div key={index} className="min-h-screen flex items-center justify-center px-6 py-24">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-2xl"
                        >
                            <h3 className="font-mono text-sm text-system-blue mb-6">0{index + 1} // {item.title.toUpperCase()}</h3>
                            <p className="font-sans text-3xl md:text-4xl text-obsidian font-light leading-relaxed">
                                {item.body}
                            </p>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AboutSection;
