"use client";

import React, { useState } from 'react';
import PullToRefresh from './PullToRefresh';
import { RefreshCw, Download } from 'lucide-react';

export default function PullToRefreshExample() {
  const [data, setData] = useState([
    { id: 1, title: 'Item 1', description: 'Description for item 1', timestamp: new Date() },
    { id: 2, title: 'Item 2', description: 'Description for item 2', timestamp: new Date() },
    { id: 3, title: 'Item 3', description: 'Description for item 3', timestamp: new Date() },
  ]);

  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const handleRefresh = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add new random item
    const newItem = {
      id: data.length + 1,
      title: `Item ${data.length + 1}`,
      description: `Description for item ${data.length + 1}`,
      timestamp: new Date()
    };
    
    setData(prev => [newItem, ...prev.slice(0, 4)]); // Keep max 5 items
    setLastRefresh(new Date());
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-4 p-4">
        <div className="flex items-center gap-2 mb-3">
          <RefreshCw size={20} className="text-blue-600" />
          <h2 className="text-lg font-semibold">Pull to Refresh Demo</h2>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Pull down on the list below to refresh the data.
        </p>
        {lastRefresh && (
          <p className="text-xs text-gray-500">
            Last refreshed: {lastRefresh.toLocaleTimeString()}
          </p>
        )}
      </div>

      <PullToRefresh 
        onRefresh={handleRefresh}
        className="h-[500px]"
      >
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </PullToRefresh>
    </div>
  );
}
