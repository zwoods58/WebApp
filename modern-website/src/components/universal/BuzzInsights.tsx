"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Clock, 
  DollarSign,
  Package,
  Users,
  Zap,
  CreditCard,
  Wallet,
  RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/currency';
import { useLanguage } from '@/hooks/LanguageContext';

interface InsightCard {
  id: string;
  type: 'low_stock' | 'overdue_credit' | 'top_seller' | 'ai_tip' | 'cash_summary' | 'inventory_summary' | 'credit_summary' | 'popular_service' | 'profitable_area' | 'transport_performance';
  title: string;
  content: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  data?: any;
  link?: string;
}

interface BuzzInsightsProps {
  country: string;
  industry: string;
  lowStockItems?: Array<{ item_name: string; quantity: number; threshold: number }>;
  overdueCredit?: { count: number; amount: number; avgDays: number };
  topSellers?: Array<{ name: string; quantity: number; revenue: number }>;
  transactions?: Array<any>;
  cashData?: { todayIn: number; todayOut: number; profit: number };
  inventoryData?: { totalItems: number; lowStock: number; totalValue: number };
  creditData?: { outstandingCount: number; totalOwed: number; overdueAmount: number };
  // Transport-specific analytics
  transportData?: {
    popularServices?: Array<{ service_name: string; trips: number; revenue: number }>;
    profitableAreas?: Array<{ location: string; revenue: number; trips: number }>;
    totalTrips?: number;
    totalRevenue?: number;
    avgTripRevenue?: number;
  };
}

