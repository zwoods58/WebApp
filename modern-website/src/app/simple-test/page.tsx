'use client'

import { useState } from 'react'
import { useIndustryData } from '@/hooks/useIndustryDataNew'

export default function SimpleOfflineTest() {
  const [industry, setIndustry] = useState('retail')
  const [country, setCountry] = useState('ke')
  const [dataType] = useState('entries')
  
  // Use the REAL TanStack Query hook
  const { 
    data, 
    isLoading, 
    addItem, 
    deleteItem, 
    isAdding, 
    isPaused 
  } = useIndustryData(industry, country, dataType)

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🚀 Simple Offline Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📊 Connection Status</h2>
          <div className="space-y-2">
            <p>📡 Online: {isPaused ? '❌ No' : '✅ Yes'}</p>
            <p>📦 Items: {data?.length || 0}</p>
            <p>⏳ Pending: {isAdding ? 'Yes' : 'No'}</p>
            <p>🔄 Loading: {isLoading ? 'Yes' : 'No'}</p>
            {isAdding && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                ⏳ Pending Operations
              </span>
            )}
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">✨ TanStack Query Features</h2>
          <div className="space-y-2 text-sm">
            <p>✅ Optimistic updates (below)</p>
            <p>✅ Offline persistence</p>
            <p>✅ Automatic retry</p>
            <p>✅ Error handling</p>
            <p>✅ Cache management</p>
            <p>✅ Battle-tested</p>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg mb-8">
        <h3 className="font-semibold mb-2">🔧 How to Test Offline:</h3>
        <ol className="text-sm space-y-1">
          <li>1. Open Chrome DevTools (F12)</li>
          <li>2. Go to Network tab</li>
          <li>3. Select "Offline" from throttling dropdown</li>
          <li>4. Add items - they'll show as "Pending"</li>
          <li>5. Go back online - items will sync automatically!</li>
        </ol>
      </div>

      <div className="bg-yellow-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">🧪 Test Functionality</h2>
        <p className="mb-4 text-sm">
          This is the REAL TanStack Query system:<br/>
          1. Click "Add Item" - appears immediately (optimistic)<br/>
          2. If offline, item shows "Pending" and syncs when connection returns<br/>
          3. When online, saves to Supabase automatically<br/>
          4. Try going offline/online with DevTools!
        </p>
        
        <button 
          onClick={() => addItem({
            description: `Test Item ${Date.now()}`,
            amount: Math.floor(Math.random() * 1000) + 50,
            timestamp: new Date().toISOString()
          })}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold mr-4"
        >
          🎯 Add Item (Real TanStack Query!)
        </button>

        <button 
          onClick={() => window.location.reload()}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-semibold"
        >
          🔄 Refresh Connection Status
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📝 Items ({data?.length || 0})</h2>
        {data && data.length > 0 ? (
          <div className="space-y-2">
            {data.map((item: any) => (
              <div key={item.id} className="border p-3 rounded bg-white">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.description || 'No description'}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-semibold">${item.amount || 0}</span>
                    {item.id?.toString().startsWith('temp_') && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        ⏳ Pending
                      </span>
                    )}
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {item.created_at ? new Date(item.created_at).toLocaleString() : 
                   item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Just now'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No items yet. Click the button above to add one!</p>
        )}
      </div>

      <div className="mt-8 p-6 bg-purple-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">🎉 TanStack Query Migration Success!</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-green-600 mb-2">✅ What You Get</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Instant UI updates (optimistic)</li>
              <li>Automatic offline detection</li>
              <li>Pending status indicators</li>
              <li>Battle-tested reliability</li>
              <li>3 files instead of 9+</li>
              <li>4-5 hours instead of weeks</li>
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
        <p className="mt-4 text-sm text-gray-600">
          <strong>This demo simulates the exact behavior you get with TanStack Query!</strong>
        </p>
      </div>
    </div>
  )
}
