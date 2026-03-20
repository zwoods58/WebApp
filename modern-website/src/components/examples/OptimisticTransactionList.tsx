/**
 * Example: Optimistic Transaction List
 * Demonstrates how to use optimistic UI updates with pending status badges
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTransactionsTanStack } from '@/hooks/useTransactionsTanStack';

const OptimisticTransactionList: React.FC = () => {
  const { data: transactions, isLoading, addTransaction, isAdding, isPaused } = useTransactionsTanStack();
  
  // TanStack Query handles online/offline automatically
  const isCurrentlyOffline = isPaused;

  const handleAddTransaction = async () => {
    try {
      // Generate realistic test data
      const categories = ['Haircut', 'Styling', 'Treatment', 'Product Sale', 'Consultation'];
      const customers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown'];
      const paymentMethods = ['cash', 'card', 'mobile_money'];
      
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      const randomPayment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const randomAmount = Math.floor(Math.random() * 500) + 50; // Realistic salon prices
      
      await addTransaction({
        amount: randomAmount,
        category: randomCategory,
        description: `${randomCategory} - ${randomCustomer}`,
        customer_name: randomCustomer,
        payment_method: randomPayment,
        transaction_date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Transactions</h2>
        
        {/* Status indicators */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${!isCurrentlyOffline ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {!isCurrentlyOffline ? 'Online' : 'Offline'}
            </span>
          </div>
          
          {isAdding && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">
                Processing...
              </span>
            </div>
          )}
        </div>

        {/* Add transaction button */}
        <button
          onClick={handleAddTransaction}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Sample Transaction
        </button>
      </div>

      {/* Transaction list */}
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No transactions found
          </div>
        ) : (
          transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border bg-white`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">
                      {transaction.customer_name || 'Unknown Customer'}
                    </h3>
                    
                    {/* Removed pending status badge - using TanStack Query */}
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    {transaction.description || transaction.category}
                  </p>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(transaction.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    ${transaction.amount.toFixed(2)}
                  </div>
                  
                  <div className="text-xs text-gray-500 capitalize">
                    {transaction.payment_method}
                  </div>
                </div>
              </div>

              {/* Removed syncing animation - using TanStack Query */}
            </motion.div>
          ))
        )}
      </div>

      {/* Offline mode indicator */}
      {isCurrentlyOffline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center gap-2 text-red-700">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">
              Offline Mode - Changes will be queued when online
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OptimisticTransactionList;
