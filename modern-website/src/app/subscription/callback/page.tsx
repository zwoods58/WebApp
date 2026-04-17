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

  useEffect(() => {
    if (!isClient) return;
    
    const reference = searchParams.get('reference');
    const paymentStatus = searchParams.get('status');
    const userEmail = searchParams.get('user_email') || undefined;
    const country = searchParams.get('country') || undefined;

    if (paymentStatus === 'success' && reference) {
      handlePaymentSuccess(reference, userEmail, country);
    } else if (paymentStatus === 'failed') {
      handlePaymentFailed(reference || undefined);
    } else {
      // Default to loading if no status
      setTimeout(() => {
        setStatus('failed');
        setMessage('No payment status received. Please contact support.');
      }, 5000);
    }
  }, [searchParams, isClient]);

  const handlePaymentSuccess = async (reference: string, userEmail?: string, country?: string) => {
    try {
      console.log('Payment successful:', { reference, userEmail, country });

      // Update subscription status in database
      if (userEmail && country) {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_email', userEmail)
          .eq('country', country)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (subscription) {
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: 'active',
              is_active: true,
              last_charge_date: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', subscription.id);

          if (error) {
            console.error('Error updating subscription:', error);
          } else {
            setSubscriptionId(subscription.id);
          }
        }
      }

      setStatus('success');
      setMessage('Payment successful! Your subscription is now active.');
      
      // Redirect back to app after 3 seconds
      setTimeout(() => {
        // Try deep link redirect first
        const deepLinkUrl = `yourapp://subscription/success?reference=${reference}`;
        window.location.href = deepLinkUrl;
        
        // Fallback to regular redirect
        setTimeout(() => {
          router.push('/Beezee-App/app/ke/retail/more');
        }, 1000);
      }, 3000);
    } catch (error) {
      console.error('Error handling payment success:', error);
      setStatus('failed');
      setMessage('Error processing payment. Please contact support.');
    }
  };

  const handlePaymentFailed = (reference?: string) => {
    setStatus('failed');
    setMessage('Payment failed. Please try again.');
    
    // Redirect back to app after 3 seconds
    setTimeout(() => {
      const deepLinkUrl = reference 
        ? `yourapp://subscription/failed?reference=${reference}`
        : 'yourapp://subscription/failed';
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