export default function BuzzInsights({
  country,
  industry,
  lowStockItems = [],
  overdueCredit,
  topSellers = [],
  transactions = [],
  cashData,
  inventoryData,
  creditData,
  transportData
}: BuzzInsightsProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  // Generate insight cards based on available data
  const generateInsights = (): InsightCard[] => {
    const insights: InsightCard[] = [];

    // Low Stock Alert
    if (lowStockItems.length > 0) {
      insights.push({
        id: 'low_stock',
        type: 'low_stock',
        title: t('buzz.low_stock_alert', 'Low Stock Alert'),
        content: `${lowStockItems.length} items need restocking`,
        icon: <AlertTriangle size={24} />,
        color: 'text-orange-700',
        bgColor: 'bg-orange-50 border-orange-200',
        data: lowStockItems.slice(0, 3),
        link: `/Beezee-App/app/${country}/${industry}/stock`
      });
    }

    // Overdue Credit Warning
    if (overdueCredit && overdueCredit.count > 0) {
      insights.push({
        id: 'overdue_credit',
        type: 'overdue_credit',
        title: t('buzz.overdue_payments', 'Overdue Payments'),
        content: `${formatCurrency(overdueCredit.amount, country)} from ${overdueCredit.count} customers`,
        icon: <Clock size={24} />,
        color: 'text-red-700',
        bgColor: 'bg-red-50 border-red-200',
        data: overdueCredit,
        link: `/Beezee-App/app/${country}/${industry}/credit`
      });
    }

    // Top Seller
    if (topSellers.length > 0) {
      const topItem = topSellers[0];
      insights.push({
        id: 'top_seller',
        type: 'top_seller',
        title: t('buzz.top_seller', 'Top Seller'),
        content: topItem.name,
        icon: <Star size={24} />,
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50 border-yellow-200',
        data: topItem,
        link: `/Beezee-App/app/${country}/${industry}/transactions`
      });
    }

    // Cash Summary - Always show if there's transaction data
    if (cashData && (cashData.todayIn > 0 || cashData.todayOut > 0)) {
      insights.push({
        id: 'cash_summary',
        type: 'cash_summary',
        title: t('buzz.daily_cash_summary', 'Daily Cash Summary'),
        content: t('buzz.cash_flow', 'Today\'s cash flow'),
        icon: <DollarSign size={24} />,
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-200',
        data: cashData,
        link: `/Beezee-App/app/${country}/${industry}/cash`
      });
    }

    // Inventory Summary - Always show if there's inventory data
    if (inventoryData && inventoryData.totalItems > 0) {
      insights.push({
        id: 'inventory_summary',
        type: 'inventory_summary',
        title: t('buzz.inventory_summary', 'Inventory Summary'),
        content: `${inventoryData.totalItems} items in stock`,
        icon: <Package size={24} />,
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-200',
        data: inventoryData,
        link: `/Beezee-App/app/${country}/${industry}/stock`
      });
    }

    // Credit Summary - Always show if there's credit data
    if (creditData && creditData.outstandingCount > 0) {
      insights.push({
        id: 'credit_summary',
        type: 'credit_summary',
        title: t('buzz.credit_summary', 'Credit Summary'),
        content: `${creditData.outstandingCount} outstanding payments`,
        icon: <CreditCard size={24} />,
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-200',
        data: creditData,
        link: `/Beezee-App/app/${country}/${industry}/credit`
      });
    }

    // Transport-specific insights
    if (industry === 'transport' && transportData) {
      // Most popular service
      if (transportData.popularServices && transportData.popularServices.length > 0) {
        const topService = transportData.popularServices[0];
        insights.push({
          id: 'popular_service',
          type: 'popular_service',
          title: t('buzz.popular_service', 'Most Popular Service'),
          content: `${topService.service_name} (${topService.trips} trips)`,
          icon: <Star size={24} />,
          color: 'text-yellow-700',
          bgColor: 'bg-yellow-50 border-yellow-200',
          data: topService,
          link: `/Beezee-App/app/${country}/${industry}/services`
        });
      }

      // Most profitable area
      if (transportData.profitableAreas && transportData.profitableAreas.length > 0) {
        const topArea = transportData.profitableAreas[0];
        insights.push({
          id: 'profitable_area',
          type: 'profitable_area',
          title: t('buzz.profitable_area', 'Most Profitable Area'),
          content: `${topArea.location} (${formatCurrency(topArea.revenue, country)})`,
          icon: <TrendingUp size={24} />,
          color: 'text-green-700',
          bgColor: 'bg-green-50 border-green-200',
          data: topArea,
          link: `/Beezee-App/app/${country}/${industry}/transactions`
        });
      }

      // Transport performance summary
      if (transportData.totalTrips && transportData.totalRevenue) {
        insights.push({
          id: 'transport_performance',
          type: 'transport_performance',
          title: t('buzz.transport_performance', 'Transport Performance'),
          content: `${transportData.totalTrips} trips, ${formatCurrency(transportData.totalRevenue, country)} total`,
          icon: <Users size={24} />,
          color: 'text-blue-700',
          bgColor: 'bg-blue-50 border-blue-200',
          data: {
            totalTrips: transportData.totalTrips,
            totalRevenue: transportData.totalRevenue,
            avgTripRevenue: transportData.avgTripRevenue
          },
          link: `/Beezee-App/app/${country}/${industry}/transactions`
        });
      }
    }

    // AI-Generated Tips
    const aiTips = generateAITips();
    if (aiTips.length > 0) {
      insights.push(...aiTips);
    }

    return insights;
  };

  // Generate AI-style contextual tips
  const generateAITips = (): InsightCard[] => {
    const tips: InsightCard[] = [];

    // Sales momentum tip
    if (transactions.length > 5) {
      tips.push({
        id: 'ai_tip_momentum',
        type: 'ai_tip',
        title: t('buzz.great_momentum', 'Great Momentum!'),
        content: t('buzz.sales_up_message', `You're doing great! Keep up the momentum.`),
        icon: <Zap size={24} />,
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-200',
        data: null
      });
    }

    // Restock reminder
    if (lowStockItems.length > 0) {
      const item = lowStockItems[0];
      tips.push({
        id: 'ai_tip_restock',
        type: 'ai_tip',
        title: t('buzz.restock_reminder', 'Restock Reminder'),
        content: `${item.item_name} is selling fast`,
        icon: <Package size={24} />,
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-200',
        data: item
      });
    }

    // Customer follow-up
    if (overdueCredit && overdueCredit.count > 0) {
      tips.push({
        id: 'ai_tip_followup',
        type: 'ai_tip',
        title: t('buzz.follow_up_needed', 'Follow-up Needed'),
        content: `${overdueCredit.count} customers have overdue payments`,
        icon: <Users size={24} />,
        color: 'text-indigo-700',
        bgColor: 'bg-indigo-50 border-indigo-200',
        data: overdueCredit
      });
    }

    return tips;
  };

  const insights = generateInsights();

  // Auto-rotate carousel
  useEffect(() => {
    if (!autoRotate || insights.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRotate, insights.length]);

  const handleCardClick = (insight: InsightCard) => {
    if (insight.link) {
      router.push(insight.link);
    }
  };

  if (insights.length === 0) {
    return null;
  }

  const currentInsight = insights[currentIndex];

  return (
    <div className="relative mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Zap size={16} className="text-[var(--powder-dark)]" />
        <h3 className="text-xs font-bold text-[var(--text-3)] uppercase tracking-wider">
          {t('buzz.title', 'Buzz')}
        </h3>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentInsight.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleCardClick(currentInsight)}
            className={`${currentInsight.bgColor} border rounded-xl p-4 relative overflow-hidden ${
              currentInsight.link ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
            }`}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 opacity-10">
              <div className={currentInsight.color}>
                {currentInsight.icon}
              </div>
            </div>

            {/* Content */}
            <div className="relative">
              <div className="flex items-start gap-3 mb-2">
                <div className={`${currentInsight.color} flex-shrink-0`}>
                  {currentInsight.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-sm ${currentInsight.color} mb-1`}>
                    {currentInsight.title}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {currentInsight.content}
                  </p>

                  {/* Cash Summary Details */}
                  {currentInsight.type === 'cash_summary' && currentInsight.data && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{t('buzz.money_in', 'Money In')}</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(currentInsight.data.todayIn, country)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{t('buzz.money_out', 'Money Out')}</span>
                        <span className="font-bold text-red-600">
                          {formatCurrency(currentInsight.data.todayOut, country)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-200">
                        <span className="font-medium text-gray-700">{t('buzz.profit', 'Profit')}</span>
                        <span className={`font-bold ${currentInsight.data.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(currentInsight.data.profit, country)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Inventory Summary Details */}
                  {currentInsight.type === 'inventory_summary' && currentInsight.data && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{t('buzz.total_value', 'Total Value')}</span>
                        <span className="font-bold text-blue-600">
                          {formatCurrency(currentInsight.data.totalValue, country)}
                        </span>
                      </div>
                      {currentInsight.data.lowStock > 0 && (
                        <div className="flex items-center gap-2 text-xs text-orange-600 mt-1">
                          <AlertTriangle size={12} />
                          <span>{currentInsight.data.lowStock} {t('buzz.low_stock', 'low stock')}</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {t('buzz.view_details', 'Tap to view details')}
                      </div>
                    </div>
                  )}

                  {/* Credit Summary Details */}
                  {currentInsight.type === 'credit_summary' && currentInsight.data && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{t('buzz.total_owed', 'Total Owed')}</span>
                        <span className="font-bold text-purple-600">
                          {formatCurrency(currentInsight.data.totalOwed, country)}
                        </span>
                      </div>
                      {currentInsight.data.overdueAmount > 0 && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-red-600">{t('buzz.overdue', 'Overdue')}</span>
                          <span className="font-bold text-red-600">
                            {formatCurrency(currentInsight.data.overdueAmount, country)}
                          </span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {t('buzz.view_details', 'Tap to view details')}
                      </div>
                    </div>
                  )}

                  {/* Additional details based on type */}
                  {currentInsight.type === 'low_stock' && currentInsight.data && (
                    <div className="mt-2 space-y-1">
                      {currentInsight.data.map((item: any, idx: number) => (
                        <div key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                          <span className="font-medium">{item.item_name}</span>
                          <span className="text-gray-500">({item.quantity} {t('buzz.left', 'left')})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentInsight.type === 'overdue_credit' && currentInsight.data && (
                    <div className="mt-2 text-xs text-gray-600">
                      {t('buzz.avg_overdue', 'Avg')}: {currentInsight.data.avgDays} {t('buzz.days', 'days')}
                    </div>
                  )}

                  {currentInsight.type === 'top_seller' && currentInsight.data && (
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <span className="text-gray-600">
                        {currentInsight.data.quantity} {t('buzz.sold', 'sold')}
                      </span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(currentInsight.data.revenue, country)}
                      </span>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots indicator */}
        {insights.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {insights.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setAutoRotate(false);
                  setCurrentIndex(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-[var(--powder-dark)] w-4'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to insight ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
