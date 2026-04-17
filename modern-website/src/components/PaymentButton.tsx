'use client';

import { useState } from 'react';
import { ExternalLink, Loader2, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

interface PaymentButtonProps {
  paymentLinkCode: string;
  customerEmail: string;
  customerName: string;
  countryCode: 'KE' | 'GH' | 'CI';
  amount?: number;
  currency?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export function PaymentButton({ 
  paymentLinkCode, 
  customerEmail, 
  customerName,
  countryCode,
  amount = 200,
  currency = 'KES',
  onSuccess,
  onError,
  className = ''
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'initiated' | 'checking' | 'success'>('idle');

  const getCurrencySymbol = () => {
    switch (currency) {
      case 'KES': return 'KSh';
      case 'GHS': return 'GH₵';
      case 'XOF': return 'CFA';
      default: return currency;
    }
  };

  const handleInitiatePayment = async () => {
    setLoading(true);
    setError(null);
    setStatus('initiated');
    
    // Get return URL for this page (use Ngrok URL in development)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const returnUrl = `${baseUrl}/payment/return`;
    
    try {
      // Create payment link using Kyshi API
      const response = await fetch('/api/payment/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentLinkCode,
          customerEmail,
          customerName,
          amount,
          currency,
          returnUrl
        })
      });

      const data = await response.json();
      
      if (data.success && data.paymentUrl) {
        setPaymentUrl(data.paymentUrl);
        setReference(data.reference);
        setStatus('initiated');
        // Open payment URL in new window
        window.open(data.paymentUrl, '_blank', 'noopener,noreferrer');
        onSuccess?.();
      } else {
        throw new Error(data.error || 'Failed to initiate payment');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error. Please try again.';
      setError(errorMessage);
      setStatus('idle');
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!reference) return;
    
    setStatus('checking');
    
    try {
      const response = await fetch(`/api/payment/status?reference=${reference}`);
      const data = await response.json();
      
      if (data.paid || data.status === 'success') {
        setStatus('success');
        onSuccess?.();
      } else if (data.status === 'failed' || data.status === 'error') {
        setError('Payment failed. Please try again.');
        setStatus('idle');
      }
    } catch (err) {
      setError('Failed to check payment status. Please try again.');
    }
  };

  const handleRetry = () => {
    setPaymentUrl(null);
    setReference(null);
    setError(null);
    setStatus('idle');
  };

  const handleOpenPayment = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (status === 'success') {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 text-center ${className}`}>
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2 text-green-700">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">
          Your payment has been confirmed and your subscription is now active.
        </p>
        {reference && (
          <p className="text-xs text-gray-500">
            Reference: {reference}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 text-center ${className}`}>
      <h3 className="text-xl font-bold mb-2">Complete Your Payment</h3>
      <p className="text-2xl font-bold text-blue-600 mb-4">
        {getCurrencySymbol()} {amount.toLocaleString()}
      </p>
      
      {!paymentUrl && !error && status === 'idle' && (
        <button
          onClick={handleInitiatePayment}
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Initializing...
            </>
          ) : (
            <>
              <ExternalLink className="w-5 h-5" />
              Pay with Mobile Money
            </>
          )}
        </button>
      )}
      
      {paymentUrl && status === 'checking' && (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Payment window opened!</span>
          </div>
          
          <p className="text-sm text-gray-600">
            Complete payment in the new tab, then click below to verify:
          </p>
          
          <div className="space-y-2">
            <button
              onClick={handleCheckStatus}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              I've Completed Payment
            </button>
            
            <button
              onClick={handleOpenPayment}
              className="w-full text-blue-500 underline text-sm hover:text-blue-600 transition-colors"
            >
              Re-open Payment Page
            </button>
          </div>
          
          {reference && (
            <p className="text-xs text-gray-500 mt-4">
              Reference: {reference}
            </p>
          )}
        </div>
      )}
      
      {error && (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
          
          <div className="space-y-2">
            {paymentUrl && (
              <button
                onClick={handleOpenPayment}
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open Payment Link
              </button>
            )}
            
            <button
              onClick={handleRetry}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Try Again
            </button>
          </div>
          
          {reference && (
            <p className="text-xs text-gray-500">
              Reference: {reference}
            </p>
          )}
        </div>
      )}
      
      {loading && (
        <div className="mt-4 text-sm text-gray-500">
          Processing payment...
        </div>
      )}
      
      {/* Payment Method Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Payment methods accepted:</p>
        <div className="flex justify-center gap-2 text-xs">
          {countryCode === 'KE' && (
            <>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">M-Pesa</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Airtel Money</span>
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">TKash</span>
            </>
          )}
          {countryCode === 'GH' && (
            <>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">MTN MoMo</span>
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">AirtelTigo Money</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Vodafone Cash</span>
            </>
          )}
          {countryCode === 'CI' && (
            <>
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">Orange Money</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">MTN Money</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Moov Money</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

