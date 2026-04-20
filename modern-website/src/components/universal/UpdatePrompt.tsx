'use client';

import { useServiceWorkerVersion } from '@/hooks/useServiceWorkerVersion';

export default function UpdatePrompt() {
  const { isUpdateAvailable, applyUpdate } = useServiceWorkerVersion();

  if (!isUpdateAvailable) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[9999] animate-slide-up">
      <div className="bg-[#1A2332] text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-sm">Update Available</p>
          <p className="text-xs text-white/70">A new version of BeeZee is ready</p>
        </div>
        <button
          onClick={applyUpdate}
          className="bg-white text-[#1A2332] font-bold text-sm px-4 py-2 rounded-xl whitespace-nowrap"
        >
          Update Now
        </button>
      </div>
    </div>
  );
}
