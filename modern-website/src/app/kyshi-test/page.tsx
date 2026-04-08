'use client';

import React, { useState } from 'react';

interface TestResult {
  test: string;
  result: any;
  timestamp: string;
}

export default function KyshiTestPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const addResult = (test: string, result: any) => {
    setResults(prev => [...prev, { test, result, timestamp: new Date().toLocaleString() }]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testKyshiWebhooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/kyshi/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-webhook' })
      });
      const result = await response.json();
      addResult('Kyshi Webhook Tests', result);
    } catch (error) {
      addResult('Kyshi Webhook Tests', { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testKyshiLiveWebhook = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/webhook/kyshi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'subscription.created',
          data: {
            subscription: {
              id: `sub_test_${Date.now()}_plan_ke_weekly`,
              customer: {
                id: `cust_${Date.now()}`,
                email: 'test.kyshi@example.com',
                currencyCode: 'KES'
              },
              plan: {
                id: 'plan_ke_weekly',
                name: 'Kenya Weekly Plan',
                amount: 200,
                currency: 'KES',
                interval: 'weekly',
                code: 'KE_WEEKLY_200'
              },
              startDate: new Date().toISOString(),
              nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              isActive: true,
              reference: `kyshi_ref_${Date.now()}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }
        })
      });
      const result = await response.json();
      addResult('Kyshi Live Webhook', result);
    } catch (error) {
      addResult('Kyshi Live Webhook', { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testGhanaPlan = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/kyshi/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'plan_gh_weekly', eventType: 'subscription.created' })
      });
      const result = await response.json();
      addResult('Ghana Plan Test', result);
    } catch (error) {
      addResult('Ghana Plan Test', { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testNigeriaPlan = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/kyshi/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'plan_ng_weekly', eventType: 'subscription.created' })
      });
      const result = await response.json();
      addResult('Nigeria Plan Test', result);
    } catch (error) {
      addResult('Nigeria Plan Test', { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Kyshi Payment System Testing</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <button
            onClick={testKyshiWebhooks}
            disabled={loading}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 disabled:opacity-50"
          >
            Test Kyshi Webhooks
          </button>
          
          <button
            onClick={testKyshiLiveWebhook}
            disabled={loading}
            className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 disabled:opacity-50"
          >
            Test Live Webhook
          </button>
          
          <button
            onClick={testGhanaPlan}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Test Ghana Plan
          </button>
          
          <button
            onClick={testNigeriaPlan}
            disabled={loading}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50"
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
            <p className="text-gray-500">No tests run yet. Click a button above to start testing.</p>
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

        <div className="mt-8 bg-teal-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Kyshi Payment System</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-teal-600">Kyshi Webhook Endpoints</h3>
              <div className="text-sm space-y-1">
                <div><strong>Webhook Tests:</strong> POST /api/kyshi/test-webhook</div>
                <div><strong>Live Webhook Test:</strong> POST /api/webhook/kyshi</div>
                <div><strong>Webhook Handler:</strong> POST /api/webhook/kyshi</div>
              </div>
              
              <div className="mt-3 p-3 bg-white rounded-lg">
                <h4 className="font-semibold mb-2">Kyshi Subscription Plans:</h4>
                <div className="text-xs space-y-1">
                  <div> Kenya Weekly (plan_ke_weekly) - 200 KES (weekly)</div>
                  <div> Ghana Weekly (plan_gh_weekly) - 20 GHS (weekly)</div>
                  <div> Nigeria Weekly (plan_ng_weekly) - 500 NGN (weekly)</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-teal-600">Production Setup</h3>
              <div className="text-sm space-y-2">
                <div><strong>Webhook URL:</strong> https://yourdomain.com/api/webhook/kyshi</div>
                <div><strong>Method:</strong> Webhook-only (no API keys needed)</div>
                <div><strong>Countries:</strong> Kenya, Ghana, Nigeria</div>
                <div><strong>Frequency:</strong> Weekly for all plans</div>
              </div>
              
              <div className="mt-3 p-3 bg-white rounded-lg">
                <h4 className="font-semibold mb-2">Next Steps:</h4>
                <div className="text-xs space-y-1">
                  <div>1. Set webhook URL in Kyshi dashboard</div>
                  <div>2. Test with real subscription payments</div>
                  <div>3. Implement database integration</div>
                  <div>4. Deploy to production domain</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
