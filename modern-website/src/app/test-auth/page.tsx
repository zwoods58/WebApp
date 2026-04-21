"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { checkAuthenticationStatus } from '@/utils/authHelpers';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export default function TestAuthPage() {
  const { business, user, isAuthenticated } = useSupabaseAuth();
  const [testResults, setTestResults] = useState<any[]>([]);

  const addResult = (test: string, result: any) => {
    setTestResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const runTests = async () => {
    setTestResults([]);

    // Test 1: Basic auth check
    addResult('Basic Auth Check', { user: !!user, business: !!business, isAuthenticated });

    // Test 2: Authentication helper
    if (business?.id) {
      const authCheck = await checkAuthenticationStatus(business.id);
      addResult('Auth Helper Check', authCheck);
    } else {
      addResult('Auth Helper Check', { error: 'No business ID available' });
    }

    // Test 3: Direct session check
    const { data: { session } } = await supabase.auth.getSession();
    addResult('Direct Session Check', { 
      hasSession: !!session, 
      userId: session?.user?.id,
      email: session?.user?.email 
    });

    // Test 4: Test transaction insert
    if (business?.id) {
      try {
        const testTransaction = {
          business_id: business.id,
          type: 'money_in' as const,
          amount: 100,
          currency: 'KES',
          industry: 'retail',
          description: 'Test transaction',
          transaction_date: new Date().toISOString().split('T')[0],
        };

        const { data, error } = await supabase
          .from('business_transactions')
          .insert(testTransaction)
          .select()
          .single();

        addResult('Transaction Insert Test', { 
          success: !error, 
          data: data?.id,
          error: error?.message 
        });
      } catch (error: any) {
        addResult('Transaction Insert Test', { 
          success: false, 
          error: error.message 
        });
      }
    } else {
      addResult('Transaction Insert Test', { error: 'No business available' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Authentication & API Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Current Status</h2>
          <div className="space-y-2 text-sm">
            <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
            <p><strong>Business:</strong> {business ? business.business_name : 'No business'}</p>
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Business ID:</strong> {business?.id || 'None'}</p>
          </div>
        </div>

        <button
          onClick={runTests}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg mb-6"
        >
          Run Authentication Tests
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Test Results</h2>
          {testResults.length === 0 ? (
            <p className="text-gray-500">Click "Run Authentication Tests" to see results</p>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded p-4">
                  <h3 className="font-semibold text-sm mb-2">{result.test}</h3>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">
                    {result.timestamp}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
