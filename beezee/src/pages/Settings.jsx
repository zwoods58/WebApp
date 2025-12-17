import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bell, MessageCircle, Trash2, User } from 'lucide-react';
import { signOut } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';
import FloatingNavBar from '../components/FloatingNavBar';
import { formatCurrency } from '../utils/i18n';
import DarkModeToggle from '../components/DarkModeToggle';
import SwipeToRefresh from '../components/SwipeToRefresh';
import LanguageSelector from '../components/LanguageSelector';
import OfflineBanner from '../components/OfflineBanner';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, clearAuth } = useAuthStore();
  const [userData, setUserData] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm(t('settings.confirmLogout', 'Are you sure you want to log out?'))) {
      return;
    }

    try {
      await signOut();
      clearAuth();
      toast.success(t('settings.logoutSuccess', 'Logged out successfully'));
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(t('settings.logoutFailed', 'Failed to log out'));
      clearAuth();
      navigate('/login', { replace: true });
    }
  };

  const getSubscriptionStatus = () => {
    if (!userData) return null;
    
    const status = userData.subscription_status;
    const trialEndDate = userData.trial_end_date;
    const gracePeriodEndDate = userData.grace_period_end_date;

    if (status === 'trial' && trialEndDate) {
      const daysLeft = Math.ceil((new Date(trialEndDate) - new Date()) / (1000 * 60 * 60 * 24));
      return {
        badge: `Trial • ${daysLeft} days left`,
        daysRemaining: daysLeft,
        showSubscribe: false,
      };
    }

    if (status === 'active') {
      return {
        badge: 'Active Subscription',
        daysRemaining: null,
        showSubscribe: false,
      };
    }

    if (status === 'grace_period' && gracePeriodEndDate) {
      const daysLeft = Math.ceil((new Date(gracePeriodEndDate) - new Date()) / (1000 * 60 * 60 * 24));
      return {
        badge: `Grace Period • ${daysLeft} days left`,
        daysRemaining: daysLeft,
        showSubscribe: true,
      };
    }

    return {
      badge: 'No Subscription',
      daysRemaining: null,
      showSubscribe: true,
    };
  };

  const handleRefresh = async () => {
    await loadUserData();
  };

  const userName = userData?.business_name || userData?.full_name || 'Business Owner';
  const phoneNumber = userData?.whatsapp_number || user?.phone || 'No phone';
  const subscriptionStatus = getSubscriptionStatus();

  return (
    <SwipeToRefresh onRefresh={handleRefresh}>
      <div className="settings-container">
        <OfflineBanner />
        {/* Header */}
        <div className="settings-header">
          <button
            className="page-back-button"
            onClick={() => navigate(-1)}
            aria-label={t('common.back', 'Go back')}
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="settings-title">{t('settings.title', 'Settings')}</h1>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar">
            <User size={40} color="#A8D5E2" />
          </div>
          <div className="profile-name">{userName}</div>
          <div className="profile-phone">{phoneNumber}</div>
          <button className="profile-edit-button" onClick={() => navigate('/dashboard/profile')}>
            {t('common.edit', 'Edit Profile')}
          </button>
        </div>

        {/* Subscription Card */}
        {subscriptionStatus && (
          <div className="subscription-card">
            <div className="subscription-status-badge">{subscriptionStatus.badge}</div>
            {subscriptionStatus.daysRemaining !== null && (
              <div className="subscription-days-remaining">
                {subscriptionStatus.daysRemaining}
              </div>
            )}
            {subscriptionStatus.showSubscribe && (
              <button
                className="subscription-subscribe-button"
                onClick={() => navigate('/dashboard/subscription')}
              >
                {t('settings.subscribeNow', 'Subscribe Now')}
              </button>
            )}
          </div>
        )}

        {/* Preferences Section */}
        <div className="settings-section-header">{t('settings.preferences', 'PREFERENCES')}</div>
        
        <div className="settings-row" onClick={() => navigate('/dashboard/settings/notifications')}>
          <Bell className="settings-row-icon" />
          <span className="settings-row-label">{t('settings.notifications', 'Notifications')}</span>
          <ChevronRight className="settings-row-chevron" />
        </div>

        <div className="settings-row">
          <DarkModeToggle />
        </div>

        <div className="settings-row">
          <LanguageSelector />
        </div>

        <div className="settings-row" onClick={() => navigate('/dashboard/settings/voice-logs')}>
          <MessageCircle className="settings-row-icon" />
          <span className="settings-row-label">{t('settings.voiceLogs', 'Voice Logs')}</span>
          <ChevronRight className="settings-row-chevron" />
        </div>

        {/* Support Section */}
        <div className="settings-section-header">{t('settings.support', 'SUPPORT')}</div>
        
        <div className="settings-row" onClick={() => navigate('/dashboard/coach')}>
          <MessageCircle className="settings-row-icon" />
          <span className="settings-row-label">{t('nav.coach', 'Financial Coach')}</span>
          <ChevronRight className="settings-row-chevron" />
        </div>

        <div className="settings-row text-red-600" onClick={handleLogout}>
          <Trash2 className="settings-row-icon text-red-600" />
          <span className="settings-row-label">{t('settings.logout', 'Logout')}</span>
          <ChevronRight className="settings-row-chevron" />
        </div>

        <div className="settings-footer">
          <p>BeeZee Finance v1.0.0</p>
          <p>© 2024 BeeZee Inc.</p>
        </div>
        
        <FloatingNavBar />
      </div>
    </SwipeToRefresh>
  );
}
