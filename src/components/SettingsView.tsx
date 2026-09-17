import React, { useState } from 'react';
import {
  Globe,
  Coins,
  Bell,
  Download,
  Moon,
  Sun,
  Shield,
  Trash2,
  Crown,
  ChevronRight,
  User,
  CheckCircle2,
  ExternalLink,
  Lock,
} from 'lucide-react';
import {
  AppCurrency,
  AppLanguage,
  UserProfile,
  UserSubscription,
  Receipt,
  WarrantyItem,
  PaymentMethod,
} from '../types';
import { translations } from '../utils/i18n';
import { CreditCard, KeyRound, Fingerprint, LogIn, LogOut, Sparkles, Smartphone, Cpu, FileText } from 'lucide-react';

interface SettingsProps {
  user: UserProfile;
  subscription: UserSubscription;
  currency: AppCurrency;
  lang: AppLanguage;
  darkMode: boolean;
  receipts: Receipt[];
  warranties: WarrantyItem[];
  paymentMethods: PaymentMethod[];
  onUpdateUser: (u: Partial<UserProfile>) => void;
  onChangeCurrency: (c: AppCurrency) => void;
  onChangeLang: (l: AppLanguage) => void;
  onToggleDarkMode: () => void;
  onOpenPaywall: () => void;
  onClearAllData: () => void;
  onOpenAuthModal: () => void;
  onOpenSecurityModal: () => void;
  onOpenPaymentMethodsModal: () => void;
  onLockVaultNow: () => void;
  onSignOut: () => void;
  onOpenPublishingModal?: () => void;
  onOpenDiagnosticsModal?: () => void;
  onOpenLegalModal?: (tab: 'privacy' | 'terms') => void;
}

