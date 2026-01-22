"use client";

import React from 'react';
import Link from 'next/link';

const GlobalFooter = () => {
    return (
        <footer className="bg-[#FAFAFA] pt-24 pb-12 border-t border-gray-200">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-4 border-b border-black py-4">
                    <h2 className="font-sans text-4xl md:text-5xl text-obsidian tracking-tight mb-6 md:mb-0">
                        How can we assist?
                    </h2>
                    <button className="font-mono text-xs uppercase tracking-widest text-obsidian/60 hover:text-system-blue transition-colors mb-2">
                        [ COMPUTE ]
                    </button>
                </div>

                {/* Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">

                    {/* Location Node */}
                    <div className="border border-gray-300 rounded-2xl p-8 md:p-12 hover:border-obsidian transition-colors duration-300 min-h-[240px] flex flex-col justify-between">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-obsidian/40 mb-8">
                            LOCATION_NODE_01
                        </div>
                        <div className="font-sans text-xl text-obsidian leading-relaxed">
                            <p>KG 7 avenue Nyakabanda</p>
                            <p>Nyarugenge, Umujyi wa Kigali</p>
                            <p className="mt-2 text-obsidian/40">RWANDA</p>
                        </div>
                    </div>

                    {/* Connectivity Node */}
                    <div className="border border-gray-300 rounded-2xl p-8 md:p-12 hover:border-obsidian transition-colors duration-300 min-h-[240px] flex flex-col justify-between">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-obsidian/40 mb-8">
                            CONNECTIVITY_NODE
                        </div>
                        <div className="font-sans text-xl text-obsidian leading-relaxed">
                            <a href="mailto:admin@atarwebb.com" className="block hover:text-system-blue transition-colors">
                                admin@atarwebb.com
                            </a>
                            <p className="mt-2">+254 758 557779</p>
                        </div>
                    </div>

                </div>

                {/* Bottom Links */}
                <div className="flex justify-between items-center pt-8 mt-16 text-[10px] font-mono uppercase tracking-widest text-obsidian/40">
                    <div className="font-bold text-obsidian">
                        GLOBAL_CONTACT
                    </div>
                    <div className="flex gap-8">
                        <span className="hidden md:inline">© 2026 ATARWEBB</span>
                        <div className="flex gap-6 font-bold text-obsidian">
                            <Link href="/terms" className="hover:text-system-blue transition-colors">TERMS</Link>
                            <Link href="/privacy" className="hover:text-system-blue transition-colors">PRIVACY</Link>
                        </div>
                        <span className="font-bold text-obsidian">LEGAL</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default GlobalFooter;
