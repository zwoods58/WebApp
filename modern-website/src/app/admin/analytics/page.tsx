"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Percent, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ANALYTICS_SECTIONS = [
  {
    title: 'Revenue Analytics',
    description: 'Track revenue trends, MRR breakdown, ARPU, and financial forecasting',
    icon: TrendingUp,
    path: '/admin/analytics/revenue',
    color: 'emerald',
  },
  {
    title: 'User Analytics',
    description: 'Monitor user growth, retention, engagement, and geographic distribution',
    icon: Users,
    path: '/admin/analytics/users',
    color: 'blue',
  },
  {
    title: 'Conversion Analytics',
    description: 'Analyze conversion funnels, trial-to-paid rates, and retention curves',
    icon: Percent,
    path: '/admin/analytics/conversion',
    color: 'purple',
  },
  {
    title: 'Beehive Analytics',
    description: 'Track community engagement, feature requests, and user participation',
    icon: MessageSquare,
    path: '/admin/analytics/beehive',
    color: 'cyan',
  },
];

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-200 dark:border-cyan-800',
  },
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Analytics
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Deep dive into revenue, users, conversions, and community engagement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ANALYTICS_SECTIONS.map((section, index) => {
          const colors = colorClasses[section.color as keyof typeof colorClasses];
          const Icon = section.icon;

          return (
            <motion.div
              key={section.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={section.path}>
                <div className={`p-8 bg-white dark:bg-[#121212] rounded-2xl border ${colors.border} hover:shadow-lg transition-all group cursor-pointer`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 ${colors.bg} rounded-xl`}>
                      <Icon className={colors.text} size={32} />
                    </div>
                    <ArrowRight className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={24} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
