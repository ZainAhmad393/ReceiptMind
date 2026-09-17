import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  DollarSign,
  AlertCircle,
  ChevronDown,
  Cpu,
  Zap,
} from 'lucide-react';
import { ChatMessage, Receipt, WarrantyItem, AppCurrency, AppLanguage } from '../types';
import { formatCurrency } from '../utils/i18n';
import { DEFAULT_PRODUCT_IMAGES, handleImageError } from '../utils/imageFallbacks';

interface GeminiChatViewProps {
  receipts: Receipt[];
  warranties: WarrantyItem[];
  currency: AppCurrency;
  lang: AppLanguage;
  onSelectReceipt?: (receipt: Receipt) => void;
  onOpenWarrantyCenter?: () => void;
}

export const GeminiChatView: React.FC<GeminiChatViewProps> = ({
  receipts,
  warranties,
  currency,
  lang,
  onSelectReceipt,
  onOpenWarrantyCenter,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('rm_gemini_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return [
      {
        id: 'msg_initial',
        role: 'assistant',
        content: `Hi there! I'm **ReceiptMind AI**, your professional personal finance advisor and warranty advocate.

I have live visibility into your **${receipts.length} scanned receipts** and **${warranties.length} tracked warranties**. 

Ask me anything about your expenditures, upcoming warranty expirations, or let me draft an official warranty claim letter for you!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: '🛡️ Expiring warranties', action: 'Which of my warranties are expiring soon?' },
          { label: '💰 Top spend categories', action: 'What are my top spending categories?' },
          { label: '🍎 Apple Store purchases', action: 'Break down my purchases from Apple Fifth Avenue' },
          { label: '📝 Draft warranty claim', action: 'Draft a manufacturer warranty claim for my Sony Headphones' },
        ],
      },
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom of thread
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rm_gemini_chat_history', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Build condensed receipts context for Gemini prompt
  const getCondensedContext = () => {
    return {
      totalReceiptsCount: receipts.length,
      totalSpend: receipts.reduce((acc, r) => acc + r.total, 0),
      currency,
      receipts: receipts.map((r) => ({
        id: r.id,
        store: r.store_name,
        date: r.date,
        total: r.total,
        payment_method: r.payment_method,
        items: r.items.map((it) => ({
          name: it.name,
          price: it.price,
          category: it.category,
          warranty_months: it.estimated_warranty_months,
        })),
      })),
      warranties: warranties.map((w) => ({
        item: w.itemName,
        store: w.storeName,
        status: w.status,
        daysRemaining: w.daysRemaining,
        expiryDate: w.expiryDate,
        price: w.price,
      })),
    };
  };

  const handleSendMessage = async (userText?: string) => {
    const textToSend = (userText || input).trim();
    if (!textToSend || loading) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          receiptsContext: getCondensedContext(),
          model: selectedModel,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to communicate with ReceiptMind AI.');
      }

      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat request error:', err);
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Connection Error**: ${err.message || 'Unable to contact ReceiptMind AI'}. Please check your connection or try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (confirm('Clear chat history?')) {
      localStorage.removeItem('rm_gemini_chat_history');
      setMessages([
        {
          id: 'msg_reset',
          role: 'assistant',
          content: 'Chat history cleared. How can I assist you with your receipts and warranties today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto pb-6">
      {/* Visual Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-5 text-white shadow-lg shrink-0 mb-3">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80"
          alt="AI Neural Background"
          referrerPolicy="no-referrer"
          onError={(e) => handleImageError(e, DEFAULT_PRODUCT_IMAGES.macbook)}
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-md shadow-amber-500/20">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  alt="AI Concierge"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, DEFAULT_PRODUCT_IMAGES.botAvatar)}
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  ReceiptMind AI Assistant
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h2>
              </div>
              <p className="text-xs text-slate-300">
                Professional intelligent assistant for receipt analytics & warranty claims
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Model Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-[11px] font-mono font-medium text-amber-400 border border-slate-700 transition-colors cursor-pointer"
                title="Select AI Engine"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>
                  {selectedModel === 'gemini-3.1-flash-lite'
                    ? 'Engine: Turbo'
                    : selectedModel === 'gemini-3.1-pro-preview'
                    ? 'Engine: Deep'
                    : 'Engine: Standard'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isModelDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-48 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-30">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Select AI Engine
                  </div>
                  <button
                    onClick={() => {
                      setSelectedModel('gemini-3.8-flash');
                      setIsModelDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 cursor-pointer ${
                      selectedModel === 'gemini-3.8-flash' ? 'text-amber-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <span>ReceiptMind Standard</span>
                    <span className="text-[10px] text-slate-500">Fast & Balanced</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedModel('gemini-3.1-flash-lite');
                      setIsModelDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 cursor-pointer ${
                      selectedModel === 'gemini-3.1-flash-lite' ? 'text-amber-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <span>ReceiptMind Turbo</span>
                    <span className="text-[10px] text-slate-500">Ultra Fast</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedModel('gemini-3.1-pro-preview');
                      setIsModelDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 cursor-pointer ${
                      selectedModel === 'gemini-3.1-pro-preview' ? 'text-amber-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <span>ReceiptMind Deep</span>
                    <span className="text-[10px] text-slate-500">Deep Reasoning</span>
                  </button>
                </div>
              )}
            </div>

            {/* Clear history button */}
            <button
              onClick={handleClearHistory}
              title="Clear conversation"
              className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Conversation Thread */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2 pr-3 scrollbar-thin">
        {messages.map((msg) => {
          const isBot = msg.role === 'assistant' || msg.role === 'model';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-amber-500 to-orange-500 shrink-0 p-0.5 shadow-sm mt-0.5">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Bot Avatar"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, DEFAULT_PRODUCT_IMAGES.botAvatar)}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 shadow-sm relative group ${
                  isBot
                    ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-medium'
                }`}
              >
                {/* Message Body with clean paragraph & bold rendering */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {msg.content}
                </div>

                {/* Suggested chips if present */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(s.action)}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-500/10 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-all cursor-pointer text-left"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Footer timestamp & copy button */}
                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    isBot ? 'text-slate-400' : 'text-slate-900/70 font-bold'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {isBot && (
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 p-0.5 shadow-sm mt-0.5">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="User"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, DEFAULT_PRODUCT_IMAGES.avatar)}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator with Animated Pulse */}
        {loading && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-amber-500 to-orange-500 shrink-0 p-0.5 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Bot Thinking"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              <span>Analyzing receipts & thinking with ReceiptMind AI...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 px-1">
        <button
          onClick={() => handleSendMessage('Which items have expiring warranties soon?')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          🛡️ Expiring Warranties
        </button>
        <button
          onClick={() => handleSendMessage('How much have I spent this month across all categories?')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          💳 Monthly Spending Breakdown
        </button>
        <button
          onClick={() => handleSendMessage('Write a warranty replacement claim letter for my MacBook Pro')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          📝 Claim Letter
        </button>
      </div>

      {/* Input Field with Send Button */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative shrink-0 flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-md focus-within:border-amber-500 transition-all"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask ReceiptMind AI about your receipts, warranties, or claims..."
          disabled={loading}
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4 stroke-[2.2]" />
        </button>
      </form>
    </div>
  );
};
