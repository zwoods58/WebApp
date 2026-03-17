"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, ArrowUp, MessageCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { MetricCard } from '../../components/MetricCard';
import { RefreshButton } from '../../components/RefreshButton';
import { BeehiveCard } from '../../components/BeehiveCard';
import { getTopBeehiveRequests, getBeehiveStats } from '../../lib/database';
import type { BeehiveRequest, BeehiveStats } from '../../lib/types';

export default function BeehiveAnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [topRequests, setTopRequests] = useState<BeehiveRequest[]>([]);
  const [stats, setStats] = useState<BeehiveStats | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const [requests, beehiveStats] = await Promise.all([
        getTopBeehiveRequests(10),
        getBeehiveStats(),
      ]);
      setTopRequests(requests);
      setStats(beehiveStats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching Beehive analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/analytics">
            <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Beehive Analytics
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Track community engagement and feature requests
            </p>
          </div>
        </div>
        <RefreshButton onRefresh={refresh} loading={loading} lastUpdated={lastUpdated} />
      </div>

      {/* Beehive Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Requests"
          value={stats?.total_requests || 0}
          icon={MessageSquare}
          iconColor="text-cyan-600"
          iconBgColor="bg-cyan-50 dark:bg-cyan-900/20"
          delay={0}
        />
        <MetricCard
          title="Pending"
          value={stats?.pending_requests || 0}
          subtitle="Awaiting review"
          icon={MessageCircle}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-50 dark:bg-yellow-900/20"
          delay={0.1}
        />
        <MetricCard
          title="In Progress"
          value={stats?.in_progress_requests || 0}
          subtitle="Being worked on"
          icon={ArrowUp}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50 dark:bg-blue-900/20"
          delay={0.2}
        />
        <MetricCard
          title="Completed"
          value={stats?.completed_requests || 0}
          subtitle="Implemented"
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-50 dark:bg-green-900/20"
          delay={0.3}
        />
      </div>

      {/* Top Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Top 10 Beehive Requests
        </h2>
        <div className="space-y-3">
          {topRequests.length > 0 ? (
            topRequests.map((request, index) => (
              <BeehiveCard key={request.id} request={request} index={index} />
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              No Beehive requests yet
            </p>
          )}
        </div>
      </motion.div>

      {/* Category Breakdown */}
      {stats && stats.top_categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Top Categories
          </h2>
          <div className="space-y-3">
            {stats.top_categories.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {category.category}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {category.count} requests
                  </span>
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(category.count / stats.total_requests) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                      className="h-full bg-cyan-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
