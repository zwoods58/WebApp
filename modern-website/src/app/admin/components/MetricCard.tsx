import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Info } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
  tooltip?: string;
}

// Tooltip component
const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
  <div className="relative group inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-50 dark:bg-blue-900/20',
  trend,
  delay = 0,
  tooltip,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon size={100} className={iconColor} />
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 ${iconBgColor} rounded-lg ${iconColor}`}>
          <Icon size={20} />
        </div>
        <div className="flex items-center gap-2">
          {trend && (
            <span
              className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                trend.isPositive
                  ? 'text-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'text-red-500 bg-red-50 dark:bg-red-900/20'
              }`}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
          {tooltip && (
            <Tooltip text={tooltip}>
              <Info className="text-gray-400 cursor-help" size={14} />
            </Tooltip>
          )}
        </div>
      </div>
      
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}
