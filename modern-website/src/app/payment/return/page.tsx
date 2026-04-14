'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, ExternalLink, RefreshCw } from 'lucide-react';

export default function PaymentReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('reference');
  const status = searchParams.get('status');
  const [paymentStatus, setPaymentStatus] = useState<'checking' | 'success' | 'failed' | 'timeout'>('checking');
  const [checkingCount, setCheckingCount] = useState(0);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);

  useEffect(() => {
    if (!reference) {
      setPaymentStatus('failed');
      return;
    }

    // If Kyshi passed status in URL, use it immediately
    if (status === 'success') {
      setPaymentStatus('success');
      setTimeout(() => router.push('/Beezee-App/dashboard'), 2000);
      return;
    }

    // Poll our API to confirm payment status
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/payment/status?reference=${reference}`);
        const data = await res.json();
        
        console.log('Payment status check result:', data);
        setTransactionDetails(data);
        
        if (data.paid || data.status === 'success') {
          setPaymentStatus('success');
          setTimeout(() => router.push('/Beezee-App/dashboard'), 3000);
        } else if (data.status === 'failed' || data.status === 'error') {
          setPaymentStatus('failed');
        } else if (checkingCount >= 10) { // Stop after 10 checks (30 seconds)
          setPaymentStatus('timeout');
        } else {
          setCheckingCount(prev => prev + 1);
        }
      } catch (err) {
        console.error('Status check failed:', err);
        if (checkingCount >= 10) {
          setPaymentStatus('timeout');
        } else {
          setCheckingCount(prev => prev + 1);
        }
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    
    // Clean up after 30 seconds maximum
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (paymentStatus === 'checking') {
        setPaymentStatus('timeout');
      }
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [reference, status, router, checkingCount, paymentStatus]);

  const handleRetryCheck = () => {
    setCheckingCount(0);
    setPaymentStatus('checking');
  };

  const handleContactSupport = () => {
    router.push('/Beezee-App/support');
  };

  const handleReturnToApp = () => {
    router.push('/Beezee-App/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {paymentStatus === 'checking' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
            <p className="text-gray-600 mb-4">
              Please wait while we confirm your transaction...
            </p>
            <p className="text-sm text-gray-500">
              Check {checkingCount}/10 • Reference: {reference?.substring(0, 12)}...
            </p>
            {transactionDetails && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-left">
                <p className="font-medium">Transaction Details:</p>
                <p>Status: {transactionDetails.status}</p>
                <p>Amount: {transactionDetails.amount} {transactionDetails.currency}</p>
                <p>Source: {transactionDetails.source}</p>
              </div>
            )}
          </>
        )}
        
        {paymentStatus === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your transaction has been completed successfully.
            </p>
            {transactionDetails && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg text-sm">
                <p className="font-medium text-green-800">Payment Confirmed</p>
                <p className="text-green-700">
                  Amount: {transactionDetails.amount} {transactionDetails.currency}
                </p>
                <p className="text-green-700">
                  Reference: {reference}
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500 mb-6">
              Redirecting to dashboard...
            </p>
            <button
              onClick={handleReturnToApp}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Go to Dashboard Now
            </button>
          </>
        )}
        
        {paymentStatus === 'failed' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              We couldn't confirm your payment. This could be due to:
            </p>
            <ul className="text-left text-sm text-gray-600 mb-6 space-y-1">
              <li>• Payment is still processing</li>
              <li>• Payment was cancelled or declined</li>
              <li>• Network connectivity issues</li>
            </ul>
            {transactionDetails && (
              <div className="mb-6 p-3 bg-red-50 rounded-lg text-sm">
                <p className="font-medium text-red-800">Transaction Details:</p>
                <p className="text-red-700">Status: {transactionDetails.status}</p>
                <p className="text-red-700">Reference: {reference}</p>
                {transactionDetails.error && (
                  <p className="text-red-700">Error: {transactionDetails.error}</p>
                )}
              </div>
            )}
            <div className="space-y-3">
              <button
                onClick={handleRetryCheck}
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Check Again
              </button>
              <button
                onClick={handleContactSupport}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </>
        )}
        
        {paymentStatus === 'timeout' && (
          <>
            <XCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Verification Timeout</h2>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment within the expected time. This doesn't necessarily mean the payment failed.
            </p>
            {transactionDetails && (
              <div className="mb-6 p-3 bg-yellow-50 rounded-lg text-sm">
                <p className="font-medium text-yellow-800">Last Known Status:</p>
                <p className="text-yellow-700">Status: {transactionDetails.status}</p>
                <p className="text-yellow-700">Reference: {reference}</p>
              </div>
            )}
            <div className="space-y-3">
              <button
                onClick={handleRetryCheck}
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Try Again
              </button>
              <button
                onClick={handleReturnToApp}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Return to App
              </button>
              <button
                onClick={handleContactSupport}
                className="w-full text-blue-500 underline text-sm"
              >
                Need Help? Contact Support
              </button>
            </div>
          </>
        )}
        
        {/* Always show reference at the bottom */}
        {reference && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Transaction Reference: {reference}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Keep this reference for your records
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
