import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Zap,
  Tag,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Crown,
  Eye,
  Receipt as ReceiptIcon,
  Calendar,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';
import { Receipt, UserSubscription, WarrantyItem, AppCurrency, AppLanguage } from '../types';
import { translations, getTranslations, formatCurrency } from '../utils/i18n';
import { getFallbackProductImage, DEFAULT_PRODUCT_IMAGES, handleImageError } from '../utils/imageFallbacks';

interface DashboardViewProps {
  receipts: Receipt[];
  warranties: WarrantyItem[];
  subscription: UserSubscription;
  currency: AppCurrency;
  lang: AppLanguage;
  onOpenCapture: () => void;
  onOpenWarrantyCenter: () => void;
  onOpenPaywall: () => void;
  onSelectReceipt: (receipt: Receipt) => void;
  onOpenChat?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  receipts,
  warranties,
  subscription,
  currency,
  lang,
  onOpenCapture,
  onOpenWarrantyCenter,
  onOpenPaywall,
  onSelectReceipt,
  onOpenChat,
}) => {
  const t = getTranslations(lang).home;
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Compute metrics
  const now = new Date('2026-09-09');
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Filter this month's receipts (August/September 2026)
  const thisMonthReceipts = receipts.filter((r) => {
    const d = new Date(r.date);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const totalThisMonth = thisMonthReceipts.reduce((acc, r) => acc + r.total, 0);

  // Expiring warranties
  const urgentWarranties = warranties.filter(
    (w) => w.status === 'critical' || w.status === 'warning'
  );

  // Most recent scan for Featured Receipt card
  const sortedReceipts = [...receipts].sort(
    (a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()
  );
  const featuredReceipt = sortedReceipts[0] || null;

  // Category totals
  const categoryTotals: Record<string, number> = {};
  receipts.forEach((r) => {
    r.items.forEach((it) => {
      categoryTotals[it.category] = (categoryTotals[it.category] || 0) + it.price;
    });
  });

  const categoryEntries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const totalAllCategories = categoryEntries.reduce((acc, [, val]) => acc + val, 0) || 1;
  const topCategoryName = categoryEntries[0]?.[0] || 'Electronics';
  const topCategoryPercent = Math.round(((categoryEntries[0]?.[1] || 0) / totalAllCategories) * 100);

  // Category colors palette
  const categoryColors: Record<string, { fill: string; dot: string }> = {
    Electronics: { fill: '#F59E0B', dot: 'bg-amber-400' },
    'Home & Furniture': { fill: '#10B981', dot: 'bg-emerald-400' },
    Clothing: { fill: '#3B82F6', dot: 'bg-blue-400' },
    Groceries: { fill: '#EC4899', dot: 'bg-pink-400' },
    Dining: { fill: '#8B5CF6', dot: 'bg-purple-400' },
    'Health & Beauty': { fill: '#06B6D4', dot: 'bg-cyan-400' },
    Other: { fill: '#64748B', dot: 'bg-slate-400' },
  };

  // 6-Month spending history trend data
  const monthlyTrends = [
    { month: 'Apr', amount: 980 },
    { month: 'May', amount: 1420 },
    { month: 'Jun', amount: 1190 },
    { month: 'Jul', amount: 2150 },
    { month: 'Aug', amount: 6470 },
    { month: 'Sep', amount: totalThisMonth || 1480 },
  ];

  const maxTrend = Math.max(...monthlyTrends.map((m) => m.amount), 2000);

  // SVG Donut calculation
  let cumulativeAngle = 0;
  const donutSlices = categoryEntries.map(([cat, amount]) => {
    const percentage = amount / totalAllCategories;
    const angle = percentage * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (startAngle + angle - 90) * (Math.PI / 180);

    const x1 = 100 + 70 * Math.cos(startRad);
    const y1 = 100 + 70 * Math.sin(startRad);
    const x2 = 100 + 70 * Math.cos(endRad);
    const y2 = 100 + 70 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;
    const pathData = `M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      cat,
      amount,
      percentage: Math.round(percentage * 100),
      pathData,
      color: categoryColors[cat]?.fill || '#94a3b8',
    };
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Top Welcome Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-amber-500 tracking-wider uppercase flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" />
            AI Expense & Warranty Engine
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
        </div>

        {/* Free scans counter badge */}
        {subscription.tier === 'free' ? (
          <button
            id="btn-dash-upgrade-badge"
            onClick={onOpenPaywall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>
              {subscription.maxFreeScans - subscription.scansUsedThisMonth} free scans left
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Crown className="w-3.5 h-3.5" />
            <span>Pro Unlimited</span>
          </div>
        )}
      </div>

      {/* Main Anchor Card: Monthly Spending */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-7 shadow-xl border border-slate-800">
        <img
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop&q=80"
          alt="Financial Dashboard Backdrop"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">{t.thisMonthSpending}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold">
              <TrendingUp className="w-3 h-3" />
              +14% {t.vsLastMonth}
            </span>
          </div>

          <div className="my-4">
            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-mono">
              {formatCurrency(totalThisMonth, currency)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tracked across {thisMonthReceipts.length} verified receipts this month
            </p>
          </div>

          {/* Quick Action Quick Bar */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-medium">Auto-categorized by AI Vision</span>
            </div>
            <button
              id="btn-dash-quick-scan"
              onClick={onOpenCapture}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Scan Now
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Warranty Expirations Card */}
        <div
          id="card-dash-warranties"
          onClick={onOpenWarrantyCenter}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-slate-400 group-hover:text-amber-500 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.activeWarranties}
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {warranties.length} Active Items
            </div>
            {urgentWarranties.length > 0 ? (
              <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {urgentWarranties.length} {t.expiringSoon}
                </span>
              </div>
            ) : (
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5">
                All warranties safely protected
              </div>
            )}
          </div>
        </div>

        {/* Top Category Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {topCategoryPercent}% of budget
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.topCategory}
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {topCategoryName}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              {formatCurrency(categoryEntries[0]?.[1] || 0, currency)} total tracked
            </p>
          </div>
        </div>
      </div>

      {/* Gemini AI Financial & Warranty Copilot Showcase Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-5 sm:p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
          alt="Gemini AI Ambient"
          referrerPolicy="no-referrer"
          onError={(e) => handleImageError(e, DEFAULT_PRODUCT_IMAGES.macbook)}
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3.5 max-w-md">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shrink-0 shadow-lg shadow-amber-500/20">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="AI Copilot"
              referrerPolicy="no-referrer"
              onError={(e) => handleImageError(e, DEFAULT_PRODUCT_IMAGES.botAvatar)}
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ReceiptMind AI
              </span>
              <span className="text-xs text-slate-400 font-medium">• 24/7 Smart Assistant</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
              ReceiptMind AI Assistant
            </h3>
            <p className="text-xs text-slate-300 line-clamp-1">
              "Which warranties expire soon?" or "Draft a warranty claim letter"
            </p>
          </div>
        </div>

        <button
          onClick={onOpenChat}
          className="relative z-10 w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch ReceiptMind AI</span>
        </button>
      </div>

      {/* Featured Protected Hardware Showcase (Always Visible Product Photos) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Protected Hardware & Valuables
            </h3>
          </div>
          <button
            onClick={onOpenWarrantyCenter}
            className="text-xs font-semibold text-amber-500 hover:underline cursor-pointer"
          >
            View All ({warranties.length}) →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {warranties.slice(0, 4).map((warr) => {
            const photoUrl =
              warr.productImageUrl || getFallbackProductImage(warr.itemName, warr.category);
            return (
              <div
                key={warr.id}
                onClick={onOpenWarrantyCenter}
                className="group p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2.5">
                  <img
                    src={photoUrl}
                    alt={warr.itemName}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, DEFAULT_PRODUCT_IMAGES.macbook)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/30">
                    {warr.daysRemaining}d left
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
                    {warr.itemName}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                    {warr.storeName}
                  </p>
                  <div className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 mt-1">
                    {formatCurrency(warr.price, currency)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Elegant Charts Grid: Donut Breakdown + Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Breakdown Donut */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                {t.spendingBreakdown}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">All-time tracked distribution</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              {formatCurrency(totalAllCategories, currency)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Donut Chart SVG */}
            <div className="relative w-44 h-44 shrink-0">
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                {donutSlices.map((slice, i) => (
                  <path
                    key={i}
                    d={slice.pathData}
                    fill={slice.color}
                    className="transition-all duration-300 hover:opacity-85 cursor-pointer"
                    onMouseEnter={() => setHoveredCategory(slice.cat)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                ))}
                {/* Donut hole for hollow center */}
                <circle cx="100" cy="100" r="50" className="fill-white dark:fill-slate-900" />
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {hoveredCategory || 'Top'}
                </span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                  {hoveredCategory
                    ? `${donutSlices.find((s) => s.cat === hoveredCategory)?.percentage}%`
                    : `${topCategoryPercent}%`}
                </span>
              </div>
            </div>

            {/* Legend List */}
            <div className="flex-1 space-y-2 w-full">
              {donutSlices.slice(0, 4).map((slice, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  onMouseEnter={() => setHoveredCategory(slice.cat)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {slice.cat}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500">{slice.percentage}%</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(slice.amount, currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6-Month Spending Trend Line Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                {t.monthlyTrend}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Past 6 months expense trajectory</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Healthy Pace
            </span>
          </div>

          {/* Bar / Trend visualization */}
          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
            {monthlyTrends.map((m, idx) => {
              const heightPercent = Math.max(12, Math.round((m.amount / maxTrend) * 100));
              const isCurrent = idx === monthlyTrends.length - 1;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-amber-500 transition-colors">
                    ${Math.round(m.amount)}
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-t-xl overflow-hidden flex flex-col justify-end h-28">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-xl transition-all duration-500 ${
                        isCurrent
                          ? 'bg-gradient-to-t from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20'
                          : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-400 dark:group-hover:bg-slate-600'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Native Banner Ad for Free Users (Requirement #10) */}
      {subscription.tier === 'free' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-900 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Apple Card • 3% Daily Cash Back
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Partner Ad
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Earn unlimited 3% cash back on all electronics, Apple purchases, and select stores.
              </p>
            </div>
          </div>
          <button
            id="btn-dash-remove-ads"
            onClick={onOpenPaywall}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0 cursor-pointer"
          >
            Remove Ads with Pro →
          </button>
        </div>
      )}

      {/* Featured Receipt Card - Showcases the most recent scan with high-quality visual representation and summary detail */}
      {featuredReceipt ? (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Featured Receipt • Latest Verified Scan
              </h3>
            </div>
            <button
              onClick={() => onSelectReceipt(featuredReceipt)}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Inspect Scanned Receipt</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            onClick={() => onSelectReceipt(featuredReceipt)}
            className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
          >
            {/* Top Accent Gradient Line */}
            <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: High-Quality Visual Showcase */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="relative w-full aspect-[4/3] rounded-2xl bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner flex items-center justify-center group/img">
                  {/* Grid background texture */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none" />

                  {/* Corner Store Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-sm border border-slate-700/80 text-[10px] font-bold text-white shadow">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{featuredReceipt.store_name}</span>
                  </div>

                  {/* High Quality Image Preview */}
                  <img
                    src={
                      featuredReceipt.imageUrl ||
                      featuredReceipt.receiptPhotoUrl ||
                      featuredReceipt.storeLogoUrl ||
                      DEFAULT_PRODUCT_IMAGES.receipt
                    }
                    alt={featuredReceipt.store_name}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, DEFAULT_PRODUCT_IMAGES.receipt)}
                    className="w-full h-full object-contain p-2 group-hover/img:scale-105 transition-transform duration-500"
                  />

                  {/* Hover Inspect Overlay */}
                  <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1.5px]">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xl text-amber-400">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Click to Inspect Full Resolution</span>
                    </div>
                  </div>
                </div>

                {/* Sub-gallery of item thumbnails if present */}
                {featuredReceipt.items.length > 0 && (
                  <div className="w-full mt-2.5 flex items-center gap-2 overflow-x-auto py-1">
                    {featuredReceipt.items.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-[10px] text-slate-700 dark:text-slate-300 shrink-0"
                      >
                        <img
                          src={item.productImageUrl || getFallbackProductImage(item.name, item.category)}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageError(e, DEFAULT_PRODUCT_IMAGES.macbook)}
                          className="w-4 h-4 rounded object-cover"
                        />
                        <span className="font-semibold truncate max-w-[90px]">{item.name}</span>
                      </div>
                    ))}
                    {featuredReceipt.items.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        +{featuredReceipt.items.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Summary Detail */}
              <div className="md:col-span-7 space-y-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {featuredReceipt.store_name}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {featuredReceipt.items[0]?.category || 'Retail'}
                    </span>
                  </div>

                  {/* Custom Tags on Featured Receipt */}
                  {featuredReceipt.tags && featuredReceipt.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                      {featuredReceipt.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {featuredReceipt.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      Reg #{featuredReceipt.id.substring(0, 6)}
                    </span>
                  </div>
                </div>

                {/* Grand Total Highlight */}
                <div className="flex items-baseline gap-2">
                  <span className="text-xs uppercase font-mono text-slate-400 font-bold">Total Billed</span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                    {formatCurrency(featuredReceipt.total, currency)}
                  </div>
                </div>

                {/* Itemized Highlights */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span className="font-semibold truncate max-w-[200px]">
                      {featuredReceipt.items[0]?.name || 'Scanned Items'}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      ${featuredReceipt.items[0]?.price.toFixed(2)}
                    </span>
                  </div>
                  {featuredReceipt.items.length > 1 && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      along with {featuredReceipt.items.length - 1} other item{featuredReceipt.items.length > 2 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Warranty Status Banner if applicable */}
                {featuredReceipt.items.some((it) => it.likely_has_warranty) && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                    <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-semibold">
                      Warranty Active • Protected in Vault (
                      {featuredReceipt.items.find((it) => it.likely_has_warranty)?.estimated_warranty_months || 12} Mos)
                    </span>
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectReceipt(featuredReceipt);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ReceiptIcon className="w-3.5 h-3.5" />
                    <span>Inspect Scanned Receipt</span>
                  </button>

                  {onOpenChat && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenChat();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Ask ReceiptMind AI</span>
                    </button>
                  )}

                  <div className="ml-auto text-[11px] text-slate-400 font-sans flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    <span>{featuredReceipt.payment_method}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Recent Receipts Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            {t.recentReceipts}
          </h3>
          <span className="text-xs text-slate-400">Showing last {Math.min(receipts.length, 5)}</span>
        </div>

        <div className="space-y-2.5">
          {receipts.slice(0, 5).map((receipt) => {
            const hasWarranty = receipt.items.some((it) => it.likely_has_warranty);
            return (
              <div
                key={receipt.id}
                onClick={() => onSelectReceipt(receipt)}
                className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 dark:hover:border-amber-500/40 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="relative w-12 sm:w-14 aspect-[3/4] rounded-2xl bg-slate-100 dark:bg-slate-800/90 overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-700/80 shadow-xs group-hover:border-amber-500/40 transition-colors flex items-center justify-center">
                    <img
                      src={
                        receipt.receiptPhotoUrl ||
                        receipt.imageUrl ||
                        receipt.storeLogoUrl ||
                        receipt.items[0]?.productImageUrl ||
                        getFallbackProductImage(receipt.store_name)
                      }
                      alt={receipt.store_name}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, DEFAULT_PRODUCT_IMAGES.receipt)}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors truncate">
                        {receipt.store_name}
                      </span>
                      {hasWarranty && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20 shrink-0">
                          <ShieldCheck className="w-3 h-3" />
                          Warranty
                        </span>
                      )}
                    </div>
                    {receipt.tags && receipt.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-0.5">
                        {receipt.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {receipt.date} • {receipt.items.length} items • {receipt.payment_method}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <div className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                    {formatCurrency(receipt.total, currency)}
                  </div>
                  <span className="text-[11px] text-amber-500 font-semibold group-hover:underline flex items-center justify-end gap-0.5 mt-0.5">
                    View <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
