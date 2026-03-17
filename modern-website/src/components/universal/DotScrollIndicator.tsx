"use client";

import React, { useEffect, useState } from 'react';

export default function DotScrollIndicator() {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        // Hide default scrollbar and add custom scrollbar styles
        const style = document.createElement('style');
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
        `;
        document.head.appendChild(style);
        
        // Handle scroll progress
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollTop / scrollHeight;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            // Clean up styles
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        };
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
        <div className="dot-scroll-indicator">
            {[0, 1, 2, 3, 4].map((index) => (
                <div
                    key={index}
                    className={`scroll-dot ${Math.round(scrollProgress * 4) === index ? 'active' : ''}`}
                    onClick={() => handleDotClick(index)}
                />
            ))}
        </div>
    );
}
