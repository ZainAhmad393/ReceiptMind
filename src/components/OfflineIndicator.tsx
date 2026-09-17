import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showReconnected) {
    return (
      <div className="fixed bottom-20 sm:bottom-6 left-4 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xl animate-in slide-in-from-bottom-2 duration-200">
        <Wifi className="w-4 h-4" />
        <span>Connected — Syncing live updates</span>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 border border-amber-500/50 px-3.5 py-2 text-xs font-bold text-amber-400 shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
      <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
      <div>
        <span className="block text-white text-[11px]">Offline Mode Active</span>
        <span className="block text-[10px] text-slate-400">Cached receipts and vault are accessible</span>
      </div>
    </div>
  );
};
