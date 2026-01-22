"use client";

import Navigation from "@/components/atarwebb/Navigation";
import HeroSequence from "@/components/atarwebb/HeroSequence";
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export default function AtarWebbPage() {
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate('.feature-card', {
                        translateY: [100, 0],
                        opacity: [0, 1],
                        delay: stagger(200),
                        duration: 1200,
                        easing: 'easeOutExpo'
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        if (cardsRef.current) {
            observer.observe(cardsRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <main className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden">
            <Navigation />
            <HeroSequence />

            {/* Content sections that will follow the scroll animation */}
            <section id="features" className="relative z-10 min-h-screen pt-32 px-6 flex flex-col items-center justify-center text-center">
                <h2 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">
                    Precision in Motion.
                </h2>
                <p className="max-w-xl text-lg text-white/60 mb-12">
                    Experience the next generation of web animations. Built with performance and aesthetics as our core foundation.
                </p>
                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="feature-card opacity-0 p-8 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-sm group hover:border-white/20 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/10 mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <span className="text-white font-bold">{i}</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Feature {i}</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Seamlessly integrated components designed to scale with your vision.
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="h-[50vh]" /> {/* Footer spacer */}
        </main>
    );
}
