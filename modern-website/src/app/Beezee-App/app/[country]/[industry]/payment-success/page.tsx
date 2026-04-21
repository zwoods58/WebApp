"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { business } = useSupabaseAuth();
  
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  
  const [isRedirecting, setIsRedirecting] = useState(true);
  const [message, setMessage] = useState('Processing payment success...');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('Payment successful! Redirecting to your dashboard...');
      
      // Redirect to the more page after 2 seconds
      setTimeout(() => {
        router.push(`/Beezee-App/app/${country.toLowerCase()}/${industry}/more`);
      }, 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [router, country, industry]);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in">
          <CheckCircle size={40} className="text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">
          Payment Successful!
        </h1>
        
        <p className="text-[var(--text-2)] mb-8">
          {message}
        </p>

        {/* Loading Indicator */}
        {isRedirecting && (
          <div className="flex items-center justify-center gap-2 text-[var(--text-3)]">
            <Loader2 size={20} className="animate-spin" />
            <span>Redirecting...</span>
          </div>
        )}

        {/* Manual Redirect Button (fallback) */}
        <button
          onClick={() => router.push(`/Beezee-App/app/${country.toLowerCase()}/${industry}/more`)}
          className="mt-6 px-6 py-2 bg-[var(--powder-dark)] text-white rounded-lg font-medium hover:bg-[var(--powder-darker)] transition-colors"
        >
          Go to Dashboard
        </button>

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-left">
            <p><strong>Debug Info:</strong></p>
            <p>Country: {country}</p>
            <p>Industry: {industry}</p>
            <p>Business: {business?.business_name}</p>
            <p>Search Params: {searchParams.toString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
