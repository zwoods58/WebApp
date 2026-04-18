"use client";

import React, { useEffect, useState, Suspense } from 'react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { QueryProvider } from "@/providers/QueryProvider";
import { Loader2, CheckCircle } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

// Industry configurations
const industryConfigs: Record<string, { name: string; pillars: string[]; color: string }> = {
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
const countryConfigs: Record<string, { name: string; flag: string; currency: string }> = {
  ke: { name: 'Kenya', flag: '🇰🇪', currency: 'KES' },
  za: { name: 'South Africa', flag: '🇿🇦', currency: 'ZAR' },
  ng: { name: 'Nigeria', flag: '🇳🇬', currency: 'NGN' },
  gh: { name: 'Ghana', flag: '🇬🇭', currency: 'GHS' },
  ug: { name: 'Uganda', flag: '🇺🇬', currency: 'UGX' },
  rw: { name: 'Rwanda', flag: '🇷🇼', currency: 'RWF' },
  tz: { name: 'Tanzania', flag: '🇹🇿', currency: 'TZS' },
  ci: { name: "Cote d'Ivoire", flag: '🇨🇮', currency: 'XOF' }
};

// Helper function to detect standalone mode and navigate accordingly
function navigatePWAAware(path: string, router: any) {
  const isStandalone = typeof window !== 'undefined' && 
                       window.matchMedia('(display-mode: standalone)').matches;
  
  if (isStandalone) {
    console.log('[Route] Standalone mode detected, using window.location.href');
    window.location.href = path;
  } else {
    console.log('[Route] Browser mode detected, using router.push');
    router.push(path);
  }
}

function RoutePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, business, loading: authLoading } = useSupabaseAuth();
  const [isRouting, setIsRouting] = useState(true);
  const [country, setCountry] = useState('');
  const [industry, setIndustry] = useState('');
  const [destination, setDestination] = useState<'dashboard' | 'login' | null>(null);

  useEffect(() => {
    // Wait for auth to finish loading before making routing decisions
    if (authLoading) return;

    // --- Priority 1: Authenticated user with business data from Supabase ---
    if (isAuthenticated && business) {
      const userCountry = business.country.toLowerCase();
      const userIndustry = business.industry.toLowerCase();
      
      console.log('[Route] Authenticated user detected:', { country: userCountry, industry: userIndustry });
      
      setCountry(userCountry);
      setIndustry(userIndustry);
      setDestination('dashboard');

      // Store for future use
      localStorage.setItem('beezee_user_data', JSON.stringify({
        country: userCountry,
        industry: userIndustry,
        businessName: business.business_name,
        firstName: business.first_name,
      }));

      // Show the setup animation, then redirect to dashboard
      setTimeout(() => {
        setIsRouting(false);
        setTimeout(() => {
          navigatePWAAware(`/Beezee-App/app/${userCountry}/${userIndustry}`, router);
        }, 800);
      }, 2000);
      return;
    }

    // --- Priority 2: localStorage data (post-signup, not yet confirmed) ---
    const userData = typeof window !== 'undefined' ? localStorage.getItem('beezee_user_data') : null;
    
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const userCountry = (parsed.country || '').toLowerCase();
        const userIndustry = (parsed.industry || '').toLowerCase();
        
        console.log('[Route] localStorage user data found:', { country: userCountry, industry: userIndustry });
        
        setCountry(userCountry);
        setIndustry(userIndustry);

        if (isAuthenticated) {
          // Authenticated but no business data yet (edge case) — go to dashboard
          setDestination('dashboard');
          setTimeout(() => {
            setIsRouting(false);
            setTimeout(() => {
              navigatePWAAware(`/Beezee-App/app/${userCountry}/${userIndustry}`, router);
            }, 800);
          }, 2000);
        } else {
          // Not authenticated (just signed up, needs email confirmation)
          setDestination('login');
          setTimeout(() => {
            setIsRouting(false);
            setTimeout(() => {
              navigatePWAAware('/Beezee-App/auth/login', router);
            }, 800);
          }, 2500);
        }
        return;
      } catch (e) {
        console.error('[Route] Failed to parse localStorage data:', e);
      }
    }

    // --- Priority 3: URL params (fallback) ---
    const countryParam = searchParams.get('country');
    const industryParam = searchParams.get('industry');

    if (countryParam && industryParam) {
      const userCountry = countryParam.toLowerCase();
      const userIndustry = industryParam.toLowerCase();
      
      console.log('[Route] URL params found:', { country: userCountry, industry: userIndustry });
      
      setCountry(userCountry);
      setIndustry(userIndustry);
      setDestination(isAuthenticated ? 'dashboard' : 'login');

      setTimeout(() => {
        setIsRouting(false);
        setTimeout(() => {
          if (isAuthenticated) {
            navigatePWAAware(`/Beezee-App/app/${userCountry}/${userIndustry}`, router);
          } else {
            navigatePWAAware('/Beezee-App/auth/login', router);
          }
        }, 800);
      }, 2000);
      return;
    }

    // --- Priority 4: No data at all — redirect to get-started ---
    console.log('[Route] No routing data found, redirecting to get-started');
    navigatePWAAware('/Beezee-App/auth/get-started', router);
  }, [router, searchParams, isAuthenticated, business, authLoading]);

  const countryConfig = countryConfigs[country];
  const industryConfig = industryConfigs[industry];

  // Loading state while auth initializes
  if (authLoading || (!countryConfig && !industryConfig)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-900">Loading...</p>
        </div>
      </div>
    );
  }

  if (!countryConfig || !industryConfig) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-900">Preparing your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="opacity-100 transition-opacity duration-500 max-w-sm w-full">
        <div className="mb-8 text-center">
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
                <div 
                  key={index}
                  className="flex items-center gap-3 opacity-100 transition-opacity duration-500"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
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
              <span className="text-gray-600">
                {destination === 'login' 
                  ? 'Almost there! Please confirm your email...' 
                  : 'Preparing your dashboard...'}
              </span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-900">
                {destination === 'login' 
                  ? 'Ready! Taking you to sign in...' 
                  : 'Ready! Redirecting to dashboard...'}
              </span>
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
