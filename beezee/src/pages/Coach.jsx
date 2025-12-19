import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Mic, ChevronLeft, Loader2, Sparkles, MessageCircle, MoreVertical } from 'lucide-react';
import { supabase, askFinancialCoach } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { useOfflineStore } from '../store/offlineStore';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import VoiceToText from '../components/VoiceToText';
import { getCoachingContext, saveConversation } from '../utils/coachingHelpers';
import { PageSkeleton } from '../components/LoadingSkeleton';
import SwipeToRefresh from '../components/SwipeToRefresh';
import OfflineBanner from '../components/OfflineBanner';
import { useTranslation } from 'react-i18next';
import BeeZeeLogo from '../components/BeeZeeLogo';

export default function Coach() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { syncCompleted } = useOfflineStore();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [userContext, setUserContext] = useState(null);
  const [questionsRemaining, setQuestionsRemaining] = useState(10);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadCoachingHistory();
      loadUserContext();
    }
  }, [user]);

  // Refresh when sync completes (syncCompleted is a counter that increments)
  useEffect(() => {
    if (syncCompleted > 0 && user) {
      console.log('Sync completed - refreshing Coach...');
      loadCoachingHistory();
      loadUserContext();
    }
  }, [syncCompleted, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadCoachingHistory = async () => {
    try {
      setLoadingHistory(true);
      const { data, error } = await supabase
        .from('coaching_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true })
        .limit(20);

      if (error) throw error;

      const formattedMessages = data.flatMap((session) => [
        { 
          role: 'user', 
          content: session.question, 
          timestamp: session.created_at,
          id: `user-${session.id}`,
        },
        { 
          role: 'assistant', 
          content: session.answer, 
          timestamp: session.created_at,
          id: `assistant-${session.id}`,
        },
      ]);

      setMessages(formattedMessages);
      if (formattedMessages.length === 0) showWelcomeMessage();
    } catch (error) {
      showWelcomeMessage();
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadUserContext = async () => {
    try {
      const context = await getCoachingContext(user.id);
      setUserContext(context);
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: todayQuestions } = await supabase
        .from('coaching_sessions')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);
      setQuestionsRemaining(Math.max(0, 10 - (todayQuestions?.length || 0)));
    } catch (error) {}
  };

  const showWelcomeMessage = () => {
    setMessages([{
      role: 'assistant',
      content: t('coach.welcome', "Hello! I'm your BeeZee AI assistant. Ask me anything about your finances or inventory."),
      timestamp: new Date().toISOString(),
      id: 'welcome',
    }]);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading || questionsRemaining <= 0) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date().toISOString(), id: Date.now().toString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await askFinancialCoach(input, userContext);
      if (result.error === 'subscription_required') {
        toast.error(t('common.subscriptionRequired', 'Active subscription required'));
        navigate('/dashboard/subscription');
        return;
      }
      if (result.error) throw new Error(result.error);

      const assistantMessage = { role: 'assistant', content: result.answer, timestamp: new Date().toISOString(), id: (Date.now() + 1).toString() };
      setMessages((prev) => [...prev, assistantMessage]);
      setQuestionsRemaining((prev) => Math.max(0, prev - 1));
      saveConversation(user.id, input, result.answer).catch(console.error);
    } catch (error) {
      toast.error(t('coach.askError', 'Failed to get response.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = (text) => {
    setInput(text);
    setShowVoiceInput(false);
    if (text.length > 5) setTimeout(() => handleSend(), 500);
  };

  if (loadingHistory) return (
    <div className="coach-container pb-24">
      <div className="reports-header-section pt-4">
        <div className="reports-title-row">
          <div className="flex items-center gap-3 px-4">
            <BeeZeeLogo />
          </div>
          <div className="flex items-center gap-2 px-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 text-gray-400">
              <ChevronLeft size={24} strokeWidth={3} />
            </button>
            <h1 className="reports-title">{t('nav.coach', 'Coach')}</h1>
          </div>
        </div>
      </div>
      <PageSkeleton />
      {/* Navigation bar hidden on Coach page */}
    </div>
  );

  return (
    <SwipeToRefresh onRefresh={async () => { await loadCoachingHistory(); await loadUserContext(); }}>
      <div className="coach-container pb-24">
        <OfflineBanner />
        
        {/* Modern Header */}
        <div className="reports-header-section pt-4">
          <div className="reports-title-row">
            <div className="px-4">
              <BeeZeeLogo />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/dashboard')} className="p-2 text-gray-400 -ml-2">
                <ChevronLeft size={24} strokeWidth={3} />
              </button>
              <h1 className="reports-title">{t('nav.coach', 'Coach')}</h1>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
              <Sparkles size={12} className="text-blue-500" />
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{questionsRemaining} Left</span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="coach-messages-container px-4 pt-4 pb-32 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              <div className={`max-w-[85%] p-5 rounded-[28px] shadow-sm ${msg.role === 'user' ? 'bg-[#2C2C2E] text-white rounded-tr-none' : 'bg-white text-gray-900 border border-gray-50 rounded-tl-none'}`}>
                <p className="text-sm font-bold leading-relaxed">{msg.content}</p>
                <span className={`text-[8px] font-black uppercase tracking-widest mt-2 block opacity-30 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {format(new Date(msg.timestamp), 'p')}
                </span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-white p-5 rounded-[28px] rounded-tl-none border border-gray-50">
                <Loader2 size={16} className="animate-spin text-gray-300" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Floating Input Area */}
        <div className="fixed bottom-[120px] left-0 right-0 px-4 animate-slide-up">
          <form onSubmit={handleSend} className="bg-white p-3 rounded-[32px] shadow-xl border border-gray-100 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowVoiceInput(true)}
              className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 active:scale-90 transition-transform"
            >
              <Mic size={20} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('coach.placeholder', 'Ask about your business...')}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold py-3 px-2"
              disabled={loading || questionsRemaining <= 0}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading || questionsRemaining <= 0}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all ${!input.trim() ? 'bg-gray-100' : 'bg-[#2C2C2E] active:scale-90'}`}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </form>
        </div>

        {showVoiceInput && (
          <VoiceToText onTranscript={handleVoiceInput} onCancel={() => setShowVoiceInput(false)} />
        )}
        
        {/* Navigation bar hidden on Coach page */}
      </div>
    </SwipeToRefresh>
  );
}
