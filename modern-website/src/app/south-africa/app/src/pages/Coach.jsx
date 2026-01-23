import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Radio, Paperclip, Loader2, Sparkles, MessageCircle, MoreVertical, ArrowUp } from 'lucide-react';
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
import PageHeader from '../components/PageHeader';
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
      return {
        key: 'coach.responses.profit',
        params: { amount: 'R22,400', trend: '15' }
      };
    }
    if (text.includes('bread') || text.includes('stock')) {
      return {
        key: 'coach.responses.stock',
        params: { count: '24', unit: 'loaves', name: 'Blue Ribbon Bread', sold: '3', days: '4' }
      };
    }
    if (text.includes('who') || text.includes('beezee')) {
      return { key: 'coach.responses.identity' };
    }
    return { key: 'coach.responses.fallback' };
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
      const response = getMockResponse(userInput);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      await addCoachSession(userInput, response.key, response.params);
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
        <div className="relative z-10 min-h-screen flex flex-col coach-glass-overlay">
          <PageHeader
            title={t('nav.coach', 'Coach')}
            showBack={true}
            backIcon="x"
            actionButtons={[
              {
                icon: <Sparkles size={18} strokeWidth={2.5} />,
                onClick: () => { },
                className: "coach-sparkles-button",
                title: t('coach.questionsLeft', { count: questionsRemaining })
              }
            ]}
          />

          {/* Chat Messages Area */}
          <div className="flex-1 px-4 pb-32 space-y-4 overflow-y-auto pt-2 hide-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                <div className={`coach-message-bubble ${msg.role === 'user' ? 'user' : 'assistant'}`}>
                  <div className="relative z-10">
                    {msg.role === 'assistant' ? (
                      <CoachMessage
                        content={msg.content?.startsWith('coach.') ? t(msg.content, msg.params) : msg.content}
                        citations={msg.citations || []}
                      />
                    ) : (
                      <p className="text-sm font-semibold leading-relaxed">{msg.content}</p>
                    )}
                  </div>

                  <span className="message-timestamp-label">
                    {format(new Date(msg.timestamp), 'p')}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-slide-up">
                <div className="coach-message-bubble assistant min-w-[80px]">
                  <div className="flex items-center gap-1.5 py-1 relative z-10">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="fixed bottom-[74px] left-4 right-4 animate-slide-up z-50">
            <div className="coach-input-wrapper">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('coach.placeholder', 'Ask about your business...')}
                  className="coach-main-input px-4"
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className={`coach-send-btn ${!input.trim() || loading ? 'disabled' : 'active'}`}
                >
                  {loading ? <Loader2 size={18} className="animate-spin text-white" /> : <ArrowUp size={24} strokeWidth={3} />}
                </button>
              </form>
            </div>
          </div>

          {showVoiceInput && (
            <VoiceToText onTranscript={handleVoiceInput} onCancel={() => setShowVoiceInput(false)} />
          )}
        </div>
      </div>
    </SwipeToRefresh>
  );
}
