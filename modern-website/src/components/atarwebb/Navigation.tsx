"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { animate } from "animejs";
import { Menu, X } from "lucide-react";

export default function Navigation() {
    const navRef = useRef<HTMLElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Set initial state immediately to prevent flash
        setIsLoaded(true);
        
        // Set scroll padding to prevent header from covering content
        const headerHeight = 80; // Approximate header height
        document.documentElement.style.scrollPaddingTop = `${headerHeight}px`;
        
        // Add styles to document head immediately
        const style = document.createElement('style');
        style.id = 'navigation-styles';
        style.textContent = `
            /* Hide default scrollbar completely */
            ::-webkit-scrollbar {
                width: 0px;
                display: none;
            }
            
            ::-webkit-scrollbar-track {
                background: transparent;
            }
            
            ::-webkit-scrollbar-thumb {
                background: transparent;
                display: none;
            }
            
            /* Firefox */
            html {
                scrollbar-width: none;
            }
            
            body {
                overflow-x: hidden;
            }
            
            /* Custom dot scroll indicator */
            .dot-scroll-indicator {
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 100;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .scroll-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                border: 2px solid rgba(255, 255, 255, 0.6);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .scroll-dot.active {
                background: white;
                border-color: white;
                transform: scale(1.2);
            }
            
            .scroll-dot:hover {
                background: rgba(255, 255, 255, 0.6);
                border-color: white;
            }
            
            /* Prevent header flash */
            .nav-fixed {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 50;
                background: white !important;
                padding: 16px 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.3s ease;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .nav-fixed a {
                color: black !important;
            }
            
            .nav-fixed button {
                color: black !important;
            }
            
            .nav-fixed button:hover {
                background: rgba(0, 0, 0, 0.1) !important;
            }
        `;
        
        // Add to head immediately
        if (!document.getElementById('navigation-styles')) {
            document.head.appendChild(style);
        }
        
        // Handle scroll progress
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollTop / scrollHeight;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        
        // Handle window resize for dynamic header height
        const handleResize = () => {
            if (navRef.current) {
                const newHeight = navRef.current.offsetHeight;
                document.documentElement.style.scrollPaddingTop = `${newHeight}px`;
            }
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            // Clean up styles
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        };
    }, []);

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

    const handleDotClick = (index: number) => {
        const totalDots = 5;
        const targetScroll = (index / (totalDots - 1)) * (document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    };

    return (
        <>
            <nav
                ref={navRef}
                className="nav-fixed"
                style={{ 
                    paddingRight: 'calc(12px + env(safe-area-inset-right))'
                }}
            >
                <Link href="/atarwebb" className="text-2xl font-bold tracking-tighter transition-colors duration-300 text-black hover:opacity-70">
                    AtarWebb
                </Link>

                <div className="flex gap-8 items-center text-sm font-medium">
                    {/* Hamburger Menu */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 rounded-full transition-colors duration-300 text-black hover:bg-black/10"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            {/* Dot Scroll Indicator */}
            <div className="dot-scroll-indicator">
                {[0, 1, 2, 3, 4].map((index) => (
                    <div
                        key={index}
                        className={`scroll-dot ${Math.round(scrollProgress * 4) === index ? 'active' : ''}`}
                        onClick={() => handleDotClick(index)}
                    />
                ))}
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[60] bg-white flex flex-col p-6">
                    <div className="flex justify-between items-center mb-12">
                        <span className="font-heading font-bold text-xl tracking-tight text-black">MENU</span>
                        <button 
                            onClick={() => setIsMenuOpen(false)} 
                            className="text-black p-2 hover:bg-black/10 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-8">
                        {/* Beezee Link */}
                        <Link
                            href="/beezee"
                            className="text-3xl font-heading font-bold text-black hover:text-gray-600 transition-colors flex items-center gap-4"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className="flex items-center gap-3">
                                <img src="/beezee.png" alt="Beezee Logo" width={32} height={32} className="rounded" />
                                Beezee
                            </div>
                            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-black">APP</span>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
