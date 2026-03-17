"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const caseStudies = [
    {
        id: 'fintech',
        title: 'Global Settlement Engine',
        client: 'TIER-1 BANK',
        description: 'Re-architecting the settlement layer for a major financial institution. We reduced transaction latency by 94% while increasing data observability, handling 12M+ daily transactions with zero downtime.',
        gradient: 'from-gray-100 to-white',
        tags: ['FINTECH', 'SCALE']
    },
    {
        id: 'health',
        title: 'Genome Sequencing Grid',
        client: 'BIO-LOGIC INC',
        description: 'Distributed computing architecture allowing for real-time patient-specific genomic analysis. Built on a private edge network to ensure patient data sovereignty and sub-millisecond access.',
        gradient: 'from-blue-50 to-white',
        tags: ['HEALTH', 'DATA']
    },
    {
        id: 'logistics',
        title: 'Autonomous Supply Chain',
        client: 'DEFENSE LOGISTICS',
        description: 'AI-driven predictive logistics for mission-critical hardware delivery in contested environments. Utilizing localized mesh networks to bypass traditional connectivity blackouts.',
        gradient: 'from-gray-200 to-gray-50',
        tags: ['DEFENSE', 'AI']
    }
];

const Card = ({ i, data, progress, range, targetScale }: { i: number, data: any, progress: MotionValue<number>, range: number[], targetScale: number }) => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    });

    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
            <motion.div
                style={{ scale, top: `calc(-5vh + ${i * 25}px)` }}
                className="relative flex flex-col w-[90vw] md:w-[1000px] h-[70vh] bg-white rounded-3xl border border-mist-gray shadow-2xl overflow-hidden origin-top"
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${data.gradient} opacity-50`} />

                <div className="relative z-10 flex flex-col h-full p-8 md:p-16 justify-between">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-2">
                            {data.tags.map((tag: string) => (
                                <span key={tag} className="px-3 py-1 rounded-full border border-obsidian/10 bg-white/50 text-xs font-mono text-obsidian/60">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <ArrowUpRight className="text-obsidian/40" />
                    </div>

                    <div>
                        <div className="font-mono text-system-blue text-sm mb-4 tracking-widest uppercase">{data.client}</div>
                        <h3 className="font-sans text-4xl md:text-6xl font-bold text-obsidian mb-8 max-w-3xl">
                            {data.title}
                        </h3>
                        <p className="font-sans text-lg md:text-xl text-obsidian/60 max-w-2xl leading-relaxed">
                            {data.description}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const CaseStudySection = () => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    });

    return (
        <section ref={container} className="relative bg-zen-white pt-24 pb-24 border-t border-mist-gray">
            <div className="container mx-auto px-6 mb-24">
                <h2 className="font-mono text-system-blue text-sm mb-4 tracking-widest uppercase">{'// PROOF OF CONCEPT'}</h2>
                <h3 className="font-sans text-4xl md:text-6xl text-obsidian font-bold">
                    Operational Success.
                </h3>
            </div>

            {caseStudies.map((project, i) => {
                const targetScale = 1 - ((caseStudies.length - i) * 0.05);
                return (
                    <Card
                        key={i}
                        i={i}
                        data={project}
                        progress={scrollYProgress}
                        range={[i * 0.25, 1]}
                        targetScale={targetScale}
                    />
                );
            })}
        </section>
    );
};

export default CaseStudySection;
