"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PricingEntry {
    countryCode: string;
    flag: string;
    flagImage: string;
    name: string;
    currencyCode: string;
    localAmount: number;
}

const pricingData: PricingEntry[] = [
    { countryCode: 'ZA', flag: '🇿🇦', flagImage: '/flags/ZA.png', name: 'South Africa',  currencyCode: 'ZAR', localAmount: 50   },
    { countryCode: 'KE', flag: '🇰🇪', flagImage: '/flags/KE.png', name: 'Kenya',          currencyCode: 'KES', localAmount: 130  },
    { countryCode: 'NG', flag: '🇳🇬', flagImage: '/flags/NG.png', name: 'Nigeria',         currencyCode: 'NGN', localAmount: 1000 },
    { countryCode: 'CI', flag: '🇨🇮', flagImage: '/flags/CI.png', name: "Côte d'Ivoire",  currencyCode: 'XOF', localAmount: 400  },
    { countryCode: 'GH', flag: '🇬🇭', flagImage: '/flags/GH.png', name: 'Ghana',           currencyCode: 'GHS', localAmount: 13   },
    { countryCode: 'TZ', flag: '🇹🇿', flagImage: '/flags/TZ.png', name: 'Tanzania',        currencyCode: 'TZS', localAmount: 1500 },
    { countryCode: 'UG', flag: '🇺🇬', flagImage: '/flags/UG.png', name: 'Uganda',          currencyCode: 'UGX', localAmount: 1500 },
    { countryCode: 'RW', flag: '🇷🇼', flagImage: '/flags/RW.png', name: 'Rwanda',          currencyCode: 'RWF', localAmount: 700  },
];

const FlagDisplay = ({ flag, flagImage, name }: { flag: string; flagImage: string; name: string }) => {
    const [imageError, setImageError] = useState(false);
    return (
        <div className="w-16 h-10 flex items-center justify-center">
            {!imageError ? (
                <Image
                    src={flagImage}
                    alt={`${name} flag`}
                    width={64}
                    height={40}
                    className="object-cover rounded"
                    onError={() => setImageError(true)}
                    style={{ imageRendering: 'crisp-edges' }}
                />
            ) : (
                <div className="text-4xl">{flag}</div>
            )}
        </div>
    );
};

const PricingCard = ({ plan, index }: { plan: PricingEntry; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.07 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.04 }}
            className="flex flex-col items-center gap-3 p-5 bg-white/60 backdrop-blur-sm border border-glass-border rounded-xl hover:border-system-blue transition-colors text-center"
        >
            <FlagDisplay flag={plan.flag} flagImage={plan.flagImage} name={plan.name} />

            <div className="text-sm font-bold text-obsidian leading-tight">{plan.name}</div>

            <div className="mt-1">
                <span className="font-mono text-xs text-system-blue font-black tracking-wider">
                    {plan.currencyCode}
                </span>
                <div className="font-sans font-black text-2xl text-obsidian leading-none mt-0.5">
                    {plan.localAmount.toLocaleString('en-US')}
                </div>
                <div className="font-mono text-[10px] text-obsidian/40 mt-1 tracking-widest uppercase">
                    per week
                </div>
            </div>
        </motion.div>
    );
};

const BeezeePricingSection = () => {
    return (
        <section className="relative bg-studio-white py-24 border-t border-glass-border overflow-hidden">
            <div className="container mx-auto px-6 max-w-5xl">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="font-mono text-system-blue mb-4 tracking-widest text-[10px] uppercase font-black">
                        {'// PRICING // 08'}
                    </p>
                    <h2 className="font-sans font-bold text-4xl md:text-5xl text-obsidian mb-4 leading-tight">
                        Simple Weekly Pricing
                    </h2>
                    <p className="text-lg text-obsidian/60 max-w-xl mx-auto leading-relaxed">
                        Priced for African businesses — pay in your local currency every week.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {pricingData.map((plan, index) => (
                        <PricingCard key={plan.countryCode} plan={plan} index={index} />
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center text-xs font-mono text-obsidian/40 mt-10 tracking-widest uppercase"
                >
                    Billed weekly · Cancel anytime · Local mobile money accepted
                </motion.p>

            </div>
        </section>
    );
};

export default BeezeePricingSection;