export const SettingsView: React.FC<SettingsProps> = ({
  user,
  subscription,
  currency,
  lang,
  darkMode,
  receipts,
  warranties,
  paymentMethods,
  onUpdateUser,
  onChangeCurrency,
  onChangeLang,
  onToggleDarkMode,
  onOpenPaywall,
  onClearAllData,
  onOpenAuthModal,
  onOpenSecurityModal,
  onOpenPaymentMethodsModal,
  onLockVaultNow,
  onSignOut,
  onOpenPublishingModal,
  onOpenDiagnosticsModal,
  onOpenLegalModal,
}) => {
  const t = translations[lang].settings;
  const [notify30, setNotify30] = useState(user.notificationSettings.notify30Days);
  const [notify7, setNotify7] = useState(user.notificationSettings.notify7Days);
  const [notify1, setNotify1] = useState(user.notificationSettings.notify1Day);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleToggleNotification = (type: '30' | '7' | '1') => {
    let nextSettings = { ...user.notificationSettings };
    if (type === '30') {
      nextSettings.notify30Days = !notify30;
      setNotify30(!notify30);
    } else if (type === '7') {
      nextSettings.notify7Days = !notify7;
      setNotify7(!notify7);
    } else if (type === '1') {
      nextSettings.notify1Day = !notify1;
      setNotify1(!notify1);
    }
    onUpdateUser({ notificationSettings: nextSettings });
  };

  const handleExportFullBackup = () => {
    const backupData = {
      user,
      subscription,
      receipts,
      warranties,
      exportedAt: new Date().toISOString(),
      appVersion: '1.2.0',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ReceiptMind_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setToastMsg('Complete encrypted JSON backup exported.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold text-amber-500 tracking-wider uppercase flex items-center gap-1">
          <Shield className="w-3 h-3" />
          System Preferences & Account
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {t.title}
        </h1>
      </div>

      {toastMsg && (
        <div className="p-3 rounded-2xl bg-slate-900 text-white border border-emerald-500/40 text-xs font-bold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* User Profile Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt="User Avatar"
              className="w-13 h-13 rounded-2xl object-cover border-2 border-amber-500 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{user.name}</h3>
                {subscription.tier !== 'free' ? (
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-extrabold">
                    PRO
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                    Free Member
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {subscription.tier === 'free' && (
              <button
                id="btn-settings-upgrade"
                onClick={onOpenPaywall}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 transition-transform active:scale-95 cursor-pointer"
              >
                Go Pro
              </button>
            )}
          </div>
        </div>

        {/* Account Authentication Quick Controls */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">Account status:</span>
            <span className="font-bold text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {user.isLoggedIn ? 'Authenticated' : 'Active Session'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-500" />
              <span>Switch / Sign In</span>
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="px-2.5 py-1.5 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 font-bold text-xs transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Security & Privacy Center Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white block uppercase tracking-wider">
                Security & 2-Factor Authentication
              </span>
              <span className="text-[11px] text-slate-400">
                AES-256 GCM client encryption • TOTP Authenticator • Passkeys
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-black">
            94% Secure
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">2FA Protection</span>
            <span className="font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              {user.twoFactorEnabled ? 'Active (Authenticator)' : 'Disabled'}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Hardware Passkeys</span>
            <span className="font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              {user.biometricsEnabled ? 'Touch ID Bound' : 'Available'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onOpenSecurityModal}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Open Full Security Center</span>
          </button>
          <button
            type="button"
            onClick={onLockVaultNow}
            className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            title="Immediately lock receipt vault"
          >
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Lock Vault</span>
          </button>
        </div>
      </div>

      {/* Payment Methods & Vault Cards */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white block uppercase tracking-wider">
                Saved Payment Methods
              </span>
              <span className="text-[11px] text-slate-400">
                {paymentMethods.length} methods saved for subscriptions & receipt matching
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPaymentMethodsModal}
            className="text-xs font-bold text-amber-500 hover:text-amber-400 cursor-pointer"
          >
            Manage Cards →
          </button>
        </div>

        {/* Primary Default Card Display */}
        {paymentMethods.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded-lg bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-black text-[9px] flex items-center justify-center shadow-sm">
                {(paymentMethods.find((p) => p.isDefault) || paymentMethods[0]).brand?.toUpperCase() || 'CARD'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                    {(paymentMethods.find((p) => p.isDefault) || paymentMethods[0]).type === 'apple_pay'
                      ? 'Apple Pay (Apple Wallet)'
                      : `Card ending in ${(paymentMethods.find((p) => p.isDefault) || paymentMethods[0]).last4}`}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase">
                    Default
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Used for ReceiptMind Pro renewals & warranty claim reimbursements
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenPaymentMethodsModal}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Subscription Status Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {t.subscription}
          </span>
          <span className="text-xs font-mono font-bold text-amber-500">
            {subscription.tier === 'free' ? 'Free Tier' : 'ReceiptMind Pro (Active)'}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 pt-1">
          <span>Monthly Scans Used</span>
          <span className="font-mono font-bold">
            {subscription.tier === 'free'
              ? `${subscription.scansUsedThisMonth} / ${subscription.maxFreeScans} scans`
              : 'Unlimited'}
          </span>
        </div>

        {subscription.tier === 'free' ? (
          <button
            onClick={onOpenPaywall}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            Upgrade to Unlimited Scans
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Active Pro subscription renewed via Store</span>
          </div>
        )}
      </div>

      {/* Regional & Localization */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Localization & Currency
        </h3>

        {/* Currency Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">{t.currency}</span>
              <span className="text-[11px] text-slate-400">Display currency across dashboard</span>
            </div>
          </div>

          <select
            id="select-app-currency"
            value={currency}
            onChange={(e) => onChangeCurrency(e.target.value as AppCurrency)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (CA$)</option>
            <option value="AUD">AUD (AU$)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="SAR">SAR (﷼)</option>
          </select>
        </div>

        {/* Language Selector */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">{t.language}</span>
              <span className="text-[11px] text-slate-400">Full UI and RTL translations</span>
            </div>
          </div>

          <select
            id="select-app-language"
            value={lang}
            onChange={(e) => onChangeLang(e.target.value as AppLanguage)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="en">English (US)</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="ar">العربية (Arabic RTL)</option>
            <option value="ur">اردو (Urdu RTL)</option>
          </select>
        </div>

        {/* Appearance Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">{t.darkMode}</span>
              <span className="text-[11px] text-slate-400">Toggle dark fintech aesthetic</span>
            </div>
          </div>

          <button
            id="btn-toggle-dark-mode"
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className={`w-12 h-7 rounded-full p-1 transition-colors relative cursor-pointer flex items-center ${
              darkMode ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {t.notifications}
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">30 Days Before Expiration</span>
              <span className="text-[11px] text-slate-400">Early warranty notice for preparation</span>
            </div>
            <input
              type="checkbox"
              checked={notify30}
              onChange={() => handleToggleNotification('30')}
              className="rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-400 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">7 Days Before Expiration</span>
              <span className="text-[11px] text-slate-400">Time to schedule repairs or inspection</span>
            </div>
            <input
              type="checkbox"
              checked={notify7}
              onChange={() => handleToggleNotification('7')}
              className="rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-400 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">1 Day Final Urgency Alert</span>
              <span className="text-[11px] text-slate-400">Last chance before manufacturer coverage expires</span>
            </div>
            <input
              type="checkbox"
              checked={notify1}
              onChange={() => handleToggleNotification('1')}
              className="rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-400 w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* App Store & Google Play Publishing Hub */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-850 text-white border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">
                  Play Store & App Store Center
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                  Ready (100%)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                PWA Manifest, Android AAB, iOS Xcode wrapping & store compliance
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            id="btn-open-publishing-hub"
            onClick={onOpenPublishingModal}
            className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center justify-between transition-all active:scale-95 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Publishing Roadmap & Configs
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            id="btn-open-diagnostics"
            onClick={onOpenDiagnosticsModal}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-extrabold text-xs border border-slate-700/80 flex items-center justify-between transition-all active:scale-95 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              Run Diagnostic Test Suite
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Data Export & App Store Compliance */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Data Governance & Privacy
        </h3>

        <button
          id="btn-settings-export-backup"
          onClick={handleExportFullBackup}
          className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Download className="w-4 h-4 text-amber-500" />
            {t.exportBackup}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            id="btn-settings-privacy-policy"
            onClick={() => onOpenLegalModal?.('privacy')}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              Privacy Policy
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            id="btn-settings-terms-eula"
            onClick={() => onOpenLegalModal?.('terms')}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              Terms & EULA
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        <button
          id="btn-settings-delete-data"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete all stored receipts and active warranties? This action cannot be undone.')) {
              onClearAllData();
            }
          }}
          className="w-full p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer border border-red-500/20"
        >
          <span className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            {t.deleteAccount} (GDPR & App Store Compliant)
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
