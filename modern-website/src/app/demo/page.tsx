'use client'

import { useIndustryData } from '@/hooks/useIndustryDataNew'
import { PendingBadge } from '@/components/PendingBadge'
import { useEffect, useState } from 'react'

export default function SimpleTanStackDemo() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Test with retail industry in Kenya - no auth required
  const { data, isLoading, addItem, isAdding, isPaused } = 
    useIndustryData('retail', 'ke', 'transactions')

  // Don't render until client-side to avoid hydration issues
  if (!isClient) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🚀 TanStack Query Demo</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🚀 TanStack Query Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📊 Connection Status</h2>
          <div className="space-y-2">
            <p>📡 Online: {isPaused ? '❌ No' : '✅ Yes'}</p>
            <p>⏳ Loading: {isLoading ? 'Yes' : 'No'}</p>
            <p>📦 Transactions: {data?.length || 0}</p>
            <PendingBadge show={isAdding} />
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">✨ Features</h2>
          <div className="space-y-2 text-sm">
            <p>✅ Offline persistence (7 days)</p>
            <p>✅ Optimistic updates</p>
            <p>✅ Automatic retry (3x)</p>
            <p>✅ Error handling</p>
            <p>✅ Cache invalidation</p>
            <p>✅ Battle-tested</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">🧪 Test Offline Functionality</h2>
        <p className="mb-4 text-sm">
          1. Go offline (disconnect from internet)<br/>
          2. Click "Add Transaction" below<br/>
          3. Watch the pending badge appear<br/>
          4. Go back online<br/>
          5. Watch it auto-sync!
        </p>
        
        <button 
          onClick={() => addItem({
            amount: Math.floor(Math.random() * 1000) + 50,
            description: `Test transaction ${Date.now()}`,
            customer_name: 'Demo Customer',
            transaction_date: new Date().toISOString()
          })}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold"
        >
          🎯 Add Transaction (Works Offline!)
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📝 Recent Transactions</h2>
        {data && data.length > 0 ? (
          <div className="space-y-2">
            {data.slice(0, 5).map((transaction: any) => (
              <div key={transaction.id} className="border p-3 rounded bg-white">
                <div className="flex justify-between">
                  <span className="font-medium">
                    {transaction.description || 'Test Transaction'}
                    {transaction.id?.startsWith('temp_') && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        ⏳ Pending
                      </span>
                    )}
                  </span>
                  <span className="text-green-600 font-semibold">${transaction.amount}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Customer: {transaction.customer_name || 'Demo Customer'} | 
                  Date: {transaction.transaction_date ? new Date(transaction.transaction_date).toLocaleDateString() : 'Just now'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No transactions yet. Click the button above to add one!</p>
        )}
      </div>

      <div className="mt-8 p-6 bg-purple-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">🎉 Migration Success!</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-green-600 mb-2">✅ What You Now Have</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Battle-tested offline system</li>
              <li>3 files instead of 9+</li>
              <li>4-5 hours instead of weeks</li>
              <li>Automatic pending state</li>
              <li>Optimistic updates</li>
              <li>7-day persistence</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-red-600 mb-2">❌ What You Removed</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>588 lines of useOffline.ts</li>
              <li>399 lines of offlineSyncService.ts</li>
              <li>257 lines of useOfflineUniversal.ts</li>
              <li>Custom IndexedDB logic</li>
              <li>Manual sync management</li>
              <li>Complex error handling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
