'use client'

import { useState } from 'react'
import { useIndustryData } from '@/hooks/useIndustryDataNew'
import { PendingBadge } from '@/components/PendingBadge'

export default function TanStackTestPage() {
  const [industry] = useState('retail')
  const [country] = useState('ke')
  
  // Test multiple data types to verify cross-invalidation
  const { data: transactions, isLoading: loadingTx, addItem: addTx, isAdding: addingTx, isPaused: pausedTx } = 
    useIndustryData(industry, country, 'transactions')
  
  const { data: inventory, isLoading: loadingInv, addItem: addInv, isAdding: addingInv } = 
    useIndustryData(industry, country, 'inventory')
  
  const { data: credit, isLoading: loadingCredit, addItem: addCredit, isAdding: addingCredit } = 
    useIndustryData(industry, country, 'credit')

  const handleAddTransaction = () => {
    addTx({
      amount: 100,
      description: 'Test transaction',
      customer_name: 'Test Customer',
      category: 'sale',
      transaction_date: new Date().toISOString().split('T')[0]
    })
  }

  const handleAddInventorySale = () => {
    // First add an inventory item
    console.log('📦 Adding inventory item...')
    addInv({
      item_name: 'Test Product',
      quantity: 10,
      threshold: 2,
      unit_price: 50
    })
    
    // Then add a transaction with inventory metadata
    setTimeout(() => {
      console.log('💰 Adding inventory sale transaction...')
      addTx({
        amount: 100,
        description: 'Inventory sale',
        customer_name: 'Test Customer',
        category: 'sale',
        transaction_date: new Date().toISOString().split('T')[0],
        metadata: {
          inventory_item_id: 'test_item_id',
          quantity_sold: 2
        }
      })
    }, 1000)
  }

  const handleDirectInventoryUpdate = () => {
    console.log('📦 Testing direct inventory update...')
    // This simulates what happens when you sell inventory and update the quantity
    addInv({
      item_name: 'Direct Update Product',
      quantity: 5,
      threshold: 1,
      unit_price: 25
    })
  }

  const handleAddCreditPayment = () => {
    // First add a credit entry
    addCredit({
      customer_name: 'Test Credit Customer',
      amount: 500,
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      date_given: new Date().toISOString().split('T')[0]
    })
    
    // Then add a payment transaction
    setTimeout(() => {
      addTx({
        amount: 100,
        description: 'Payment for credit: Test Credit Customer',
        customer_name: 'Test Credit Customer',
        category: 'payment',
        transaction_date: new Date().toISOString().split('T')[0],
        metadata: {
          credit_id: 'test_credit_id'
        }
      })
    }, 1000)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">TanStack Query Cross-Invalidation Test</h1>
      
      <div className="mb-6 space-y-2">
        <p>Industry: {industry} | Country: {country}</p>
        <div className="flex gap-4">
          <span>Transactions: {loadingTx ? 'Loading...' : `Loaded (${transactions?.length || 0})`}</span>
          <span>Inventory: {loadingInv ? 'Loading...' : `Loaded (${inventory?.length || 0})`}</span>
          <span>Credit: {loadingCredit ? 'Loading...' : `Loaded (${credit?.length || 0})`}</span>
        </div>
        <div className="flex gap-4">
          <span>Offline: {pausedTx ? 'Yes' : 'No'}</span>
          <PendingBadge show={addingTx || addingInv || addingCredit} />
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <h2 className="text-xl font-semibold">Test Operations (Check Console for Cross-Invalidation Logs)</h2>
        
        <div className="flex gap-4 flex-wrap">
          <button 
            onClick={handleAddTransaction}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Simple Transaction
          </button>
          
          <button 
            onClick={handleAddInventorySale}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Inventory Sale (Tests Cross-Invalidation)
          </button>
          
          <button 
            onClick={handleDirectInventoryUpdate}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Direct Inventory Update (Debug)
          </button>
          
          <button 
            onClick={handleAddCreditPayment}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Add Credit Payment (Tests Cross-Invalidation)
          </button>
        </div>
        
        <p className="text-sm text-gray-600">
          📝 Open browser console to see cross-invalidation logs. Each operation should invalidate related queries.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Transactions ({transactions?.length || 0})</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {transactions?.map((transaction: any) => (
              <div key={transaction.id} className="border p-2 rounded text-sm">
                <p>{transaction.description} - ${transaction.amount}</p>
                <p className="text-xs text-gray-600">{transaction.customer_name}</p>
                {transaction.metadata && (
                  <p className="text-xs text-blue-600">📋 Has metadata</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Inventory ({inventory?.length || 0})</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {inventory?.map((item: any) => (
              <div key={item.id} className="border p-2 rounded text-sm">
                <p>{item.item_name}</p>
                <p className="text-xs text-gray-600">Qty: {item.quantity} | Price: ${item.unit_price}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Credit ({credit?.length || 0})</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {credit?.map((item: any) => (
              <div key={item.id} className="border p-2 rounded text-sm">
                <p>{item.customer_name}</p>
                <p className="text-xs text-gray-600">Amount: ${item.amount} | Status: {item.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
