"use client";

import React from 'react';
import { Zap, Shield, Cloud } from 'lucide-react';

export default function SystemTriad() {
  const systems = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance for instant results",
      color: "orange"
    },
    {
      icon: Shield,
      title: "Secure by Design",
      description: "Enterprise-grade security for your data",
      color: "blue"
    },
    {
      icon: Cloud,
      title: "Cloud Native",
      description: "Access your business from anywhere",
      color: "green"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      orange: "bg-orange-100 text-orange-600 border-orange-200",
      blue: "bg-blue-100 text-blue-600 border-blue-200",
      green: "bg-green-100 text-green-600 border-green-200"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.orange;
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Built for Modern Business
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our system architecture ensures reliability, security, and performance at scale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {systems.map((system, index) => (
            <div key={index} className="text-center group">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 transition-all duration-300 group-hover:scale-110 ${getColorClasses(system.color)}`}>
                <system.icon className="w-10 h-10" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {system.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {system.description}
              </p>
            </div>
          ))}
        </div>

        {/* Integration Points */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Seamless Integration
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "QuickBooks", "Xero", "Stripe", "PayPal",
              "Shopify", "WooCommerce", "Square", "Mailchimp"
            ].map((integration, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center border border-gray-200 hover:border-orange-300 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <div className="w-6 h-6 bg-gray-400 rounded"></div>
                </div>
                <div className="text-sm font-medium text-gray-700">{integration}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
