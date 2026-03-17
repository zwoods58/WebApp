"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface LegalLayoutProps {
    title: string;
    lastUpdated: string;
    children: React.ReactNode;
    homeLink?: string;
    brandName?: string;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({
    title,
    lastUpdated,
    children,
    homeLink = "/",
    brandName = "ATARWEBB"
}) => {
    return (
        <main className="min-h-screen bg-white text-obsidian selection:bg-system-blue selection:text-white">
            <div className="container mx-auto px-6 py-12 md:py-24 max-w-4xl">

                {/* Navigation */}
                <Link
                    href={homeLink}
                    className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-obsidian/40 hover:text-system-blue transition-colors mb-16"
                >
                    <ArrowLeft size={12} /> Back to {brandName}
                </Link>

                {/* Header */}
                <header className="mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                        {title}
                    </h1>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-obsidian/40">
                        Last Updated: {lastUpdated}
                    </p>
                </header>

                {/* Content */}
                <article className="prose prose-obsidian max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:mt-12 prose-h2:mb-6 prose-p:text-obsidian/70 prose-p:leading-relaxed prose-li:text-obsidian/70 prose-li:leading-relaxed">
                    {children}
                </article>

                {/* Footer Spacer */}
                <div className="h-32" />
            </div>
        </main>
    );
};

export default LegalLayout;
