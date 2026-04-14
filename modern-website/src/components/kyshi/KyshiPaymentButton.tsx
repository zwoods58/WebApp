'use client';

import { useState } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';

interface KyshiPaymentButtonProps {
  paymentLinkCode: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  countryCode: string;
  redirectUrl?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function KyshiPaymentButton({
  paymentLinkCode,
  customerEmail,
  customerFirstName,
  customerLastName,
  countryCode,
  redirectUrl,
  onSuccess,
  onError,
  className,
  children
}: KyshiPaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleKyshiPopup = async () => {
    setLoading(true);
    
    try {
      console.log('=== KYSHI POPUP PAYMENT START ===');
      
      // 1. Fetch the authorizationUrl from backend
      const response = await fetch('/api/kyshi/payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentLinkCode,
          customerEmail,
          customerFirstName,
          customerLastName,
          countryCode,
          redirectUrl: redirectUrl || `https://atarwebb.com/payment/return` // Use provided or fallback
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Payment link response:', data);

      if (!data.authorizationUrl || !data.reference) {
        throw new Error('Invalid response from payment API');
      }

      // 2. Open the Kyshi/Paystack URL in a popup
      const popup = window.open(
        data.authorizationUrl, 
        'KyshiPayment', 
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup was blocked. Please allow popups and try again.');
      }

      // 3. Poll for popup closure
      let checkCount = 0;
      const maxChecks = 60; // Max 1 minute wait

      const timer = setInterval(async () => {
        checkCount++;
        
        try {
          if (popup.closed) {
            clearInterval(timer);
            console.log('Popup closed, checking payment status...');
            
            // 4. THE CALLBACK: User closed the payment tab, now check the status
            await checkPaymentStatus(data.reference);
          } else if (checkCount >= maxChecks) {
            clearInterval(timer);
            popup.close();
            setLoading(false);
            onError?.('Payment verification timeout. Please check your transaction history.');
          }
        } catch (error) {
          console.error('Error during popup polling:', error);
          clearInterval(timer);
          popup.close();
          setLoading(false);
          onError?.('An error occurred during payment verification.');
        }
      }, 1000);

    } catch (error) {
      console.error('Kyshi payment error:', error);
      setLoading(false);
      onError?.(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  const checkPaymentStatus = async (reference: string) => {
    try {
      console.log('Checking payment status for reference:', reference);
      
      const statusResponse = await fetch(`/api/payment/status?reference=${reference}`);
      const statusData = await statusResponse.json();
      
      console.log('Payment status result:', statusData);
      
      if (statusData.paid || statusData.status === 'success') {
        console.log('Payment successful!');
        onSuccess?.();
      } else {
        console.log('Payment not confirmed:', statusData);
        onError?.('Payment not confirmed. Please check your transaction history or try again.');
      }
    } catch (error) {
      console.error('Status check failed:', error);
      onError?.('Failed to verify payment status. Please contact support if you believe this is an error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleKyshiPopup}
      disabled={loading}
      className={className}
      style={{
        backgroundColor: loading ? '#9ca3af' : '#3b82f6',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'background-color 0.2s'
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.backgroundColor = '#2563eb';
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          e.currentTarget.style.backgroundColor = '#3b82f6';
        }
      }}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing Payment...
        </>
      ) : (
        <>
          <ExternalLink className="w-4 h-4 mr-2" />
          {children || 'Pay with Kyshi'}
        </>
      )}
    </button>
  );
}

