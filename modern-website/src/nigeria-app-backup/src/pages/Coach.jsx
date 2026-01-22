import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Mic, X, Archive, Plus, Loader2, Sparkles, MessageCircle, MoreVertical } from 'lucide-react';
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
import FloatingNavBar from '../components/FloatingNavBar';
import CoachMessage from '../components/CoachMessage';

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
  const [questionsRemaining, setQuestionsRemaining] = useState(60);
  const [isTyping, setIsTyping] = useState(false);
  
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
          citations: session.context?.citations || [], // Extract citations from context
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

    const userMessage = { 
      role: 'user', 
      content: input, 
      timestamp: new Date().toISOString(), 
      id: Date.now().toString() 
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await askFinancialCoach(input, userContext);
      console.log('API response from coach:', result);
      
      if (result.error === 'subscription_required') {
        toast.error(t('common.subscriptionRequired', 'Active subscription required'));
        navigate('/dashboard/subscription');
        return;
      }
      if (result.error) throw new Error(result.error);

      const assistantMessage = { 
        role: 'assistant', 
        content: result.answer, 
        timestamp: new Date().toISOString(), 
        id: (Date.now() + 1).toString(),
        citations: result.citations || [], // Capture citations from API response
      };
      console.log('Assistant message with citations:', assistantMessage);
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Light Gray Background with Moving Shapes */}
      <div className="absolute inset-0 bg-gray-200">
        {/* Glass Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/5 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/25 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-white/20 to-transparent pointer-events-none"></div>
        
        {/* 3 Moving Bees - Left to Right - Spaced Out */}
        <div className="absolute top-20 left-10 w-32 h-32 animate-slide-left-right" style={{ animationDelay: '0s', animationDuration: '8s' }}>
          <div className="relative w-full h-full">
            {/* Bee Body */}
            <div className="absolute inset-x-4 top-8 bottom-8 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-full"></div>
            {/* Bee Stripes */}
            <div className="absolute inset-x-4 top-10 h-3 bg-black/20 rounded-full"></div>
            <div className="absolute inset-x-4 top-16 h-3 bg-black/20 rounded-full"></div>
            <div className="absolute inset-x-4 bottom-10 h-3 bg-black/20 rounded-full"></div>
            {/* Bee Wings */}
            <div className="absolute left-0 top-12 w-8 h-8 bg-white/40 rounded-full animate-pulse"></div>
            <div className="absolute right-0 top-12 w-8 h-8 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
        <div className="absolute top-1/3 right-10 w-40 h-40 animate-slide-left-right" style={{ animationDelay: '2s', animationDuration: '10s' }}>
          <div className="relative w-full h-full">
            {/* Bee Body */}
            <div className="absolute inset-x-5 top-10 bottom-10 bg-gradient-to-br from-yellow-400/25 to-yellow-500/25 rounded-full"></div>
            {/* Bee Stripes */}
            <div className="absolute inset-x-5 top-12 h-4 bg-black/20 rounded-full"></div>
            <div className="absolute inset-x-5 top-20 h-4 bg-black/20 rounded-full"></div>
            <div className="absolute inset-x-5 bottom-12 h-4 bg-black/20 rounded-full"></div>
            {/* Bee Wings */}
            <div className="absolute left-0 top-14 w-10 h-10 bg-white/35 rounded-full animate-pulse"></div>
            <div className="absolute right-0 top-14 w-10 h-10 bg-white/35 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></div>
          </div>
        </div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 animate-slide-left-right" style={{ animationDelay: '4s', animationDuration: '9s' }}>
          <div className="relative w-full h-full">
            {/* Bee Body */}
            <div className="absolute inset-x-4 top-9 bottom-9 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-full"></div>
            {/* Bee Stripes */}
            <div className="absolute inset-x-4 top-11 h-3 bg-black/20 rounded-full"></div>
            <div className="absolute inset-x-4 top-17 h-3 bg-black/20 rounded-full"></div>
            <div className="absolute inset-x-4 bottom-11 h-3 bg-black/20 rounded-full"></div>
            {/* Bee Wings */}
            <div className="absolute left-0 top-13 w-9 h-9 bg-white/40 rounded-full animate-pulse"></div>
            <div className="absolute right-0 top-13 w-9 h-9 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          </div>
        </div>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col">
          {/* Professional Header - Dark Gray with Gloss */}
          <div className="p-4">
            <div className="bg-white border-gray-300 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BeeZeeLogo />
                  <h1 className="text-gray-800 font-semibold text-xl">{t('nav.coach', 'Coach')}</h1>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2">
                  <Sparkles size={14} className="text-gray-700" />
                  <span className="text-gray-700 text-xs font-bold uppercase tracking-wider">{questionsRemaining} Left</span>
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
    <SwipeToRefresh onRefresh={async () => { await loadCoachingHistory(); await loadUserContext(); }}>
      <div className="min-h-screen relative overflow-hidden">
        {/* Light Gray Background with Moving Shapes */}
        <div className="absolute inset-0 bg-gray-200">
          {/* Glass Background Layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/5 pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/25 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-white/20 to-transparent pointer-events-none"></div>
          
          {/* 3 Moving Bees - Left to Right - Spaced Out */}
          <div className="absolute top-20 left-10 w-32 h-32 animate-slide-left-right" style={{ animationDelay: '0s', animationDuration: '8s' }}>
            <div className="relative w-full h-full">
              {/* Bee Body */}
              <div className="absolute inset-x-4 top-8 bottom-8 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-full"></div>
              {/* Bee Stripes */}
              <div className="absolute inset-x-4 top-10 h-3 bg-black/20 rounded-full"></div>
              <div className="absolute inset-x-4 top-16 h-3 bg-black/20 rounded-full"></div>
              <div className="absolute inset-x-4 bottom-10 h-3 bg-black/20 rounded-full"></div>
              {/* Bee Wings */}
              <div className="absolute left-0 top-12 w-8 h-8 bg-white/40 rounded-full animate-pulse"></div>
              <div className="absolute right-0 top-12 w-8 h-8 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
          <div className="absolute top-1/3 right-10 w-40 h-40 animate-slide-left-right" style={{ animationDelay: '2s', animationDuration: '10s' }}>
            <div className="relative w-full h-full">
              {/* Bee Body */}
              <div className="absolute inset-x-5 top-10 bottom-10 bg-gradient-to-br from-yellow-400/25 to-yellow-500/25 rounded-full"></div>
              {/* Bee Stripes */}
              <div className="absolute inset-x-5 top-12 h-4 bg-black/20 rounded-full"></div>
              <div className="absolute inset-x-5 top-20 h-4 bg-black/20 rounded-full"></div>
              <div className="absolute inset-x-5 bottom-12 h-4 bg-black/20 rounded-full"></div>
              {/* Bee Wings */}
              <div className="absolute left-0 top-14 w-10 h-10 bg-white/35 rounded-full animate-pulse"></div>
              <div className="absolute right-0 top-14 w-10 h-10 bg-white/35 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></div>
            </div>
          </div>
          <div className="absolute bottom-20 left-1/4 w-36 h-36 animate-slide-left-right" style={{ animationDelay: '4s', animationDuration: '9s' }}>
            <div className="relative w-full h-full">
              {/* Bee Body */}
              <div className="absolute inset-x-4 top-9 bottom-9 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-full"></div>
              {/* Bee Stripes */}
              <div className="absolute inset-x-4 top-11 h-3 bg-black/20 rounded-full"></div>
              <div className="absolute inset-x-4 top-17 h-3 bg-black/20 rounded-full"></div>
              <div className="absolute inset-x-4 bottom-11 h-3 bg-black/20 rounded-full"></div>
              {/* Bee Wings */}
              <div className="absolute left-0 top-13 w-9 h-9 bg-white/40 rounded-full animate-pulse"></div>
              <div className="absolute right-0 top-13 w-9 h-9 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          <OfflineBanner />
          
          {/* Professional Header - Dark Gray with Gloss */}
          <div className="p-4 pt-12">
            <div className="bg-white border-gray-300 rounded-3xl p-4 shadow-2xl">
              <div className="flex items-center justify-between">
                {/* Left Controls */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-10 h-10 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-200 transition-all duration-200"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                  <BeeZeeLogo />
                  <h1 className="text-gray-800 font-semibold text-xl">{t('nav.coach', 'Coach')}</h1>
                </div>
                
                {/* Questions Counter */}
                <div className="bg-gray-100 border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2">
                  <Sparkles size={14} className="text-gray-700" />
                  <span className="text-gray-700 text-xs font-bold uppercase tracking-wider">{questionsRemaining} Left</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages Area - Dark Gray with Gloss */}
          <div className="flex-1 px-4 pb-40 space-y-3 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                <div className={`max-w-[85%] rounded-2xl shadow-2xl border p-4 transition-all duration-300 hover:shadow-3xl transform hover:scale-[1.03] hover:-translate-y-1 bg-white border-gray-300 text-gray-900 ${
                  msg.role === 'user' 
                    ? 'rounded-tr-sm shadow-blue-500/20' 
                    : 'rounded-tl-sm shadow-gray-500/20'
                }`}>
                  {/* Glass Gloss Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-2xl pointer-events-none"></div>
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/60 to-transparent rounded-t-2xl pointer-events-none"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-2xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Use CoachMessage component for assistant messages, plain text for user messages */}
                  <div className="relative z-10">
                    {msg.role === 'assistant' ? (
                      <CoachMessage content={msg.content} citations={msg.citations || []} />
                    ) : (
                      <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                  
                  <span className={`text-[10px] font-semibold uppercase tracking-wide mt-2 block opacity-60 relative z-10 ${
                    msg.role === 'user' ? 'text-right text-gray-500' : 'text-left text-gray-500'
                  }`}>
                    {format(new Date(msg.timestamp), 'p')}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator - Dark Gray with Gloss */}
            {loading && (
              <div className="flex justify-start animate-slide-up">
                <div className="bg-white border-gray-300 rounded-2xl rounded-tl-sm shadow-2xl p-4 shadow-gray-500/20">
                  {/* Glass Gloss Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-2xl pointer-events-none"></div>
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/60 to-transparent rounded-t-2xl pointer-events-none"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-2xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="flex items-center gap-1 relative z-10">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  {isTyping && (
                    <span className="text-xs text-gray-500 mt-2 block relative z-10">Thinking...</span>
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Dark Gray Input Area with Gloss */}
          <div className="fixed bottom-[60px] left-4 right-4 animate-slide-up">
            <form onSubmit={handleSend} className="bg-white border-gray-300 rounded-3xl shadow-xl p-3 flex items-center gap-3">
              {/* Plus Button */}
              <button
                type="button"
                className="w-9 h-9 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all duration-200 active:scale-90"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
              
              {/* Input Field */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('coach.placeholder', 'Ask about your business...')}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-3 px-2 text-gray-900 placeholder-gray-500"
                disabled={loading || questionsRemaining <= 0}
              />
              
              {/* Voice Button */}
              <button
                type="button"
                onClick={() => setShowVoiceInput(true)}
                className="w-9 h-9 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all duration-200 active:scale-90"
              >
                <Mic size={16} strokeWidth={2.5} />
              </button>
              
              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim() || loading || questionsRemaining <= 0}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-200 active:scale-90 ${
                  !input.trim() || loading || questionsRemaining <= 0
                    ? 'bg-gray-300 cursor-not-allowed border border-gray-400' 
                    : 'bg-blue-500 hover:bg-blue-600 border border-blue-600'
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
