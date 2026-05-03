"use client";

import React, { useState } from 'react';
import { TrendingUp, Users, Package, DollarSign, ArrowUp, ArrowDown, MoreVertical } from 'lucide-react';

export default function BusinessTrackerApp() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const stats = [
    {
      title: "Today's Revenue",
      value: "$2,847",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "green"
    },
    {
      title: "Total Orders",
      value: "156",
      change: "+8.2%",
      trend: "up", 
      icon: Package,
      color: "blue"
    },
    {
      title: "Active Customers",
      value: "1,248",
      change: "+3.1%",
      trend: "up",
      icon: Users,
      color: "purple"
    },
    {
      title: "Growth Rate",
      value: "23.4%",
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
      color: "orange"
    }
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "John Doe", amount: "$89.99", status: "completed", time: "2 min ago" },
    { id: "ORD-002", customer: "Jane Smith", amount: "$156.00", status: "processing", time: "5 min ago" },
    { id: "ORD-003", customer: "Bob Johnson", amount: "$45.50", status: "completed", time: "12 min ago" },
    { id: "ORD-004", customer: "Alice Brown", amount: "$234.00", status: "pending", time: "18 min ago" }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: "bg-green-100 text-green-600 border-green-200",
      blue: "bg-blue-100 text-blue-600 border-blue-200", 
      purple: "bg-purple-100 text-purple-600 border-purple-200",
      orange: "bg-orange-100 text-orange-600 border-orange-200"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getStatusColor = (status: string) => {
    const statusMap = {
      completed: "bg-green-100 text-green-700",
      processing: "bg-blue-100 text-blue-700", 
      pending: "bg-yellow-100 text-yellow-700"
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BZ</span>
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Business Tracker</h1>
                <p className="text-xs text-gray-500">Real-time analytics</p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          {['overview', 'sales', 'customers', 'products'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                selectedTab === tab
                  ? 'text-orange-600 border-orange-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders.map((order, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{order.customer}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{order.id}</span>
                      <span>·</span>
                      <span>{order.time}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{order.amount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            <Package className="w-4 h-4" />
            New Order
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            View Report
          </button>
        </div>
      </div>
    </div>
  );
}
