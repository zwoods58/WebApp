'use client';

import { useState } from 'react';

export default function ComparisonPage() {
    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <div className="max-w-[98vw] mx-auto">
                <h1 className="text-white text-3xl font-bold mb-6 text-center">Hero Banner Comparison</h1>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    {/* Reference Image */}
                    <div className="bg-gray-800 rounded-lg p-4">
                        <h2 className="text-white text-xl font-semibold mb-4">Reference Design</h2>
                        <div className="bg-white rounded-lg overflow-hidden">
                            <img
                                src="/Reference.webp"
                                alt="Reference Design"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>

                    {/* Our Implementation */}
                    <div className="bg-gray-800 rounded-lg p-4">
                        <h2 className="text-white text-xl font-semibold mb-4">Our Implementation</h2>
                        <div className="bg-white rounded-lg overflow-hidden">
                            <HeroBanner />
                        </div>
                    </div>
                </div>

                {/* Assets Reference */}
                <div className="bg-gray-800 rounded-lg p-4">
                    <h2 className="text-white text-xl font-semibold mb-4">Available Assets</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-300 mb-2">Background.png</p>
                            <img src="/Background.png" alt="Background" className="w-full h-auto rounded" />
                        </div>
                        <div>
                            <p className="text-gray-300 mb-2">Shapes.png</p>
                            <img src="/Shapes.png" alt="Shapes" className="w-full h-auto rounded bg-gray-700" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Hero Banner Component - This is what we'll iterate on
function HeroBanner() {
    return (
        <div className="relative w-full h-[600px] overflow-hidden">
            {/* Gradient Background - matching reference */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'url(/Background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />

            {/* 3D Shapes - positioned in center-lower area */}
            <div className="absolute inset-0 flex items-center justify-center">
                <img
                    src="/Shapes.png"
                    alt="3D Shapes"
                    className="w-auto max-w-[510px] h-auto max-h-[390px] object-contain"
                    style={{
                        filter: 'drop-shadow(0 22px 44px rgba(0,0,0,0.085))',
                        transform: 'translateY(40px)'
                    }}
                />
            </div>

            {/* Text Overlay - positioned in upper-center area */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <div className="text-center px-8" style={{ transform: 'translateY(-115px)' }}>
                    <h1
                        className="font-bold mb-5 tracking-tight"
                        style={{
                            fontSize: '6.75rem',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 38%, #d946ef 72%, #f0abfc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontWeight: '900',
                            letterSpacing: '-0.047em',
                            lineHeight: '0.95'
                        }}
                    >
                        Kontlodon
                    </h1>
                    <p className="font-medium" style={{
                        fontSize: '1.7rem',
                        color: '#a5a5b0',
                        fontWeight: '500',
                        letterSpacing: '0.027em'
                    }}>
                        Modern Design System
                    </p>
                </div>
            </div>
        </div>
    );
}
