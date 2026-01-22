"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const BeezeePricing = () => {
    const plans = [
        {
            country: 'South Africa',
            currency: 'ZAR',
            price: '49',
            period: '/mo',
            features: [
                'Full Financial Dashboard',
                'Unlimited Invoices',
                'Inventory Management',
                'AI Coach Access',
                'Bank-Level Security'
            ],
            gradient: 'from-blue-500/10 to-blue-500/5',
            border: 'border-blue-200'
        },
        {
            country: 'Kenya',
            currency: 'KES',
            price: '100',
            period: '/wk',
            features: [
                'Full Financial Dashboard',
                'Unlimited Invoices',
                'Inventory Management',
                'AI Coach Access',
                'M-PESA Integration Ready'
            ],
            gradient: 'from-emerald-500/10 to-emerald-500/5',
            border: 'border-emerald-200'
        },
        {
            country: 'Nigeria',
            currency: 'NGN',
            price: '600',
            period: '/wk',
            features: [
                'Full Financial Dashboard',
                'Unlimited Invoices',
                'Inventory Management',
                'AI Coach Access',
                'Bank-Level Security'
            ],
            gradient: 'from-purple-500/10 to-purple-500/5',
            border: 'border-purple-200'
        }
    ];

    return (
        <section className="py-24 bg-studio-white border-t border-glass-border">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-bold text-obsidian mb-6 tracking-tight">Simple, Transparent Pricing</h2>
                    <p className="text-lg text-obsidian/60">
                        Choose the plan that fits your region. All plans include our core features and a 7-day free trial.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.country}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative p-8 rounded-2xl bg-white border ${plan.border} shadow-lg hover:shadow-xl transition-all duration-300 group`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-b ${plan.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

                            <div className="relative z-10">
                                <h3 className="text-lg font-medium text-obsidian/70 mb-2 uppercase tracking-wide">{plan.country}</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-2xl font-bold text-obsidian/40">{plan.currency}</span>
                                    <span className="text-5xl font-black text-obsidian tracking-tight">{plan.price}</span>
                                    <span className="text-base text-obsidian/60">{plan.period}</span>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-system-success/10 flex items-center justify-center flex-shrink-0">
                                                <Check size={12} className="text-system-success" />
                                            </div>
                                            <span className="text-sm text-obsidian/80">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => document.getElementById('pwa-selection')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full py-4 bg-obsidian text-white rounded-lg font-bold text-sm tracking-wide hover:bg-black transition-colors"
                                >
                                    Start Free Trial
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BeezeePricing;
