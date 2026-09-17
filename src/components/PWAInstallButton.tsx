import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle2 } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'button' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already running as an installed PWA or app container, hide or show badge
  if (isInstalled) {
    if (variant === 'compact') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
          <CheckCircle2 className="w-3 h-3" />
          App Active
        </span>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setJustInstalled(true);
      setTimeout(() => setJustInstalled(false), 4000);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'header') {
      return (
        <button
          id="btn-pwa-install-header"
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 transition-all active:scale-95 cursor-pointer ${className}`}
          title="Install ReceiptMind App on your device"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      );
    }

    return (
      <button
        id="btn-pwa-install"
        onClick={handleInstallClick}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all active:scale-95 cursor-pointer ${className}`}
      >
        <Download className="w-4 h-4" />
        <span>Install ReceiptMind App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not fired by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          id="btn-pwa-install-ios"
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 ${className}`}
          title="Install on iPhone or iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-500" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Install on iPhone / iPad
                    </h3>
                    <p className="text-[11px] text-slate-400">Launch from your Home Screen with camera access</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <p>
                    Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline text-blue-500" /> at the bottom of your Safari browser bar.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <p>
                    Scroll down and select <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline text-amber-500" />.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <p>
                    Tap <strong>Add</strong> in the top-right corner. ReceiptMind will appear on your screen as a native application!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback if browser ambient badge handles it
  return null;
};
