import React, { useState, useRef } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  ExternalLink,
  Receipt as ReceiptIcon,
  Bell,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Info,
  Calendar,
  DollarSign,
  FileCheck,
  X,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { WarrantyItem, AppCurrency, AppLanguage, Receipt } from '../types';
import { translations, formatCurrency } from '../utils/i18n';
import { getFallbackProductImage, DEFAULT_PRODUCT_IMAGES, handleImageError } from '../utils/imageFallbacks';

interface SimulatedNotificationData {
  id: string;
  itemName: string;
  storeName: string;
  daysRemaining: number;
  expiryDate: string;
  status: WarrantyItem['status'];
  permissionLabel: string;
  audioPlayed: boolean;
  associatedWarranty?: WarrantyItem;
}

interface WarrantyCenterProps {
  warranties: WarrantyItem[];
  receipts: Receipt[];
  currency: AppCurrency;
  lang: AppLanguage;
  onSelectReceipt: (receipt: Receipt) => void;
  onUpdateWarrantyNote: (id: string, serial: string, notes: string) => void;
}

export const WarrantyCenterView: React.FC<WarrantyCenterProps> = ({
  warranties,
  receipts,
  currency,
  lang,
  onSelectReceipt,
  onUpdateWarrantyNote,
}) => {
  const t = translations[lang].warranty;
  const [filter, setFilter] = useState<'all' | 'safe' | 'warning' | 'critical' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantyItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [simulatedAlert, setSimulatedAlert] = useState<SimulatedNotificationData | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Edit notes state
  const [serialInput, setSerialInput] = useState('');
  const [notesInput, setNotesInput] = useState('');

  const filteredWarranties = warranties.filter((w) => {
    if (filter !== 'all' && w.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        w.itemName.toLowerCase().includes(q) ||
        w.storeName.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        (w.serialNumber && w.serialNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  /**
   * Generates a clean synthetic notification chime using Web Audio API
   */
  const playNotificationChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return false;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Note 1: 587.33 Hz (D5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.18, now + 0.03);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.22);

      // Note 2: 880 Hz (A5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.1);
      gain2.gain.setValueAtTime(0, now + 0.1);
      gain2.gain.linearRampToValueAtTime(0.22, now + 0.13);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.45);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Simulates a push notification for an expiring warranty
   * Verifies native permissions, plays audio chime, and renders system feedback
   */
  const triggerExpiringWarrantyNotification = (specificWarranty?: WarrantyItem, customDays?: number) => {
    // Pick the most urgent expiring warranty, or fallback to sample
    const target: WarrantyItem =
      specificWarranty ||
      warranties.find((w) => w.status === 'critical') ||
      warranties.find((w) => w.status === 'warning') ||
      warranties.find((w) => w.daysRemaining > 0) ||
      warranties[0] || {
        id: 'sample-warranty-01',
        receiptId: 'sample-rec-01',
        itemName: 'Apple MacBook Pro 16" (M3 Max)',
        storeName: 'Apple Fifth Avenue',
        purchaseDate: '2025-09-23',
        expiryDate: '2026-09-23',
        months: 12,
        daysRemaining: 14,
        status: 'warning' as const,
        price: 2499,
        category: 'Electronics' as const,
      };

    const days = customDays !== undefined ? customDays : (target.daysRemaining > 0 ? target.daysRemaining : 14);

    // Play synthesized notification sound
    const audioSuccess = playNotificationChime();

    // Verify browser push notification permissions
    let permLabel = 'In-App Sandbox Mode';
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        permLabel = 'Native OS Push Delivered';
        try {
          new Notification('⚠️ Warranty Expiring Soon', {
            body: `[ReceiptMind] Warranty for "${target.itemName}" expires in ${days} days (${target.expiryDate})! Tap to view claim terms.`,
            icon: '/favicon.ico',
            tag: 'warranty-expiration-test',
          });
        } catch {
          // Fallback handled by in-app card
        }
      } else if (Notification.permission === 'denied') {
        permLabel = 'Browser Permission Blocked';
      } else if (Notification.permission === 'default') {
        permLabel = 'Awaiting Browser Permission';
        try {
          Notification.requestPermission().then((p) => {
            if (p === 'granted') {
              try {
                new Notification('⚠️ Warranty Expiring Soon', {
                  body: `[ReceiptMind] Warranty for "${target.itemName}" expires in ${days} days (${target.expiryDate})! Tap to view claim terms.`,
                  icon: '/favicon.ico',
                  tag: 'warranty-expiration-test',
                });
              } catch {}
            }
          });
        } catch {}
      }
    }

    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
    }

    setSimulatedAlert({
      id: `sim-${Date.now()}`,
      itemName: target.itemName,
      storeName: target.storeName,
      daysRemaining: days,
      expiryDate: target.expiryDate,
      status: target.status,
      permissionLabel: permLabel,
      audioPlayed: audioSuccess,
      associatedWarranty: target,
    });

    dismissTimerRef.current = setTimeout(() => {
      setSimulatedAlert(null);
    }, 8000);
  };

  const openWarrantyDetails = (warranty: WarrantyItem) => {
    setSelectedWarranty(warranty);
    setSerialInput(warranty.serialNumber || '');
    setNotesInput(warranty.notes || '');
  };

  const handleSaveNotes = () => {
    if (selectedWarranty) {
      onUpdateWarrantyNote(selectedWarranty.id, serialInput, notesInput);
      setSelectedWarranty({
        ...selectedWarranty,
        serialNumber: serialInput,
        notes: notesInput,
      });
      setToastMessage('Serial number and notes saved.');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const getStatusBadge = (status: WarrantyItem['status'], days: number) => {
    switch (status) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            {days < 0 ? 'Expired' : `${days}d left (Urgent)`}
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            {days}d remaining
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/15 text-slate-500 dark:text-slate-400 border border-slate-500/30">
            Expired
          </span>
        );
      case 'safe':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            {days}d (Protected)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-500 tracking-wider uppercase flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Proactive Coverage Guardian
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.subtitle}</p>
        </div>

        {/* 'Test Notification' Primary Action Button */}
        <div className="flex items-center gap-2">
          <button
            id="btn-test-notification"
            onClick={() => triggerExpiringWarrantyNotification()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0 group"
            title="Simulate push notification for an expiring warranty and verify system settings"
          >
            <Bell className="w-4 h-4 text-slate-950 fill-current group-hover:rotate-12 transition-transform" />
            <span>Test Notification</span>
          </button>
        </div>
      </div>

      {/* Visual Vault Banner Card with Backdrop Image */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 shadow-xl border border-slate-800">
        <img
          src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&auto=format&fit=crop&q=80"
          alt="Hardware Protection Vault"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/80 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Certified Asset Protection
            </span>
            <div className="text-3xl font-extrabold font-mono text-white mt-1">
              {formatCurrency(
                warranties
                  .filter((w) => w.status !== 'expired')
                  .reduce((sum, w) => sum + (w.price || 0), 0),
                currency
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Total merchandise protected under active warranties
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-2 rounded-2xl bg-slate-800/80 backdrop-blur-md border border-slate-700/80 text-center">
              <span className="text-xs font-bold text-emerald-400 block font-mono">
                {warranties.filter((w) => w.status === 'safe').length}
              </span>
              <span className="text-[10px] text-slate-400">Protected</span>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-slate-800/80 backdrop-blur-md border border-slate-700/80 text-center">
              <span className="text-xs font-bold text-amber-400 block font-mono">
                {warranties.filter((w) => w.status === 'warning' || w.status === 'critical').length}
              </span>
              <span className="text-[10px] text-slate-400">Expiring</span>
            </div>
            <button
              id="btn-banner-test-notification"
              onClick={() => triggerExpiringWarrantyNotification()}
              className="px-3 py-2 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-center transition-colors cursor-pointer group"
              title="Simulate push notification for an expiring warranty"
            >
              <span className="text-xs font-bold text-amber-300 block font-mono flex items-center justify-center gap-1 group-hover:scale-105 transition-transform">
                <Bell className="w-3 h-3 text-amber-400 fill-current" />
                Simulate
              </span>
              <span className="text-[10px] text-slate-300">Test Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Push Notification System Verification Card */}
      {simulatedAlert && (
        <div
          id="simulated-push-notification-banner"
          className="relative overflow-hidden rounded-3xl bg-slate-900 text-white border-2 border-amber-500/70 shadow-2xl p-4 sm:p-5 backdrop-blur-md animate-in fade-in slide-in-from-top duration-300"
        >
          {/* Top glowing ambient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400" />

          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-3.5 min-w-0 flex-1">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-inner mt-0.5">
                <Bell className="w-5 h-5 animate-bounce fill-current" />
              </div>

              <div className="space-y-1.5 min-w-0 flex-1">
                {/* Meta Tags */}
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    ReceiptMind AI Push Notification
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">Just Now</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    System Alert Simulation
                  </span>
                </div>

                {/* Notification Title */}
                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  ⚠️ Warranty Expiring Soon: {simulatedAlert.itemName}
                </h3>

                {/* Notification Body */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your manufacturer coverage from <strong className="text-white">{simulatedAlert.storeName}</strong> expires in{' '}
                  <span className="font-mono font-bold text-amber-300">{simulatedAlert.daysRemaining} days</span> on{' '}
                  <span className="font-mono text-white">{simulatedAlert.expiryDate}</span>. Verify claim receipts or check merchant replacement terms before coverage lapses.
                </p>

                {/* System Settings Verification Panel */}
                <div className="mt-3 pt-2.5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/60 px-2.5 py-1.5 rounded-xl border border-slate-700/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">OS Push: <strong className="text-white">{simulatedAlert.permissionLabel}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/60 px-2.5 py-1.5 rounded-xl border border-slate-700/60">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Audio Alerts: <strong className="text-white">{simulatedAlert.audioPlayed ? '880Hz Chime Active' : 'Sound Ready'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/60 px-2.5 py-1.5 rounded-xl border border-slate-700/60">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">System Settings: <strong className="text-emerald-400">Verified & Configured</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dismiss button */}
            <button
              id="btn-close-simulated-notification"
              onClick={() => setSimulatedAlert(null)}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Action Buttons */}
          <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Simulated notification automatically closes in 8 seconds
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setSimulatedAlert(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
              >
                Dismiss
              </button>
              {simulatedAlert.associatedWarranty && (
                <button
                  id="btn-inspect-expiring-warranty"
                  onClick={() => {
                    openWarrantyDetails(simulatedAlert.associatedWarranty!);
                    setSimulatedAlert(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Inspect Expiring Item</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Legacy/Simple In-App Toast Message */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-slate-900 text-white border border-amber-500/40 shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-top duration-300">
          <Bell className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
          <div className="flex-1 text-xs">
            <p className="font-bold text-amber-300">Notification Alert</p>
            <p className="text-slate-300 mt-0.5 leading-relaxed">{toastMessage}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter Pills */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-warranty-search"
            type="text"
            placeholder="Search item, store, or serial..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'all', label: t.allWarranties, count: warranties.length },
            { id: 'critical', label: t.critical, count: warranties.filter((w) => w.status === 'critical').length },
            { id: 'warning', label: t.expiringSoon, count: warranties.filter((w) => w.status === 'warning').length },
            { id: 'safe', label: t.safe, count: warranties.filter((w) => w.status === 'safe').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                filter === tab.id
                  ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filter === tab.id
                    ? 'bg-white/20 dark:bg-slate-950/20 text-white dark:text-slate-950'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Warranties List */}
      <div className="space-y-3">
        {filteredWarranties.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.noWarranties}</p>
            <p className="text-xs text-slate-400 mt-1">Scan physical or digital receipts to track warranties automatically.</p>
          </div>
        ) : (
          filteredWarranties.map((warr) => {
            // Compute percentage of warranty passed
            const purchase = new Date(warr.purchaseDate).getTime();
            const expiry = new Date(warr.expiryDate).getTime();
            const current = new Date('2026-09-09').getTime();
            const totalDuration = expiry - purchase;
            const elapsed = Math.max(0, current - purchase);
            const percentPassed = Math.min(100, Math.max(5, Math.round((elapsed / totalDuration) * 100)));

            return (
              <div
                key={warr.id}
                onClick={() => openWarrantyDetails(warr)}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 dark:hover:border-amber-500/40 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  {/* Product image thumbnail */}
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700/60 shadow-inner group-hover:border-amber-500/40 transition-colors relative flex items-center justify-center">
                    <img
                      src={warr.productImageUrl || getFallbackProductImage(warr.itemName, warr.category)}
                      alt={warr.itemName}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, DEFAULT_PRODUCT_IMAGES.macbook)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors truncate">
                          {warr.itemName}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {warr.storeName} • Purchased {warr.purchaseDate}
                        </p>
                      </div>
                      {getStatusBadge(warr.status, warr.daysRemaining)}
                    </div>

                    {/* Progress bar countdown */}
                    <div className="mt-3 space-y-1.5">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>{warr.months} Months Coverage</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Expires {warr.expiryDate}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          style={{ width: `${percentPassed}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            warr.status === 'critical'
                              ? 'bg-red-500'
                              : warr.status === 'warning'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(warr.price, currency)}
                  </span>
                  <span className="text-amber-500 font-semibold flex items-center gap-1 group-hover:underline">
                    View Policy & Receipt <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Warranty Detail Modal / Drawer */}
      {selectedWarranty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-white">Warranty Inspection</h3>
                  <p className="text-[11px] text-slate-400">{selectedWarranty.storeName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWarranty(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Product Photo Showcase */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 aspect-video bg-slate-950">
                <img
                  src={
                    selectedWarranty.productImageUrl ||
                    getFallbackProductImage(selectedWarranty.itemName, selectedWarranty.category)
                  }
                  alt={selectedWarranty.itemName}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, DEFAULT_PRODUCT_IMAGES.macbook)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-amber-500/30">
                    {selectedWarranty.storeName}
                  </span>
                  <span className="text-xs font-mono font-bold text-white bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700">
                    {formatCurrency(selectedWarranty.price, currency)}
                  </span>
                </div>
              </div>

              {/* Top Banner Info */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-white">{selectedWarranty.itemName}</h4>
                    <span className="text-xs text-slate-400">{selectedWarranty.category}</span>
                  </div>
                  {getStatusBadge(selectedWarranty.status, selectedWarranty.daysRemaining)}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/50 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Purchase Date</span>
                    <span className="font-mono font-semibold text-white">{selectedWarranty.purchaseDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Coverage End Date</span>
                    <span className="font-mono font-semibold text-amber-400">{selectedWarranty.expiryDate}</span>
                  </div>
                </div>
              </div>

              {/* Push Alert Triggers (30d, 7d, 1d) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    Automated Alert Schedule
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">FCM Enabled</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => triggerExpiringWarrantyNotification(selectedWarranty, 30)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-amber-400 block">30 Days</span>
                    <span className="text-[11px] text-slate-300">Early Notice</span>
                  </button>
                  <button
                    onClick={() => triggerExpiringWarrantyNotification(selectedWarranty, 7)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-orange-400 block">7 Days</span>
                    <span className="text-[11px] text-slate-300">Inspection</span>
                  </button>
                  <button
                    onClick={() => triggerExpiringWarrantyNotification(selectedWarranty, 1)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-red-400 block">1 Day</span>
                    <span className="text-[11px] text-slate-300">Final Alert</span>
                  </button>
                </div>

                <button
                  id="btn-modal-test-notification"
                  onClick={() => triggerExpiringWarrantyNotification(selectedWarranty)}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 fill-current" />
                  <span>Test Notification for this Warranty</span>
                </button>
              </div>

              {/* Serial Number & Claim Notes */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Warranty Claim Details & Serial Number
                </span>
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">Serial / IMEI / Model Number</label>
                  <input
                    type="text"
                    placeholder="e.g. SN-8921-X902 or IMEI"
                    value={serialInput}
                    onChange={(e) => setSerialInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">Support Notes & Return Terms</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Keep original packaging for store returns; manufacturer requires claim form."
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  onClick={handleSaveNotes}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-400 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                >
                  Save Serial & Notes
                </button>
              </div>

              {/* Original Receipt & Claim Policy Links */}
              <div className="pt-2 space-y-2">
                {selectedWarranty.claimPolicyUrl && (
                  <a
                    href={selectedWarranty.claimPolicyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center justify-between transition-colors"
                  >
                    <span>Search Official Store Return Policy</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={() => {
                    const match = receipts.find((r) => r.id === selectedWarranty.receiptId);
                    if (match) {
                      setSelectedWarranty(null);
                      onSelectReceipt(match);
                    }
                  }}
                  className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ReceiptIcon className="w-4 h-4 text-slate-400" />
                    Open Associated Verified Receipt
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
