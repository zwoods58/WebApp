"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-white">

            {/* Background: The "Invisible" Prism */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-prism-gradient opacity-50 blur-3xl rounded-full" />
                <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(rgba(244,244,247,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(244,244,247,0.5)_1px,transparent_1px)] bg-[size:4rem_4rem] mask-radial-fade" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="max-w-5xl"
                >
                    <h1 className="font-sans font-bold text-6xl md:text-8xl lg:text-9xl tracking-tighter text-obsidian mb-10 leading-none">
                        Building For <br /> The Future.
                    </h1>
                    <p className="text-xl md:text-2xl text-obsidian/60 max-w-2xl mx-auto font-light leading-relaxed mb-12">
                        Every step forward lays the foundation for limitless growth Ascending to new heights of innovation, one step at a time.
                    </p>

                    <div className="flex items-center justify-center gap-6">
                        <button className="bg-obsidian text-white px-10 py-5 font-medium tracking-wide hover:bg-system-blue hover:text-white transition-colors duration-500 rounded-full shadow-flight hover:shadow-diffusion hover:-translate-y-1">
                            EXPLORE THE UNSEEN
                        </button>
                    </div>
                </motion.div>

            </div>

            {/* Floating Prism/Glass Object (CSS only for now) */}
            <motion.div
                className="absolute w-64 h-64 bg-gradient-to-br from-white to-sky-50 rounded-3xl opacity-30 blur-2xl top-1/4 left-1/4 mix-blend-multiply animate-pulse"
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                    scale: [1, 1.05, 1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
        </section>
    );
};

export default HeroSection;
