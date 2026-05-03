"use client";

import React from 'react';
import { TrendingUp, Users, Package, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';

export default function GhostSummaryBar() {
  const stats = [
    {
      icon: DollarSign,
      value: "$2.8M+",
      label: "Revenue Processed",
      change: "+23%",
      trend: "up"
    },
    {
      icon: Users,
      value: "10K+",
      label: "Active Businesses",
      change: "+15%",
      trend: "up"
    },
    {
      icon: Package,
      value: "1M+",
      label: "Products Managed",
      change: "+8%",
      trend: "up"
    },
    {
      icon: TrendingUp,
      value: "98%",
      label: "Customer Satisfaction",
      change: "+2%",
      trend: "up"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-200">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Trusted by Growing Businesses Worldwide
          </h2>
          <p className="text-gray-600">
            Join thousands of entrepreneurs who are already scaling with BeeZee
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-orange-600" />
                </div>
                {stat.trend === 'up' && (
                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <ArrowUp className="w-3 h-3" />
                    {stat.change}
                  </div>
                )}
              </div>
              
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">GDPR Ready</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
