"use client";

import React from 'react';
import { Smartphone, Cloud, Shield, Zap, Globe, Clock } from 'lucide-react';

export default function CapabilitiesBar() {
  const capabilities = [
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Optimized for smartphones and tablets"
    },
    {
      icon: Cloud,
      title: "Cloud Sync",
      description: "Real-time data synchronization"
    },
    {
      icon: Shield,
      title: "Secure",
      description: "Bank-level security for your data"
    },
    {
      icon: Zap,
      title: "Fast",
      description: "Lightning-fast performance"
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Available in 20+ languages"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer service"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {capabilities.map((capability, index) => (
            <div key={index} className="text-center group">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-500/30 transition-colors">
                <capability.icon className="w-6 h-6 text-orange-400" />
              </div>
              <h4 className="font-semibold text-white mb-1">{capability.title}</h4>
              <p className="text-xs text-gray-400">{capability.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
