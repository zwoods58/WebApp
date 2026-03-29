'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface KyshiPlan {
  id: string;
  name: string;
  description: string;
  interval: string;
  amount: string;
  localCurrency: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface KyshiSubscription {
  id: string;
  code: string;
  customer: {
    id: string;
    email: string;
    currencyCode: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    customerCode?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  };
  plan: KyshiPlan;
  startDate: string;
  nextPaymentDate: string;
  isActive: boolean;
  authorizationUrl?: string;
  accessCode?: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

export default function KyshiTestComponent() {
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [plans, setPlans] = useState<KyshiPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<KyshiSubscription[]>([]);
  const [newPlanCreated, setNewPlanCreated] = useState<KyshiPlan | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');

  // Test API connection
  const testConnection = async () => {
    setLoading(true);
    setConnectionStatus('testing');
    
    try {
      const response = await fetch('/api/kyshi/test');
      const result = await response.json();
      
      if (result.success) {
        setConnectionStatus('success');
        toast.success('Kyshi API connection successful!');
      } else {
        setConnectionStatus('error');
        toast.error(result.message || 'Connection failed');
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Connection test failed');
    } finally {
      setLoading(false);
    }
  };

  // Create Kenya weekly plan
  const createKenyaPlan = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/kyshi/test', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        setNewPlanCreated(result.plan);
        toast.success('Kenya weekly plan created successfully!');
        // Refresh plans list
        fetchPlans();
      } else {
        toast.error(result.message || 'Plan creation failed');
      }
    } catch (error) {
      toast.error('Plan creation failed');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all plans
  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/kyshi/plans');
      const result = await response.json();
      
      if (result.success) {
        setPlans(result.plans);
      } else {
        toast.error(result.message || 'Failed to fetch plans');
      }
    } catch (error) {
      toast.error('Failed to fetch plans');
    }
  };

  // Fetch all subscriptions
  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/kyshi/subscriptions');
      const result = await response.json();
      
      if (result.success) {
        setSubscriptions(result.subscriptions);
      } else {
        toast.error(result.message || 'Failed to fetch subscriptions');
      }
    } catch (error) {
      toast.error('Failed to fetch subscriptions');
    }
  };

  // Create subscription
  const createSubscription = async () => {
    if (!customerEmail || !selectedPlanId) {
      toast.error('Customer email and plan selection are required');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/kyshi/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail,
          planId: selectedPlanId,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Subscription created successfully!');
        setCustomerEmail('');
        setSelectedPlanId('');
        fetchSubscriptions();
      } else {
        toast.error(result.message || 'Subscription creation failed');
      }
    } catch (error) {
      toast.error('Subscription creation failed');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on mount
  useEffect(() => {
    fetchPlans();
    fetchSubscriptions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'testing':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Kyshi Integration Test</h1>
      
      {/* Connection Test Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">API Connection Test</h2>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={testConnection}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>
          <span className={`font-medium ${getStatusColor(connectionStatus)}`}>
            {connectionStatus === 'idle' && 'Not tested'}
            {connectionStatus === 'testing' && 'Testing...'}
            {connectionStatus === 'success' && '✓ Connected'}
            {connectionStatus === 'error' && '✗ Failed'}
          </span>
        </div>
        
        <button
          onClick={createKenyaPlan}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 mr-4"
        >
          {loading ? 'Creating...' : 'Create Kenya Weekly Plan (200 KES)'}
        </button>
      </div>

      {/* New Plan Created */}
      {newPlanCreated && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-800">New Plan Created!</h3>
          <div className="mt-2 text-sm">
            <p><strong>Name:</strong> {newPlanCreated.name}</p>
            <p><strong>Amount:</strong> {newPlanCreated.amount} {newPlanCreated.localCurrency}</p>
            <p><strong>Interval:</strong> {newPlanCreated.interval}</p>
            <p><strong>Plan ID:</strong> {newPlanCreated.id}</p>
            <p><strong>Code:</strong> {newPlanCreated.code}</p>
          </div>
        </div>
      )}

      {/* Plans Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <button
          onClick={fetchPlans}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 mb-4"
        >
          Refresh Plans
        </button>
        
        {plans.length > 0 ? (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="text-sm text-gray-600">{plan.description}</p>
                <div className="mt-2 text-sm">
                  <span className="font-medium">Amount:</span> {plan.amount} {plan.localCurrency} | 
                  <span className="font-medium ml-2">Interval:</span> {plan.interval} | 
                  <span className="font-medium ml-2">Status:</span> {plan.isActive ? 'Active' : 'Inactive'}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  ID: {plan.id} | Code: {plan.code}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No plans found</p>
        )}
      </div>

      {/* Create Subscription Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Create Subscription</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Customer Email</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="customer@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Select Plan</label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a plan...</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - {plan.amount} {plan.localCurrency}/{plan.interval}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={createSubscription}
            disabled={loading || !customerEmail || !selectedPlanId}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Subscription'}
          </button>
        </div>
      </div>

      {/* Subscriptions Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Existing Subscriptions</h2>
        <button
          onClick={fetchSubscriptions}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 mb-4"
        >
          Refresh Subscriptions
        </button>
        
        {subscriptions.length > 0 ? (
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">Subscription {sub.code}</h3>
                <div className="mt-2 text-sm">
                  <p><strong>Customer:</strong> {sub.customer.email}</p>
                  <p><strong>Plan:</strong> {sub.plan.name} ({sub.plan.amount} {sub.plan.localCurrency}/{sub.plan.interval})</p>
                  <p><strong>Start Date:</strong> {new Date(sub.startDate).toLocaleDateString()}</p>
                  <p><strong>Next Payment:</strong> {new Date(sub.nextPaymentDate).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {sub.isActive ? 'Active' : 'Inactive'}</p>
                  <p><strong>Reference:</strong> {sub.reference}</p>
                  {sub.authorizationUrl && (
                    <p><strong>Auth URL:</strong> <a href={sub.authorizationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Complete Setup</a></p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No subscriptions found</p>
        )}
      </div>
    </div>
  );
}
