"use client";

import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, CreditCard, Wallet } from 'lucide-react';

export default function TransactionPrism() {
  const transactions = [
    {
      type: "sale",
      amount: "$1,248.50",
      customer: "John Doe",
      time: "2 min ago",
      status: "completed",
      icon: DollarSign,
      trend: "up"
    },
    {
      type: "refund",
      amount: "$45.00",
      customer: "Jane Smith",
      time: "15 min ago", 
      status: "processed",
      icon: CreditCard,
      trend: "down"
    },
    {
      type: "payment",
      amount: "$890.00",
      customer: "Bob Johnson",
      time: "1 hour ago",
      status: "completed",
      icon: Wallet,
      trend: "up"
    },
    {
      type: "sale",
      amount: "$2,156.75",
      customer: "Alice Brown",
      time: "2 hours ago",
      status: "completed",
      icon: DollarSign,
      trend: "up"
    }
  ];

  const stats = [
    {
      label: "Today's Revenue",
      value: "$4,340.25",
      change: "+12.5%",
      icon: TrendingUp,
      color: "green"
    },
    {
      label: "Transactions",
      value: "156",
      change: "+8.2%",
      icon: DollarSign,
      color: "blue"
    },
    {
      label: "Avg. Sale",
      value: "$27.82",
      change: "+3.1%",
      icon: ArrowUpRight,
      color: "purple"
    }
  ];

  const getStatusColor = (status: string) => {
    const statusMap = {
      completed: "bg-green-100 text-green-700",
      processed: "bg-blue-100 text-blue-700",
      pending: "bg-yellow-100 text-yellow-700"
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <ArrowUpRight className="w-4 h-4 text-green-600" /> : <ArrowDownRight className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Transaction Overview</h3>
        <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
          View All
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
              <span className="text-xs font-medium text-green-600">{stat.change}</span>
            </div>
            <div className="text-lg font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Recent Transactions</h4>
        </div>
        
        <div className="divide-y divide-gray-200">
          {transactions.map((transaction, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'sale' ? 'bg-green-100' : 
                    transaction.type === 'refund' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <transaction.icon className={`w-5 h-5 ${
                      transaction.type === 'sale' ? 'text-green-600' : 
                      transaction.type === 'refund' ? 'text-red-600' : 'text-blue-600'
                    }`} />
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900">{transaction.customer}</div>
                    <div className="text-xs text-gray-500">{transaction.time}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-gray-900 flex items-center gap-1">
                    {getTrendIcon(transaction.trend)}
                    {transaction.amount}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
          New Sale
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-200 transition-colors text-sm">
          View Report
        </button>
      </div>
    </div>
  );
}
