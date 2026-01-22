import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Mic, X, Archive, Plus, Loader2, Sparkles, MessageCircle, MoreVertical } from 'lucide-react';
// import { supabase, askFinancialCoach } from '../utils/supabase'; // Disabled for demo
import { useAuthStore } from '../store/authStore';
import { useOfflineStore } from '../store/offlineStore';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import VoiceToText from '../components/VoiceToText';
// import { getCoachingContext, saveConversation } from '../utils/coachingHelpers'; // Disabled
import { PageSkeleton } from '../components/LoadingSkeleton';
import SwipeToRefresh from '../components/SwipeToRefresh';
import OfflineBanner from '../components/OfflineBanner';
import { useTranslation } from 'react-i18next';
import BeeZeeLogo from '../components/BeeZeeLogo';
import FloatingNavBar from '../components/FloatingNavBar';
import CoachMessage from '../components/CoachMessage';
import { useDemoData } from '../hooks/useDemoData';

export default function Coach() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const { coachSessions, addCoachSession, loading: demoLoading } = useDemoData();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [questionsRemaining, setQuestionsRemaining] = useState(99);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (coachSessions) {
      setMessages(coachSessions);
    }
  }, [coachSessions]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getMockResponse = (input) => {
    const text = input.toLowerCase();
    if (text.includes('profit') || text.includes('doing')) {
      return "Your business is doing well! Your total profit is R22,400 this month, which is up 15% from last month. Most of your revenue is coming from Blue Ribbon Bread sales.";
    }
    if (text.includes('bread') || text.includes('stock')) {
      return "You currently have 24 loaves of Blue Ribbon Bread in stock. You've sold 3 today. Based on your sales rate, you should restock in about 4 days.";
    }
    if (text.includes('who') || text.includes('beezee')) {
      return "I'm BeeZee, your AI business coach! I'm here to help you manage your shop in South Africa, track your inventory, and understand your finances.";
    }
    return "That's a great question! In this demo mode, I can help you analyze your mock data. Try asking about your profit or bread stock!";
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userInput = input;
    setInput('');
    setLoading(true);
    setIsTyping(true);

    try {
      // Direct call to demo hook to save both user and assistant messages
      const answer = getMockResponse(userInput);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      await addCoachSession(userInput, answer);
      setQuestionsRemaining((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error(t('coach.askError', 'Failed to get response.'));
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleVoiceInput = (text) => {
    setInput(text);
    setShowVoiceInput(false);
    if (text.length > 5) setTimeout(() => handleSend(), 500);
  };

  if (loadingHistory) return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/5 pointer-events-none"></div>
      </div>
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="p-4">
          <div className="bg-white border-gray-300 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BeeZeeLogo />
                <h1 className="text-gray-800 font-semibold text-xl">{t('nav.coach', 'Coach')}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <PageSkeleton />
        </div>
      </div>
    </div>
  );

  return (
    <SwipeToRefresh onRefresh={async () => { }}>
      <div className="min-h-screen relative overflow-hidden">
        {/* Light Gray Background with Moving Shapes */}
        <div className="absolute inset-0 bg-gray-200">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/5 pointer-events-none"></div>

          {/* Animated items would go here as in the original */}
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Professional Header */}
          <div className="p-4 pt-12">
            <div className="bg-white border-gray-300 rounded-3xl p-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-10 h-10 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center text-gray-800"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                  <BeeZeeLogo />
                  <h1 className="text-gray-800 font-semibold text-xl">{t('nav.coach', 'Coach')} (Demo)</h1>
                </div>

                <div className="bg-gray-100 border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2">
                  <Sparkles size={14} className="text-gray-700" />
                  <span className="text-gray-700 text-xs font-bold uppercase tracking-wider">{questionsRemaining} Left</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 px-4 pb-40 space-y-3 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                <div className={`max-w-[85%] rounded-2xl shadow-2xl border p-4 transition-all duration-300 bg-white border-gray-300 text-gray-900 ${msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                  }`}>
                  <div className="relative z-10">
                    {msg.role === 'assistant' ? (
                      <CoachMessage content={msg.content} citations={msg.citations || []} />
                    ) : (
                      <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                    )}
                  </div>

                  <span className={`text-[10px] font-semibold uppercase tracking-wide mt-2 block opacity-60 text-gray-500 ${msg.role === 'user' ? 'text-right' : 'text-left'
                    }`}>
                    {format(new Date(msg.timestamp), 'p')}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-slide-up">
                <div className="bg-white border-gray-300 rounded-2xl rounded-tl-sm shadow-2xl p-4">
                  <div className="flex items-center gap-1 relative z-10">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2 block">BeeZee is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="fixed bottom-[60px] left-4 right-4 animate-slide-up">
            <form onSubmit={handleSend} className="bg-white border-gray-300 rounded-3xl shadow-xl p-3 flex items-center gap-3">
              <button
                type="button"
                className="w-9 h-9 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center text-gray-600"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('coach.placeholder', 'Ask about your business...')}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-3 px-2 text-gray-900 placeholder-gray-500"
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowVoiceInput(true)}
                className="w-9 h-9 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center text-gray-600"
              >
                <Mic size={16} strokeWidth={2.5} />
              </button>

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-200 ${!input.trim() || loading ? 'bg-gray-300' : 'bg-blue-500'
                  }`}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} strokeWidth={2.5} />}
              </button>
            </form>
          </div>

          {showVoiceInput && (
            <VoiceToText onTranscript={handleVoiceInput} onCancel={() => setShowVoiceInput(false)} />
          )}
        </div>
      </div>
    </SwipeToRefresh>
  );
}
