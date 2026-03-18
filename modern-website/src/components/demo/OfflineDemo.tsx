"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface QueuedItem {
  id: string;
  type: 'transaction' | 'post' | 'inventory';
  data: any;
  timestamp: number;
  status: 'pending' | 'synced';
}

export default function OfflineDemo() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queuedItems, setQueuedItems] = useState<QueuedItem[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'complete'>('idle');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('Network restored, starting sync...');
      setSyncStatus('syncing');
      
      // Simulate sync process
      setTimeout(() => {
        setQueuedItems(prev => prev.map(item => ({ ...item, status: 'synced' })));
        setSyncStatus('complete');
        setTimeout(() => {
          setQueuedItems([]);
          setSyncStatus('idle');
        }, 2000);
      }, 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('idle');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addTransaction = () => {
    const newItem: QueuedItem = {
      id: `txn-${Date.now()}`,
      type: 'transaction',
      data: {
        amount: Math.floor(Math.random() * 1000) + 50,
        description: `Sale #${Math.floor(Math.random() * 1000)}`,
        customer: 'Walk-in Customer'
      },
      timestamp: Date.now(),
      status: 'pending'
    };

    setQueuedItems(prev => [...prev, newItem]);
    console.log('Transaction added to queue:', newItem);
  };

  const addPost = () => {
    const newItem: QueuedItem = {
      id: `post-${Date.now()}`,
      type: 'post',
      data: {
        content: 'Great business today! 🎉',
        author: 'Business Owner'
      },
      timestamp: Date.now(),
      status: 'pending'
    };

    setQueuedItems(prev => [...prev, newItem]);
    console.log('Post added to queue:', newItem);
  };

  const addInventory = () => {
    const newItem: QueuedItem = {
      id: `inv-${Date.now()}`,
      type: 'inventory',
      data: {
        itemName: 'Product XYZ',
        stockLevel: Math.floor(Math.random() * 50) + 1,
        price: (Math.random() * 100 + 10).toFixed(2)
      },
      timestamp: Date.now(),
      status: 'pending'
    };

    setQueuedItems(prev => [...prev, newItem]);
    console.log('Inventory update added to queue:', newItem);
  };

  const clearQueue = () => {
    setQueuedItems([]);
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff size={24} className="text-red-500" />;
    if (syncStatus === 'syncing') return <Clock size={24} className="text-yellow-500 animate-pulse" />;
    if (queuedItems.length > 0) return <Clock size={24} className="text-orange-500" />;
    return <CheckCircle size={24} className="text-green-500" />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline Mode';
    if (syncStatus === 'syncing') return 'Syncing...';
    if (queuedItems.length > 0) return 'Pending Items';
    return 'Online & Synced';
  };

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-50 border-red-200 text-red-700';
    if (syncStatus === 'syncing') return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    if (queuedItems.length > 0) return 'bg-orange-50 border-orange-200 text-orange-700';
    return 'bg-green-50 border-green-200 text-green-700';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🌐 Offline-First Demo</h1>
        <p className="text-gray-600 mb-8">Test the offline functionality - works even without internet!</p>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`border rounded-xl p-6 mb-8 ${getStatusColor()}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <div className="text-lg font-semibold">{getStatusText()}</div>
                <div className="text-sm opacity-80">
                  {isOnline ? 'Connected to internet' : 'No internet connection'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{queuedItems.length}</div>
              <div className="text-sm opacity-80">Queued Items</div>
            </div>
          </div>

          {syncStatus === 'complete' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm"
            >
              <CheckCircle size={16} />
              <span>All items synced successfully!</span>
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <button
            onClick={addTransaction}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            💳 Add Transaction
          </button>
          <button
            onClick={addPost}
            className="bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600 transition-colors font-medium"
          >
            🐝 Create Post
          </button>
          <button
            onClick={addInventory}
            className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            📦 Update Inventory
          </button>
        </motion.div>

        {/* Queued Items */}
        {queuedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Queued Items</h3>
              <button
                onClick={clearQueue}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear Queue
              </button>
            </div>
            
            <div className="space-y-3">
              {queuedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`border rounded-lg p-4 ${
                    item.status === 'synced' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-orange-50 border-orange-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium capitalize">
                          {item.type}
                        </span>
                        {item.status === 'pending' && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                            Pending
                          </span>
                        )}
                        {item.status === 'synced' && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Synced
                          </span>
                        )}
                      </div>
                      
                      {item.type === 'transaction' && (
                        <div className="text-sm text-gray-600">
                          <div>Amount: ${item.data.amount}</div>
                          <div>{item.data.description}</div>
                          <div>Customer: {item.data.customer}</div>
                        </div>
                      )}
                      
                      {item.type === 'post' && (
                        <div className="text-sm text-gray-600">
                          <div>"{item.data.content}"</div>
                          <div>By: {item.data.author}</div>
                        </div>
                      )}
                      
                      {item.type === 'inventory' && (
                        <div className="text-sm text-gray-600">
                          <div>Item: {item.data.itemName}</div>
                          <div>Stock: {item.data.stockLevel} units</div>
                          <div>Price: ${item.data.price}</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <AlertCircle size={20} />
            How to Test Offline Functionality
          </h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Turn off your internet connection (WiFi/Cellular)</li>
            <li>Click the buttons above to add transactions, posts, or inventory updates</li>
            <li>Notice they appear as "Pending" items in the queue</li>
            <li>Turn your internet connection back on</li>
            <li>Watch as items automatically sync and change to "Synced" status</li>
            <li>This is exactly how BeeZee works for businesses with poor internet!</li>
          </ol>
        </motion.div>
      </motion.div>
    </div>
  );
}
