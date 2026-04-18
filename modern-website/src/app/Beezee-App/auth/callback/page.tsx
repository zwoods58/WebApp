"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import Link from 'next/link';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        setStatus('error');
        setMessage(errorDescription || 'Authentication failed');
        console.error('Auth callback error:', { error, errorDescription });
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code provided');
        return;
      }

      try {
        setStatus('loading');
        setMessage('Confirming your email...');

        // Exchange the code for a session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          setStatus('error');
          setMessage(exchangeError.message || 'Failed to confirm email');
          console.error('Code exchange error:', exchangeError);
          return;
        }

        if (data.session) {
          setStatus('success');
          setMessage('Email confirmed successfully!');
          
          // Redirect to the route page — user has a session now,
          // so the route page will detect their business data and 
          // redirect them to the correct dashboard
          setTimeout(() => {
            router.push('/Beezee-App/route');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('No session created');
        }
      } catch (err) {
        setStatus('error');
        setMessage('An unexpected error occurred');
        console.error('Callback error:', err);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-1)] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader size={32} className="text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-1)] mb-4">
              Processing...
            </h1>
            <p className="text-[var(--text-2)] text-lg">
              {message}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-1)] mb-4">
              Success!
            </h1>
            <p className="text-[var(--text-2)] text-lg mb-6">
              {message}
            </p>
            <Link
              href="/Beezee-App/auth/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white py-3 px-6 rounded-xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all font-medium text-sm"
            >
              Continue to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-1)] mb-4">
              Authentication Error
            </h1>
            <p className="text-[var(--text-2)] text-lg mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Link
                href="/Beezee-App/auth/signup"
                className="inline-block w-full bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white py-3 px-6 rounded-xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all font-medium text-sm text-center"
              >
                Try Signing Up Again
              </Link>
              <Link
                href="/Beezee-App/auth/login"
                className="inline-block w-full bg-[var(--glass-bg)] border-2 border-[var(--border)] text-[var(--text-1)] py-3 px-6 rounded-xl hover:bg-[var(--border)] hover:border-[var(--powder-mid)] transition-all font-medium text-sm text-center"
              >
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

