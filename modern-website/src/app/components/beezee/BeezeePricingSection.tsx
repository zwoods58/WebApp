"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

interface PricingEntry {
    countryCode: string;
    flag: string;
    flagImage: string;
    name: string;
    currencyCode: string;
    localAmount: number;
}

interface Region {
    id: string;
    name: string;
    countries: PricingEntry[];
}

const regions: Region[] = [
    {
        id: 'east',
        name: 'East Africa',
        countries: [
            { countryCode: 'KE', flag: '🇰🇪', flagImage: '/flags/KE.png', name: 'Kenya', currencyCode: 'KES', localAmount: 200 },
            { countryCode: 'TZ', flag: '🇹🇿', flagImage: '/flags/TZ.png', name: 'Tanzania', currencyCode: 'TZS', localAmount: 1500 },
            { countryCode: 'UG', flag: '🇺🇬', flagImage: '/flags/UG.png', name: 'Uganda', currencyCode: 'UGX', localAmount: 2000 },
            { countryCode: 'RW', flag: '🇷🇼', flagImage: '/flags/RW.png', name: 'Rwanda', currencyCode: 'RWF', localAmount: 1000 },
            // DEACTIVATED:
            // { countryCode: 'ET', flag: '🇪🇹', flagImage: '/flags/ET.png', name: 'Ethiopia', currencyCode: 'ETB', localAmount: 100 },
        ]
    },
    {
        id: 'west',
        name: 'West Africa',
        countries: [
            { countryCode: 'NG', flag: '🇳🇬', flagImage: '/flags/NG.png', name: 'Nigeria', currencyCode: 'NGN', localAmount: 1000 },
            { countryCode: 'CI', flag: '🇨🇮', flagImage: '/flags/CI.png', name: "Côte d'Ivoire", currencyCode: 'XOF', localAmount: 1000 },
            { countryCode: 'GH', flag: '🇬🇭', flagImage: '/flags/GH.png', name: 'Ghana', currencyCode: 'GHS', localAmount: 15 },
            // DEACTIVATED:
            // { countryCode: 'SN', flag: '🇸🇳', flagImage: '/flags/SN.png', name: 'Senegal', currencyCode: 'XOF', localAmount: 800 },
            // { countryCode: 'BJ', flag: '🇧🇯', flagImage: '/flags/BJ.png', name: 'Benin', currencyCode: 'XOF', localAmount: 700 },
            // { countryCode: 'BF', flag: '🇧🇫', flagImage: '/flags/BF.png', name: 'Burkina Faso', currencyCode: 'XOF', localAmount: 500 },
            // { countryCode: 'SL', flag: '🇸🇱', flagImage: '/flags/SL.png', name: 'Sierra Leone', currencyCode: 'SLL', localAmount: 15 },
        ]
    },
    {
        id: 'south',
        name: 'Southern Africa',
        countries: [
            { countryCode: 'ZA', flag: '🇿🇦', flagImage: '/flags/ZA.png', name: 'South Africa', currencyCode: 'ZAR', localAmount: 40 },
            { countryCode: 'ZM', flag: '🇿🇲', flagImage: '/flags/ZM.png', name: 'Zambia', currencyCode: 'ZMW', localAmount: 40 },
            // DEACTIVATED:
            // { countryCode: 'MZ', flag: '🇲🇿', flagImage: '/flags/MZ.png', name: 'Mozambique', currencyCode: 'MZN', localAmount: 80 },
            // { countryCode: 'MW', flag: '🇲🇼', flagImage: '/flags/MW.png', name: 'Malawi', currencyCode: 'MWK', localAmount: 1000 },
        ]
    },
    {
        id: 'central',
        name: 'Central Africa',
        countries: [
            // DEACTIVATED:
            // { countryCode: 'CM', flag: '🇨🇲', flagImage: '/flags/CM.png', name: 'Cameroon', currencyCode: 'XAF', localAmount: 1000 },
            // { countryCode: 'CD', flag: '🇨🇩', flagImage: '/flags/CD.png', name: 'DRC', currencyCode: 'CDF', localAmount: 3000 },
            // { countryCode: 'GA', flag: '🇬🇦', flagImage: '/flags/GA.png', name: 'Gabon', currencyCode: 'XAF', localAmount: 900 },
        ]
    },
    {
        id: 'north',
        name: 'North Africa',
        countries: [
            // DEACTIVATED:
            // { countryCode: 'EG', flag: '🇪🇬', flagImage: '/flags/EG.png', name: 'Egypt', currencyCode: 'EGP', localAmount: 50 },
        ]
    }
];

