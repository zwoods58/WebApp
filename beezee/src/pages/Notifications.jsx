import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, X, Check, Loader2, Sparkles, ChevronLeft } from 'lucide-react';
import { supabase, sendNotification } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { createWaMeLink } from '../utils/waMeLinks';
import toast from 'react-hot-toast';
import OfflineBanner from '../components/OfflineBanner';
import { useTranslation } from 'react-i18next';
import FloatingNavBar from '../components/FloatingNavBar';

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications-list')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => channel.unsubscribe();
  }, [user]);

  async function loadNotifications() {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('dismissed', false)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }

  async function dismiss(id) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ dismissed: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  }

  async function testNotification() {
    setTesting(true);
    try {
      const { error } = await sendNotification(user.id, {
        title: 'Test Notification',
        message: 'This is a test notification to verify the system is working.',
        type: 'info',
      });

      if (error) throw error;
      toast.success(t('notifications.testSent', 'Test notification sent!'));
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error(t('notifications.testFailed', 'Failed to send test notification'));
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="notifications-container min-h-screen bg-gray-50 pb-20">
      <OfflineBanner />
      
      {/* Header */}
      <div className="notifications-header-section sticky top-0 z-10 bg-white shadow-sm px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label={t('common.back', 'Go back')}
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{t('settings.notifications', 'Notifications')}</h1>
          </div>
          {/* <button
            onClick={testNotification}
            disabled={testing}
            className="text-xs font-semibold px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 transition-colors flex items-center gap-1.5"
          >
            {testing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Test
          </button> */}
        </div>
      </div>

      <div className="notifications-list-container p-4">
        {loading && notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Loader2 className="animate-spin text-primary-600 mb-4" size={32} />
            <p className="text-gray-500 font-medium">{t('common.loading', 'Loading your updates...')}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
              <Sparkles className="text-primary-400" size={36} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('notifications.emptyTitle', "You're all caught up!")}</h2>
            <p className="text-gray-500 max-w-xs mx-auto">
              {t('notifications.emptyDesc', "Check back later for updates about your business, tips, and reminders.")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`notification-card relative bg-white p-4 rounded-2xl shadow-sm border-l-4 transition-all hover:shadow-md ${
                  n.read ? 'border-gray-200 opacity-80' : 'border-primary-500 ring-1 ring-primary-50'
                }`}
                onClick={() => !n.read && markAsRead(n.id)}
              >
                {!n.read && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
                )}
                
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-bold pr-8 ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismiss(n.id);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label={t('common.delete', 'Dismiss')}
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <p className={`text-sm mb-4 leading-relaxed ${n.read ? 'text-gray-500' : 'text-gray-700'}`}>
                  {n.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">
                    {new Date(n.created_at).toLocaleDateString()} at {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  
                  {n.action_url && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (n.action_url.startsWith('https://wa.me')) {
                          window.open(n.action_url, '_blank');
                        } else {
                          navigate(n.action_url);
                        }
                      }}
                      className="text-xs font-bold py-1.5 px-4 bg-primary-600 text-white rounded-full shadow-sm hover:bg-primary-700 transition-colors flex items-center gap-1.5"
                    >
                      {n.action_url.includes('wa.me') ? <MessageCircle size={14} /> : null}
                      {t('common.action', 'View Details')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <FloatingNavBar />
    </div>
  );
}
