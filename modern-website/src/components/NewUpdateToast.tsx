"use client";

import { usePWAStatus } from "next-pwa-pack";
import { X, Download } from "lucide-react";

export function NewUpdateToast() {
  const { hasUpdate, update } = usePWAStatus();
  
  if (!hasUpdate) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
      <Download size={20} />
      <div className="flex-1">
        <p className="font-medium">Update Available!</p>
        <p className="text-sm opacity-90">New version ready to install</p>
      </div>
      <button
        onClick={update}
        className="px-3 py-1 bg-white text-green-500 rounded font-medium hover:bg-gray-100"
      >
        Update Now
      </button>
      <button
        onClick={() => {/* Dismiss logic if needed */}}
        className="p-1 hover:bg-green-600 rounded"
      >
        <X size={16} />
      </button>
    </div>
  );
}