const FlagDisplay = ({ flag, flagImage, name }: { flag: string; flagImage: string; name: string }) => {
    const [imageError, setImageError] = useState(false);
    return (
        <div className="w-12 h-9 flex items-center justify-center">
            {!imageError ? (
                <Image
                    src={flagImage}
                    alt={`${name} flag`}
                    width={48}
                    height={36}
                    className="object-cover rounded"
                    onError={() => setImageError(true)}
                    style={{ imageRendering: 'crisp-edges' }}
                />
            ) : (
                <div className="text-3xl">{flag}</div>
            )}
        </div>
    );
};

const BeezeePricingSection = () => {
    const [openRegion, setOpenRegion] = useState<string | null>('east');

    const toggleRegion = (regionId: string) => {
        setOpenRegion(openRegion === regionId ? null : regionId);
    };

    return (
        <section className="relative bg-studio-white py-24 border-t border-glass-border overflow-hidden">
            <div className="container mx-auto px-6 max-w-3xl">

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

                <div className="space-y-3">
                    {regions.map((region) => (
                        <div key={region.id} className="border border-glass-border rounded-xl overflow-hidden bg-white/40 backdrop-blur-sm">
                            {/* Region Header - Clickable Dropdown */}
                            <button
                                onClick={() => toggleRegion(region.id)}
                                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/60 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {region.countries.slice(0, 3).map((c) => (
                                            <div key={c.countryCode} className="w-7 h-5 rounded-sm overflow-hidden ring-2 ring-white">
                                                <Image
                                                    src={c.flagImage}
                                                    alt={c.name}
                                                    width={28}
                                                    height={20}
                                                    className="object-cover w-full h-full"
                                                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <span className="font-bold text-obsidian text-lg">{region.name}</span>
                                        <span className="text-obsidian/40 text-sm ml-2 font-mono">
                                            {region.countries.length} {region.countries.length === 1 ? 'country' : 'countries'}
                                        </span>
                                    </div>
                                </div>
                                <motion.div
                                    animate={{ rotate: openRegion === region.id ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown className="w-5 h-5 text-obsidian/40" />
                                </motion.div>
                            </button>

                            {/* Country List */}
                            <AnimatePresence>
                                {openRegion === region.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-5 pb-4 border-t border-glass-border pt-3 space-y-2">
                                            {region.countries.length > 0 ? (
                                                region.countries.map((country, index) => (
                                                    <motion.div
                                                        key={country.countryCode}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                                        className="flex items-center justify-between py-3 px-4 bg-white/60 rounded-lg hover:bg-white/90 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <FlagDisplay flag={country.flag} flagImage={country.flagImage} name={country.name} />
                                                            <div>
                                                                <div className="font-semibold text-obsidian text-sm">{country.name}</div>
                                                                <div className="font-mono text-[10px] text-obsidian/40">{country.currencyCode}</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-sans font-black text-xl text-obsidian leading-none">
                                                                {country.localAmount.toLocaleString('en-US')}
                                                            </div>
                                                            <div className="font-mono text-[9px] text-obsidian/40 mt-0.5 tracking-widest uppercase">
                                                                {country.currencyCode} / week
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="flex items-center justify-center py-6 px-4 bg-white/40 rounded-lg"
                                                >
                                                    <span className="font-mono text-sm text-obsidian/50 tracking-wider uppercase">
                                                        Coming Soon
                                                    </span>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
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