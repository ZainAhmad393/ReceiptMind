import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Printer,
  FileSpreadsheet,
  Calendar,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  X,
  CreditCard,
  Share2,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ImageIcon,
  FileText,
  Eye,
  RotateCw,
  RotateCcw,
  Tag,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { Receipt, AppCurrency, AppLanguage, ProductCategory, UserSubscription } from '../types';
import { translations, formatCurrency } from '../utils/i18n';
import { getFallbackProductImage, DEFAULT_PRODUCT_IMAGES, handleImageError } from '../utils/imageFallbacks';

/**
 * ReceiptThumbnail with subtle skeleton loader and smooth fade-in animation
 */
interface ReceiptThumbnailProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

const ReceiptThumbnail: React.FC<ReceiptThumbnailProps> = ({
  src,
  alt,
  fallbackSrc = DEFAULT_PRODUCT_IMAGES.receipt,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div className="relative w-14 sm:w-16 aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs shrink-0 flex items-center justify-center group-hover:border-amber-500/50 group-hover:shadow-sm transition-all">
      {/* Subtle Skeleton Loader while image is fetching/decoding */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-200/80 dark:bg-slate-800/95 p-1.5 overflow-hidden">
          {/* Shimmer sweep effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent -translate-x-full animate-skeleton-shimmer" />
          </div>
          {/* Miniature receipt wireframe icon */}
          <div className="w-7 h-7 rounded-lg bg-slate-300/80 dark:bg-slate-700/80 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-1 animate-pulse">
            <ImageIcon className="w-3.5 h-3.5 opacity-70" />
          </div>
          <div className="w-7 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full animate-pulse mb-1" />
          <div className="w-5 h-1 bg-slate-300/70 dark:bg-slate-700/70 rounded-full animate-pulse" />
        </div>
      )}

      {/* Actual Image with smooth fade-in */}
      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          setHasError(true);
          setIsLoaded(true);
          handleImageError(e, fallbackSrc);
        }}
        className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500 ease-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      />

      {/* Subtle document corner watermark */}
      <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-[9px] font-bold text-amber-400 opacity-75 group-hover:opacity-100 transition-opacity flex items-center pointer-events-none z-10">
        <FileText className="w-2.5 h-2.5" />
      </div>
    </div>
  );
};

/**
 * LineItemThumbnail for itemized breakdown with subtle skeleton and smooth transition
 */
interface LineItemThumbnailProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

const LineItemThumbnail: React.FC<LineItemThumbnailProps> = ({
  src,
  alt,
  fallbackSrc = DEFAULT_PRODUCT_IMAGES.macbook,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-200/80 dark:bg-slate-800 animate-pulse overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-full animate-skeleton-shimmer" />
          </div>
          <ImageIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 opacity-60" />
        </div>
      )}
      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          setHasError(true);
          setIsLoaded(true);
          handleImageError(e, fallbackSrc);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

interface ReceiptLibraryProps {
  receipts: Receipt[];
  currency: AppCurrency;
  lang: AppLanguage;
  subscription: UserSubscription;
  selectedReceipt?: Receipt | null;
  onSelectReceipt: (receipt: Receipt | null) => void;
  onOpenPaywall: () => void;
  onUpdateReceiptTags?: (receiptId: string, tags: string[]) => void;
}

