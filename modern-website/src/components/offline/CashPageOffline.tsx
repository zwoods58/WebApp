import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function CashPageOffline() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900">Cash Transactions</h1>
      </div>
      
      {/* Offline Message */}
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <WifiOff className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">
            You're Offline
          </h2>
          <p className="text-yellow-700 mb-4">
            Cash transactions are not available offline. Please check your internet connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        
        {/* Recent Transactions Placeholder */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Recent Transactions</h3>
          </div>
          <div className="p-8 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <WifiOff className="w-8 h-8 text-gray-400" />
            </div>
            <p>Connect to the internet to view your cash transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
