'use client';

import { useState } from 'react';

export default function StartButtonTestPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, result: any) => {
    setResults(prev => [...prev, {
      test,
      timestamp: new Date().toISOString(),
      result
    }]);
  };

  const testPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/startbutton/test-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          amount: 10000,
          currency: 'NGN'
        })
      });
      const result = await response.json();
      addResult('Payment Initialization', result);
    } catch (error) {
      addResult('Payment Initialization', { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testTransfer = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/startbutton/test-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankCode: '058',
          accountNumber: '0123456789',
          accountName: 'Test Account',
          amount: 10000,
          currency: 'NGN'
        })
      });
      const result = await response.json();
      addResult('Transfer Initialization', result);
    } catch (error) {
      addResult('Transfer Initialization', { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testBalance = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/startbutton/test-balance');
      const result = await response.json();
      addResult('Balance Check', result);
    } catch (error) {
      addResult('Balance Check', { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testFXRate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/startbutton/test-fx?from=NGN&to=GHS');
      const result = await response.json();
      addResult('FX Rate (NGN to GHS)', result);
    } catch (error) {
      addResult('FX Rate (NGN to GHS)', { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/startbutton/test-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      addResult('Authentication Methods', result);
    } catch (error) {
      addResult('Authentication Methods', { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/startbutton/test-subscriptions');
      const result = await response.json();
      addResult('Subscription Plans', result);
    } catch (error) {
      addResult('Subscription Plans', { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testSubscriptionWebhooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/startbutton/test-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-webhook' })
      });
      const result = await response.json();
      addResult('Subscription Webhooks', result);
    } catch (error) {
      addResult('Subscription Webhooks', { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testSpecificSubscription = async (planCode: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/startbutton/test-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planCode })
      });
      const result = await response.json();
      addResult(`Subscription Test (${planCode})`, result);
    } catch (error) {
      addResult(`Subscription Test (${planCode})`, { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  
  const testWebhookReceiver = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/startbutton/test-webhook-receiver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      addResult('Webhook Receiver Test', result);
    } catch (error) {
      addResult('Webhook Receiver Test', { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testStatus = async (reference: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/startbutton/test-status?reference=${reference}`);
      const result = await response.json();
      addResult(`Transaction Status (${reference})`, result);
    } catch (error) {
      addResult(`Transaction Status (${reference})`, { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">StartButton Payment System Testing</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <button
            onClick={testAuth}
            disabled={loading}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            Test Authentication
          </button>
          
          <button
            onClick={testSubscriptions}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            View Subscription Plans
          </button>
          
          <button
            onClick={testSubscriptionWebhooks}
            disabled={loading}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50"
          >
            Test Subscription Webhooks
          </button>
          
          <button
            onClick={testWebhookReceiver}
            disabled={loading}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Test Live Webhook
          </button>
          
          <button
            onClick={() => testSpecificSubscription('3b0ee2ed7602')}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Test Nigeria Plan
          </button>
          
          <button
            onClick={clearResults}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            Clear Results
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          {loading && <p className="text-blue-600 mb-4">Running test...</p>}
          
          {results.length === 0 ? (
            <p className="text-gray-500">No tests run yet. Click the buttons above to test the StartButton API.</p>
          ) : (
            <div className="space-y-4">
              {results.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{item.test}</h3>
                    <span className="text-sm text-gray-500">{item.timestamp}</span>
                  </div>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                    {JSON.stringify(item.result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">StartButton Payment System</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-orange-600">StartButton (7 Countries - Weekly Plans)</h3>
              <div className="text-sm space-y-1">
                <div><strong>Auth Test:</strong> POST /api/startbutton/test-auth</div>
                <div><strong>Subscription Plans:</strong> GET/POST /api/startbutton/test-subscriptions</div>
                <div><strong>Live Webhook Test:</strong> POST /api/startbutton/test-webhook-receiver</div>
                <div><strong>Webhook Handler:</strong> POST /api/webhook/startbutton</div>
              </div>
              
              <div className="mt-3 p-3 bg-white rounded-lg">
                <h4 className="font-semibold mb-2">StartButton Subscription Plans:</h4>
                <div className="text-xs space-y-1">
                  <div> Nigeria (3b0ee2ed7602) - 500 NGN (weekly)</div>
                  <div> South Africa (e624b74f1b92) - 30 ZAR (weekly)</div>
                  <div> Ghana (dd3d15df45a0) - 20 GHS (weekly)</div>
                  <div> Kenya (8b80dc9ecf54) - 200 KES (weekly)</div>
                  <div> Tanzania (ac0cf59c69bf) - 2000 TZS (weekly)</div>
                  <div> Uganda (97e6aede1698) - 4000 UGX (weekly)</div>
                  <div> Rwanda (f0409a10a1c7) - 1500 RWF (weekly)</div>
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-white rounded-lg">
                <h4 className="font-semibold mb-2">Production Setup:</h4>
                <div className="text-xs space-y-1">
                  <div>1. Set webhook URL in StartButton dashboard</div>
                  <div>2. Use dashboard subscription URLs for payments</div>
                  <div>3. Webhook handler processes all subscription events</div>
                  <div>4. No API keys needed - webhook-only approach</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

