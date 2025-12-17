import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Mic, MessageCircle, ChevronLeft } from 'lucide-react';
import { supabase, askFinancialCoach } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { useOfflineStore } from '../store/offlineStore';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import VoiceRecorder from '../components/VoiceRecorder';
import { getCoachingContext, saveConversation } from '../utils/coachingHelpers';
import FloatingNavBar from '../components/FloatingNavBar';
import { PageSkeleton } from '../components/LoadingSkeleton';
import SwipeToRefresh from '../components/SwipeToRefresh';
import OfflineBanner from '../components/OfflineBanner';
import { useTranslation } from 'react-i18next';

export default function Coach() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isOnline } = useOfflineStore();
  const { t } = useTranslation();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [userContext, setUserContext] = useState(null);
  const [questionsRemaining, setQuestionsRemaining] = useState(10);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadCoachingHistory();
    loadUserContext();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      if (formattedMessages.length === 0) {
        showWelcomeMessage();
      }
    } catch (error) {
      console.error('Error loading coaching history:', error);
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

      const used = todayQuestions?.length || 0;
      setQuestionsRemaining(Math.max(0, 10 - used));
    } catch (error) {
      console.error('Error loading user context:', error);
    }
  };

  const showWelcomeMessage = () => {
    const welcomeMessage = {
      role: 'assistant',
      content: t('coach.welcome', "Hello! I'm your BeeZee Financial Coach. How can I help you with your business finances today?"),
      timestamp: new Date().toISOString(),
      id: 'welcome',
    };
    setMessages([welcomeMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading || questionsRemaining <= 0) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await askFinancialCoach(input, userContext);
      
      if (result.error === 'subscription_required') {
        toast.error(t('common.subscriptionRequired', 'Coach requires an active subscription'), { duration: 4000 });
        setTimeout(() => {
          navigate('/dashboard/subscription');
        }, 1500);
        return;
      }

      if (result.error) throw new Error(result.error);

      const assistantMessage = {
        role: 'assistant',
        content: result.answer,
        timestamp: new Date().toISOString(),
        id: (Date.now() + 1).toString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setQuestionsRemaining((prev) => Math.max(0, prev - 1));
      
      // Save conversation in background
      saveConversation(user.id, input, result.answer).catch(console.error);
    } catch (error) {
      console.error('Error asking coach:', error);
      toast.error(t('coach.askError', 'Could not get a response. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = (text) => {
    setInput(text);
    setShowVoiceInput(false);
    // Auto-send if it's a clear question
    if (text.length > 5) {
      setTimeout(() => {
        handleSend();
      }, 500);
    }
  };

  const handleRefresh = async () => {
    await loadCoachingHistory();
    await loadUserContext();
  };

  if (loadingHistory) {
    return (
      <div className="coach-container">
        <OfflineBanner />
        <div className="coach-header">
          <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 text-gray-600">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.coach', 'Financial Coach')}</h1>
        </div>
        <PageSkeleton />
        <FloatingNavBar />
      </div>
    );
  }

  return (
    <SwipeToRefresh onRefresh={handleRefresh}>
      <div className="coach-container">
        <OfflineBanner />
        
        <div className="coach-header">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label={t('common.back', 'Go back')}
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{t('nav.coach', 'Financial Coach')}</h1>
          </div>
          <div className="questions-badge">
            {questionsRemaining} {t('coach.questionsRemaining', 'questions left today')}
          </div>
        </div>

        <div className="messages-list pb-32">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-bubble ${message.role === 'user' ? 'user' : 'assistant'}`}
            >
              <div className="message-content">{message.content}</div>
              <div className="message-time">
                {format(new Date(message.timestamp), 'p')}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message-bubble assistant">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area-container">
          <form onSubmit={handleSend} className="input-area">
            <button
              type="button"
              className="voice-input-button"
              onClick={() => setShowVoiceInput(true)}
              aria-label={t('coach.voiceInput', 'Speak your question')}
            >
              <Mic size={24} />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('coach.placeholder', 'Ask about your profits, expenses...')}
              disabled={loading || questionsRemaining <= 0}
            />
            <button
              type="submit"
              className="send-button"
              disabled={!input.trim() || loading || questionsRemaining <= 0}
              aria-label={t('common.send', 'Send message')}
            >
              <Send size={24} />
            </button>
          </form>
          {questionsRemaining <= 0 && (
            <p className="limit-warning text-center mt-2 text-xs text-red-500">
              {t('coach.limitReached', "You've reached your daily question limit.")}
            </p>
          )}
        </div>

        {showVoiceInput && (
          <VoiceRecorder
            onTranscript={handleVoiceInput}
            onCancel={() => setShowVoiceInput(false)}
          />
        )}
        
        <FloatingNavBar />
      </div>
    </SwipeToRefresh>
  );
}
