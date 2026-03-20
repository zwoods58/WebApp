'use client'

import { useState } from 'react'
import { useTransactionsTanStack } from '@/hooks/useTransactionsTanStack'
import { ConnectionStatus } from '@/components/ConnectionStatus'
import { PendingBadge } from '@/components/PendingBadge'

export default function OfflineTestPage() {
  const [testCount, setTestCount] = useState(0)
  const transactions = useTransactionsTanStack({ 
    industry: 'retail', 
    country: 'ke' 
  })

  const handleAddTestTransaction = () => {
    const newCount = testCount + 1
    setTestCount(newCount)
    transactions.addTransaction({
      amount: Math.floor(Math.random() * 1000) + 100,
      description: `Test Transaction #${newCount}`,
      customer_name: 'Offline Test Customer',
      transaction_date: new Date().toISOString(),
      category: 'test'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">TanStack Query Offline Test</h1>
        
        {/* Connection Status */}
        <div className="mb-8">
          <ConnectionStatus />
        </div>

        {/* Status Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className={`p-3 rounded ${transactions.isLoading ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
              Loading: {transactions.isLoading ? 'Yes' : 'No'}
            </div>
            <div className={`p-3 rounded ${transactions.isPaused ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-600'}`}>
              Paused: {transactions.isPaused ? 'Yes' : 'No'}
            </div>
            <div className={`p-3 rounded ${transactions.isAdding ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'}`}>
              Adding: {transactions.isAdding ? 'Yes' : 'No'}
            </div>
            <div className={`p-3 rounded ${transactions.error ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
              Error: {transactions.error ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        {/* Add Transaction Button */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <button
            onClick={handleAddTestTransaction}
            disabled={transactions.isAdding}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {transactions.isAdding ? (
              <span className="flex items-center gap-2">
                <PendingBadge show={true} />
                Adding Transaction...
              </span>
            ) : (
              'Add Test Transaction'
            )}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Try turning off WiFi and clicking this button. The item should appear immediately with a pending badge.
          </p>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Transactions ({transactions.data.length})
          </h2>
          
          {transactions.data.length === 0 ? (
            <p className="text-gray-500">No transactions yet. Add one to test!</p>
          ) : (
            <div className="space-y-3">
              {transactions.data.map((transaction) => (
                <div 
                  key={transaction.id}
                  className={`border rounded-lg p-4 ${
                    transaction.id?.toString().startsWith('temp_') 
                      ? 'border-yellow-300 bg-yellow-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-600">
                        {transaction.customer_name} • ${transaction.amount}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.transaction_date).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {transaction.id?.toString().startsWith('temp_') && (
                        <PendingBadge show={true} />
                      )}
                      <button
                        onClick={() => transactions.deleteTransaction(transaction.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">🧪 Test Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li><strong>Normal mode:</strong> Add items - they should sync immediately</li>
            <li><strong>Offline test:</strong> Turn off WiFi, add an item - should appear with yellow pending badge</li>
            <li><strong>Persistence test:</strong> Refresh page while offline - pending items should remain</li>
            <li><strong>Sync test:</strong> Turn WiFi back on - pending items should sync automatically</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
