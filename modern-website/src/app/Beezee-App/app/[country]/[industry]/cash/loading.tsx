import React from 'react';

export default function CashLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-4">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        
        {/* Transaction List Skeleton */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
