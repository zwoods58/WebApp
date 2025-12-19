import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bell, MessageCircle, LogOut, User, Shield, Globe, Moon, CreditCard } from 'lucide-react';
import { signOut } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';
import FloatingNavBar from '../components/FloatingNavBar';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm(t('settings.confirmLogout', 'Log out?'))) return;
    try {
      await signOut();
      clearAuth();
      toast.success(t('settings.logoutSuccess', 'Logged out'));
      navigate('/login', { replace: true });
    } catch (error) {
      clearAuth();
      navigate('/login', { replace: true });
    }
  };

  const userName = userData?.business_name || userData?.full_name || t('settings.businessOwner', 'Business Owner');
  const phoneNumber = userData?.whatsapp_number || user?.phone || 'No phone';

  return (
    <SwipeToRefresh onRefresh={loadUserData}>
      <div className="settings-container pb-24">
        <OfflineBanner />
        
        {/* Modern Header */}
        <div className="reports-header-section">
          <div className="reports-title-row">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400">
                <ChevronLeft size={24} strokeWidth={3} />
              </button>
              <h1 className="reports-title">{t('settings.title', 'Settings')}</h1>
            </div>
          </div>
        </div>

        <div className="px-4 mt-8 space-y-8">
          {/* Profile Quick Access */}
          <div 
            onClick={() => navigate('/dashboard/profile')}
            className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <h2 className="text-sm font-black text-gray-900 mb-0.5">{userName}</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{phoneNumber}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </div>

          {/* Preferences Section */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">{t('settings.preferences', 'Preferences')}</h3>
            <div className="bg-white rounded-[32px] border border-gray-50 shadow-sm overflow-hidden">
              <div className="settings-row-premium">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Moon size={18} />
                  </div>
                  <span className="text-sm font-black text-gray-900">{t('settings.darkMode', 'Appearance')}</span>
                </div>
                <DarkModeToggle />
              </div>
              
              <div className="h-[1px] bg-gray-50 mx-6" />
              
              <div className="settings-row-premium" onClick={() => navigate('/dashboard/settings/notifications')}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                    <Bell size={18} />
                  </div>
                  <span className="text-sm font-black text-gray-900">{t('settings.notifications', 'Notifications')}</span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </div>

              <div className="h-[1px] bg-gray-50 mx-6" />

              <div className="settings-row-premium">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center">
                    <Globe size={18} />
                  </div>
                  <span className="text-sm font-black text-gray-900">{t('settings.language', 'Language')}</span>
                </div>
                <LanguageSelector />
              </div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">{t('subscription.title', 'Account')}</h3>
            <div className="bg-white rounded-[32px] border border-gray-50 shadow-sm overflow-hidden">
              <div className="settings-row-premium" onClick={() => navigate('/dashboard/subscription')}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                    <CreditCard size={18} />
                  </div>
                  <span className="text-sm font-black text-gray-900">{t('subscription.myPlan', 'Membership Plan')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-full">
                    {userData?.subscription_tier || 'AI'}
                  </span>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              </div>

              <div className="h-[1px] bg-gray-50 mx-6" />

              <div className="settings-row-premium" onClick={() => navigate('/dashboard/settings/voice-logs')}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center">
                    <Shield size={18} />
                  </div>
                  <span className="text-sm font-black text-gray-900">{t('settings.voiceLogs', 'Activity Logs')}</span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </div>
            </div>
          </div>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="w-full py-5 bg-red-50 text-red-500 font-black rounded-[32px] flex items-center justify-center gap-2 active:scale-95 transition-transform animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            <LogOut size={20} />
            {t('settings.logout', 'Logout')}
          </button>

          <div className="text-center pb-10 opacity-20">
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">BeeZee Finance v1.0.0</p>
          </div>
        </div>

        <FloatingNavBar />
      </div>
    </SwipeToRefresh>
  );
}
