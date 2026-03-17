"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Package, CreditCard, Globe2, Wrench, Store, Utensils, Car, Scissors, Ruler, Laptop } from 'lucide-react';
import Image from 'next/image';

interface FeatureContent {
    id: string;
    subtitle: string;
    title: string;
    benefitHeadline: string;
    description: string;
    highlights: string[];
    imagePath: string;
    imageAlt: string;
    icon: React.ReactNode;
}

// Country data structure with flag image paths
const countryData = [
    { code: 'KE', name: 'Kenya', currency: 'KES', languages: 'English, Swahili', flagEmoji: '🇰🇪', flagImage: '/flags/KE.png' },
    { code: 'NG', name: 'Nigeria', currency: 'NGN', languages: 'English, Yoruba, Igbo, Hausa', flagEmoji: '🇳🇬', flagImage: '/flags/NG.png' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR', languages: 'English, Afrikaans, Zulu, Xhosa', flagEmoji: '🇿🇦', flagImage: '/flags/ZA.png' },
    { code: 'GH', name: 'Ghana', currency: 'GHS', languages: 'English, Twi', flagEmoji: '🇬🇭', flagImage: '/flags/GH.png' },
    { code: 'UG', name: 'Uganda', currency: 'UGX', languages: 'English, Luganda', flagEmoji: '🇺🇬', flagImage: '/flags/UG.png' },
    { code: 'RW', name: 'Rwanda', currency: 'RWF', languages: 'English, Kinyarwanda', flagEmoji: '🇷🇼', flagImage: '/flags/RW.png' },
    { code: 'TZ', name: 'Tanzania', currency: 'TZS', languages: 'English, Swahili', flagEmoji: '🇹🇿', flagImage: '/flags/TZ.png' }
];

const features: FeatureContent[] = [
    {
        id: 'dashboard',
        subtitle: 'DASHBOARD // 01',
        title: 'See Your Business',
        benefitHeadline: 'Make smart choices with instant updates',
        description: 'See how your business is doing right now. Track daily sales, watch your money, and get smart tips to help you grow.',
        highlights: [
            'Live business numbers',
            'Daily sales tracking',
            'Smart business tips',
            'Quick actions'
        ],
        imagePath: '/beezee-dashboard-screenshot.png',
        imageAlt: 'BeeZee Dashboard showing business overview and metrics',
        icon: <TrendingUp className="w-6 h-6" />
    },
    {
        id: 'cash',
        subtitle: 'MONEY_TRACKING // 02',
        title: 'Track Every Sale',
        benefitHeadline: 'Never miss recording a sale or cost again',
        description: 'Add your income and expenses in seconds. Our smart system puts everything in the right place and keeps all your money records safe.',
        highlights: [
            'One-tap sales recording',
            'Auto sorting',
            'Full money history'
        ],
        imagePath: '/beezee-cash-screenshot.png',
        imageAlt: 'BeeZee Cash page showing transaction tracking',
        icon: <CheckCircle2 className="w-6 h-6" />
    },
    {
        id: 'inventory',
        subtitle: 'STOCK_CONTROL // 03',
        title: 'Manage Your Stock',
        benefitHeadline: 'Never run out of products again',
        description: 'Watch your stock levels in real-time, get alerts when items are low, and manage your products well. Keep your shop full and customers happy.',
        highlights: [
            'Live stock tracking',
            'Low stock alerts',
            'Product list',
            'Quick restock'
        ],
        imagePath: '/beezee-inventory-screenshot.png',
        imageAlt: 'BeeZee Inventory page showing stock management',
        icon: <Package className="w-6 h-6" />
    },
    {
        id: 'services',
        subtitle: 'SERVICES // 04',
        title: 'Offer Your Services',
        benefitHeadline: 'Organize your work and serve customers better',
        description: 'List your services, book appointments, and manage your work easily. Great for salons, repair shops, and service businesses.',
        highlights: [
            'Service menu',
            'Booking calendar',
            'Price management',
            'Customer history'
        ],
        imagePath: '/beezee-services-screenshot.png',
        imageAlt: 'BeeZee Services page showing service catalog',
        icon: <Wrench className="w-6 h-6" />
    },
    {
        id: 'credit',
        subtitle: 'CREDIT_CONTROL // 05',
        title: 'Track Credit Sales',
        benefitHeadline: 'Know who owes you money, easily',
        description: 'Manage customer credit without stress. Track who owes what, send payment reminders, and keep your money flowing smoothly.',
        highlights: [
            'Customer debt tracking',
            'Payment reminders',
            'Credit history',
            'Debt alerts'
        ],
        imagePath: '/beezee-credit-screenshot.png',
        imageAlt: 'BeeZee Credit page showing credit management',
        icon: <CreditCard className="w-6 h-6" />
    },
    {
        id: 'language',
        subtitle: 'MADE_FOR_AFRICA // 06',
        title: 'Built for African Businesses',
        benefitHeadline: 'Your language, your money, your business',
        description: 'BeeZee works your way. From your local language to your country money, from shop to street business. Get business tools that understand you and your world.',
        highlights: [
            'Many languages (English, Swahili, Yoruba, Igbo, Hausa, Afrikaans, Zulu, Xhosa, Twi, Luganda, Kinyarwanda)',
            'Local money (KES, NGN, ZAR, GHS, UGX, RWF, TZS)',
            'African business terms',
            'Features for African markets'
        ],
        imagePath: '',
        imageAlt: '',
        icon: <Globe2 className="w-6 h-6" />
    }
];

const BeezeeProcessSection = () => {
    return (
        <section className="relative bg-studio-white">
            {/* Sticky Hero Section */}
            <div className="min-h-[80vh] flex items-center justify-center sticky top-0 z-0 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center px-6 max-w-4xl"
                >
                    <p className="font-mono text-system-blue mb-8 tracking-widest text-sm uppercase">
                        {'// CORE FEATURES //'}
                    </p>
                    <h2 className="font-sans font-bold text-5xl md:text-7xl text-obsidian mb-8 leading-tight">
                        Core Features That <span className="text-black/20">Power Your Business</span>
                    </h2>
                    <p className="text-lg md:text-xl text-obsidian/60 max-w-2xl mx-auto leading-relaxed">
                        Six essential tools designed for African SMEs
                    </p>
                </motion.div>
            </div>

            {/* Feature Sections */}
            <div className="relative z-10 bg-studio-white/90 backdrop-blur-xl border-t border-glass-border">
                {features.map((feature, index) => {
                    const isLanguageSection = feature.id === 'language';
                    const isImageLeft = index % 2 === 0;

                    if (isLanguageSection) {
                        return (
                            <div key={feature.id} className="min-h-screen flex items-center justify-center px-6 py-24">
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="max-w-4xl text-center"
                                >
                                    <FeatureContent feature={feature} />
                                    
                                    {/* Condensed Country & Language Support */}
                                    <div className="mt-12">
                                        <div className="text-center mb-8">
                                            <div className="font-mono text-sm md:text-base text-system-blue font-black mb-8 tracking-widest uppercase">
                                                7 COUNTRIES • 12+ LANGUAGES • 7 INDUSTRIES
                                            </div>
                                        </div>
                                        
                                        {/* Countries Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                            {countryData.map((country) => (
                                                <CountryCard 
                                                    key={country.code}
                                                    flagEmoji={country.flagEmoji}
                                                    flagImage={country.flagImage}
                                                    name={country.name}
                                                    currency={country.currency}
                                                    languages={country.languages}
                                                />
                                            ))}
                                        </div>

                                        
                                        {/* Industries */}
                                        <div className="text-center mt-12">
                                            <div className="font-mono text-[10px] text-system-blue font-black mb-6 tracking-widest uppercase">
                                                7 KEY INDUSTRIES
                                            </div>
                                            <p className="text-xl md:text-2xl text-obsidian/80 mb-8 font-semibold">
                                                Built for every African business type
                                            </p>
                                            <div className="flex justify-center items-center flex-nowrap max-w-6xl mx-auto overflow-x-auto py-2">
                                                <FloatingWord>Retail</FloatingWord>
                                                <FloatingWord>Restaurant</FloatingWord>
                                                <FloatingWord>Transport</FloatingWord>
                                                <FloatingWord>Salon</FloatingWord>
                                                <FloatingWord>Tailor</FloatingWord>
                                                <FloatingWord>Repairs</FloatingWord>
                                                <FloatingWord>Freelance</FloatingWord>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        );
                    }

                    return (
                        <div key={feature.id} className="min-h-screen flex items-center justify-center px-6 py-24">
                            <div className="container mx-auto max-w-6xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                                    {isImageLeft ? (
                                        <>
                                            <PhoneScreenshot feature={feature} index={index} />
                                            <FeatureContent feature={feature} />
                                        </>
                                    ) : (
                                        <>
                                            <FeatureContent feature={feature} className="md:order-2" />
                                            <PhoneScreenshot feature={feature} index={index} className="md:order-1" />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

const PhoneScreenshot = ({ feature, index, className = '' }: { feature: FeatureContent; index: number; className?: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className={`relative ${className}`}
        >
            <div className="relative mx-auto max-w-[280px] md:max-w-[300px]">
                {/* Phone Frame */}
                <div className="relative rounded-[2.5rem] overflow-hidden bg-obsidian shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-[8px] border-obsidian">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-obsidian rounded-b-2xl z-10" />
                    
                    {/* Screenshot */}
                    <div className="relative aspect-[9/19.5] bg-white">
                        <Image
                            src={feature.imagePath}
                            alt={feature.imageAlt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 280px, 300px"
                        />
                    </div>
                </div>

                {/* Floating Icon Badge */}
                <motion.div
                    className="absolute -top-4 -right-4 w-14 h-14 bg-system-blue rounded-2xl shadow-lg flex items-center justify-center text-white"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    {feature.icon}
                </motion.div>
            </div>
        </motion.div>
    );
};

const FeatureContent = ({ feature, className = '' }: { feature: FeatureContent; className?: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={className}
        >
            {/* Subtitle */}
            <div className="font-mono text-[10px] text-system-blue font-black mb-4 tracking-widest uppercase">
                {feature.subtitle}
            </div>

            {/* Title */}
            <h3 className="font-sans text-3xl md:text-4xl lg:text-5xl text-obsidian font-black leading-tight mb-4">
                {feature.title}
            </h3>

            {/* Benefit Headline */}
            <p className="text-xl md:text-2xl text-system-blue font-semibold mb-6 leading-snug">
                {feature.benefitHeadline}
            </p>

            {/* Description */}
            <p className="text-base md:text-lg text-obsidian/60 leading-relaxed mb-8">
                {feature.description}
            </p>

            {/* Highlights */}
            <div className="space-y-3">
                {feature.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-system-blue flex-shrink-0 mt-0.5" />
                        <span className="text-sm md:text-base text-obsidian/70">{highlight}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const CountryFlag = ({ country, label, currency }: { country: string; label: string; currency: string }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm border border-glass-border rounded-xl hover:border-system-blue transition-colors"
        >
            <div className="text-5xl">{country}</div>
            <div className="text-sm font-bold text-obsidian">{label}</div>
            <div className="text-xs font-mono text-system-blue">{currency}</div>
        </motion.div>
    );
};

const LanguageBadge = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="px-4 py-2 bg-system-blue/10 border border-system-blue/20 rounded-full">
            <span className="text-sm font-mono text-system-blue font-semibold">{children}</span>
        </div>
    );
};

const CountryCard = ({ flagEmoji, flagImage, name, currency, languages }: { 
    flagEmoji: string; 
    flagImage: string; 
    name: string; 
    currency: string; 
    languages: string; 
}) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm border border-glass-border rounded-xl hover:border-system-blue transition-colors"
        >
            <div className="w-16 h-10 flex items-center justify-center">
                <FlagDisplay flagEmoji={flagEmoji} flagImage={flagImage} countryName={name} />
            </div>
            <div className="text-sm font-bold text-obsidian">{name}</div>
            <div className="text-xs font-mono text-system-blue">{currency}</div>
            <div className="text-xs text-obsidian/60 text-center">{languages}</div>
        </motion.div>
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
                    width={64}
                    height={40}
                    className="object-cover rounded"
                    onError={() => setImageError(true)}
                    style={{ imageRendering: 'crisp-edges' }}
                />
            ) : (
                <div className="text-4xl">{flagEmoji}</div>
            )}
        </>
    );
};

const FloatingWord = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.span
            whileHover={{ scale: 1.1, y: -2 }}
            className="text-lg md:text-xl font-bold text-obsidian hover:text-system-blue transition-colors cursor-pointer mx-2 md:mx-4"
        >
            {children}
        </motion.span>
    );
};

const LanguageFlag = ({ flag, language }: { flag: string; language: string }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-3 py-2 bg-white/60 backdrop-blur-sm border border-glass-border rounded-lg hover:border-system-blue transition-colors"
        >
            <span className="text-lg">{flag}</span>
            <span className="text-sm font-medium text-obsidian">{language}</span>
        </motion.div>
    );
};

export default BeezeeProcessSection;
