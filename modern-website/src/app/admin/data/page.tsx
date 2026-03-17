"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Users, DollarSign, MessageSquare, Search, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ESSENTIAL_TABLES = [
  { 
    name: 'businesses', 
    displayName: 'Businesses', 
    description: 'User accounts and business profiles',
    icon: Users,
    color: 'blue',
    essential: ['id', 'phone_number', 'business_name', 'country', 'is_active', 'created_at']
  },
  { 
    name: 'transactions', 
    displayName: 'Transactions', 
    description: 'Revenue and payment records',
    icon: DollarSign,
    color: 'emerald',
    essential: ['id', 'business_id', 'amount', 'currency', 'category', 'transaction_date', 'created_at']
  },
  { 
    name: 'beehive_requests', 
    displayName: 'Beehive Requests', 
    description: 'Community feature requests',
    icon: MessageSquare,
    color: 'cyan',
    essential: ['id', 'business_id', 'title', 'category', 'status', 'upvotes_count', 'created_at']
  },
];

export default function DataPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tableStats, setTableStats] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    loadTableStats();
  }, []);

  const loadTableStats = async () => {
    setLoading(true);
    const stats: Record<string, any> = {};
    
    for (const table of ESSENTIAL_TABLES) {
      const stat = await getTableStats(table.name);
      stats[table.name] = stat;
    }
    
    setTableStats(stats);
    setLoading(false);
  };

  const getTableStats = async (tableName: string) => {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (error) throw error;

      return {
        table_name: tableName,
        row_count: count || 0,
        last_updated: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Error fetching stats for ${tableName}:`, error);
      return {
        table_name: tableName,
        row_count: 0,
        last_updated: new Date().toISOString(),
      };
    }
  };

  const loadTableData = async (tableName: string) => {
    try {
      const table = ESSENTIAL_TABLES.find(t => t.name === tableName);
      if (!table) return;

      const { data, error } = await supabase
        .from(tableName)
        .select(table.essential.join(', '))
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setTableData(data || []);
      setSelectedTable(tableName);
    } catch (error) {
      console.error(`Error loading data for ${tableName}:`, error);
      setTableData([]);
    }
  };

  const exportToCSV = () => {
    if (!selectedTable || tableData.length === 0) return;

    const table = ESSENTIAL_TABLES.find(t => t.name === selectedTable);
    if (!table) return;

    const headers = table.essential.join(',');
    const rows = tableData.map(row =>
      table.essential.map(col => {
        const value = row[col];
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
        return value;
      }).join(',')
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTable}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredTables = ESSENTIAL_TABLES.filter(table =>
    table.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    cyan: {
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      text: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-200 dark:border-cyan-800',
    },
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Data
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Essential business data monitoring
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredTables.map((table, index) => {
          const colors = colorClasses[table.color as keyof typeof colorClasses];
          const Icon = table.icon;
          const stats = tableStats[table.name];

          return (
            <motion.div
              key={table.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div
                onClick={() => loadTableData(table.name)}
                className={`p-6 bg-white dark:bg-[#121212] rounded-2xl border ${colors.border} hover:shadow-lg transition-all cursor-pointer group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${colors.bg} rounded-lg`}>
                    <Icon className={colors.text} size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {loading ? '...' : (stats?.row_count || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">records</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {table.displayName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {table.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500">Click to view data</span>
                  <Database className="text-gray-400 group-hover:text-blue-500 transition-colors" size={16} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Table Data View */}
      {selectedTable && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {ESSENTIAL_TABLES.find(t => t.name === selectedTable)?.displayName}
                </h2>
                <p className="text-sm text-gray-500">
                  {tableData.length} records (showing latest 20)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  Export CSV
                </button>
                <button
                  onClick={() => setSelectedTable(null)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  {ESSENTIAL_TABLES.find(t => t.name === selectedTable)?.essential.map((col) => (
                    <th
                      key={col}
                      className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-4 px-4"
                    >
                      {col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {tableData.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    {ESSENTIAL_TABLES.find(t => t.name === selectedTable)?.essential.map((col) => (
                      <td key={col} className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                        {formatCellValue(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function formatCellValue(value: any): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
