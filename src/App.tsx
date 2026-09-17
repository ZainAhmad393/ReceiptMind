import React, { useState, useEffect } from 'react';
import {
  Home,
  ShieldCheck,
  Plus,
  FileText,
  TrendingUp,
  Settings as SettingsIcon,
  Sparkles,
  Camera,
  Crown,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';
import {
  Receipt,
  WarrantyItem,
  UserProfile,
  UserSubscription,
  AppCurrency,
  AppLanguage,
  PaymentMethod,
  SecuritySession,
  SecurityAuditLog,
} from './types';
import { initialReceipts, computeWarrantiesFromReceipts } from './data/sampleReceipts';
import {
  initialPaymentMethods,
  initialSecuritySessions,
  initialSecurityAuditLogs,
} from './data/sampleSecurityAndPayments';
import { translations, getTranslations } from './utils/i18n';
import { getFallbackProductImage, DEFAULT_PRODUCT_IMAGES, handleImageError } from './utils/imageFallbacks';
import { DashboardView } from './components/DashboardView';
import { WarrantyCenterView } from './components/WarrantyCenterView';
import { ReceiptLibraryView } from './components/ReceiptLibraryView';
import { InsightsView } from './components/InsightsView';
import { SettingsView } from './components/SettingsView';
import { GeminiChatView } from './components/GeminiChatView';
import { ReceiptCaptureModal } from './components/ReceiptCaptureModal';
import { PaywallModal } from './components/PaywallModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { PaymentMethodsModal } from './components/PaymentMethodsModal';
import { SecuritySettingsModal } from './components/SecuritySettingsModal';
import { VaultLockOverlay } from './components/VaultLockOverlay';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { StorePublishingModal } from './components/StorePublishingModal';
import { DiagnosticTestSuiteModal } from './components/DiagnosticTestSuiteModal';
import { LegalDocumentsModal } from './components/LegalDocumentsModal';
import {
  Lock,
  CreditCard,
  KeyRound,
  LogIn,
  LogOut,
  UserCheck,
  ChevronDown,
  Smartphone,
  Cpu,
} from 'lucide-react';

// Hydration helper to ensure all receipts have guaranteed images even if loaded from old localStorage
function hydrateReceiptsWithImages(list: Receipt[]): Receipt[] {
  const initialMap = new Map(initialReceipts.map((r) => [r.id, r]));
  return list.map((r) => {
    const template = initialMap.get(r.id);
    const storeLogoUrl =
      r.storeLogoUrl || template?.storeLogoUrl || getFallbackProductImage(r.store_name);
    const receiptPhotoUrl =
      r.receiptPhotoUrl || template?.receiptPhotoUrl || DEFAULT_PRODUCT_IMAGES.receipt;
    const imageUrl = r.imageUrl || template?.imageUrl || receiptPhotoUrl;

    const items = r.items.map((it, idx) => {
      const templateItem = template?.items[idx];
      return {
        ...it,
        productImageUrl:
          it.productImageUrl ||
          templateItem?.productImageUrl ||
          getFallbackProductImage(it.name, it.category),
      };
    });

    const tags = r.tags && r.tags.length > 0 ? r.tags : template?.tags || [];

    return {
      ...r,
      storeLogoUrl,
      receiptPhotoUrl,
      imageUrl,
      tags,
      items,
    };
  });
}

export default function App() {
  // Local storage state initialization
  const [lang, setLang] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('rm_lang');
    if (saved && (saved === 'en' || saved === 'es' || saved === 'fr' || saved === 'ar' || saved === 'ur')) {
      return saved as AppLanguage;
    }
    return 'en';
  });

  const [currency, setCurrency] = useState<AppCurrency>(() => {
    return (localStorage.getItem('rm_currency') as AppCurrency) || 'USD';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('rm_dark');
    return saved !== null ? saved === 'true' : true; // Default to dark fintech aesthetic
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('rm_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      id: 'usr_default',
      name: 'Alex Mercer',
      email: 'alex.mercer@icloud.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      currency: 'USD',
      language: 'en',
      notificationSettings: {
        notify30Days: true,
        notify7Days: true,
        notify1Day: true,
      },
      onboardingCompleted: true, // will trigger if user explicitly resets
    };
  });

  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    const saved = localStorage.getItem('rm_sub');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      tier: 'free',
      scansUsedThisMonth: 3,
      maxFreeScans: 20,
    };
  });

  const [receipts, setReceipts] = useState<Receipt[]>(() => {
    const savedV4 = localStorage.getItem('rm_receipts_v4');
    if (savedV4) {
      try {
        const parsed = JSON.parse(savedV4);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return hydrateReceiptsWithImages(parsed);
        }
      } catch {}
    }
    const savedOld = localStorage.getItem('rm_receipts');
    if (savedOld) {
      try {
        const parsed = JSON.parse(savedOld);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hydrated = hydrateReceiptsWithImages(parsed);
          localStorage.setItem('rm_receipts_v4', JSON.stringify(hydrated));
          return hydrated;
        }
      } catch {}
    }
    const hydratedInit = hydrateReceiptsWithImages(initialReceipts);
    localStorage.setItem('rm_receipts_v4', JSON.stringify(hydratedInit));
    return hydratedInit;
  });

  // Custom warranty overrides (serials/notes)
  const [warrantyOverrides, setWarrantyOverrides] = useState<Record<string, { serial?: string; notes?: string }>>(() => {
    const saved = localStorage.getItem('rm_warr_overrides');
    return saved ? JSON.parse(saved) : {};
  });

  // Active view tab
  const [activeTab, setActiveTab] = useState<'home' | 'warranties' | 'chat' | 'library' | 'insights' | 'settings'>('home');

  // Modals state
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedReceiptDetail, setSelectedReceiptDetail] = useState<Receipt | null>(null);

  // Authentication, Security & Payment Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isVaultLocked, setIsVaultLocked] = useState(false);

  // Store Publishing, Testing Diagnostics, and Legal Compliance Modals
  const [isPublishingOpen, setIsPublishingOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalInitialTab, setLegalInitialTab] = useState<'privacy' | 'terms'>('privacy');

  // Stored Payment Methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem('rm_payment_methods');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return initialPaymentMethods;
  });

  // Stored Security Sessions & Logs
  const [securitySessions, setSecuritySessions] = useState<SecuritySession[]>(() => {
    const saved = localStorage.getItem('rm_security_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return initialSecuritySessions;
  });

  const [securityLogs, setSecurityLogs] = useState<SecurityAuditLog[]>(() => {
    const saved = localStorage.getItem('rm_security_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return initialSecurityAuditLogs;
  });

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('rm_dark', String(darkMode));
  }, [darkMode]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('rm_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('rm_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('rm_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('rm_sub', JSON.stringify(subscription));
  }, [subscription]);

  useEffect(() => {
    localStorage.setItem('rm_payment_methods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem('rm_security_sessions', JSON.stringify(securitySessions));
  }, [securitySessions]);

  useEffect(() => {
    localStorage.setItem('rm_security_logs', JSON.stringify(securityLogs));
  }, [securityLogs]);

  useEffect(() => {
    localStorage.setItem('rm_receipts', JSON.stringify(receipts));
  }, [receipts]);

  useEffect(() => {
    localStorage.setItem('rm_warr_overrides', JSON.stringify(warrantyOverrides));
  }, [warrantyOverrides]);

  // Compute warranties from receipts and apply overrides
  const computedWarranties = computeWarrantiesFromReceipts(receipts).map((w) => {
    const override = warrantyOverrides[w.id];
    if (override) {
      return {
        ...w,
        serialNumber: override.serial || w.serialNumber,
        notes: override.notes || w.notes,
      };
    }
    return w;
  });

  // Handle saving newly captured receipt
  const handleSaveReceipt = (newReceipt: Receipt) => {
    setReceipts([newReceipt, ...receipts]);
    setSubscription((prev) => ({
      ...prev,
      scansUsedThisMonth: prev.scansUsedThisMonth + 1,
    }));
  };

  // Handle warranty notes update
  const handleUpdateWarrantyNote = (id: string, serial: string, notes: string) => {
    setWarrantyOverrides((prev) => ({
      ...prev,
      [id]: { serial, notes },
    }));
  };

  // Handle updating receipt custom tags
  const handleUpdateReceiptTags = (receiptId: string, tags: string[]) => {
    setReceipts((prev) =>
      prev.map((r) => (r.id === receiptId ? { ...r, tags } : r))
    );
    if (selectedReceiptDetail && selectedReceiptDetail.id === receiptId) {
      setSelectedReceiptDetail((prev) => (prev ? { ...prev, tags } : null));
    }
  };

  // Handle Pro upgrade
  const handleUpgradeSubscription = (plan: 'monthly' | 'yearly') => {
    setSubscription({
      tier: 'premium',
      scansUsedThisMonth: 0,
      maxFreeScans: 999999,
      expiresAt: plan === 'yearly' ? '2027-09-09' : '2026-10-09',
    });
  };

  // Reset/Clear Data
  const handleClearAllData = () => {
    setReceipts([]);
    setWarrantyOverrides({});
    localStorage.removeItem('rm_receipts');
    localStorage.removeItem('rm_warr_overrides');
    setActiveTab('home');
  };

  // Payment methods management handlers
  const handleAddPaymentMethod = (newPm: Omit<PaymentMethod, 'id' | 'createdAt'>) => {
    const created: PaymentMethod = {
      ...newPm,
      id: `pm_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    if (created.isDefault) {
      setPaymentMethods((prev) => [created, ...prev.map((p) => ({ ...p, isDefault: false }))]);
    } else {
      setPaymentMethods((prev) => [...prev, created]);
    }
    const newLog: SecurityAuditLog = {
      id: `log_${Date.now()}`,
      event: 'Payment Method Enrolled',
      details: `${created.brand?.toUpperCase() || created.type} card ending in ${created.last4} verified`,
      timestamp: new Date().toISOString(),
      ipAddress: '198.51.100.42',
      severity: 'info',
    };
    setSecurityLogs((prev) => [newLog, ...prev]);
  };

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => {
      const remaining = prev.filter((p) => p.id !== id);
      if (remaining.length > 0 && !remaining.some((p) => p.isDefault)) {
        remaining[0].isDefault = true;
      }
      return remaining;
    });
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((p) => ({ ...p, isDefault: p.id === id }))
    );
  };

  const handleRevokeOtherSessions = () => {
    setSecuritySessions((prev) => prev.filter((s) => s.isCurrent));
    const newLog: SecurityAuditLog = {
      id: `log_${Date.now()}`,
      event: 'Remote Sessions Revoked',
      details: 'Terminated active credentials on secondary hardware instances',
      timestamp: new Date().toISOString(),
      ipAddress: '198.51.100.42',
      severity: 'security',
    };
    setSecurityLogs((prev) => [newLog, ...prev]);
  };

  const handleLoginSuccess = (updatedUser: UserProfile, isNewUser?: boolean) => {
    setUser(updatedUser);
    setIsVaultLocked(false);
    const newLog: SecurityAuditLog = {
      id: `log_${Date.now()}`,
      event: isNewUser ? 'New Account Registered' : 'Successful Authentication',
      details: `User session active for ${updatedUser.email}`,
      timestamp: new Date().toISOString(),
      ipAddress: '198.51.100.42',
      severity: 'info',
    };
    setSecurityLogs((prev) => [newLog, ...prev]);
  };

  const handleSignOut = () => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
    setIsUserMenuOpen(false);
    const newLog: SecurityAuditLog = {
      id: `log_${Date.now()}`,
      event: 'Sign Out',
      details: 'User logged out of the current device session',
      timestamp: new Date().toISOString(),
      ipAddress: '198.51.100.42',
      severity: 'info',
    };
    setSecurityLogs((prev) => [newLog, ...prev]);
  };

  const handleLockVaultNow = () => {
    setIsVaultLocked(true);
    setIsUserMenuOpen(false);
  };

  const handleUnlockVault = () => {
    setIsVaultLocked(false);
  };

  const isRTL = lang === 'ar' || lang === 'ur';
  const t = getTranslations(lang);

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans antialiased selection:bg-amber-500 selection:text-slate-950"
    >
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  ReceiptMind
                </span>
                {subscription.tier === 'premium' ? (
                  <span className="px-1.5 py-0.2 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[9px] tracking-wider uppercase">
                    PRO
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[9px] tracking-wider uppercase">
                    FREE
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                AI Receipts & Warranties
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            {/* ReceiptMind AI Button in Header */}
            <button
              id="btn-header-receiptmind-ai"
              onClick={() => {
                setSelectedReceiptDetail(null);
                setActiveTab('chat');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 hover:border-amber-500/40'
              }`}
              title="ReceiptMind AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span className="hidden sm:inline">{t.nav.chat || 'ReceiptMind AI'}</span>
            </button>

            {/* Install PWA Button in Header */}
            <PWAInstallButton variant="header" />

            {/* Quick Scan CTA Button in Header */}
            <button
              id="btn-header-quick-scan"
              onClick={() => {
                if (
                  subscription.tier === 'free' &&
                  subscription.scansUsedThisMonth >= subscription.maxFreeScans
                ) {
                  setIsPaywallOpen(true);
                } else {
                  setIsCaptureOpen(true);
                }
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-transform active:scale-95 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan Receipt</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="btn-header-dark-mode"
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 flex items-center justify-center transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile & Security Dropdown Trigger */}
            <div className="relative">
              <button
                id="btn-header-profile-menu"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                title="Account & Security"
              >
                <div className="w-8 h-8 rounded-xl overflow-hidden border-2 border-amber-500 shadow-sm relative">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, DEFAULT_PRODUCT_IMAGES.avatar)}
                    className="w-full h-full object-cover"
                  />
                  {user.twoFactorEnabled && (
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Popover Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2.5 space-y-2 animate-in fade-in zoom-in-95 duration-150">
                    {/* Header info */}
                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                          {user.name}
                        </span>
                        {subscription.tier === 'premium' ? (
                          <span className="px-1.5 py-0.2 rounded-md bg-amber-500 text-slate-950 font-black text-[9px] uppercase">
                            PRO
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              setIsPaywallOpen(true);
                            }}
                            className="text-[10px] font-extrabold text-amber-500 hover:underline"
                          >
                            Upgrade Pro
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                    </div>

                    {/* Menu links */}
                    <div className="space-y-1 text-xs">
                      <button
                        id="menu-btn-security"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsSecurityModalOpen(true);
                        }}
                        className="w-full p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <KeyRound className="w-4 h-4 text-emerald-500" />
                          <span>Security & 2FA</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-500 font-extrabold">
                          94%
                        </span>
                      </button>

                      <button
                        id="menu-btn-payments"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsPaymentModalOpen(true);
                        }}
                        className="w-full p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-amber-500" />
                          <span>Payment Methods</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {paymentMethods.length} saved
                        </span>
                      </button>

                      <button
                        id="menu-btn-lock-vault"
                        onClick={handleLockVaultNow}
                        className="w-full p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Lock className="w-4 h-4 text-amber-500" />
                        <span>Lock Encrypted Vault</span>
                      </button>

                      <button
                        id="menu-btn-publishing"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsPublishingOpen(true);
                        }}
                        className="w-full p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-amber-500" />
                          <span>Publish to Stores</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-extrabold">
                          Ready
                        </span>
                      </button>

                      <button
                        id="menu-btn-diagnostics"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsDiagnosticsOpen(true);
                        }}
                        className="w-full p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Cpu className="w-4 h-4 text-blue-500" />
                        <span>Run Test Suite</span>
                      </button>
                    </div>

                    {/* Auth Actions */}
                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <button
                        id="menu-btn-switch-account"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setAuthModalMode('login');
                          setIsAuthModalOpen(true);
                        }}
                        className="w-full p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogIn className="w-4 h-4 text-slate-400" />
                        <span>Switch / Sign In</span>
                      </button>

                      <button
                        id="menu-btn-signout"
                        onClick={handleSignOut}
                        className="w-full p-2 rounded-xl hover:bg-red-500/10 text-red-500 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main View Container */}
      <main className="max-w-4xl mx-auto px-4 pt-5 pb-28">
        {activeTab === 'home' && (
          <DashboardView
            receipts={receipts}
            warranties={computedWarranties}
            subscription={subscription}
            currency={currency}
            lang={lang}
            onOpenCapture={() => {
              if (
                subscription.tier === 'free' &&
                subscription.scansUsedThisMonth >= subscription.maxFreeScans
              ) {
                setIsPaywallOpen(true);
              } else {
                setIsCaptureOpen(true);
              }
            }}
            onOpenWarrantyCenter={() => setActiveTab('warranties')}
            onOpenPaywall={() => setIsPaywallOpen(true)}
            onOpenChat={() => setActiveTab('chat')}
            onSelectReceipt={(r) => {
              setSelectedReceiptDetail(r);
              setActiveTab('library');
            }}
          />
        )}

        {activeTab === 'chat' && (
          <GeminiChatView
            receipts={receipts}
            warranties={computedWarranties}
            currency={currency}
            lang={lang}
            onSelectReceipt={(r) => {
              setSelectedReceiptDetail(r);
              setActiveTab('library');
            }}
            onOpenWarrantyCenter={() => setActiveTab('warranties')}
          />
        )}

        {activeTab === 'warranties' && (
          <WarrantyCenterView
            warranties={computedWarranties}
            receipts={receipts}
            currency={currency}
            lang={lang}
            onSelectReceipt={(r) => {
              setSelectedReceiptDetail(r);
              setActiveTab('library');
            }}
            onUpdateWarrantyNote={handleUpdateWarrantyNote}
          />
        )}

        {activeTab === 'library' && (
          <ReceiptLibraryView
            receipts={receipts}
            currency={currency}
            lang={lang}
            subscription={subscription}
            selectedReceipt={selectedReceiptDetail}
            onSelectReceipt={setSelectedReceiptDetail}
            onOpenPaywall={() => setIsPaywallOpen(true)}
            onUpdateReceiptTags={handleUpdateReceiptTags}
          />
        )}

        {activeTab === 'insights' && (
          <InsightsView
            receipts={receipts}
            warranties={computedWarranties}
            currency={currency}
            lang={lang}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            user={user}
            subscription={subscription}
            currency={currency}
            lang={lang}
            darkMode={darkMode}
            receipts={receipts}
            warranties={computedWarranties}
            paymentMethods={paymentMethods}
            onUpdateUser={(u) => setUser((prev) => ({ ...prev, ...u }))}
            onChangeCurrency={setCurrency}
            onChangeLang={setLang}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            onOpenPaywall={() => setIsPaywallOpen(true)}
            onClearAllData={handleClearAllData}
            onOpenAuthModal={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
            onOpenPaymentMethodsModal={() => setIsPaymentModalOpen(true)}
            onLockVaultNow={handleLockVaultNow}
            onSignOut={handleSignOut}
            onOpenPublishingModal={() => setIsPublishingOpen(true)}
            onOpenDiagnosticsModal={() => setIsDiagnosticsOpen(true)}
            onOpenLegalModal={(tab) => {
              setLegalInitialTab(tab);
              setIsLegalOpen(true);
            }}
          />
        )}
      </main>

      {/* Floating Bottom Mobile Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="max-w-lg mx-auto px-3 h-16 flex items-center justify-around relative">
          {/* Tab: Dashboard */}
          <button
            id="tab-btn-dashboard"
            onClick={() => {
              setSelectedReceiptDetail(null);
              setActiveTab('home');
            }}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer py-1 ${
              activeTab === 'home'
                ? 'text-amber-500 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{t.nav.home}</span>
          </button>

          {/* Tab: Warranties */}
          <button
            id="tab-btn-warranties"
            onClick={() => {
              setSelectedReceiptDetail(null);
              setActiveTab('warranties');
            }}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer py-1 relative ${
              activeTab === 'warranties'
                ? 'text-amber-500 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{t.nav.warranties}</span>
            {computedWarranties.some((w) => w.status === 'critical' || w.status === 'warning') && (
              <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          {/* Center Prominent Floating Action Button: Capture Receipt */}
          <div className="relative -top-5 flex justify-center">
            <button
              id="fab-scan-receipt"
              onClick={() => {
                if (
                  subscription.tier === 'free' &&
                  subscription.scansUsedThisMonth >= subscription.maxFreeScans
                ) {
                  setIsPaywallOpen(true);
                } else {
                  setIsCaptureOpen(true);
                }
              }}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/35 hover:scale-105 active:scale-95 transition-all border-4 border-white dark:border-slate-900 cursor-pointer"
              title="Scan Receipt with AI"
            >
              <Camera className="w-6 h-6 stroke-[2.2]" />
            </button>
          </div>

          {/* Tab: ReceiptMind AI */}
          <button
            id="tab-btn-chat"
            onClick={() => {
              setSelectedReceiptDetail(null);
              setActiveTab('chat');
            }}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer py-1 relative ${
              activeTab === 'chat'
                ? 'text-amber-500 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="ReceiptMind AI"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <span className="text-[10px] tracking-tight">{t.nav.chat || 'ReceiptMind AI'}</span>
          </button>

          {/* Tab: Receipts Library */}
          <button
            id="tab-btn-library"
            onClick={() => setActiveTab('library')}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer py-1 ${
              activeTab === 'library'
                ? 'text-amber-500 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{t.nav.receipts}</span>
          </button>

          {/* Tab: Settings / Insights */}
          <button
            id="tab-btn-settings"
            onClick={() => {
              setSelectedReceiptDetail(null);
              setActiveTab('settings');
            }}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer py-1 ${
              activeTab === 'settings'
                ? 'text-amber-500 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{t.nav.settings}</span>
          </button>
        </div>
      </nav>

      {/* Camera / Receipt Capture Modal */}
      <ReceiptCaptureModal
        isOpen={isCaptureOpen}
        onClose={() => setIsCaptureOpen(false)}
        onSaveReceipt={handleSaveReceipt}
        lang={lang}
      />

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        subscription={subscription}
        onUpgrade={handleUpgradeSubscription}
        lang={lang}
        paymentMethods={paymentMethods}
        onOpenPaymentMethods={() => setIsPaymentModalOpen(true)}
      />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={(u) => {
          setUser((prev) => ({ ...prev, ...u }));
          setIsOnboardingOpen(false);
        }}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
        currentUser={user}
      />

      {/* Payment Methods Modal */}
      <PaymentMethodsModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentMethods={paymentMethods}
        onAddPaymentMethod={handleAddPaymentMethod}
        onRemovePaymentMethod={handleRemovePaymentMethod}
        onSetDefaultPaymentMethod={handleSetDefaultPaymentMethod}
      />

      {/* Security & 2FA Settings Modal */}
      <SecuritySettingsModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        user={user}
        onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
        sessions={securitySessions}
        auditLogs={securityLogs}
        onRevokeOtherSessions={handleRevokeOtherSessions}
        onLockVaultNow={handleLockVaultNow}
      />

      {/* Vault Lock Screen Overlay */}
      <VaultLockOverlay
        isLocked={isVaultLocked}
        onUnlock={handleUnlockVault}
        userEmail={user.email}
        biometricsEnabled={user.biometricsEnabled}
      />

      {/* Store Publishing Roadmap & Native Packaging Center */}
      <StorePublishingModal
        isOpen={isPublishingOpen}
        onClose={() => setIsPublishingOpen(false)}
        onOpenLegal={(tab) => {
          setLegalInitialTab(tab);
          setIsLegalOpen(true);
        }}
      />

      {/* Diagnostic End-to-End System Test Suite */}
      <DiagnosticTestSuiteModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />

      {/* Legal & App Store Compliance (Privacy Policy & EULA) */}
      <LegalDocumentsModal
        isOpen={isLegalOpen}
        initialTab={legalInitialTab}
        onClose={() => setIsLegalOpen(false)}
      />

      {/* Connectivity & Offline Status Bar */}
      <OfflineIndicator />
    </div>
  );
}
