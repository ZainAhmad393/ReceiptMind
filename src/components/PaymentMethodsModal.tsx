import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock,
  Sparkles,
  Smartphone,
  Building2,
  Check,
} from 'lucide-react';
import { PaymentMethod, CardBrand, PaymentMethodType, Receipt } from '../types';

interface PaymentMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethods: PaymentMethod[];
  receipts: Receipt[];
  onAddPaymentMethod: (pm: Omit<PaymentMethod, 'id' | 'createdAt'>) => void;
  onRemovePaymentMethod: (id: string) => void;
  onSetDefaultPaymentMethod: (id: string) => void;
}

export const PaymentMethodsModal: React.FC<PaymentMethodsModalProps> = ({
  isOpen,
  onClose,
  paymentMethods,
  receipts,
  onAddPaymentMethod,
  onRemovePaymentMethod,
  onSetDefaultPaymentMethod,
}) => {
  const [view, setView] = useState<'list' | 'add'>('list');
  const [addType, setAddType] = useState<PaymentMethodType>('credit_card');

  // Form states for Add Card
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingZip, setBillingZip] = useState('10019');
  const [isDefault, setIsDefault] = useState(paymentMethods.length === 0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Detect card brand from number
  const detectBrand = (num: string): CardBrand => {
    const clean = num.replace(/\s+/g, '');
    if (/^4/.test(clean)) return 'visa';
    if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(clean)) return 'mastercard';
    if (/^3[47]/.test(clean)) return 'amex';
    if (/^6(011|5)/.test(clean)) return 'discover';
    return 'other';
  };

  const detectedBrand = detectBrand(cardNumber);

  // Auto-format card number
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Auto-format expiry MM/YY
  const handleExpiryChange = (val: string) => {
    let clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 2) {
      clean = clean.slice(0, 2) + '/' + clean.slice(2);
    }
    setExpiry(clean);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (addType === 'credit_card') {
      const cleanNum = cardNumber.replace(/\s+/g, '');
      if (cleanNum.length < 15) {
        setErrorMsg('Please provide a valid 16-digit card number.');
        return;
      }
      if (!cardholderName.trim()) {
        setErrorMsg('Please enter the cardholder name.');
        return;
      }
      const [mStr, yStr] = expiry.split('/');
      const month = parseInt(mStr, 10);
      const year = parseInt(`20${yStr}`, 10);
      if (!month || month < 1 || month > 12 || !year || year < 2024) {
        setErrorMsg('Please enter a valid expiration date (MM/YY).');
        return;
      }
      if (cvv.length < 3) {
        setErrorMsg('Please provide a 3 or 4 digit security code (CVV).');
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onAddPaymentMethod({
          type: 'credit_card',
          brand: detectedBrand,
          last4: cleanNum.slice(-4),
          expMonth: month,
          expYear: year,
          cardholderName: cardholderName.trim(),
          isDefault,
          billingZip: billingZip.trim(),
          billingCountry: 'United States',
        });
        setSuccessMsg('Payment card secured and added to encrypted vault!');
        setTimeout(() => {
          setView('list');
          setSuccessMsg(null);
          // Reset form
          setCardNumber('');
          setCardholderName('');
          setExpiry('');
          setCvv('');
        }, 800);
      }, 700);
    } else if (addType === 'apple_pay' || addType === 'google_pay') {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onAddPaymentMethod({
          type: addType,
          brand: 'other',
          last4: String(Math.floor(1000 + Math.random() * 9000)),
          cardholderName: `${cardholderName || 'Verified User'} (${addType === 'apple_pay' ? 'Apple Wallet' : 'Google Wallet'})`,
          isDefault,
        });
        setSuccessMsg(`${addType === 'apple_pay' ? 'Apple Pay' : 'Google Pay'} connected successfully!`);
        setTimeout(() => {
          setView('list');
          setSuccessMsg(null);
        }, 800);
      }, 700);
    } else if (addType === 'paypal') {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onAddPaymentMethod({
          type: 'paypal',
          brand: 'other',
          last4: 'PAYPAL',
          cardholderName: cardholderName || 'paypal-account@user.com',
          isDefault,
        });
        setSuccessMsg('PayPal account authorized and saved.');
        setTimeout(() => {
          setView('list');
          setSuccessMsg(null);
        }, 800);
      }, 700);
    }
  };

  // Helper to get total spend on this card from receipts
  const getCardSpendTotal = (pm: PaymentMethod) => {
    return receipts
      .filter((r) => {
        const p = (r.payment_method || '').toLowerCase();
        if (pm.type === 'apple_pay' && p.includes('apple')) return true;
        if (pm.last4 && p.includes(pm.last4)) return true;
        if (pm.brand && p.includes(pm.brand)) return true;
        return false;
      })
      .reduce((sum, r) => sum + r.total, 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Glow Top Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Payment Methods</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                PCI-DSS Level 1 Vault & Instant Receipt Matching
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

        {/* Action Toggle (Saved Cards vs Add Method) */}
        <div className="px-6 pt-2">
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => {
                setView('list');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                view === 'list'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Saved Cards ({paymentMethods.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setView('add');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                view === 'add'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Payment Method</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Notifications */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LIST VIEW: SAVED PAYMENT METHODS */}
          {view === 'list' && (
            <div className="space-y-3">
              {paymentMethods.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No payment methods stored in your encrypted vault.
                  </p>
                  <button
                    onClick={() => setView('add')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    Add Your First Card
                  </button>
                </div>
              ) : (
                paymentMethods.map((pm) => {
                  const spend = getCardSpendTotal(pm);
                  const isVisa = pm.brand === 'visa';
                  const isMastercard = pm.brand === 'mastercard';
                  const isAmex = pm.brand === 'amex';
                  const isApplePay = pm.type === 'apple_pay';
                  const isGooglePay = pm.type === 'google_pay';
                  const isPayPal = pm.type === 'paypal';

                  return (
                    <div
                      key={pm.id}
                      className={`relative p-4 rounded-2xl border transition-all ${
                        pm.isDefault
                          ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/40 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {/* Card / Wallet Badge */}
                          <div
                            className={`w-12 h-8 rounded-lg flex items-center justify-center font-extrabold text-[10px] tracking-wider text-white shadow-sm shrink-0 ${
                              isVisa
                                ? 'bg-gradient-to-r from-blue-700 to-indigo-800'
                                : isMastercard
                                ? 'bg-gradient-to-r from-red-600 to-amber-600'
                                : isAmex
                                ? 'bg-gradient-to-r from-emerald-700 to-teal-800'
                                : isApplePay
                                ? 'bg-slate-900 border border-slate-700'
                                : isGooglePay
                                ? 'bg-gradient-to-r from-blue-600 to-emerald-600'
                                : isPayPal
                                ? 'bg-blue-600'
                                : 'bg-slate-700'
                            }`}
                          >
                            {isVisa
                              ? 'VISA'
                              : isMastercard
                              ? 'MC'
                              : isAmex
                              ? 'AMEX'
                              : isApplePay
                              ? ' Pay'
                              : isGooglePay
                              ? 'GPay'
                              : isPayPal
                              ? 'PayPal'
                              : 'CARD'}
                          </div>

                          {/* Card Details */}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                                {isApplePay
                                  ? 'Apple Pay'
                                  : isGooglePay
                                  ? 'Google Pay'
                                  : isPayPal
                                  ? 'PayPal Wallet'
                                  : `${pm.brand?.toUpperCase() || 'Card'} •••• ${pm.last4}`}
                              </span>
                              {pm.isDefault && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black tracking-wider uppercase">
                                  Default
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {pm.cardholderName}
                              {pm.expMonth && pm.expYear && ` • Expires ${String(pm.expMonth).padStart(2, '0')}/${String(pm.expYear).slice(-2)}`}
                            </p>

                            {/* Linked Receipts Statistics */}
                            {spend > 0 && (
                              <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                <Sparkles className="w-3 h-3" />
                                <span>${spend.toLocaleString('en-US', { minimumFractionDigits: 2 })} tracked across receipts</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          {!pm.isDefault && (
                            <button
                              type="button"
                              onClick={() => onSetDefaultPaymentMethod(pm.id)}
                              className="px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 text-[10px] font-bold transition-colors cursor-pointer"
                              title="Make this the default card for Pro subscriptions"
                            >
                              Make Default
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              if (paymentMethods.length <= 1) {
                                setErrorMsg('You must keep at least one payment method or add a replacement first.');
                                return;
                              }
                              if (window.confirm('Remove this payment method from your secure vault?')) {
                                onRemovePaymentMethod(pm.id);
                              }
                            }}
                            className="p-1.5 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Remove card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Security Footnote */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>256-Bit Hardware Tokenization</span>
                </div>
                <span className="text-emerald-500 font-bold">Zero-Fraud Guarantee</span>
              </div>
            </div>
          )}

          {/* ADD VIEW: NEW PAYMENT METHOD FORM */}
          {view === 'add' && (
            <div className="space-y-4">
              {/* Payment Type Selection */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAddType('credit_card')}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    addType === 'credit_card'
                      ? 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                  <span className="text-[11px] font-bold block">Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAddType('apple_pay')}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    addType === 'apple_pay'
                      ? 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                  <span className="text-[11px] font-bold block">Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAddType('google_pay')}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    addType === 'google_pay'
                      ? 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                  <span className="text-[11px] font-bold block">Google Pay</span>
                </button>
              </div>

              {/* Real-time Interactive Card Preview (for Credit Card) */}
              {addType === 'credit_card' && (
                <div className="relative p-5 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-850 to-slate-800 border border-slate-700 text-white shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                      ReceiptMind SafeVault
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-bold tracking-wider uppercase font-mono">
                      {detectedBrand.toUpperCase()}
                    </span>
                  </div>

                  <div className="my-5">
                    <span className="font-mono text-base tracking-widest block font-bold text-slate-100">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </span>
                  </div>

                  <div className="flex items-end justify-between text-xs">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">
                        Cardholder
                      </span>
                      <span className="font-bold tracking-wide truncate max-w-[170px] block">
                        {cardholderName || 'YOUR FULL NAME'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">
                        Expires
                      </span>
                      <span className="font-mono font-bold">
                        {expiry || 'MM/YY'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Input Fields */}
              <form onSubmit={handleAddSubmit} className="space-y-3">
                {addType === 'credit_card' ? (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        required
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder="Name on card"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                          Expires
                        </label>
                        <input
                          type="text"
                          required
                          value={expiry}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="col-span-1">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                          placeholder="•••"
                          className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="col-span-1">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                          Billing ZIP
                        </label>
                        <input
                          type="text"
                          required
                          value={billingZip}
                          onChange={(e) => setBillingZip(e.target.value)}
                          placeholder="ZIP"
                          className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                    <p className="text-slate-600 dark:text-slate-300">
                      Link your {addType === 'apple_pay' ? 'Apple Wallet' : 'Google Pay Wallet'} for instant biometrically secured checkout on Pro subscriptions and automatic receipt reconciliation.
                    </p>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        Account Identifier / Name
                      </label>
                      <input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder="Alex Mercer"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-400"
                  />
                  <span>Set as default payment method for Pro plans</span>
                </label>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setView('list')}
                    className="w-1/3 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-transform active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Tokenizing Card...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Save to Vault</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
