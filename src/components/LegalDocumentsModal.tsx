import React, { useState } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Lock, Download, Printer } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: 'privacy' | 'terms';
  onClose: () => void;
}

export const LegalDocumentsModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              {activeTab === 'privacy' ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Legal & Store Compliance
              </h2>
              <p className="text-xs text-slate-400">
                Official documentation for App Store & Google Play Store distribution
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-5 pt-3 border-b border-slate-100 dark:border-slate-800 flex gap-2 shrink-0 bg-slate-50/50 dark:bg-slate-950/20">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Privacy Policy (GDPR & CCPA)
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'terms'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Terms of Service & EULA
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {activeTab === 'privacy' ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center gap-2.5">
                <Lock className="w-4 h-4 shrink-0" />
                <span>
                  <strong>App Store & Play Store Guarantee:</strong> ReceiptMind is built with a zero-knowledge local vault architecture. Your raw receipt photos and personal purchase details remain strictly in your encrypted client storage.
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  1. Information We Collect
                </h3>
                <p>
                  ReceiptMind accesses your device camera and selected image files solely when you initiate an optical scan or photo upload. We do not transmit or store continuous video streams or background imagery. Extracted data points (merchant, date, line items, and totals) are parsed via privacy-preserving AI inference and stored locally on your device.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  2. Camera & Photo Permissions (Apple iOS & Android)
                </h3>
                <p>
                  Pursuant to Apple App Store Review Guideline 5.1.1 and Google Play User Data policies:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><strong>Camera Access (NSCameraUsageDescription):</strong> Required strictly for real-time receipt scanning and edge detection within the viewfinder.</li>
                  <li><strong>Photo Library (NSPhotoLibraryUsageDescription):</strong> Utilized only when you manually select existing receipt screenshots or PDF invoices for processing.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  3. Security & Client-Side Encryption
                </h3>
                <p>
                  Receipt data in local storage can be locked with a 4-digit master PIN and biometrics (Touch ID, Face ID, WebAuthn Passkeys). Cryptographic hashes prevent unauthorized recovery of your purchase history.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  4. Right to Deletion & Portability (GDPR & CCPA)
                </h3>
                <p>
                  You retain full ownership of your data. You may download a complete encrypted JSON/CSV archive of all receipts at any time, or execute the "Delete All Stored Receipts & Data" command in Settings for permanent data purge.
                </p>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                Last updated: September 2026 • Validated for Google Play Console & Apple App Store Connect.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>End User License Agreement (EULA):</strong> Standard Apple & Google Play Store terms governing subscription services and AI OCR accuracy.
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  1. License Grant
                </h3>
                <p>
                  Subject to your compliance with these Terms, ReceiptMind grants you a revocable, non-exclusive, non-transferable, limited license to download, install, and use the application on compatible mobile and desktop devices.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  2. AI OCR Extraction & Warranty Disclaimers
                </h3>
                <p>
                  ReceiptMind leverages advanced neural models to parse receipts and estimate warranty periods. While accuracy rates exceed 99%, users are encouraged to verify crucial dates with manufacturer documentation before filing warranty claims. ReceiptMind is not an insurer or underwriter.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  3. Subscriptions & Billing
                </h3>
                <p>
                  ReceiptMind Pro subscriptions (Monthly or Annual) provide unlimited receipt scans, warranty calendar integration, and multi-currency export. When subscribed via Apple App Store or Google Play Store, payment is charged to your Apple ID or Google Play account at confirmation of purchase, and renews automatically unless canceled at least 24 hours before the end of the current billing cycle.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  4. Termination
                </h3>
                <p>
                  You may terminate your agreement at any time by uninstalling the application or purging stored receipts through the in-app Data Governance controls.
                </p>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                Contact: support@receiptmind.app • Governed under standard Apple Licensed Application End User License Agreement (EULA).
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 font-medium">
            Version 1.2.0 • Store Policy Compliant
          </span>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            I Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
