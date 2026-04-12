'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase client (uses anon key – safe for client)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
interface Plan {
  id: string;
  country_code: string;
  name: string;
  amount: number;
  currency: string;
  interval: string;
  kyshi_plan_code: string;
  is_active: boolean;
}

interface Subscription {
  id: string;
  customer_id: string;
  plan_id: string;
  kyshi_subscription_id: string;
  status: string;
  current_period_end: string;
  plan?: Plan;
}

interface Transaction {
  id: string;
  kyshi_reference: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

interface WebhookLog {
  id: string;
  event_type: string;
  reference: string;
  processed: boolean;
  error_message: string;
  created_at: string;
}

const COUNTRIES = [
  { 
    code: 'KE', 
    name: 'Kenya', 
    currency: 'KES',
    paymentMethods: [
      { type: 'card', name: 'Visa/Mastercard', icon: '💳' }
    ]
  },
  { 
    code: 'GH', 
    name: 'Ghana', 
    currency: 'GHS',
    paymentMethods: [
      { type: 'card', name: 'Visa/Mastercard', icon: '💳' }
    ]
  },
  { 
    code: 'NG', 
    name: 'Nigeria', 
    currency: 'NGN',
    paymentMethods: [
      { type: 'card', name: 'Visa/Mastercard', icon: '💳' }
    ]
  },
  { 
    code: 'CI', 
    name: 'Côte d\'Ivoire', 
    currency: 'XOF',
    paymentMethods: [
      { type: 'card', name: 'Visa/Mastercard', icon: '💳' }
    ]
  },
  // South Africa (ZAR) removed - not supported by Kyshi
];

const TEST_SCENARIOS = [
  {
    scenario: 'basic_kenya',
    name: 'Basic Kenya User',
    description: 'Standard Kenyan user with M-Pesa',
    email: 'john.ke@example.com'
  },
  {
    scenario: 'premium_ghana',
    name: 'Premium Ghana User', 
    description: 'Ghanaian user with mobile money',
    email: 'ama.gh@example.com'
  },
  {
    scenario: 'nigeria_bank',
    name: 'Nigeria Bank Transfer',
    description: 'Nigerian user preferring bank transfer',
    email: 'tunde.ng@example.com'
  },
  {
    scenario: 'ivory_coast',
    name: 'Côte d\'Ivoire User',
    description: 'Ivorian user with Orange Money',
    email: 'marie.ci@example.com'
  }
];

export default function KyshiTestPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'status' | 'transactions' | 'webhooks' | 'scenarios'>('create');

