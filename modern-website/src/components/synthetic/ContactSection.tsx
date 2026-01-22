"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactSection = () => {
    const [focused, setFocused] = useState(false);

    return (
        <section id="contact" className="min-h-screen bg-zen-white text-foreground selection:bg-system-blue selection:text-white overflow-hidden relative border-t border-mist-gray">
            {/* Background Ghost Map */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute right-0 top-0 h-full w-1/2 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-no-repeat bg-cover grayscale opacity-10" />
                {/* Pulsing Node */}
                <div className="absolute top-1/2 right-[25%] w-4 h-4 bg-system-blue rounded-full animate-ping opacity-20" />
                <div className="absolute top-1/2 right-[25%] w-4 h-4 bg-system-blue rounded-full opacity-40 ml-[1px] mt-[1px]" />
            </div>

            <div className="container mx-auto px-6 pt-32 h-screen flex flex-col justify-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-4xl"
                >
                    <p className="font-mono text-ghost-text mb-8 tracking-widest text-sm uppercase">
                        {'// SYSTEM ACCESS POINT //'}
                    </p>

                    <h2 className="font-sans font-bold text-5xl md:text-6xl text-obsidian mb-16">
                        Orchestrate <br /> your next move.
                    </h2>

                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="How can we assist?"
                            className="w-full bg-transparent border-b-2 border-shadow-gray py-4 text-2xl md:text-3xl font-light text-obsidian focus:outline-none focus:border-system-blue transition-colors duration-300 placeholder:text-obsidian/20"
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                        />
                        <button className={`absolute right-0 top-1/2 -translate-y-1/2 font-mono text-sm transition-all duration-300 ${focused ? 'text-system-blue opacity-100' : 'text-ghost-text opacity-50'}`}>
                            [ COMPUTE ]
                        </button>
                    </div>

                    <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="p-8 bg-white shadow-diffusion rounded-xl border border-mist-gray">
                            <h3 className="font-mono text-xs text-ghost-text mb-4">LOCATION_NODE_01</h3>
                            <p className="font-sans text-xl text-obsidian">
                                KG 7 avuene Nyakabanda<br />
                                Nyarugenge, Umujyi wa Kigali<br />
                                RWANDA
                            </p>
                        </div>
                        <div className="p-8 bg-white shadow-diffusion rounded-xl border border-mist-gray">
                            <h3 className="font-mono text-xs text-ghost-text mb-4">CONNECTIVITY_NODE</h3>
                            <p className="font-sans text-xl text-obsidian">
                                admin@atarwebb.com<br />
                                +254 758 557779
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ContactSection;
