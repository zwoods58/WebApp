"use client";

import React, { useEffect, useState, Suspense } from 'react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { QueryProvider } from "@/providers/QueryProvider";
import { Loader2, CheckCircle } from 'lucide-react';

// Industry configurations
const industryConfigs = {
  retail: {
    name: 'Retail',
    pillars: ['Sales', 'Stock Purchases', 'Customer Credit', 'Products on Shelf', 'Profit & Top Items'],
    color: '#3B82F6'
  },
  food: {
    name: 'Food',
    pillars: ['Orders', 'Ingredients & Gas', 'Credit Customers', 'Ingredients', 'Popular Dishes & Waste'],
    color: '#F59E0B'
  },
  transport: {
    name: 'Transport',
    pillars: ['Trip Fares', 'Fuel & Maintenance', 'Passenger Credit', 'Fuel in Tank', 'Daily Earnings & Efficiency'],
    color: '#10B981'
  },
  salon: {
    name: 'Salon',
    pillars: ['Services', 'Products & Supplies', 'Client Credit', 'Products & Materials', 'Revenue by Service & Busy Times'],
    color: '#EC4899'
  },
  tailor: {
    name: 'Tailor',
    pillars: ['Job Payments', 'Fabric & Thread', 'Client Deposits', 'Fabric & Notions', 'Jobs Completed & Profit per Job'],
    color: '#8B5CF6'
  },
  repairs: {
    name: 'Repairs',
    pillars: ['Repair Fees', 'Parts & Tools', 'Customer Credit', 'Parts Inventory', 'Common Repairs & Warranty'],
    color: '#F97316'
  },
  freelance: {
    name: 'Freelance',
    pillars: ['Project Payments', 'Software & Equipment', 'Client Invoices', 'Digital Assets', 'Income by Client & Profitability'],
    color: '#06B6D4'
  }
};

// Country configurations
const countryConfigs = {
  ke: { name: 'Kenya', flag: '🇰🇪', currency: 'KES' },
  za: { name: 'South Africa', flag: '🇿🇦', currency: 'ZAR' },
  ng: { name: 'Nigeria', flag: '🇳🇬', currency: 'NGN' },
  gh: { name: 'Ghana', flag: '🇬🇭', currency: 'GHS' },
  ug: { name: 'Uganda', flag: '🇺🇬', currency: 'UGX' },
  rw: { name: 'Rwanda', flag: '🇷🇼', currency: 'RWF' },
  tz: { name: 'Tanzania', flag: '🇹🇿', currency: 'TZS' }
};

function RoutePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRouting, setIsRouting] = useState(true);
  const [country, setCountry] = useState('');
  const [industry, setIndustry] = useState('');

  useEffect(() => {
    // Get user data from localStorage or URL params
    const userData = typeof window !== 'undefined' ? localStorage.getItem('beezee_user_data') : null;
    const countryParam = searchParams.get('country');
    const industryParam = searchParams.get('industry');

    if (userData) {
      const parsed = JSON.parse(userData);
      setCountry(parsed.country);
      setIndustry(parsed.industry);
      
      // Route to the appropriate dashboard after a short delay
      setTimeout(() => {
        setIsRouting(false);
        router.push(`/Beezee-App/app/${parsed.country.toLowerCase()}/${parsed.industry.toLowerCase()}`);
      }, 2000);
    } else if (countryParam && industryParam) {
      setCountry(countryParam);
      setIndustry(industryParam);
      
      setTimeout(() => {
        setIsRouting(false);
        router.push(`/Beezee-App/app/${countryParam.toLowerCase()}/${industryParam.toLowerCase()}`);
      }, 2000);
    } else {
      // No data found, redirect to signup
      router.push('/beezee/auth/signup');
    }
  }, [router, searchParams]);

  const countryConfig = countryConfigs[country.toLowerCase() as keyof typeof countryConfigs];
  const industryConfig = industryConfigs[industry.toLowerCase() as keyof typeof industryConfigs];

  if (!countryConfig || !industryConfig) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-900">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="opacity-100 transition-opacity duration-500">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
               style={{ backgroundColor: `${industryConfig.color}20` }}>
            <span className="text-4xl">{countryConfig.flag}</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Setting up your {industryConfig.name} dashboard
          </h1>
          <p className="text-gray-600 mb-6">
            {countryConfig.name} · {countryConfig.currency}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Your 5 Business Pillars:</h3>
            <div className="space-y-2">
              {industryConfig.pillars.map((pillar, index) => (
                <div className="opacity-100 transition-opacity duration-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-900">{pillar}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          {isRouting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-gray-600">Preparing your dashboard...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-900">Ready! Redirecting...</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RoutePage() {
  return (
    <QueryProvider>
      <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-900">Loading...</p>
        </div>
      </div>
    }>
      <RoutePageContent />
    </Suspense>
    </QueryProvider>
  );
}

