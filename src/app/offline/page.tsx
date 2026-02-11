'use client';

import { WifiOff } from 'lucide-react';
import { Metadata } from 'next';

export default function OfflinePage() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#FAF5EC] flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-[#C9F0EF] rounded-full flex items-center justify-center">
            <WifiOff className="w-10 h-10 text-[#21B3B1]" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#4A4A4A] mb-4">
          You're Offline
        </h1>

        <p className="text-[#7A7A7A] mb-8 leading-relaxed">
          It looks like you've lost your internet connection. Some features may not be available until you're back online.
        </p>

        <button
          onClick={handleReload}
          className="bg-[#21B3B1] text-white px-8 py-3 rounded-lg hover:bg-[#168E8C] transition-colors font-medium"
        >
          Try Again
        </button>

        <p className="mt-6 text-sm text-[#7A7A7A]">
          Your connection will be restored automatically when you're back online.
        </p>
      </div>
    </div>
  );
}
