"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const layers = [
    {
        id: 'quality',
        title: 'Quality',
        subtitle: 'World-Class Design',
        description: 'We strive for perfection. Every pixel, every line of code is crafted to be world-class. Our products are built to be robust, premium, and reliable.',
        step: '01'
    },
    {
        id: 'accessibility',
        title: 'Accessibility',
        subtitle: 'For Everyone',
        description: 'Premium shouldn\'t mean exclusive. We build tools that everyone can afford and access. High quality, handled with care, for everyone.',
        step: '02'
    },
    {
        id: 'simplicity',
        title: 'Simplicity',
        subtitle: 'Intuitive Use',
        description: 'Complexity handling by us, clarity for you. We make advanced technology feel simple. No jargon, just powerful tools anyone can use.',
        step: '03'
    }
];

const LayersSection = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-zen-white">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">

                {/* Section Title - sticky / absolute */}
                <div className="absolute top-24 left-6 md:left-24 z-10">
                    <h2 className="font-mono text-system-blue text-sm mb-4 tracking-widest">{'// METHODOLOGY'}</h2>
                    <h3 className="font-sans text-4xl md:text-5xl text-obsidian font-bold max-w-xl leading-tight">
                        The Standard.
                    </h3>
                </div>

                <motion.div style={{ x }} className="flex gap-12 md:gap-24 pl-[10vw]">
                    {layers.map((layer) => (
                        <div key={layer.id} className="w-[85vw] md:w-[60vw] h-[60vh] md:h-[70vh] flex-shrink-0 relative group">
                            <div className="absolute inset-0 bg-white shadow-xl rounded-2xl border border-mist-gray overflow-hidden transform transition-transform duration-500 group-hover:scale-[1.02]">
                                <div className="absolute top-0 right-0 p-8 md:p-12">
                                    <span className="font-mono text-6xl md:text-8xl text-black/5 font-bold tracking-tighter">
                                        {layer.step}
                                    </span>
                                </div>
                                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-2xl bg-gradient-to-t from-white via-white to-transparent pt-24">
                                    <div className="font-mono text-system-blue text-xs mb-4 uppercase tracking-wider">{layer.subtitle}</div>
                                    <h3 className="font-sans text-3xl md:text-5xl font-bold text-obsidian mb-6">{layer.title}</h3>
                                    <p className="font-sans text-lg text-obsidian/60 leading-relaxed max-w-lg">
                                        {layer.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Spacer for scroll completion */}
                    <div className="w-[10vw] flex-shrink-0" />
                </motion.div>
            </div>
        </section>
    );
};

export default LayersSection;
