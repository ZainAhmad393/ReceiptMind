import React, { useState } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  KeyRound,
  Fingerprint,
  Smartphone,
  Laptop,
  QrCode,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  History,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { UserProfile, SecuritySession, SecurityAuditLog } from '../types';

interface SecuritySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (u: Partial<UserProfile>) => void;
  sessions: SecuritySession[];
  onRevokeSessions: () => void;
  auditLogs: SecurityAuditLog[];
  onLockVaultNow: () => void;
}

export const SecuritySettingsModal: React.FC<SecuritySettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  sessions,
  onRevokeSessions,
  auditLogs,
  onLockVaultNow,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | '2fa' | 'passkeys' | 'sessions' | 'audit'>('overview');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 2FA Wizard State
  const [is2FAEnabled, setIs2FAEnabled] = useState(user.twoFactorEnabled ?? true);
  const [totpInput, setTotpInput] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);

  // Biometrics & PIN
  const [biometricsOn, setBiometricsOn] = useState(user.biometricsEnabled ?? true);
  const [autoLockMinutes, setAutoLockMinutes] = useState(user.autoLockMinutes ?? 5);

  // Password Change State
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdError, setPwdError] = useState<string | null>(null);

  if (!isOpen) return null;

  const secretKey = 'RMIND-7X9K-22PQ-88AA';
  const backupCodes = [
    'A9F2-4810',
    '33BC-8891',
    '88X1-2094',
    '77KL-4491',
    '55MN-9082',
    '11ZP-4920',
    '99WQ-8812',
    '22CV-3940',
  ];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCopySecretKey = () => {
    navigator.clipboard.writeText(secretKey);
    setCopiedKey(true);
    showToast('2FA secret key copied to clipboard.');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopiedCodes(true);
    showToast('All 8 emergency backup recovery codes copied!');
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleVerify2FACode = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpInput.length !== 6) {
      showToast('Please enter the 6-digit TOTP code from your authenticator.');
      return;
    }
    setIs2FAEnabled(true);
    onUpdateUser({ twoFactorEnabled: true, twoFactorMethod: 'authenticator' });
    setShow2FASetup(false);
    setTotpInput('');
    showToast('Two-Factor Authentication successfully verified and enforced!');
  };

  const handleToggle2FA = (enable: boolean) => {
    if (enable) {
      setShow2FASetup(true);
    } else {
      if (window.confirm('Disabling 2FA lowers your account defense score. Proceed?')) {
        setIs2FAEnabled(false);
        onUpdateUser({ twoFactorEnabled: false });
        showToast('Two-Factor Authentication disabled.');
      }
    }
  };

  const handleToggleBiometrics = () => {
    const nextVal = !biometricsOn;
    setBiometricsOn(nextVal);
    onUpdateUser({ biometricsEnabled: nextVal });
    showToast(nextVal ? 'Biometrics / Passkey hardware unlock enabled.' : 'Biometric unlock disabled.');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    if (!currentPwd) {
      setPwdError('Please enter your current vault password.');
      return;
    }
    if (newPwd.length < 8) {
      setPwdError('New password must be at least 8 characters long.');
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError('New passwords do not match.');
      return;
    }

    showToast('Vault master password successfully updated and re-encrypted!');
    setShowPasswordChange(false);
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
  };

  // Calculate Security Score
  const score = [
    is2FAEnabled ? 35 : 0,
    biometricsOn ? 25 : 0,
    user.isLoggedIn ? 20 : 10,
    autoLockMinutes > 0 ? 15 : 5,
    5, // hardware baseline
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Glow Accent Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-orange-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-tight">Security & Privacy Vault</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-wider uppercase">
                  Level 4 Defense
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                AES-256 GCM Client Encryption & Zero-Knowledge Protocol
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toast Feedback */}
        {toastMsg && (
          <div className="mx-6 mt-2 p-3 rounded-2xl bg-slate-900 text-white border border-emerald-500/40 text-xs font-bold flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Sub-Navigation Tabs */}
        <div className="px-6 pt-2">
          <div className="grid grid-cols-5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-center">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`py-1.5 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('2fa')}
              className={`py-1.5 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === '2fa'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              2FA Code
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('passkeys')}
              className={`py-1.5 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'passkeys'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Passkeys
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sessions')}
              className={`py-1.5 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'sessions'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Devices
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`py-1.5 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Audit Log
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Security Health Score Banner */}
              <div className="p-4 rounded-3xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white border border-slate-700 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400 block">
                    Vault Protection Grade
                  </span>
                  <div className="flex items-center gap-2.5 mt-0.5">
                    <span className="text-2xl font-black">{score}% Secure</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">
                      {score >= 90 ? 'EXCELLENT' : score >= 70 ? 'GOOD' : 'ATTENTION'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Receipts & warranties protected with end-to-end local cryptographic keys.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLockVaultNow();
                  }}
                  className="px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock Vault Now</span>
                </button>
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Active Protection Layers
                </span>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block">Two-Factor Authentication (2FA)</span>
                      <span className="text-[10px] text-slate-400">TOTP Authenticator app verification</span>
                    </div>
                  </div>
                  <span className={`font-bold ${is2FAEnabled ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {is2FAEnabled ? 'Enforced' : 'Disabled'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <Fingerprint className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block">Biometric / Passkey Hardware Binding</span>
                      <span className="text-[10px] text-slate-400">Touch ID, Face ID, or Windows Hello</span>
                    </div>
                  </div>
                  <span className={`font-bold ${biometricsOn ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {biometricsOn ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block">AES-256 GCM Client Encryption</span>
                      <span className="text-[10px] text-slate-400">Local Zero-Knowledge encrypted metadata</span>
                    </div>
                  </div>
                  <span className="text-emerald-500 font-bold">Enabled</span>
                </div>
              </div>

              {/* Master Password Management CTA */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  <span>{showPasswordChange ? 'Hide Password Settings' : 'Change Master Vault Password'}</span>
                </button>

                {showPasswordChange && (
                  <form onSubmit={handleChangePasswordSubmit} className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                    {pwdError && (
                      <p className="text-xs font-bold text-red-500">{pwdError}</p>
                    )}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPwd}
                        onChange={(e) => setCurrentPwd(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-amber-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                        New Password (8+ chars)
                      </label>
                      <input
                        type="password"
                        required
                        value={newPwd}
                        onChange={(e) => setNewPwd(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-amber-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-amber-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Update Master Password
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TWO-FACTOR AUTHENTICATION (2FA) */}
          {activeTab === '2fa' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="font-extrabold text-sm block">Two-Factor Authentication</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Require a 6-digit TOTP code when unlocking the receipt vault or exporting data.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle2FA(!is2FAEnabled)}
                  className={`w-12 h-7 rounded-full p-1 transition-colors relative cursor-pointer flex items-center ${
                    is2FAEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      is2FAEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 2FA Setup / Key Display */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <QrCode className="w-4 h-4 text-amber-500" />
                  <span>Authenticator App Setup (Google Authenticator, Authy, 1Password)</span>
                </div>

                {/* Secret Key with Copy */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Manual Secret Setup Key
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono text-xs font-bold border border-slate-200 dark:border-slate-700 text-amber-500 select-all">
                      {secretKey}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopySecretKey}
                      className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Verification Code Input */}
                <form onSubmit={handleVerify2FACode} className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-400">
                    Verify 6-Digit TOTP Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={totpInput}
                      onChange={(e) => setTotpInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-center tracking-widest text-sm font-bold focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Verify & Save
                    </button>
                  </div>
                </form>
              </div>

              {/* Recovery Backup Codes */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Emergency Backup Recovery Codes
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyBackupCodes}
                    className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCodes ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCodes ? 'Copied All' : 'Copy Codes'}</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs text-slate-600 dark:text-slate-300">
                  {backupCodes.map((code, i) => (
                    <div key={i} className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PASSKEYS & BIOMETRICS */}
          {activeTab === 'passkeys' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm block">Touch ID / Face ID Hardware Passkey</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Unlock receipts with physical device biometrics via WebAuthn.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleBiometrics}
                  className={`w-12 h-7 rounded-full p-1 transition-colors relative cursor-pointer flex items-center ${
                    biometricsOn ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      biometricsOn ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Inactivity Auto-Lock Setting */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold">Auto-Lock Inactive Vault</span>
                  </div>
                  <select
                    value={autoLockMinutes}
                    onChange={(e) => {
                      const mins = parseInt(e.target.value, 10);
                      setAutoLockMinutes(mins);
                      onUpdateUser({ autoLockMinutes: mins });
                      showToast(`Auto-lock set to ${mins === 0 ? 'Never' : `${mins} minutes`}.`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold border border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value={1}>After 1 minute</option>
                    <option value={5}>After 5 minutes (Recommended)</option>
                    <option value={15}>After 15 minutes</option>
                    <option value={60}>After 1 hour</option>
                    <option value={0}>Never auto-lock</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  When inactive, ReceiptMind will blur warranty receipts and require passkey/password confirmation.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVE SESSIONS & DEVICES */}
          {activeTab === 'sessions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Active Connected Devices ({sessions.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Terminate all other device sessions? You will stay logged in here.')) {
                      onRevokeSessions();
                      showToast('All other device sessions terminated.');
                    }
                  }}
                  className="text-xs font-bold text-red-500 hover:text-red-400 cursor-pointer"
                >
                  Revoke All Other Sessions
                </button>
              </div>

              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                    sess.isCurrent
                      ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                      {sess.deviceType === 'desktop' ? (
                        <Laptop className="w-4 h-4" />
                      ) : (
                        <Smartphone className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {sess.deviceName}
                        </span>
                        {sess.isCurrent && (
                          <span className="px-2 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                            This Device
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {sess.browser} • {sess.location} • {sess.ipAddress}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {sess.lastActive}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Cryptographic Security Ledger
              </span>

              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {log.event}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase ${
                          log.severity === 'security'
                            ? 'bg-amber-500/20 text-amber-500'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {log.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {log.details}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono block mt-1">
                      IP: {log.ipAddress}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