export const ReceiptLibraryView: React.FC<ReceiptLibraryProps> = ({
  receipts,
  currency,
  lang,
  subscription,
  selectedReceipt,
  onSelectReceipt,
  onOpenPaywall,
  onUpdateReceiptTags,
}) => {
  const t = translations[lang].library;
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [warrantyOnly, setWarrantyOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeReceiptTab, setActiveReceiptTab] = useState<'image' | 'slip'>('image');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [isModalImageLoaded, setIsModalImageLoaded] = useState<boolean>(false);
  const [isLightboxImageLoaded, setIsLightboxImageLoaded] = useState<boolean>(false);

  // Reset modal image loading status whenever the selected receipt or active tab changes
  useEffect(() => {
    setIsModalImageLoaded(false);
  }, [selectedReceipt?.id, activeReceiptTab]);

  // Reset lightbox image loading status when lightbox opens or receipt changes
  useEffect(() => {
    if (isLightboxOpen) {
      setIsLightboxImageLoaded(false);
    }
  }, [isLightboxOpen, selectedReceipt?.id]);

  const categories: ProductCategory[] = [
    'Electronics',
    'Home & Furniture',
    'Clothing',
    'Groceries',
    'Dining',
    'Health & Beauty',
    'Other',
  ];

  // Extract all unique custom tags across receipts for quick-filtering
  const allAvailableTags = useMemo(() => {
    const tagSet = new Set<string>();
    receipts.forEach((r) => {
      r.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [receipts]);

  // Extract all unique payment methods across receipts
  const availablePaymentMethods = useMemo(() => {
    const pmSet = new Set<string>();
    receipts.forEach((r) => {
      if (r.payment_method && r.payment_method.trim()) {
        pmSet.add(r.payment_method.trim());
      }
    });
    return Array.from(pmSet).sort();
  }, [receipts]);

  // Calculate receipt count for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    receipts.forEach((r) => {
      const catsInReceipt = new Set<string>(r.items.map((it) => it.category));
      catsInReceipt.forEach((cat) => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, [receipts]);

  // Calculate receipt count for each payment method
  const paymentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    receipts.forEach((r) => {
      if (r.payment_method) {
        counts[r.payment_method] = (counts[r.payment_method] || 0) + 1;
      }
    });
    return counts;
  }, [receipts]);

  // Full-text search across store names, items purchased, and custom tags
  const filtered = receipts
    .filter((r) => {
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const terms = query.split(/\s+/).filter(Boolean);

        // Every term must match at least one field (store name, items purchased, tags, notes, payment)
        const matchesAllTerms = terms.every((term) => {
          const rawTerm = term.replace(/^[#]/, '');

          // 1. Store name full-text search
          const matchesStore =
            r.store_name.toLowerCase().includes(term) ||
            r.store_name.toLowerCase().includes(rawTerm);

          // 2. Items purchased full-text search (item name, category, notes, serial number)
          const matchesItem = r.items.some((it) =>
            it.name.toLowerCase().includes(term) ||
            it.name.toLowerCase().includes(rawTerm) ||
            it.category.toLowerCase().includes(term) ||
            (it.notes && it.notes.toLowerCase().includes(term)) ||
            (it.serial_number && it.serial_number.toLowerCase().includes(term))
          );

          // 3. Custom tags full-text search
          const matchesTag = r.tags?.some((t) =>
            t.toLowerCase().includes(term) ||
            t.toLowerCase().includes(rawTerm)
          );

          // 4. Notes & payment method
          const matchesNote = r.notes?.toLowerCase().includes(term);
          const matchesPayment = r.payment_method.toLowerCase().includes(term);

          return matchesStore || matchesItem || matchesTag || matchesNote || matchesPayment;
        });

        if (!matchesAllTerms) return false;
      }

      if (categoryFilter !== 'all') {
        const hasCat = r.items.some((it) => it.category === categoryFilter);
        if (!hasCat) return false;
      }

      if (paymentFilter !== 'all') {
        if (r.payment_method !== paymentFilter) return false;
      }

      if (warrantyOnly) {
        const hasWarranty = r.items.some((it) => it.likely_has_warranty);
        if (!hasWarranty) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount-desc') return b.total - a.total;
      if (sortBy === 'amount-asc') return a.total - b.total;
      return 0;
    });

  // Export to CSV
  const handleExportCSV = () => {
    if (subscription.tier === 'free') {
      onOpenPaywall();
      return;
    }

    const headers = ['Receipt ID', 'Store Name', 'Date', 'Item Name', 'Category', 'Price', 'Warranty', 'Warranty Months', 'Subtotal', 'Tax', 'Total', 'Payment Method'];
    const rows: string[][] = [];

    filtered.forEach((r) => {
      r.items.forEach((it) => {
        rows.push([
          r.id,
          `"${r.store_name.replace(/"/g, '""')}"`,
          r.date,
          `"${it.name.replace(/"/g, '""')}"`,
          it.category,
          it.price.toFixed(2),
          it.likely_has_warranty ? 'YES' : 'NO',
          it.estimated_warranty_months.toString(),
          r.subtotal.toFixed(2),
          r.tax.toFixed(2),
          r.total.toFixed(2),
          `"${r.payment_method.replace(/"/g, '""')}"`,
        ]);
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ReceiptMind_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMsg('CSV report downloaded successfully!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Export to Print / PDF
  const handlePrintPDF = () => {
    if (subscription.tier === 'free') {
      onOpenPaywall();
      return;
    }
    window.print();
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-amber-500 tracking-wider uppercase flex items-center gap-1">
            <FileSpreadsheet className="w-3 h-3" />
            Central Expense Vault
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t.title}
          </h1>
        </div>

        {/* Action buttons: Export CSV & PDF */}
        <div className="flex items-center gap-2">
          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.exportCsv}</span>
            {subscription.tier === 'free' && (
              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-500 uppercase font-extrabold">
                Pro
              </span>
            )}
          </button>

          <button
            id="btn-export-pdf"
            onClick={handlePrintPDF}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.exportPdf}</span>
            {subscription.tier === 'free' && (
              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-500 uppercase font-extrabold">
                Pro
              </span>
            )}
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 rounded-2xl bg-slate-900 text-white border border-emerald-500/40 text-xs font-bold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        {/* Full-Text Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="input-library-search"
            type="text"
            placeholder="Search store names, items purchased, or custom tags (#work, #tax, drill)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Custom Tag Pills */}
        {allAvailableTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1 pr-1">
              <Tag className="w-3 h-3 text-amber-500" />
              Tags:
            </span>
            {allAvailableTags.map((tag) => {
              const isSelected = search.toLowerCase().includes(tag.toLowerCase());
              return (
                <button
                  key={tag}
                  onClick={() => {
                    if (isSelected) {
                      setSearch('');
                    } else {
                      setSearch(tag);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50'
                  }`}
                >
                  <span>#{tag}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Search match stats */}
        {search.trim() && (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              Found <strong className="text-slate-900 dark:text-white">{filtered.length}</strong> {filtered.length === 1 ? 'receipt' : 'receipts'} matching &ldquo;<span className="text-amber-500 font-semibold">{search}</span>&rdquo;
            </span>
            <button
              onClick={() => setSearch('')}
              className="text-xs font-semibold text-amber-500 hover:underline cursor-pointer"
            >
              Reset search
            </button>
          </div>
        )}

        {/* Filter Dropdowns Bar: Category & Payment Method Filters */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter Dropdown */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
                <Filter className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <label htmlFor="filter-select-category" className="text-[11px] font-bold text-slate-500 dark:text-slate-400 select-none">
                  Category:
                </label>
                <select
                  id="filter-select-category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer pr-1 text-xs"
                >
                  <option value="all">All Categories ({receipts.length})</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c} ({categoryCounts[c] || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method Filter Dropdown */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
                <CreditCard className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <label htmlFor="filter-select-payment" className="text-[11px] font-bold text-slate-500 dark:text-slate-400 select-none">
                  Payment:
                </label>
                <select
                  id="filter-select-payment"
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer pr-1 text-xs"
                >
                  <option value="all">All Payment Methods ({receipts.length})</option>
                  {availablePaymentMethods.map((pm) => (
                    <option key={pm} value={pm}>
                      {pm} ({paymentCounts[pm] || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Warranty Only Toggle */}
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer select-none shadow-xs">
                <input
                  type="checkbox"
                  checked={warrantyOnly}
                  onChange={(e) => setWarrantyOnly(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-400"
                />
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.filterWarrantyOnly}</span>
              </label>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs ml-auto">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Sort:</span>
              <select
                id="select-sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer pr-1 text-xs"
              >
                <option value="date-desc">Newest Date</option>
                <option value="date-asc">Oldest Date</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>

          {/* Quick Category Filtering Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 max-w-full no-scrollbar">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap cursor-pointer transition-all ${
                categoryFilter === 'all'
                  ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-700/70'
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap cursor-pointer transition-all ${
                  categoryFilter === c
                    ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-700/70'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Active Filter Badges */}
          {(categoryFilter !== 'all' || paymentFilter !== 'all' || warrantyOnly) && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active:</span>
              {categoryFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px] font-semibold">
                  Category: {categoryFilter}
                  <button onClick={() => setCategoryFilter('all')} className="hover:text-amber-700 dark:hover:text-amber-300 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {paymentFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-[11px] font-semibold">
                  Payment: {paymentFilter}
                  <button onClick={() => setPaymentFilter('all')} className="hover:text-sky-700 dark:hover:text-sky-300 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {warrantyOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                  Warranty Only
                  <button onClick={() => setWarrantyOnly(false)} className="hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setPaymentFilter('all');
                  setWarrantyOnly(false);
                }}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:underline cursor-pointer ml-1"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Receipts List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Search className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.noReceiptsFound}</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No receipts matched your search or selected filters. Try choosing a different category, payment method, or clearing the search.
            </p>
            {(search || categoryFilter !== 'all' || paymentFilter !== 'all' || warrantyOnly) && (
              <button
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('all');
                  setPaymentFilter('all');
                  setWarrantyOnly(false);
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Reset All Filters & Search
              </button>
            )}
          </div>
        ) : (
          filtered.map((receipt) => {
            const hasWarranty = receipt.items.some((it) => it.likely_has_warranty);
            const receiptPhoto =
              receipt.receiptPhotoUrl ||
              receipt.imageUrl ||
              receipt.storeLogoUrl ||
              DEFAULT_PRODUCT_IMAGES.receipt;

            const purchasedItemsPreview = receipt.items.map((it) => it.name).slice(0, 2).join(', ');
            const extraItemsCount = receipt.items.length > 2 ? receipt.items.length - 2 : 0;

            return (
              <div
                key={receipt.id}
                onClick={() => onSelectReceipt(receipt)}
                className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 dark:hover:border-amber-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between gap-3 sm:gap-4"
              >
                {/* Left section: Subtle Rounded Thumbnail + Metadata */}
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                  {/* Subtle, rounded thumbnail of the receipt photo with loading skeleton and smooth fade-in */}
                  <ReceiptThumbnail
                    src={receiptPhoto}
                    alt={`${receipt.store_name} receipt`}
                    fallbackSrc={DEFAULT_PRODUCT_IMAGES.receipt}
                  />

                  {/* Vertically and visually aligned content */}
                  <div className="min-w-0 flex-1 space-y-1">
                    {/* Store Title & Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors truncate">
                        {receipt.store_name}
                      </h4>
                      {hasWarranty && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20 shrink-0">
                          <ShieldCheck className="w-3 h-3" />
                          Warranty
                        </span>
                      )}
                      {receipt.isInsuranceBacked && (
                        <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20 shrink-0">
                          Insurance Vault
                        </span>
                      )}
                    </div>

                    {/* Items Purchased Preview */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                      <span className="font-medium">{purchasedItemsPreview}</span>
                      {extraItemsCount > 0 && (
                        <span className="text-slate-400 ml-1">+{extraItemsCount} more</span>
                      )}
                    </p>

                    {/* Custom Tags */}
                    {receipt.tags && receipt.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-0.5">
                        {receipt.tags.map((tag) => (
                          <span
                            key={tag}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearch(tag);
                            }}
                            className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60 hover:border-amber-500/40 hover:text-amber-500 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Transaction metadata */}
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {receipt.date} • {receipt.items.length} {t.itemsCount} • {receipt.payment_method}
                    </p>
                  </div>
                </div>

                {/* Right section: Price & Details link */}
                <div className="text-right shrink-0 flex flex-col items-end justify-center pl-2">
                  <div className="text-base sm:text-lg font-extrabold font-mono text-slate-900 dark:text-white">
                    {formatCurrency(receipt.total, currency)}
                  </div>
                  <span className="text-[11px] text-amber-500 font-semibold group-hover:underline flex items-center justify-end gap-0.5 mt-0.5">
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Native Banner Ad for Free Users (Requirement #10) */}
      {subscription.tier === 'free' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 text-white border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Square Terminal POS • Flat Rate Processing</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase tracking-wider">
                  Ad
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Accept all cards and Apple Pay seamlessly with no monthly subscription fees.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenPaywall}
            className="text-xs font-bold text-amber-400 hover:underline shrink-0 cursor-pointer"
          >
            Upgrade to Pro to Remove Ads →
          </button>
        </div>
      )}

      {/* Selected Receipt Detail Modal with Prominent Receipt Image Showcase */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
            {/* Modal Top Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 z-20 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {selectedReceipt.store_name}
                    </h3>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                      Verified Document
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {selectedReceipt.date} • Scanned into ReceiptMind Vault
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* View Mode Toggle if both photo and slip exist */}
                <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700/60">
                  <button
                    onClick={() => setActiveReceiptTab('image')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeReceiptTab === 'image'
                        ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Receipt Photo</span>
                  </button>
                  <button
                    onClick={() => setActiveReceiptTab('slip')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeReceiptTab === 'slip'
                        ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Itemized Slip</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    onSelectReceipt(null);
                    setZoomLevel(1);
                    setRotation(0);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Responsive 2-Column Layout */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left / Prominent Column: High-Quality Receipt Image Showcase */}
              <div className="lg:col-span-6 space-y-3 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    Prominent Scanned Document
                  </span>

                  {/* Image Controls: Zoom, Rotate, Lightbox */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setZoomLevel((prev) => Math.max(1, prev - 0.25))}
                      disabled={zoomLevel <= 1}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 px-1 font-bold">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.25))}
                      disabled={zoomLevel >= 2.5}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setRotation((prev) => (prev + 90) % 360)}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                      title="Rotate 90°"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsLightboxOpen(true)}
                      className="w-7 h-7 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
                      title="Full Screen Lightbox"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Main Prominent Image Viewport */}
                <div className="relative rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl min-h-[340px] sm:min-h-[460px] flex items-center justify-center group">
                  {/* Subtle Grid Background Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />

                  {/* Corner Verification Stamp */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-[11px] font-bold text-amber-400 shadow-md pointer-events-none">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Stored Document Asset</span>
                  </div>

                  {/* Subtle Loading Skeleton while image is loading */}
                  {!isModalImageLoaded && (
                    <div className="absolute inset-0 z-15 flex flex-col items-center justify-center p-6 bg-slate-950/85 backdrop-blur-xs transition-opacity duration-300">
                      <div className="relative w-52 sm:w-64 h-64 sm:h-80 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl p-5 flex flex-col justify-between overflow-hidden">
                        {/* Shimmer sweep effect */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-skeleton-shimmer" />
                        </div>

                        {/* Top Store Placeholder */}
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-amber-400 animate-pulse">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <div className="w-32 h-3 bg-slate-800 rounded-full animate-pulse" />
                          <div className="w-20 h-2 bg-slate-800/70 rounded-full animate-pulse" />
                        </div>

                        {/* Simulated Rows */}
                        <div className="space-y-2.5 my-3 px-1">
                          <div className="flex justify-between items-center">
                            <div className="w-24 h-2 bg-slate-800 rounded-full animate-pulse" />
                            <div className="w-10 h-2 bg-slate-800 rounded-full animate-pulse" />
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="w-28 h-2 bg-slate-800 rounded-full animate-pulse" />
                            <div className="w-8 h-2 bg-slate-800 rounded-full animate-pulse" />
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="w-16 h-2 bg-slate-800 rounded-full animate-pulse" />
                            <div className="w-12 h-2 bg-slate-800 rounded-full animate-pulse" />
                          </div>
                        </div>

                        {/* Barcode & Status */}
                        <div className="space-y-2 pt-2.5 border-t border-slate-800/80">
                          <div className="h-5 w-full bg-slate-800/60 rounded flex items-center justify-center gap-1 overflow-hidden px-2">
                            {Array.from({ length: 20 }).map((_, i) => (
                              <div key={i} className="bg-slate-700 h-full" style={{ width: i % 2 === 0 ? '2px' : '3px' }} />
                            ))}
                          </div>
                          <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-400 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                            <span>Loading scanned media...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Click to expand overlay hint */}
                  {isModalImageLoaded && (
                    <button
                      onClick={() => setIsLightboxOpen(true)}
                      className="absolute inset-0 z-20 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-[2px] cursor-pointer"
                    >
                      <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-xl flex items-center gap-1.5 text-amber-400">
                        <Eye className="w-4 h-4" />
                        <span>Click to view Full-Screen Lightbox</span>
                      </div>
                    </button>
                  )}

                  {/* Image Display using imageUrl or receiptPhotoUrl */}
                  <div
                    className="w-full h-full flex items-center justify-center p-3 overflow-hidden transition-transform duration-300"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                    }}
                  >
                    <img
                      src={
                        activeReceiptTab === 'image'
                          ? selectedReceipt.imageUrl ||
                            selectedReceipt.receiptPhotoUrl ||
                            DEFAULT_PRODUCT_IMAGES.receipt
                          : selectedReceipt.receiptPhotoUrl ||
                            selectedReceipt.imageUrl ||
                            DEFAULT_PRODUCT_IMAGES.receipt
                      }
                      alt={`Receipt from ${selectedReceipt.store_name}`}
                      referrerPolicy="no-referrer"
                      onLoad={() => setIsModalImageLoaded(true)}
                      onError={(e) => {
                        setIsModalImageLoaded(true);
                        handleImageError(e, DEFAULT_PRODUCT_IMAGES.receipt);
                      }}
                      style={{
                        transform: `scale(${zoomLevel})`,
                        transition: 'transform 0.2s ease-out',
                      }}
                      className={`max-h-[380px] sm:max-h-[480px] w-auto max-w-full object-contain rounded-xl shadow-lg border border-slate-800/80 bg-white transition-all duration-500 ease-out ${
                        isModalImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.97]'
                      }`}
                    />
                  </div>
                </div>

                {/* Scanned Image Meta Info */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium font-mono text-[11px]">
                      Capture: {selectedReceipt.receiptPhotoUrl ? 'Photo Upload' : 'AI Rendered SVG'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {selectedReceipt.items.length} line items detected
                    </span>
                    <a
                      href={selectedReceipt.imageUrl || selectedReceipt.receiptPhotoUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>Direct Asset</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Itemized Breakdown & Verified Receipt Slip */}
              <div className="lg:col-span-6 space-y-4">
                {/* Thermal Paper Preview Card */}
                <div className="relative rounded-2xl bg-white text-slate-900 p-5 sm:p-6 shadow-xl border border-slate-200">
                  {/* Jagged top line decoration */}
                  <div className="text-center pb-4 border-b border-dashed border-slate-300">
                    <div className="flex items-center justify-center gap-2">
                      <h3 className="text-lg font-extrabold uppercase tracking-tight text-slate-900">
                        {selectedReceipt.store_name}
                      </h3>
                    </div>
                    <p className="text-[10px] uppercase font-mono text-slate-500 tracking-wider mt-0.5">
                      Verified Store Receipt • ReceiptMind Archive
                    </p>
                    <p className="text-xs font-mono text-slate-600 mt-1">
                      Date: {selectedReceipt.date} • Reg #{selectedReceipt.id.substring(0, 6)}
                    </p>
                  </div>

                  {/* Line Items */}
                  <div className="py-4 space-y-2.5 border-b border-dashed border-slate-300 font-mono text-xs">
                    {selectedReceipt.items.map((it, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex items-center gap-2 flex-1 pr-2">
                            <LineItemThumbnail
                              src={it.productImageUrl || getFallbackProductImage(it.name, it.category)}
                              alt={it.name}
                              fallbackSrc={DEFAULT_PRODUCT_IMAGES.macbook}
                            />
                            <div>
                              <span className="font-semibold text-slate-800 block">
                                {it.name}
                              </span>
                              <span className="text-[10px] font-sans font-medium text-slate-500">
                                {it.category}
                              </span>
                            </div>
                          </div>
                          <span className="font-bold text-slate-950 font-mono shrink-0">
                            ${it.price.toFixed(2)}
                          </span>
                        </div>
                        {it.likely_has_warranty && (
                          <div className="flex items-center gap-1 text-[10px] text-amber-600 font-sans font-bold pl-0.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{it.estimated_warranty_months} Months Manufacturer Warranty</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="py-3 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>${selectedReceipt.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Tax</span>
                      <span>${selectedReceipt.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-slate-950 pt-2 border-t border-slate-200 font-mono">
                      <span>TOTAL</span>
                      <span className="text-base font-extrabold">
                        ${selectedReceipt.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1 font-sans flex items-center justify-between">
                      <span>Payment: {selectedReceipt.payment_method}</span>
                      {selectedReceipt.isInsuranceBacked && (
                        <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          🛡️ Insurance Backed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Barcode representation */}
                  <div className="pt-4 border-t border-dashed border-slate-300 text-center space-y-1">
                    <div className="h-9 w-full flex items-center justify-center gap-0.5 overflow-hidden">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-slate-900 h-full"
                          style={{ width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '2px' : '1px' }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      RM-{selectedReceipt.id.replace('rcpt_', '').padStart(10, '0')}
                    </span>
                  </div>
                </div>

                {/* Custom Tags Section in Detail Modal */}
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      Custom Tags & Categorization
                    </span>
                    <span className="text-[10px] text-slate-400">Searchable across library</span>
                  </div>

                  {/* Current Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 min-h-[28px]">
                    {(!selectedReceipt.tags || selectedReceipt.tags.length === 0) ? (
                      <span className="text-[11px] text-slate-400 italic">No custom tags yet. Add tags below to organize.</span>
                    ) : (
                      selectedReceipt.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-400 font-medium"
                        >
                          #{tag}
                          <button
                            onClick={() => {
                              const updatedTags = (selectedReceipt.tags || []).filter((t) => t !== tag);
                              onUpdateReceiptTags?.(selectedReceipt.id, updatedTags);
                            }}
                            className="p-0.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Remove tag"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Add Tag Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Add tag (e.g. Tax2025, WorkExpense, Hardware)..."
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const cleaned = newTagInput.trim().replace(/^[#]/, '');
                            if (cleaned && !selectedReceipt.tags?.includes(cleaned)) {
                              const updated = [...(selectedReceipt.tags || []), cleaned];
                              onUpdateReceiptTags?.(selectedReceipt.id, updated);
                              setNewTagInput('');
                            }
                          }
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const cleaned = newTagInput.trim().replace(/^[#]/, '');
                        if (cleaned && !selectedReceipt.tags?.includes(cleaned)) {
                          const updated = [...(selectedReceipt.tags || []), cleaned];
                          onUpdateReceiptTags?.(selectedReceipt.id, updated);
                          setNewTagInput('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(`
                          <html>
                            <head><title>Receipt - ${selectedReceipt.store_name}</title></head>
                            <body style="font-family: monospace; padding: 20px; text-align: center;">
                              <h2>${selectedReceipt.store_name}</h2>
                              <p>Date: ${selectedReceipt.date}</p>
                              <hr style="border: 1px dashed #ccc; margin: 15px 0;"/>
                              ${selectedReceipt.items.map(it => `<div style="display:flex; justify-content:space-between; margin:6px 0;"><span>${it.name}</span><b>$${it.price.toFixed(2)}</b></div>`).join('')}
                              <hr style="border: 1px dashed #ccc; margin: 15px 0;"/>
                              <div style="display:flex; justify-content:space-between; font-size:16px;"><b>TOTAL</b><b>$${selectedReceipt.total.toFixed(2)}</b></div>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                        printWindow.print();
                      }
                    }}
                    className="flex-1 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Print Receipt</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `Receipt #${selectedReceipt.id} from ${selectedReceipt.store_name} on ${selectedReceipt.date} for $${selectedReceipt.total.toFixed(2)}`
                      );
                      setToastMsg('Receipt summary copied to clipboard!');
                      setTimeout(() => setToastMsg(null), 3000);
                    }}
                    className="flex-1 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copy Summary</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Lightbox for Detailed Inspection */}
      {isLightboxOpen && selectedReceipt && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4">
          <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
            <span className="text-xs font-bold text-slate-300">
              {selectedReceipt.store_name} • Full Inspection
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close Full Screen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-w-4xl max-h-[85vh] overflow-auto p-2 flex items-center justify-center relative min-h-[280px] min-w-[240px]">
            {/* Subtle Loading Skeleton while high-resolution image is loading */}
            {!isLightboxImageLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <div className="w-64 h-84 rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-center gap-3 relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-skeleton-shimmer" />
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-amber-400 animate-pulse">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="w-32 h-3 bg-slate-800 rounded-full animate-pulse mt-2" />
                  <div className="w-20 h-2 bg-slate-800/80 rounded-full animate-pulse" />
                  <span className="text-xs text-amber-400/90 font-medium mt-2 animate-pulse flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Buffering full document...
                  </span>
                </div>
              </div>
            )}
            <img
              src={
                selectedReceipt.imageUrl ||
                selectedReceipt.receiptPhotoUrl ||
                DEFAULT_PRODUCT_IMAGES.receipt
              }
              alt={selectedReceipt.store_name}
              referrerPolicy="no-referrer"
              onLoad={() => setIsLightboxImageLoaded(true)}
              onError={(e) => {
                setIsLightboxImageLoaded(true);
                handleImageError(e, DEFAULT_PRODUCT_IMAGES.receipt);
              }}
              className={`max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl border border-slate-700 bg-white transition-all duration-500 ease-out ${
                isLightboxImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            />
          </div>

          <div className="absolute bottom-5 text-center text-xs text-slate-400">
            Press anywhere outside or close button to return to Receipt Vault
          </div>
        </div>
      )}
    </div>
  );
};
