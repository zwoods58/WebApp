"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Image from 'next/image';

// Country data structure with flag image paths (same as BeezeeProcessSection)
const countryData = [
    { code: 'KE', name: 'Kenya', currency: 'KES', flagEmoji: '🇰🇪', flagImage: '/flags/KE.png' },
    { code: 'NG', name: 'Nigeria', currency: 'NGN', flagEmoji: '🇳🇬', flagImage: '/flags/NG.png' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR', flagEmoji: '🇿🇦', flagImage: '/flags/ZA.png' },
    { code: 'GH', name: 'Ghana', currency: 'GHS', flagEmoji: '🇬🇭', flagImage: '/flags/GH.png' },
    { code: 'UG', name: 'Uganda', currency: 'UGX', flagEmoji: '🇺🇬', flagImage: '/flags/UG.png' },
    { code: 'RW', name: 'Rwanda', currency: 'RWF', flagEmoji: '🇷🇼', flagImage: '/flags/RW.png' },
    { code: 'TZ', name: 'Tanzania', currency: 'TZS', flagEmoji: '🇹🇿', flagImage: '/flags/TZ.png' }
];

const BeezeePricing = () => {
    const plans = [
        {
            countryCode: 'KE',
            currency: 'KES',
            price: '200',
            period: '/wk',
                        features: [
                'All 6 Main Features',
                'Sales Tracking & Reports',
                'Local Language Support',
                'Business Tips',
                'Help Any Time'
            ],
            gradient: 'from-emerald-500/10 to-emerald-500/5',
            border: 'border-emerald-200'
        },
        {
            countryCode: 'NG',
            currency: 'NGN',
            price: '500',
            period: '/wk',
                        features: [
                'All 6 Core Features',
                'Business Tracking & Analytics',
                'Yoruba/Igbo/Hausa Support',
                'Performance Insights',
                '24/7 Customer Support'
            ],
            gradient: 'from-purple-500/10 to-purple-500/5',
            border: 'border-purple-200'
        },
        {
            countryCode: 'ZA',
            currency: 'ZAR',
            price: '30',
            period: '/wk',
                        features: [
                'All 6 Core Features',
                'Business Tracking & Analytics',
                'Zulu/Xhosa/Afrikaans Support',
                'Performance Insights',
                '24/7 Customer Support'
            ],
            gradient: 'from-blue-500/10 to-blue-500/5',
            border: 'border-blue-200'
        },
        {
            countryCode: 'GH',
            currency: 'GHS',
            price: '13',
            period: '/wk',
                        features: [
                'All 6 Core Features',
                'Business Tracking & Analytics',
                'Twi Language Support',
                'Performance Insights',
                '24/7 Customer Support'
            ],
            gradient: 'from-yellow-500/10 to-yellow-500/5',
            border: 'border-yellow-200'
        },
        {
            countryCode: 'UG',
            currency: 'UGX',
            price: '4,000',
            period: '/wk',
                        features: [
                'All 6 Core Features',
                'Business Tracking & Analytics',
                'Luganda Language Support',
                'Performance Insights',
                '24/7 Customer Support'
            ],
            gradient: 'from-green-500/10 to-green-500/5',
            border: 'border-green-200'
        },
        {
            countryCode: 'RW',
            currency: 'RWF',
            price: '1,500',
            period: '/wk',
                        features: [
                'All 6 Core Features',
                'Business Tracking & Analytics',
                'Kinyarwanda Support',
                'Performance Insights',
                '24/7 Customer Support'
            ],
            gradient: 'from-cyan-500/10 to-cyan-500/5',
            border: 'border-cyan-200'
        },
        {
            countryCode: 'TZ',
            currency: 'TZS',
            price: '2,000',
            period: '/wk',
                        features: [
                'All 6 Main Features',
                'Sales Tracking & Reports',
                'Local Language Support',
                'Business Tips',
                'Help Any Time'
            ],
            gradient: 'from-indigo-500/10 to-indigo-500/5',
            border: 'border-indigo-200'
        }
    ];

    return (
        <section className="py-24 bg-studio-white border-t border-glass-border">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-bold text-obsidian mb-6 tracking-tight">Weekly Pricing For Beezee</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {plans.map((plan, index) => {
                        const country = countryData.find(c => c.code === plan.countryCode);
                        return (
                        <motion.div
                            key={plan.countryCode}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative p-8 rounded-2xl bg-white border ${plan.border} shadow-lg hover:shadow-xl transition-all duration-300 group`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-b ${plan.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-5 flex items-center justify-center">
                                        <FlagDisplay 
                                            flagEmoji={country?.flagEmoji || ''} 
                                            flagImage={country?.flagImage || ''} 
                                            countryName={country?.name || ''} 
                                        />
                                    </div>
                                    <h3 className="text-lg font-medium text-obsidian/70 uppercase tracking-wide">{country?.name}</h3>
                                </div>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-2xl font-bold text-obsidian/40">{plan.currency}</span>
                                    <span className="text-5xl font-black text-obsidian tracking-tight">{plan.price}</span>
                                    <span className="text-base text-obsidian/60">{plan.period}</span>
                                </div>

                                
                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full bg-system-success/10 flex items-center justify-center flex-shrink-0">
                                                <Check size={10} className="text-system-success" />
                                            </div>
                                            <span className="text-xs text-obsidian/80">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => document.getElementById('pwa-selection')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full py-3 bg-obsidian text-white rounded-lg font-bold text-xs tracking-wide hover:bg-black transition-colors"
                                >
                                    Start 7-Day Free Trial
                                </button>
                            </div>
                        </motion.div>
                        );
                    })}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[11px] font-mono text-obsidian/40 uppercase tracking-widest">
                        BeeZee is a business tracking and analytics app - not a payment processor
                    </p>
                    <p className="text-[10px] font-mono text-obsidian/30 mt-2">
                        Weekly subscription for business tracking only. 7-day free trial for all plans.
                    </p>
                </div>
            </div>
        </section>
    );
};

const FlagDisplay = ({ flagEmoji, flagImage, countryName }: { 
    flagEmoji: string; 
    flagImage: string; 
    countryName: string; 
}) => {
    const [imageError, setImageError] = useState(false);

    return (
        <>
            {!imageError ? (
                <Image
                    src={flagImage}
                    alt={`${countryName} flag`}
                    width={32}
                    height={20}
                    className="object-cover rounded"
                    onError={() => setImageError(true)}
                    style={{ imageRendering: 'crisp-edges' }}
                />
            ) : (
                <div className="text-lg">{flagEmoji}</div>
            )}
        </>
    );
};

export default BeezeePricing;
