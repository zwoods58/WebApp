"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Table, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getTableStats } from '../lib/metrics';

const MONITORED_TABLES = [
  { name: 'businesses', displayName: 'Businesses', description: 'Business registrations and profiles' },
  { name: 'transactions', displayName: 'Transactions', description: 'Money-in tracking (sales, income)' },
  { name: 'expenses', displayName: 'Expenses', description: 'Money-out tracking (costs, purchases)' },
  { name: 'credit', displayName: 'Credit', description: 'Customer credit management' },
  { name: 'inventory', displayName: 'Inventory', description: 'Stock management' },
  { name: 'targets', displayName: 'Targets', description: 'Performance tracking' },
  { name: 'services', displayName: 'Services', description: 'Service offerings' },
  { name: 'appointments', displayName: 'Appointments', description: 'Booking management' },
  { name: 'beehive_requests', displayName: 'Beehive Requests', description: 'Community feature requests' },
  { name: 'beehive_votes', displayName: 'Beehive Votes', description: 'Voting system' },
  { name: 'beehive_comments', displayName: 'Beehive Comments', description: 'Discussion threads' },
  { name: 'daily_sales_history', displayName: 'Daily Sales History', description: 'Sales performance history' },
];

export default function TablesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tableStats, setTableStats] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTableStats();
  }, []);

  const loadTableStats = async () => {
    setLoading(true);
    const stats: Record<string, any> = {};
    
    for (const table of MONITORED_TABLES) {
      const stat = await getTableStats(table.name);
      stats[table.name] = stat;
    }
    
    setTableStats(stats);
    setLoading(false);
  };

  const filteredTables = MONITORED_TABLES.filter(table =>
    table.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Database Tables
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Monitor all {MONITORED_TABLES.length} BeeZee database tables
          </p>
        </div>
        
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTables.map((table, index) => (
          <motion.div
            key={table.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link href={`/admin/tables/${table.name}`}>
              <div className="p-6 bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all shadow-sm hover:shadow-md group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Table className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {table.displayName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {table.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Rows</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {loading ? '...' : (tableStats[table.name]?.row_count || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div className="text-center py-12">
          <Database className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 dark:text-gray-400">No tables found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
