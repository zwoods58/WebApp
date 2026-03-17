"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Auto-scroll every 4 seconds
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % layers.length);
        }, 4000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        // Reset the interval when manually changing slides
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % layers.length);
        }, 4000);
    };

    const goToPrevious = () => {
        const newIndex = currentIndex === 0 ? layers.length - 1 : currentIndex - 1;
        goToSlide(newIndex);
    };

    const goToNext = () => {
        const newIndex = (currentIndex + 1) % layers.length;
        goToSlide(newIndex);
    };

    return (
        <section className="relative h-screen bg-white overflow-hidden">
            {/* Section Title */}
            <div className="absolute top-24 left-6 md:left-24 z-20">
                <h2 className="font-mono text-system-blue text-sm mb-4 tracking-widest">{'// METHODOLOGY'}</h2>
                <h3 className="font-sans text-4xl md:text-5xl text-obsidian font-bold max-w-xl leading-tight">
                    The Standard.
                </h3>
            </div>

            {/* Carousel Container */}
            <div className="relative h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="w-[85vw] md:w-[60vw] h-[60vh] md:h-[70vh] relative group"
                    >
                        <div className="absolute inset-0 bg-white shadow-xl rounded-2xl border border-mist-gray overflow-hidden transform transition-transform duration-500 group-hover:scale-[1.02]">
                            <div className="absolute top-0 right-0 p-8 md:p-12">
                                <span className="font-mono text-6xl md:text-8xl text-black/5 font-bold tracking-tighter">
                                    {layers[currentIndex].step}
                                </span>
                            </div>
                            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-2xl bg-gradient-to-t from-white via-white to-transparent pt-24">
                                <div className="font-mono text-system-blue text-xs mb-4 uppercase tracking-wider">
                                    {layers[currentIndex].subtitle}
                                </div>
                                <h3 className="font-sans text-3xl md:text-5xl font-bold text-obsidian mb-6">
                                    {layers[currentIndex].title}
                                </h3>
                                <p className="font-sans text-lg text-obsidian/60 leading-relaxed max-w-lg">
                                    {layers[currentIndex].description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={goToPrevious}
                className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-mist-gray flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
                <svg className="w-6 h-6 text-obsidian" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={goToNext}
                className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-mist-gray flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
                <svg className="w-6 h-6 text-obsidian" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {layers.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentIndex
                                ? 'bg-system-blue w-8'
                                : 'bg-mist-gray hover:bg-obsidian/40'
                        }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default LayersSection;
