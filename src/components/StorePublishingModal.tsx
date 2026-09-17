import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Play,
  Apple,
  CheckCircle2,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  FileCode2,
  Sparkles,
  Info,
  ChevronRight,
  FolderArchive,
  Layers,
  Code2,
  Eye,
  Camera,
  Database,
  Cpu
} from 'lucide-react';

interface StorePublishingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLegal: (tab: 'privacy' | 'terms') => void;
}

export const StorePublishingModal: React.FC<StorePublishingModalProps> = ({
  isOpen,
  onClose,
  onOpenLegal,
}) => {
  const [activePlatform, setActivePlatform] = useState<
    'native_android' | 'brand_assets' | 'playstore_twa' | 'appstore' | 'metadata'
  >('native_android');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedAssetPreview, setSelectedAssetPreview] = useState<string>('/icons/icon-square.png');

  if (!isOpen) return null;

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const gradleBuildSnippet = `./gradlew :app:bundleRelease`;
  const keystoreSnippet = `keytool -genkey -v -keystore release.keystore -alias receiptmind -keyalg RSA -keysize 2048 -validity 10000`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">
                  ReceiptMind Deployment &amp; Store Publishing
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                  Native Android 15 Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kotlin &amp; Jetpack Compose source code, Play Store assets, and release pipeline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Readiness Checklist Banner */}
        <div className="px-5 py-2.5 bg-emerald-500/10 border-b border-emerald-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Store Standards Verified: Native Android Package &amp; Brand Assets Provisioned</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Kotlin + Jetpack Compose
            </span>
            <span className="flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Room DB + ML Kit OCR
            </span>
            <span className="flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> 512px Icons &amp; Splash Screens
            </span>
          </div>
        </div>

        {/* Platform Selection Tabs */}
        <div className="px-5 pt-3 border-b border-slate-100 dark:border-slate-800 flex gap-2 shrink-0 bg-slate-50/70 dark:bg-slate-950/40 overflow-x-auto">
          <button
            onClick={() => setActivePlatform('native_android')}
            className={`pb-2.5 px-3 text-xs font-extrabold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'native_android'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Native Android (Kotlin &amp; Compose)</span>
          </button>

          <button
            onClick={() => setActivePlatform('brand_assets')}
            className={`pb-2.5 px-3 text-xs font-extrabold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'brand_assets'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Brand Icons &amp; Splash Assets</span>
          </button>

          <button
            onClick={() => setActivePlatform('playstore_twa')}
            className={`pb-2.5 px-3 text-xs font-extrabold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'playstore_twa'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Store (PWA / TWA Option)</span>
          </button>

          <button
            onClick={() => setActivePlatform('appstore')}
            className={`pb-2.5 px-3 text-xs font-extrabold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'appstore'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Apple className="w-3.5 h-3.5 fill-current" />
            <span>Apple App Store (iOS)</span>
          </button>

          <button
            onClick={() => setActivePlatform('metadata')}
            className={`pb-2.5 px-3 text-xs font-extrabold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'metadata'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Store Listing Metadata</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {/* TAB 1: NATIVE KOTLIN & JETPACK COMPOSE */}
          {activePlatform === 'native_android' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-900 dark:text-white space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-500 text-xs uppercase tracking-wider block">
                    Native Kotlin + Jetpack Compose Architecture
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                    Project Path: /android
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  A complete standalone native Android project has been generated in the <code>/android</code> folder. It preserves the exact ReceiptMind visual brand, dark ink-navy &amp; amber design system, local Room database, and on-device receipt extraction engine.
                </p>
              </div>

              {/* Core Android Modules */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Database className="w-4 h-4 text-amber-500" />
                    <span>Room SQLite DB</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Offline encrypted vault with DAO queries, warranty expiration triggers, and search.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Camera className="w-4 h-4 text-amber-500" />
                    <span>CameraX + ML Kit</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    On-device optical character recognition with laser beam viewfinder animation.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Layers className="w-4 h-4 text-amber-500" />
                    <span>Material 3 Compose</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Ink-Navy (#090D16) background, amber accents (#F59E0B), and custom typography.
                  </p>
                </div>
              </div>

              {/* Step-by-Step Native Release Steps */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  How to Build &amp; Deploy to Google Play Console
                </h3>

                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                        1
                      </span>
                      Open in Android Studio
                    </span>
                    <span className="text-[11px] text-slate-400 font-bold">Android Studio Ladybug+</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Open Android Studio, choose <strong>Open</strong>, and select the <code>/android</code> directory. Gradle will automatically sync dependencies defined in <code>gradle/libs.versions.toml</code>.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                        2
                      </span>
                      Generate Release Keystore
                    </span>
                    <button
                      onClick={() => copyToClipboard('keystore', keystoreSnippet)}
                      className="flex items-center gap-1 text-[11px] font-bold text-amber-500 hover:text-amber-400 cursor-pointer"
                    >
                      {copiedKey === 'keystore' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Keystore Command</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10.5px] overflow-x-auto">
                    {keystoreSnippet}
                  </pre>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                        3
                      </span>
                      Build Signed Android App Bundle (.aab)
                    </span>
                    <button
                      onClick={() => copyToClipboard('bundle', gradleBuildSnippet)}
                      className="flex items-center gap-1 text-[11px] font-bold text-amber-500 hover:text-amber-400 cursor-pointer"
                    >
                      {copiedKey === 'bundle' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Gradle Command</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto">
                    {gradleBuildSnippet}
                  </pre>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Output: <code>android/app/build/outputs/bundle/release/app-release.aab</code>. This is the exact bundle uploaded directly to Google Play Console.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BRAND ASSETS SHOWCASE */}
          {activePlatform === 'brand_assets' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-900 dark:text-white space-y-1">
                <span className="font-extrabold text-amber-500 text-xs uppercase tracking-wider block">
                  Production App Icon &amp; Splash Screen Suite
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Rendered in vector SVG and 512x512 PNG, matching the ink-navy luxury aesthetic with amber laser beam accents.
                </p>
              </div>

              {/* Visual Showcase Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Square Icon */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-4">
                  <img
                    src="/icons/icon-square.png"
                    alt="Square Icon"
                    className="w-20 h-20 rounded-xl shadow-lg border border-amber-500/30 object-cover bg-slate-950"
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">
                        Google Play Store Icon
                      </span>
                      <span className="text-[10px] font-mono text-amber-500">512 x 512</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Standard square icon required for Play Store listing.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href="/icons/icon-square.png"
                        download="receiptmind-icon-square-512.png"
                        className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1 hover:bg-amber-400"
                      >
                        <Download className="w-3 h-3" /> PNG (512px)
                      </a>
                      <a
                        href="/icons/icon-square.svg"
                        download="receiptmind-icon-square.svg"
                        className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px] flex items-center gap-1"
                      >
                        SVG
                      </a>
                    </div>
                  </div>
                </div>

                {/* Squircle Rounded Icon */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-4">
                  <img
                    src="/icons/icon-rounded.png"
                    alt="Rounded Icon"
                    className="w-20 h-20 rounded-[20px] shadow-lg border border-amber-500/30 object-cover bg-slate-950"
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">
                        Apple App Store Squircle
                      </span>
                      <span className="text-[10px] font-mono text-amber-500">512 x 512</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      22.5% squircle corner radius with rim lighting.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href="/icons/icon-rounded.png"
                        download="receiptmind-icon-rounded-512.png"
                        className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1 hover:bg-amber-400"
                      >
                        <Download className="w-3 h-3" /> PNG (512px)
                      </a>
                      <a
                        href="/icons/icon-rounded.svg"
                        download="receiptmind-icon-rounded.svg"
                        className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px] flex items-center gap-1"
                      >
                        SVG
                      </a>
                    </div>
                  </div>
                </div>

                {/* Minimalist Splash Emblem */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-4">
                  <img
                    src="/icons/splash-logo.png"
                    alt="Splash Logo"
                    className="w-20 h-20 rounded-xl shadow-lg border border-amber-500/30 object-cover bg-slate-950"
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">
                        Splash Emblem Monogram
                      </span>
                      <span className="text-[10px] font-mono text-amber-500">512 x 512</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Clean centered emblem with radiant ambient halo for launch screens.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href="/icons/splash-logo.png"
                        download="receiptmind-splash-logo-512.png"
                        className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1 hover:bg-amber-400"
                      >
                        <Download className="w-3 h-3" /> PNG (512px)
                      </a>
                      <a
                        href="/icons/splash-logo.svg"
                        download="receiptmind-splash-logo.svg"
                        className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px] flex items-center gap-1"
                      >
                        SVG
                      </a>
                    </div>
                  </div>
                </div>

                {/* Full Mobile Splash Screen */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl shadow-lg border border-amber-500/30 bg-slate-950 flex items-center justify-center overflow-hidden">
                    <img
                      src="/icons/splash-screen.svg"
                      alt="Mobile Splash"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">
                        Full Mobile Splash Screen
                      </span>
                      <span className="text-[10px] font-mono text-amber-500">1080 x 1920</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      High-resolution portrait screen with typography &amp; security crest.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href="/icons/splash-screen.svg"
                        download="receiptmind-splash-screen-1080x1920.svg"
                        className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1 hover:bg-amber-400"
                      >
                        <Download className="w-3 h-3" /> Download Vector SVG
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PLAY STORE TWA (ALTERNATIVE OPTION) */}
          {activePlatform === 'playstore_twa' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-900 dark:text-white space-y-1">
                <span className="font-extrabold text-amber-500 text-xs uppercase tracking-wider block">
                  Trusted Web Activity (TWA) Distribution Option
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  If you prefer to package the live web version directly without compiling the Kotlin code in Android Studio, you can use Google's official <strong>PWABuilder</strong> or <strong>Bubblewrap CLI</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <span className="font-extrabold text-slate-900 dark:text-white block">
                    Option A: PWABuilder (2-Minute Automated Packaging)
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Visit <strong>pwabuilder.com</strong>, paste your hosted app URL, click <em>Package for Android</em>, and download the pre-signed <code>.aab</code> bundle ready for Google Play Console upload.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <span className="font-extrabold text-slate-900 dark:text-white block">
                    Option B: Bubblewrap CLI
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] flex items-center justify-between">
                    <span>npx @bubblewrap/cli init --manifest=https://your-domain.com/manifest.json</span>
                    <button
                      onClick={() =>
                        copyToClipboard('bw', 'npx @bubblewrap/cli init --manifest=https://your-domain.com/manifest.json')
                      }
                      className="text-amber-400 hover:text-amber-300 ml-2"
                    >
                      {copiedKey === 'bw' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: APPLE APP STORE */}
          {activePlatform === 'appstore' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-900 dark:text-white space-y-1">
                <span className="font-extrabold text-amber-500 text-xs uppercase tracking-wider block">
                  Apple App Store (iOS) Distribution
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Wrap ReceiptMind into an Xcode project using <strong>Capacitor</strong> in 3 terminal commands.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Capacitor iOS Commands</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'cap_cmd',
                        'npm i @capacitor/core @capacitor/cli @capacitor/ios\nnpx cap init ReceiptMind com.receiptmind.app\nnpx cap add ios\nnpm run build\nnpx cap copy\nnpx cap open ios'
                      )
                    }
                    className="text-amber-500 hover:text-amber-400 font-bold text-[11px] flex items-center gap-1"
                  >
                    {copiedKey === 'cap_cmd' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Commands</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`npm i @capacitor/core @capacitor/cli @capacitor/ios
npx cap init ReceiptMind com.receiptmind.app
npx cap add ios
npm run build && npx cap copy
npx cap open ios`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: METADATA */}
          {activePlatform === 'metadata' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-500 tracking-wider block">
                    App Title (Play Store &amp; App Store)
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      ReceiptMind: AI Scanner &amp; Warranty Vault
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard('title', 'ReceiptMind: AI Scanner & Warranty Vault')
                      }
                      className="text-amber-500 hover:text-amber-400 font-bold"
                    >
                      {copiedKey === 'title' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                  <span className="text-[10px] font-extrabold uppercase text-amber-500 tracking-wider block">
                    Short Description (Max 80 chars)
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-slate-700 dark:text-slate-300 text-xs">
                      AI receipt scanner, expense tracker, and warranty expiration vault.
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          'short_desc',
                          'AI receipt scanner, expense tracker, and warranty expiration vault.'
                        )
                      }
                      className="text-amber-500 hover:text-amber-400 font-bold"
                    >
                      {copiedKey === 'short_desc' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                  <span className="text-[10px] font-extrabold uppercase text-amber-500 tracking-wider block">
                    Privacy Policy &amp; Terms
                  </span>
                  <div className="flex items-center gap-3 mt-1.5">
                    <button
                      onClick={() => onOpenLegal('privacy')}
                      className="text-amber-500 hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>Review Privacy Policy</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onOpenLegal('terms')}
                      className="text-amber-500 hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>Review Terms of Service</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">
            Target SDK: Android 35 • iOS 17+ • Zero-Knowledge Encryption
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
