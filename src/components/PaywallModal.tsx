import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Crown,
  Check,
  Zap,
  Shield,
  FileSpreadsheet,
  Ban,
  FileCheck2,
  Sparkles,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserSubscription, AppLanguage, PaymentMethod } from '../types';
import { translations } from '../utils/i18n';
import { CreditCard, ChevronRight } from 'lucide-react';

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  onUpgrade: (tier: 'monthly' | 'yearly') => void;
  lang: AppLanguage;
  paymentMethods?: PaymentMethod[];
  onOpenPaymentMethods?: () => void;
}

export const PaywallModal: React.FC<PaywallProps> = ({
  isOpen,
  onClose,
  subscription,
  onUpgrade,
  lang,
  paymentMethods = [],
  onOpenPaymentMethods,
}) => {
  const t = translations[lang].paywall;
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);

  const defaultPayment = paymentMethods.find((p) => p.isDefault) || paymentMethods[0];

  if (!isOpen) return null;

  const features = [
    {
      icon: Zap,
      title: 'Unlimited AI Receipt Scans',
      desc: 'No 20-scan monthly caps. Snap stacks of receipts in batch.',
    },
    {
      icon: Shield,
      title: 'Smart Warranty Claim Assistant',
      desc: 'Auto-generates legal claim letters and finds manufacturer contacts.',
    },
    {
      icon: FileCheck2,
      title: 'Certified Insurance Mode',
      desc: 'Export notarized PDF packages for flood, fire, and theft insurance claims.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Unlimited CSV & Accounting Export',
      desc: 'Instant 1-click downloads for QuickBooks, TurboTax, and Excel.',
    },
    {
      icon: Ban,
      title: 'Zero Ads Forever',
      desc: 'A pure, fast, distraction-free fintech utility experience.',
    },
  ];

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onUpgrade(selectedPlan);

      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#10b981', '#6366f1'],
        });
      } catch {
        // Ignored
      }

      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Background Aura */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-sm">
              ReceiptMind Pro
            </span>
          </div>
          <button
            id="btn-close-paywall"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Hero Header with Imagery */}
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 p-6 text-center space-y-2.5 bg-slate-950">
            <img
              src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80"
              alt="Pro Financial Vault"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-0.5 mx-auto shadow-xl shadow-amber-500/20 flex items-center justify-center mb-2">
                <div className="w-full h-full rounded-[22px] bg-slate-900 flex items-center justify-center">
                  <Crown className="w-7 h-7 text-amber-400" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">{t.title}</h2>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">{t.subtitle}</p>
            </div>
          </div>

          {/* Feature Bullets */}
          <div className="space-y-3 bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <feat.icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{feat.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Plan Selector */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Yearly Plan */}
            <div
              id="plan-selector-yearly"
              onClick={() => setSelectedPlan('yearly')}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedPlan === 'yearly'
                  ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                  : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-extrabold tracking-wider uppercase shadow-sm">
                Save 33%
              </div>
              <span className="text-xs font-bold block text-white">{t.yearlyPlan}</span>
              <div className="text-lg font-extrabold font-mono text-amber-400 mt-1">$39.99</div>
              <span className="text-[10px] text-slate-400 block">$3.33 / month</span>
            </div>

            {/* Monthly Plan */}
            <div
              id="plan-selector-monthly"
              onClick={() => setSelectedPlan('monthly')}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedPlan === 'monthly'
                  ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                  : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:border-slate-600'
              }`}
            >
              <span className="text-xs font-bold block text-white">{t.monthlyPlan}</span>
              <div className="text-lg font-extrabold font-mono text-white mt-1">$4.99</div>
              <span className="text-[10px] text-slate-400 block">Billed monthly</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Payment Method
                </span>
                <span className="font-extrabold text-white text-xs">
                  {defaultPayment
                    ? defaultPayment.type === 'apple_pay'
                      ? 'Apple Pay (Wallet)'
                      : `${defaultPayment.brand?.toUpperCase() || 'Card'} ending in ${defaultPayment.last4}`
                    : 'Add Credit / Debit Card'}
                </span>
              </div>
            </div>

            {onOpenPaymentMethods && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPaymentMethods();
                }}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer"
              >
                <span>Change</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Subscribe CTA */}
          <div className="space-y-2 pt-2">
            <button
              id="btn-subscribe-pro"
              disabled={isProcessing}
              onClick={handleSubscribe}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isProcessing
                ? 'Activating Subscription...'
                : selectedPlan === 'yearly'
                ? 'Start 7-Day Free Trial • $39.99/yr'
                : 'Subscribe Now • $4.99/mo'}
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
              <button
                onClick={() => {
                  alert('Purchases restored. You are already in the highest available demo tier.');
                }}
                className="hover:underline cursor-pointer"
              >
                {t.restorePurchases}
              </button>
              <span>•</span>
              <a href="#" className="hover:underline">
                Terms
              </a>
              <span>•</span>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
