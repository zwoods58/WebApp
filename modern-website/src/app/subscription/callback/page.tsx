'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

function SubscriptionCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  // Remove old handlePaymentSuccess and handlePaymentFailed
  useEffect(() => {
    if (!isClient) return;
    
    const reference = searchParams.get('reference');
    const paymentStatus = searchParams.get('status');
    const userEmail = searchParams.get('user_email') || undefined;
    const country = searchParams.get('country') || undefined;

    const verifyTransaction = async () => {
      if (!reference) {
        setStatus('failed');
        setMessage('Missing transaction reference. Please contact support.');
        return;
      }

      try {
        console.log(`Verifying transaction: ${reference}`);
        const response = await fetch('/api/subscription/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference, user_email: userEmail, country }),
        });

        const result = await response.json();

        if (result.success) {
          setStatus('success');
          setMessage('Payment successful! Your subscription is now active.');
          if (result.subscriptionId) setSubscriptionId(result.subscriptionId);
          
          handleRedirect(reference, 'success');
        } else {
          // If the status is pending, we can either poll or show pending
          if (result.kyshiStatus === 'pending') {
            setStatus('loading');
            setMessage('Payment is still processing. Please wait...');
            // Check again after 5 seconds
            setTimeout(verifyTransaction, 5000);
          } else {
            console.error('Payment verified as failed/cancelled', result);
            setStatus('failed');
            setMessage(`Payment wasn't successful. Status: ${result.kyshiStatus || 'failed'}`);
            handleRedirect(reference, 'failed');
          }
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('failed');
        setMessage('Error verifying payment. Please contact support.');
      }
    };

    if (reference) {
       verifyTransaction();
    } else {
      setTimeout(() => {
        setStatus('failed');
        setMessage('No payment status received. Please contact support.');
      }, 5000);
    }
  }, [searchParams, isClient]);

  const handleRedirect = (reference: string, type: 'success' | 'failed') => {
    setTimeout(() => {
      // Try deep link redirect first
      const deepLinkUrl = type === 'success' 
        ? `yourapp://subscription/success?reference=${reference}`
        : `yourapp://subscription/failed?reference=${reference}`;
      window.location.href = deepLinkUrl;
      
      // Fallback to regular redirect
      setTimeout(() => {
        router.push('/Beezee-App/app/ke/retail/more');
      }, 1000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-xl">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
            <div className="mt-4">
              <div className="animate-pulse flex space-x-2 justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            {subscriptionId && (
              <p className="text-sm text-gray-500 mb-4">Subscription ID: {subscriptionId}</p>
            )}
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800 font-medium mb-2">What happens next?</p>
              <ul className="text-sm text-green-700 text-left space-y-1">
                <li>Weekly subscription activated</li>
                <li>Access granted to premium features</li>
                <li>Next charge in 7 days</li>
                <li>Cancel anytime from settings</li>
              </ul>
            </div>
            <p className="text-sm text-gray-500">Redirecting back to app...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => router.push('/Beezee-App/app/ke/retail/more')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function SubscriptionCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SubscriptionCallbackContent />
    </Suspense>
  );
}

