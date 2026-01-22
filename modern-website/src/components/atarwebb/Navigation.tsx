"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function Navigation() {
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Entrance animation for navigation
        if (navRef.current) {
            animate(navRef.current, {
                translateY: [-100, 0],
                opacity: [0, 1],
                duration: 1000,
                easing: 'easeOutExpo',
                delay: 500
            });
        }
    }, []);

    return (
        <nav
            ref={navRef}
            className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center mix-blend-difference"
        >
            <Link href="/atarwebb" className="text-white text-2xl font-bold tracking-tighter hover:opacity-70 transition-opacity">
                AtarWebb
            </Link>

            <div className="flex gap-8 items-center text-white/80 text-sm font-medium">
                <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                <Link href="#showcase" className="hover:text-white transition-colors">Showcase</Link>
                <button className="px-4 py-2 bg-white text-black rounded-full hover:bg-white/90 transition-colors text-xs font-bold uppercase tracking-widest">
                    Get Started
                </button>
            </div>
        </nav>
    );
}
