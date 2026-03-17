"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DataTable } from '../../components/DataTable';
import { supabase } from '../../lib/supabase';

const TABLE_CONFIGS: Record<string, { displayName: string; columns: string[] }> = {
  businesses: {
    displayName: 'Businesses',
    columns: ['id', 'phone_number', 'business_name', 'country', 'industry', 'is_active', 'home_currency', 'created_at'],
  },
  transactions: {
    displayName: 'Transactions',
    columns: ['id', 'business_id', 'amount', 'currency', 'category', 'payment_method', 'transaction_date', 'created_at'],
  },
  expenses: {
    displayName: 'Expenses',
    columns: ['id', 'business_id', 'amount', 'currency', 'category', 'supplier_name', 'expense_date', 'created_at'],
  },
  credit: {
    displayName: 'Credit',
    columns: ['id', 'business_id', 'customer_name', 'amount', 'paid_amount', 'status', 'due_date', 'created_at'],
  },
  inventory: {
    displayName: 'Inventory',
    columns: ['id', 'business_id', 'item_name', 'quantity', 'cost_price', 'selling_price', 'low_stock_threshold', 'created_at'],
  },
  targets: {
    displayName: 'Targets',
    columns: ['id', 'business_id', 'daily_target', 'weekly_target', 'monthly_target', 'current_streak', 'created_at'],
  },
  services: {
    displayName: 'Services',
    columns: ['id', 'business_id', 'service_name', 'category', 'price', 'duration_minutes', 'is_active', 'created_at'],
  },
  appointments: {
    displayName: 'Appointments',
    columns: ['id', 'business_id', 'service_id', 'customer_name', 'appointment_date', 'status', 'created_at'],
  },
  beehive_requests: {
    displayName: 'Beehive Requests',
    columns: ['id', 'business_id', 'country', 'industry', 'title', 'category', 'status', 'upvotes_count', 'created_at'],
  },
  beehive_votes: {
    displayName: 'Beehive Votes',
    columns: ['id', 'request_id', 'business_id', 'vote_type', 'created_at'],
  },
  beehive_comments: {
    displayName: 'Beehive Comments',
    columns: ['id', 'request_id', 'business_id', 'comment_text', 'parent_comment_id', 'created_at'],
  },
  daily_sales_history: {
    displayName: 'Daily Sales History',
    columns: ['id', 'business_id', 'date', 'sales_total', 'daily_target', 'target_achieved', 'created_at'],
  },
};

export default function TableDetailPage() {
  const params = useParams();
  const tableName = params?.tableName as string;
  const config = TABLE_CONFIGS[tableName];

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortKey, setSortKey] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const pageSize = 50;
  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    if (config) {
      fetchData();
    }
  }, [tableName, currentPage, sortKey, sortDirection]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize - 1;

      const { data: tableData, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .order(sortKey, { ascending: sortDirection === 'asc' })
        .range(start, end);

      if (error) throw error;

      setData(tableData || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const exportToCSV = () => {
    if (data.length === 0) return;

    const headers = config.columns.join(',');
    const rows = data.map(row =>
      config.columns.map(col => {
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
    a.download = `${tableName}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!config) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Table not found</p>
        <Link href="/admin/tables" className="text-blue-500 hover:underline mt-4 inline-block">
          Back to Tables
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/tables">
            <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {config.displayName}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {totalCount.toLocaleString()} total records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        {loading && data.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <DataTable
            columns={config.columns.map(col => ({
              key: col,
              label: col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              sortable: true,
            }))}
            data={data}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        )}
      </motion.div>
    </div>
  );
}
