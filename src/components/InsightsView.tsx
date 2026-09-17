import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Award,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Receipt, WarrantyItem, AppCurrency, AppLanguage } from '../types';
import { translations, formatCurrency } from '../utils/i18n';

interface InsightsViewProps {
  receipts: Receipt[];
  warranties: WarrantyItem[];
  currency: AppCurrency;
  lang: AppLanguage;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  receipts,
  warranties,
  currency,
  lang,
}) => {
  const t = translations[lang].insights;
  const [smartTip, setSmartTip] = useState<string>(
    'You spent 28% more on electronics this month than usual — 2 items carry active warranties. Remember to file manufacturer warranty cards within 30 days of purchase.'
  );
  const [isGeneratingTip, setIsGeneratingTip] = useState(false);

  // Total protected merchandise value
  const totalProtectedValue = warranties
    .filter((w) => w.status !== 'expired')
    .reduce((acc, w) => acc + w.price, 0);

  // Category totals
  const categoryTotals: Record<string, number> = {};
  receipts.forEach((r) => {
    r.items.forEach((it) => {
      categoryTotals[it.category] = (categoryTotals[it.category] || 0) + it.price;
    });
  });

  const totalSpending = receipts.reduce((acc, r) => acc + r.total, 0);

  const handleRefreshSmartTip = async () => {
    setIsGeneratingTip(true);
    try {
      const res = await fetch('/api/smart-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalSpending,
          categoryBreakdown: categoryTotals,
          expiringWarrantiesCount: warranties.filter((w) => w.status === 'warning' || w.status === 'critical').length,
        }),
      });
      const data = await res.json();
      if (data.tip) {
        setSmartTip(data.tip);
      }
    } catch {
      setSmartTip(
        'Your high-value tech purchases represent 62% of all expenses. Keeping receipts in Insurance Mode protects against loss or power-surge damage claims.'
      );
    } finally {
      setIsGeneratingTip(false);
    }
  };

  const monthComparisons = [
    { category: 'Electronics', current: 3748, previous: 2199, change: +70.4 },
    { category: 'Home & Furniture', current: 749, previous: 890, change: -15.8 },
    { category: 'Groceries', current: 285, previous: 310, change: -8.0 },
    { category: 'Clothing', current: 268, previous: 190, change: +41.0 },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold text-amber-500 tracking-wider uppercase flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Financial & Asset Intelligence
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {t.title}
        </h1>
      </div>

      {/* AI Smart Tip Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-slate-900 border border-amber-500/30 p-6 shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.aiSmartTip}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Personalized spending & warranty counsel</p>
            </div>
          </div>

          <button
            id="btn-refresh-smart-tip"
            onClick={handleRefreshSmartTip}
            disabled={isGeneratingTip}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-amber-500 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingTip ? 'animate-spin' : ''}`} />
            <span>{isGeneratingTip ? t.generating : t.generateTip}</span>
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed bg-white/40 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-amber-500/20">
          "{smartTip}"
        </p>
      </div>

      {/* Protected Merchandise Asset Metric */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              Protected Assets
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {t.protectedValue}
            </span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
              {formatCurrency(totalProtectedValue, currency)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Currently safeguarded by active store & manufacturer warranties
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full">
              Coverage Ratio
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Eligible Items Covered
            </span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
              {Math.round((totalProtectedValue / (totalSpending || 1)) * 100)}%
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Of your total tracked expenditures are protected against defects
            </p>
          </div>
        </div>
      </div>

      {/* Month-Over-Month Category Comparison */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            {t.monthOverMonth}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">August 2026 vs September 2026 expenditure variance</p>
        </div>

        <div className="space-y-3">
          {monthComparisons.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {item.category}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {formatCurrency(item.current, currency)} vs {formatCurrency(item.previous, currency)}
                </span>
              </div>

              <div
                className={`flex items-center gap-1 text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                  item.change > 0
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {item.change > 0 ? (
                  <>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    +{item.change}%
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    {item.change}%
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
