import React, { useState } from 'react';
import { ShieldCheck, Lock, Fingerprint, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface VaultLockOverlayProps {
  isLocked: boolean;
  user: UserProfile;
  onUnlock: () => void;
}

export const VaultLockOverlay: React.FC<VaultLockOverlayProps> = ({
  isLocked,
  user,
  onUnlock,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isLocked) return null;

  const handleUnlockWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setErrorMsg('Please enter your 4-digit PIN or master password.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onUnlock();
      setPin('');
      setErrorMsg(null);
    }, 500);
  };

  const handleBiometricUnlock = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onUnlock();
      setErrorMsg(null);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 text-white p-6 shadow-2xl text-center space-y-5">
        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 mx-auto shadow-xl shadow-amber-500/20 flex items-center justify-center">
          <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center">
            <Lock className="w-7 h-7 text-amber-400" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Vault Locked</h2>
          <p className="text-xs text-slate-400 mt-1">
            Receipts, warranties, and payment cards are encrypted with AES-256 GCM.
          </p>
        </div>

        {/* User Badge */}
        <div className="flex items-center justify-center gap-2 p-2 rounded-2xl bg-slate-800/80 border border-slate-700/60 max-w-xs mx-auto">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt="User"
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-xs font-bold text-slate-200 truncate">{user.name}</span>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleUnlockWithPin} className="space-y-3">
          <input
            type="password"
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN or Password"
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-center font-mono tracking-widest text-sm focus:ring-2 focus:ring-amber-500"
          />

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isVerifying ? 'Decrypting Vault...' : 'Unlock Vault'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleBiometricUnlock}
          disabled={isVerifying}
          className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-700"
        >
          <Fingerprint className="w-4 h-4 text-amber-400" />
          <span>Unlock with Touch ID / Face ID</span>
        </button>
      </div>
    </div>
  );
};
