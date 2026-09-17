import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, ShieldCheck, PieChart, ArrowRight, CheckCircle2, Sparkles, Apple } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingProps {
  isOpen: boolean;
  onComplete: (user: Partial<UserProfile>) => void;
}

export const OnboardingModal: React.FC<OnboardingProps> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [authMode, setAuthMode] = useState<'intro' | 'auth'>('intro');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const slides = [
    {
      icon: Camera,
      title: 'Scan Receipts Instantly',
      subtitle: 'Snap any paper or digital receipt. Our vision AI instantly extracts store names, line items, taxes, and prices with laser accuracy.',
      badge: 'Edge-Detection AI',
      color: 'from-amber-500/20 to-orange-500/10 text-amber-500',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80',
    },
    {
      icon: ShieldCheck,
      title: 'Never Miss a Warranty Deadline',
      subtitle: 'ReceiptMind automatically detects warranty-eligible electronics, tools, and appliances, tracking countdowns and return policies.',
      badge: 'Proactive 30/7/1 Day Alerts',
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-500',
      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop&q=80',
    },
    {
      icon: PieChart,
      title: 'Clean Spending Insights',
      subtitle: 'Effortless automated categorization, month-over-month trends, and certified insurance backups for peace of mind.',
      badge: 'Certified Insurance Mode',
      color: 'from-blue-500/20 to-indigo-500/10 text-blue-500',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setAuthMode('auth');
    }
  };

  const handleFinish = (method: string) => {
    onComplete({
      name: name.trim() || (method === 'apple' ? 'Alex Mercer' : method === 'google' ? 'Alex Mercer' : 'ReceiptMind User'),
      email: email.trim() || (method === 'apple' ? 'alex.mercer@icloud.com' : 'alex.mercer@gmail.com'),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      onboardingCompleted: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="p-6 sm:p-8">
          {/* Top Brand Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold tracking-tight text-lg text-white">ReceiptMind</span>
            </div>
            {authMode === 'intro' && (
              <button
                id="btn-skip-onboarding"
                onClick={() => setAuthMode('auth')}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Skip
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {authMode === 'intro' ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Visual Icon Box */}
                <div className="relative h-52 rounded-2xl bg-slate-900 border border-slate-700/60 flex flex-col items-center justify-center overflow-hidden shadow-lg">
                  <img
                    src={slides[currentStep].image}
                    alt={slides[currentStep].title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-18 h-18 rounded-2xl bg-gradient-to-br ${slides[currentStep].color} backdrop-blur-md flex items-center justify-center mb-3 shadow-xl border border-white/10`}>
                      {React.createElement(slides[currentStep].icon, { className: 'w-9 h-9' })}
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/90 backdrop-blur-md text-slate-200 border border-slate-700 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      {slides[currentStep].badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    {slides[currentStep].title}
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                    {slides[currentStep].subtitle}
                  </p>
                </div>

                {/* Dots indicator */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  {slides.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentStep ? 'w-6 bg-amber-500' : 'w-2 bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                {/* Action button */}
                <button
                  id="btn-onboarding-next"
                  onClick={handleNext}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  {currentStep === slides.length - 1 ? 'Get Started' : 'Next'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="auth"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Create Your Account
                  </h2>
                  <p className="text-xs text-slate-400">
                    Sync receipts and active warranties securely across all devices
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    id="btn-auth-apple"
                    onClick={() => handleFinish('apple')}
                    className="w-full py-3 px-4 rounded-xl bg-white text-slate-900 font-semibold flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
                  >
                    <Apple className="w-5 h-5 fill-current" />
                    <span>Continue with Apple</span>
                  </button>

                  <button
                    id="btn-auth-google"
                    onClick={() => handleFinish('google')}
                    className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold border border-slate-700 flex items-center justify-center gap-3 transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-xs text-slate-500 uppercase font-medium">Or email</span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <div className="space-y-2">
                  <input
                    id="input-auth-name"
                    type="text"
                    placeholder="Full Name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    id="input-auth-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    id="btn-auth-submit-email"
                    onClick={() => handleFinish('email')}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-colors cursor-pointer mt-1"
                  >
                    Continue with Email
                  </button>
                </div>

                <button
                  id="btn-auth-guest"
                  onClick={() => handleFinish('guest')}
                  className="w-full text-center text-xs text-slate-400 hover:text-slate-200 py-1 transition-colors cursor-pointer"
                >
                  Continue as Guest Demo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
