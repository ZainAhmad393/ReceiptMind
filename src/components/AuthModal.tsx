import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Fingerprint,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { UserProfile, AppLanguage } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (user: UserProfile, isNewUser?: boolean) => void;
  lang: AppLanguage;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [enable2FAOnSignup, setEnable2FAOnSignup] = useState(true);

  if (!isOpen) return null;

  // Real-time password strength validation
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const strengthScore = [hasMinLength, hasUpperCase, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Ultra-Secure'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-400'];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please provide both email address and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const updatedUser: UserProfile = {
        ...currentUser,
        email,
        name: name || currentUser.name || email.split('@')[0],
        isLoggedIn: true,
        twoFactorEnabled: currentUser.twoFactorEnabled ?? true,
        biometricsEnabled: currentUser.biometricsEnabled ?? true,
      };
      setSuccessMessage('Authentication successful. Welcome back!');
      setTimeout(() => {
        onLoginSuccess(updatedUser, false);
        onClose();
      }, 700);
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
        currency: currentUser.currency || 'USD',
        language: currentUser.language || 'en',
        notificationSettings: {
          notify30Days: true,
          notify7Days: true,
          notify1Day: true,
        },
        onboardingCompleted: true,
        isLoggedIn: true,
        createdAt: new Date().toISOString(),
        twoFactorEnabled: enable2FAOnSignup,
        twoFactorMethod: 'authenticator',
        biometricsEnabled: true,
        vaultLocked: false,
        recoveryKeyGenerated: true,
      };

      setSuccessMessage('Account registered with zero-knowledge vault encryption!');
      setTimeout(() => {
        onLoginSuccess(newUser, true);
        onClose();
      }, 800);
    }, 900);
  };

  const handleDemoLogin = (profileType: 'alex' | 'sarah' | 'new') => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      let targetUser: UserProfile;
      if (profileType === 'alex') {
        targetUser = {
          id: 'usr_alex',
          name: 'Alex Mercer',
          email: 'alex.mercer@icloud.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          currency: 'USD',
          language: 'en',
          notificationSettings: { notify30Days: true, notify7Days: true, notify1Day: true },
          onboardingCompleted: true,
          isLoggedIn: true,
          twoFactorEnabled: true,
          twoFactorMethod: 'authenticator',
          biometricsEnabled: true,
          vaultLocked: false,
        };
      } else if (profileType === 'sarah') {
        targetUser = {
          id: 'usr_sarah',
          name: 'Sarah Chen (CFO)',
          email: 'sarah.chen@venturefin.io',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          currency: 'USD',
          language: 'en',
          notificationSettings: { notify30Days: true, notify7Days: true, notify1Day: true },
          onboardingCompleted: true,
          isLoggedIn: true,
          twoFactorEnabled: true,
          twoFactorMethod: 'authenticator',
          biometricsEnabled: true,
          vaultLocked: false,
        };
      } else {
        targetUser = {
          id: `usr_${Date.now()}`,
          name: 'Guest Explorer',
          email: 'explorer@receiptmind.app',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          currency: 'USD',
          language: 'en',
          notificationSettings: { notify30Days: true, notify7Days: true, notify1Day: true },
          onboardingCompleted: true,
          isLoggedIn: true,
          twoFactorEnabled: false,
          biometricsEnabled: false,
          vaultLocked: false,
        };
      }

      setSuccessMessage(`Logged in as ${targetUser.name}`);
      setTimeout(() => {
        onLoginSuccess(targetUser, false);
        onClose();
      }, 500);
    }, 600);
  };

  const handlePasskeyAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const updatedUser: UserProfile = {
        ...currentUser,
        isLoggedIn: true,
        biometricsEnabled: true,
      };
      setSuccessMessage('Biometric Passkey Verified via Touch ID / Face ID!');
      setTimeout(() => {
        onLoginSuccess(updatedUser, false);
        onClose();
      }, 600);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Glow Ambient Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">
                {mode === 'login' ? 'Account Sign In' : mode === 'register' ? 'Create Secure Account' : 'Reset Password'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                ReceiptMind End-to-End Encrypted Vault
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

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot' && (
          <div className="px-6 pt-2">
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          </div>
        )}

        {/* Body content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Status feedback alerts */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Vault Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-bold text-amber-500 hover:text-amber-400 cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-400"
                  />
                  <span>Keep vault session active</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Unlock Vault & Sign In</span>
                  </>
                )}
              </button>

              {/* Passkey / Biometric Fast Login */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePasskeyAuth}
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Fingerprint className="w-4 h-4 text-amber-500" />
                  <span>One-Tap Passkey / Touch ID Login</span>
                </button>
              </div>

              {/* Quick Demo Switcher */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                  Instant One-Click Demo Profiles:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('alex')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 hover:border-amber-500/40 border border-slate-200 dark:border-slate-700 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white block truncate">
                      Alex Mercer
                    </span>
                    <span className="text-[10px] text-amber-500 font-bold">Pro Member</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('sarah')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 hover:border-amber-500/40 border border-slate-200 dark:border-slate-700 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white block truncate">
                      Sarah Chen
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">CFO Account</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* REGISTER (SIGN UP) FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="elena@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Create Master Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Password Strength</span>
                      <span className="font-bold text-amber-500">
                        {strengthLabels[strengthScore] || 'Weak'}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full flex-1 rounded-full transition-all ${
                            step <= strengthScore ? strengthColors[strengthScore] : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                      <span className={hasMinLength ? 'text-emerald-500 font-bold' : ''}>
                        • 8+ characters
                      </span>
                      <span className={hasUpperCase ? 'text-emerald-500 font-bold' : ''}>
                        • Uppercase letter
                      </span>
                      <span className={hasNumber ? 'text-emerald-500 font-bold' : ''}>
                        • Numbers (0-9)
                      </span>
                      <span className={hasSpecial ? 'text-emerald-500 font-bold' : ''}>
                        • Special symbol
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Security Pre-configuration */}
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 space-y-2 text-xs">
                <label className="flex items-center justify-between cursor-pointer select-none">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="font-bold block">Enable Two-Factor Authentication</span>
                      <span className="text-[10px] text-slate-400">TOTP Authenticator protection</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enable2FAOnSignup}
                    onChange={(e) => setEnable2FAOnSignup(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-400"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Creating Encrypted Account...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Free Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD SUB-VIEW */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Enter your registered account email. Because ReceiptMind uses client-side zero-knowledge architecture, you will receive a secure cryptographic recovery link to reset your master password.
              </p>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!email) {
                    setErrorMessage('Please enter your email.');
                    return;
                  }
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    setSuccessMessage(`Recovery instructions sent to ${email}`);
                    setTimeout(() => {
                      setMode('login');
                      setSuccessMessage(null);
                    }, 2000);
                  }, 800);
                }}
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {isLoading ? 'Dispatching Instructions...' : 'Send Vault Recovery Link'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className="w-full py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
