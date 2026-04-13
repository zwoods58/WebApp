'use client';

import React, { useState } from 'react';
import KyshiPaymentButton from '@/components/kyshi/KyshiPaymentButton';
import { KenyaSubscriptionModalPopup } from '@/components/subscription/KenyaSubscriptionModalPopup';

export default function KyshiPopupExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePaymentSuccess = () => {
    console.log('Payment successful!');
    // Redirect or update UI
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Kyshi Popup Payment Examples</h1>
      
      {/* Example 1: Direct Payment Button */}
      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Example 1: Direct Payment Button</h2>
        <p className="text-gray-600 mb-4">
          Simple payment button that opens popup directly
        </p>
        <KyshiPaymentButton
          paymentLinkCode="KE_WEEKLY_SUBSCRIPTION"
          customerEmail="test@example.com"
          customerFirstName="John"
          customerLastName="Doe"
          countryCode="KE"
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        >
          Pay KES 200
        </KyshiPaymentButton>
      </div>

      {/* Example 2: Modal with Payment Form */}
      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Example 2: Modal Payment Flow</h2>
        <p className="text-gray-600 mb-4">
          Modal that collects user info before payment
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Open Payment Modal
        </button>
      </div>

      {/* Payment Modal */}
      <KenyaSubscriptionModalPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      {/* Usage Instructions */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">How the Popup Flow Works:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>User clicks payment button</li>
          <li>Frontend calls `/api/kyshi/payment-link` to get authorization URL</li>
          <li>Popup opens with Kyshi/Paystack payment page</li>
          <li>User completes payment in popup</li>
          <li>Popup closes (automatically or manually)</li>
          <li>Frontend detects popup closure and calls `/api/payment/status?reference=xxx`</li>
          <li>Backend checks payment status with Kyshi API</li>
          <li>Success/error callbacks are triggered</li>
        </ol>
      </div>
    </div>
  );
}