  // Form state
  const [email, setEmail] = useState('test.kyshi@example.com');
  const [firstName, setFirstName] = useState('Test');
  const [lastName, setLastName] = useState('User');
  const [phone, setPhone] = useState('+254712345678');
  const [countryCode, setCountryCode] = useState('KE');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedScenario, setSelectedScenario] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);

  // Data state
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [authorizationUrl, setAuthorizationUrl] = useState('');

  // Load plans on mount
  useEffect(() => {
    loadPlans();
    loadWebhookLogs();
  }, []);

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const loadPlans = async () => {
    const { data, error } = await supabase
      .from('kyshi_plans')
      .select('*')
      .eq('is_active', true)
      .order('country_code');
    if (error) {
      console.error(error);
      showMessage('Failed to load plans', 'error');
    } else {
      setPlans(data || []);
      if (data?.length) setSelectedPlanId(data[0].id);
    }
  };

  const loadSubscriptionStatus = async () => {
    if (!email) return;
    try {
      const res = await fetch(`/api/kyshi/subscription-status?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) {
        setSubscriptions(data.subscriptions || []);
        setTransactions(data.transactions || []);
      } else {
        showMessage(data.message || 'Failed to load status', 'error');
      }
    } catch (err) {
      showMessage('Error loading status', 'error');
    }
  };

  const loadWebhookLogs = async () => {
    const { data, error } = await supabase
      .from('kyshi_webhook_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error) setWebhookLogs(data || []);
  };

  const createSubscription = async () => {
    if (!email || !firstName || !selectedPlanId) {
      showMessage('Please fill all required fields', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/kyshi/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, lastName, phone, countryCode, planId: selectedPlanId }),
      });
      const data = await res.json();
      if (data.success) {
        showMessage('Subscription created! Redirecting to payment...', 'success');
        setAuthorizationUrl(data.authorizationUrl || '');
        if (data.authorizationUrl) {
          // Automatically redirect to Paystack after a short delay
          setTimeout(() => {
            window.location.href = data.authorizationUrl;
          }, 1500);
        } else {
          await loadSubscriptionStatus();
        }
      } else {
        showMessage(data.message || 'Creation failed', 'error');
      }
    } catch (err) {
      showMessage('Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (subId: string) => {
    if (!confirm('Cancel this subscription?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/kyshi/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subId }),
      });
      const data = await res.json();
      if (data.success) {
        showMessage('Cancelled', 'success');
        await loadSubscriptionStatus();
      } else {
        showMessage(data.message || 'Cancel failed', 'error');
      }
    } catch (err) {
      showMessage('Error cancelling', 'error');
    } finally {
      setLoading(false);
    }
  };

  const chargeManual = async (subId: string) => {
    if (!confirm('Manually charge this subscription now?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/kyshi/charge-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subId }),
      });
      const data = await res.json();
      if (data.success) {
        showMessage(`Charge ${data.transaction?.status === 'success' ? 'succeeded' : 'failed'}`, 'info');
        await loadSubscriptionStatus();
        await loadWebhookLogs();
      } else {
        showMessage(data.message || 'Charge failed', 'error');
      }
    } catch (err) {
      showMessage('Error charging', 'error');
    } finally {
      setLoading(false);
    }
  };

  const refundTransaction = async (txnId: string) => {
    if (!confirm('Refund this transaction?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/kyshi/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: txnId }),
      });
      const data = await res.json();
      if (data.success) {
        showMessage('Refund processed', 'success');
        await loadSubscriptionStatus();
      } else {
        showMessage(data.message || 'Refund failed', 'error');
      }
    } catch (err) {
      showMessage('Error refunding', 'error');
    } finally {
      setLoading(false);
    }
  };

  const simulateAdvanceTime = async () => {
    if (!confirm('This will set all active subscriptions to be due yesterday. Continue?')) return;
    setLoading(true);
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const { error } = await supabase
        .from('kyshi_subscriptions')
        .update({ current_period_end: yesterdayStr })
        .eq('status', 'active');
      if (error) throw error;
      showMessage('Time simulated – subscriptions are now due', 'success');
      await loadSubscriptionStatus();
    } catch (err) {
      showMessage('Failed to simulate time', 'error');
    } finally {
      setLoading(false);
    }
  };

  const triggerCronJob = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cron/charge-due-subscriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'your_cron_secret'}` },
      });
      const data = await res.json();
      if (data.success) {
        showMessage(`Cron ran: ${data.successful} charged, ${data.failed} failed`, 'success');
        await loadSubscriptionStatus();
        await loadWebhookLogs();
      } else {
        showMessage(data.message || 'Cron failed', 'error');
      }
    } catch (err) {
      showMessage('Error triggering cron', 'error');
    } finally {
      setLoading(false);
    }
  };

  const activeSubscription = subscriptions.find(s => s.status === 'active');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Kyshi Subscription Test Suite</h1>
        <p className="text-gray-600 mb-4">Test full lifecycle: create → authorize → charge → webhook → renew → cancel → refund</p>
        
        {/* Testing Context Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-blue-900 mb-3">🧪 What We're Testing</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Payment Provider</h3>
              <p className="text-blue-700"><strong>Kyshi</strong> - African payment infrastructure</p>
              <p className="text-blue-600 text-xs mt-1">Supports mobile money, cards, and bank transfers across Africa</p>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Supported Countries & Currencies</h3>
              <ul className="text-blue-700 space-y-1">
                <li>🇰🇪 <strong>Kenya</strong> - KES (Kenyan Shilling) ✅</li>
                <li>🇬🇭 <strong>Ghana</strong> - GHS (Ghanaian Cedi) ⚠️</li>
                <li>🇳🇬 <strong>Nigeria</strong> - NGN (Nigerian Naira) ⚠️</li>
                <li>�� <strong>Côte d'Ivoire</strong> - XOF (West African CFA Franc) ⚠️</li>
              </ul>
              <p className="text-xs text-blue-600 mt-2">
                ⚠️ Note: Only Kenya (KES) is currently working. Other currencies may require Kyshi support contact.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">Available Payment Methods</h3>
            {countryCode && (() => {
              const selectedCountry = COUNTRIES.find(c => c.code === countryCode);
              if (!selectedCountry) return <p className="text-sm text-blue-600">Select a country to see available payment methods</p>;
              
              return (
                <div>
                  <p className="text-sm text-blue-700 mb-2">
                    <strong>{selectedCountry.name}</strong> supports {selectedCountry.paymentMethods.length} payment methods:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedCountry.paymentMethods.map((method, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs bg-white border border-blue-200 rounded p-2">
                        <span className="text-lg">{method.icon}</span>
                        <div>
                          <div className="font-medium text-blue-800">{method.name}</div>
                          <div className="text-blue-600 capitalize">{method.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            {!countryCode && (
              <p className="text-sm text-blue-600">Select a country to see available payment methods</p>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-600">
              <strong>Test Mode:</strong> Use test card <code className="bg-blue-100 px-1 rounded">4084 0840 8408 4081</code>, 
              any future expiry, CVV <code className="bg-blue-100 px-1 rounded">408</code>
            </p>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-800' :
            message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {message.text}
          </div>
        )}

        {authorizationUrl && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-semibold text-yellow-800 mb-2">
              Redirecting to Paystack Checkout...
            </h3>
            <p className="text-sm text-yellow-700 mb-3">
              You will be redirected to Paystack to complete payment. The checkout page will show multiple payment options for {COUNTRIES.find(c => c.code === countryCode)?.name || 'your country'}.
            </p>
            
            {/* Payment Methods Preview */}
            {countryCode && (() => {
              const selectedCountry = COUNTRIES.find(c => c.code === countryCode);
              if (!selectedCountry) return null;
              
              return (
                <div className="mb-4 p-3 bg-white border border-yellow-300 rounded">
                  <h4 className="font-medium text-yellow-800 mb-2 text-sm">Payment Options on Paystack:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {selectedCountry.paymentMethods.map((method, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="text-base">{method.icon}</span>
                        <div>
                          <div className="font-medium text-gray-800">{method.name}</div>
                          <div className="text-gray-600 capitalize">{method.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            
            <div className="bg-white p-2 rounded border border-yellow-300 mb-3">
              <code className="text-xs break-all">{authorizationUrl}</code>
            </div>
            
            <div className="flex gap-2 mb-3">
              <button 
                onClick={() => window.location.href = authorizationUrl}
                className="bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700"
              >
                Go to Payment Now
              </button>
              <button 
                onClick={() => window.open(authorizationUrl, '_blank')}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                Open in New Tab
              </button>
              <button 
                onClick={() => setAuthorizationUrl('')}
                className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
              >
                Cancel Redirect
              </button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <h4 className="font-medium text-blue-800 mb-2 text-sm">Testing Information:</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Card Test:</strong> Use 4084 0840 8408 4081, any future expiry, CVV 408</p>
                <p><strong>Mobile Money:</strong> Use real phone numbers for live testing (test mode may simulate)</p>
                <p><strong>Bank Transfer:</strong> Follow Paystack's bank transfer instructions</p>
                <p><strong>USSD:</strong> Dial the provided USSD code and follow prompts</p>
              </div>
            </div>
          </div>
        )}

        {/* Paystack Access Troubleshooting */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-red-900 mb-3">🚫 Paystack Access Issues</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-red-800 mb-2">Common Solutions</h3>
              <ul className="text-red-700 space-y-1">
                <li>• Disable VPN/Proxy services</li>
                <li>• Clear browser cache & cookies</li>
                <li>• Try different browser (Chrome/Firefox)</li>
                <li>• Check firewall/antivirus settings</li>
                <li>• Use mobile hotspot if needed</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-red-800 mb-2">Alternative Testing</h3>
              <ul className="text-red-700 space-y-1">
                <li>• Use ngrok for local testing</li>
                <li>• Test with different network</li>
                <li>• Contact Paystack support</li>
                <li>• Use test cards in sandbox mode</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-red-200">
            <h3 className="font-medium text-red-800 mb-2">Quick Test Commands</h3>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
              <div># Start ngrok (if needed)</div>
              <div>ngrok http 3000</div>
              <div className="mt-2"># Test webhook manually</div>
              <div>curl -X POST localhost:3000/api/webhooks/kyshi</div>
              <div>  -H "Content-Type: application/json"</div>
              <>  -d '{`{"event":"successful","data":{"reference":"test_123","amount":20000,"customer":{"email":"test@example.com"}}}`}'</>
            </div>
          </div>
        </div>

        <div className="border-b mb-6">
          <nav className="flex space-x-6">
            {(['create', 'status', 'transactions', 'webhooks', 'scenarios'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 font-medium ${
                  activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* CREATE TAB */}
        {activeTab === 'create' && (
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Create Customer & Subscription</h2>
            
            {/* Selected Country/Currency Indicator */}
            {countryCode && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  <strong>Testing:</strong> {COUNTRIES.find(c => c.code === countryCode)?.name} ({COUNTRIES.find(c => c.code === countryCode)?.currency})
                  {plans.filter(p => p.country_code === countryCode).length > 0 && (
                    <span className="ml-2">• {plans.filter(p => p.country_code === countryCode).length} plan(s) available</span>
                  )}
                </p>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-4">
              <input type="email" placeholder="Email *" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded" />
              <input type="text" placeholder="First Name *" value={firstName} onChange={e => setFirstName(e.target.value)} className="border p-2 rounded" />
              <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} className="border p-2 rounded" />
              <input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="border p-2 rounded" />
              <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="border p-2 rounded">
                {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.currency})</option>)}
              </select>
              <select value={selectedPlanId} onChange={e => setSelectedPlanId(e.target.value)} className="border p-2 rounded">
                <option value="">Select plan</option>
                {plans.filter(p => p.country_code === countryCode).map(p => (
                  <option key={p.id} value={p.id}>{p.name} - {p.amount} {p.currency}/week</option>
                ))}
              </select>
            </div>
            <button onClick={createSubscription} disabled={loading} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Subscription'}
            </button>
            {authorizationUrl && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm">🔐 <strong>Authorization required</strong> – <a href={authorizationUrl} target="_blank" rel="noopener noreferrer" className="underline">Click here to add a test card</a></p>
                <p className="text-xs text-gray-600 mt-1">Use test card: 4084 0840 8408 4081, expiry future, CVV 408</p>
              </div>
            )}
          </div>
        )}

        {/* STATUS TAB */}
        {activeTab === 'status' && (
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>
            <div className="flex gap-2 mb-4">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="flex-1 border p-2 rounded" placeholder="Customer email" />
              <button onClick={loadSubscriptionStatus} className="bg-blue-600 text-white px-4 rounded">Load</button>
            </div>
            {activeSubscription && (
              <div className="bg-green-50 border border-green-200 p-4 rounded mb-4">
                <h3 className="font-bold text-green-800">Active Subscription</h3>
                <p>Plan: {activeSubscription.plan?.name} - {activeSubscription.plan?.amount} {activeSubscription.plan?.currency}/week</p>
                <p>Next billing: {activeSubscription.current_period_end}</p>
                <p>Kyshi ID: {activeSubscription.kyshi_subscription_id}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => chargeManual(activeSubscription.id)} className="bg-green-600 text-white px-4 py-1 rounded">Charge Now</button>
                  <button onClick={() => cancelSubscription(activeSubscription.id)} className="bg-red-600 text-white px-4 py-1 rounded">Cancel</button>
                </div>
              </div>
            )}
            <h3 className="font-semibold mt-4">All Subscriptions</h3>
            {subscriptions.length === 0 ? <p className="text-gray-500">No subscriptions found</p> : subscriptions.map(sub => (
              <div key={sub.id} className="border rounded p-3 mt-2">
                <p><strong>Status:</strong> <span className={`px-2 py-0.5 rounded text-sm ${sub.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>{sub.status}</span></p>
                <p>Plan: {sub.plan?.name}</p>
                {sub.current_period_end && <p>Next billing: {sub.current_period_end}</p>}
                {sub.status === 'active' && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => chargeManual(sub.id)} className="text-sm bg-green-600 text-white px-3 py-0.5 rounded">Charge</button>
                    <button onClick={() => cancelSubscription(sub.id)} className="text-sm bg-red-600 text-white px-3 py-0.5 rounded">Cancel</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Transactions</h2>
            <button onClick={loadSubscriptionStatus} className="mb-4 bg-blue-600 text-white px-4 py-1 rounded">Refresh</button>
            {transactions.length === 0 ? <p className="text-gray-500">No transactions</p> : transactions.map(txn => (
              <div key={txn.id} className="border rounded p-3 mt-2">
                <p>Reference: {txn.kyshi_reference}</p>
                <p>Amount: {txn.amount} {txn.currency}</p>
                <p>Status: <span className={`px-2 py-0.5 rounded text-sm ${txn.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>{txn.status}</span></p>
                <p>Date: {new Date(txn.created_at).toLocaleString()}</p>
                {txn.status === 'success' && (
                  <button onClick={() => refundTransaction(txn.id)} className="mt-2 bg-orange-600 text-white px-3 py-1 rounded text-sm">Refund</button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TESTING TOOLS TAB */}
        {activeTab === 'scenarios' && (
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Testing Tools</h2>
            
            {/* Test Scenarios */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Pre-configured Test Scenarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TEST_SCENARIOS.map((scenario: any) => (
                  <button
                    key={scenario.scenario}
                    onClick={() => {
                      setEmail(scenario.email);
                      setSelectedScenario(scenario.scenario);
                      showMessage(`Loaded ${scenario.name} scenario`, 'info');
                    }}
                    className={`p-3 border rounded text-left ${
                      selectedScenario === scenario.scenario 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium">{scenario.name}</div>
                    <div className="text-sm text-gray-600">{scenario.description}</div>
                    <div className="text-xs text-blue-600 mt-1">{scenario.email}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct API Testing */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Direct API Testing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('4084 0840 8408 4081');
                    showMessage('Test card number copied!', 'success');
                  }}
                  className="p-3 bg-gray-100 border rounded hover:bg-gray-200"
                >
                  <div className="font-medium">📋 Copy Test Card</div>
                  <div className="text-sm text-gray-600">4084 0840 8408 4081</div>
                </button>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://your-ngrok-url.ngrok-free.dev/api/webhooks/kyshi');
                    showMessage('Webhook URL copied!', 'success');
                  }}
                  className="p-3 bg-gray-100 border rounded hover:bg-gray-200"
                >
                  <div className="font-medium">🔗 Copy Webhook URL</div>
                  <div className="text-sm text-gray-600">For Kyshi dashboard</div>
                </button>
                
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/cron/charge-due-subscriptions', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'your_cron_secret'}` },
                      });
                      const data = await res.json();
                      showMessage(`Cron test: ${data.success ? 'Success' : 'Failed'}`, data.success ? 'success' : 'error');
                    } catch (err) {
                      showMessage('Cron test failed', 'error');
                    }
                  }}
                  className="p-3 bg-purple-100 border rounded hover:bg-purple-200"
                >
                  <div className="font-medium">⚙️ Test Cron Job</div>
                  <div className="text-sm text-gray-600">Manual trigger</div>
                </button>
                
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/kyshi/subscription-status?email=test@example.com');
                      const data = await res.json();
                      console.log('Status check result:', data);
                      showMessage('Status check logged in console', 'info');
                    } catch (err) {
                      showMessage('Status check failed', 'error');
                    }
                  }}
                  className="p-3 bg-green-100 border rounded hover:bg-green-200"
                >
                  <div className="font-medium">📊 Test Status API</div>
                  <div className="text-sm text-gray-600">Check subscription status</div>
                </button>
              </div>
            </div>

            {/* Environment Check */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Environment Check</h3>
              <div className="bg-gray-100 p-4 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Supabase URL:</strong>
                    <div className="text-xs break-all font-mono bg-white p-2 rounded mt-1">
                      {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
                    </div>
                  </div>
                  <div>
                    <strong>Kyshi API URL:</strong>
                    <div className="text-xs break-all font-mono bg-white p-2 rounded mt-1">
                      {process.env.KYSHI_API_URL || 'Not set'}
                    </div>
                  </div>
                  <div>
                    <strong>Environment:</strong>
                    <div className="text-xs font-mono bg-white p-2 rounded mt-1">
                      {process.env.NODE_ENV || 'development'}
                    </div>
                  </div>
                  <div>
                    <strong>Cron Secret:</strong>
                    <div className="text-xs font-mono bg-white p-2 rounded mt-1">
                      {process.env.NEXT_PUBLIC_CRON_SECRET ? 'Set' : 'Not set'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WEBHOOKS & CRON TAB */}
        {activeTab === 'webhooks' && (
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Webhook Testing & Auto‑Renewal</h2>
            <div className="bg-blue-50 p-4 rounded mb-6">
              <p className="text-sm"><strong>Webhook URL (configure in Kyshi dashboard):</strong><br/>
              <code className="bg-gray-200 px-2 py-1 rounded">https://your-ngrok-url.ngrok-free.dev/api/webhooks/kyshi</code></p>
              <p className="text-sm mt-2"><strong>Test card for sandbox:</strong> 4084 0840 8408 4081, any future expiry, CVV 408</p>
            </div>
            <div className="flex gap-3 mb-6">
              <button onClick={simulateAdvanceTime} className="bg-yellow-600 text-white px-4 py-2 rounded">⏩ Simulate Advance Time</button>
              <button onClick={triggerCronJob} className="bg-purple-600 text-white px-4 py-2 rounded">⚙️ Trigger Cron Job (Charge Due)</button>
              <button onClick={loadWebhookLogs} className="bg-gray-600 text-white px-4 py-2 rounded">🔄 Refresh Logs</button>
            </div>
            <h3 className="font-semibold mb-2">Recent Webhook Logs</h3>
            {webhookLogs.length === 0 ? <p className="text-gray-500">No webhooks received yet.</p> : webhookLogs.map(log => (
              <div key={log.id} className="border rounded p-2 mt-2 text-sm">
                <p><strong>Event:</strong> {log.event_type} | <strong>Ref:</strong> {log.reference || 'N/A'}</p>
                <p><strong>Processed:</strong> {log.processed ? '✅ Yes' : '❌ No'} {log.error_message && <span className="text-red-600"> – {log.error_message}</span>}</p>
                <p className="text-gray-500">{new Date(log.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}