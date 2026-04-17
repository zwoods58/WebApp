"use client";

import React, { useEffect } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';

export default function Confirmation() {
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to login after 10 seconds
    const timer = setTimeout(() => {
      router.push('/Beezee-App/auth/login');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-1)] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={40} className="text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-[var(--text-1)] mb-4">
          Check Your Email
        </h1>
        
        <div className="space-y-4 mb-8">
          <p className="text-[var(--text-2)] text-lg">
            We've sent a confirmation email to your registered email address.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
            <ol className="space-y-2 text-blue-800 text-sm">
              <li>1. Check your email inbox</li>
              <li>2. Look for the BeeZee confirmation email</li>
              <li>3. Click the confirmation link in the email</li>
              <li>4. Return here to sign in</li>
            </ol>
          </div>
          
          <div className="text-[var(--text-3)] text-sm space-y-1">
            <p>• Didn't receive the email? Check your spam folder.</p>
            <p>• The confirmation link will expire in 24 hours.</p>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/Beezee-App/auth/login"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white py-3 px-6 rounded-xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all font-medium text-sm"
          >
            Go to Login
            <ArrowRight size={16} />
          </Link>
          
          <p className="text-[var(--text-3)] text-xs">
            You'll be redirected automatically in 10 seconds...
          </p>
        </div>
      </div>
    </div>
  );
}

