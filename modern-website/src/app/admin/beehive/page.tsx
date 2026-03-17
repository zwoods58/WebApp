"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowUp, MessageCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { RefreshButton } from '../components/RefreshButton';
import { BeehiveCard } from '../components/BeehiveCard';
import { getTopBeehiveRequests, getBeehiveStats } from '../lib/database';
import type { BeehiveRequest, BeehiveStats } from '../lib/types';

export default function BeehivePage() {
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
      console.error('Error fetching Beehive data:', error);
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Beehive
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Community feature requests and engagement
          </p>
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
          icon={Clock}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-50 dark:bg-yellow-900/20"
          delay={0.1}
        />
        <MetricCard
          title="In Progress"
          value={stats?.in_progress_requests || 0}
          subtitle="Being worked on"
          icon={TrendingUp}
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

      {/* Engagement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Community Engagement
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg mb-3 mx-auto">
                <ArrowUp className="text-cyan-600" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.total_votes || 0}
              </p>
              <p className="text-sm text-gray-500">Total Votes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-3 mx-auto">
                <MessageCircle className="text-purple-600" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.total_comments || 0}
              </p>
              <p className="text-sm text-gray-500">Total Comments</p>
            </div>
          </div>
        </motion.div>

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
                <div key={category.category} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {category.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {category.count} requests
                    </span>
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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

      {/* Top Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Top Community Requests
        </h2>
        <div className="space-y-3">
          {topRequests.length > 0 ? (
            topRequests.map((request, index) => (
              <BeehiveCard key={request.id} request={request} index={index} />
            ))
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400">No Beehive requests yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Community members can submit feature requests to improve BeeZee
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
