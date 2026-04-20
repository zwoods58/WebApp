'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function SubscriptionCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'pending' | 'failed'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const reference = searchParams.get('reference');
    const sub_id = searchParams.get('sub_id');

    if (!reference) {
      setStatus('failed');
      setMessage('Missing payment reference');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/subscription/verify?reference=${reference}&sub_id=${sub_id}`);
        const data = await response.json();

        if (data.status === 'success') {
          setStatus('success');
          setMessage('Your subscription is now active.');
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else if (data.status === 'pending') {
          setStatus('pending');
          setMessage('We will email you when your payment clears.');
          setTimeout(() => {
            router.push('/dashboard');
          }, 5000);
        } else {
          setStatus('failed');
          setMessage('Your payment was not completed. Please try again.');
          setTimeout(() => {
            router.push('/subscribe');
          }, 4000);
        }
      } catch (error) {
        setStatus('failed');
        setMessage('Unable to verify payment. Please try again.');
        setTimeout(() => {
          router.push('/subscribe');
        }, 4000);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-[var(--text-1)] mb-2">Verifying your payment...</h1>
          <p className="text-[var(--text-2)]">Please wait while we confirm your transaction.</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Confirmed!</h1>
          <p className="text-[var(--text-1)] mb-4">{message}</p>
          <p className="text-sm text-[var(--text-2)]">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏰</div>
          <h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">Payment Processing</h1>
          <p className="text-[var(--text-2)] mb-4">{message}</p>
          <p className="text-sm text-[var(--text-2)]">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Not Completed</h1>
          <p className="text-[var(--text-2)] mb-4">{message}</p>
          <p className="text-sm text-[var(--text-2)]">Redirecting to subscribe page...</p>
        </div>
      </div>
    );
  }

  return null;
}

export default function SubscriptionCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    }>
      <SubscriptionCallbackContent />
    </Suspense>
  );
}

