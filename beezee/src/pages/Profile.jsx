import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { Phone, MessageSquare, Calendar, Crown, ChevronLeft, User, ShieldCheck, Mail, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import OfflineBanner from '../components/OfflineBanner';
import { useTranslation } from 'react-i18next';
import FloatingNavBar from '../components/FloatingNavBar';
import BeeZeeLogo from '../components/BeeZeeLogo';

export default function Profile() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (error) throw error;
      setProfile(data);
      setWhatsappNumber(data.whatsapp_number || data.phone_number);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('users').update({ whatsapp_number: whatsappNumber }).eq('id', user.id);
      if (error) throw error;
      toast.success(t('profile.saveSuccess', 'Profile updated'));
      loadProfile();
    } catch (error) {
      toast.error(t('profile.saveFailed', 'Failed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="profile-container pb-24">
      <div className="flex flex-col items-center justify-center py-20 opacity-20">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
      <FloatingNavBar />
    </div>
  );

  const daysRemaining = profile?.trial_end_date ? Math.ceil((new Date(profile.trial_end_date) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="profile-container pb-24">
      <OfflineBanner />
      
      {/* Modern Header */}
      <div className="reports-header-section pt-4">
        <div className="reports-title-row">
          <div className="px-4">
            <BeeZeeLogo />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="p-2 text-gray-400 -ml-2">
              <ChevronLeft size={24} strokeWidth={3} />
            </button>
            <h1 className="reports-title">{t('profile.title', 'Account')}</h1>
          </div>
          <button onClick={() => { clearAuth(); navigate('/login'); }} className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="px-4 mt-8 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 flex flex-col items-center animate-slide-up">
          <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mb-4 text-4xl">
            👤
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">{profile.phone_number}</h2>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-50 rounded-full">
            <Crown size={14} className="text-blue-500" />
            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">
              {profile.subscription_status === 'trial' ? `${daysRemaining} Days Left` : 'Active Member'}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white p-5 rounded-[28px] border border-gray-50 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{t('profile.memberSince', 'Joined')}</p>
              <p className="text-sm font-black text-gray-900">{format(new Date(profile.created_at), 'MMMM dd, yyyy')}</p>
            </div>
          </div>
        </div>

        {/* WhatsApp Form */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <MessageSquare size={16} />
            WhatsApp Notification
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="relative">
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+1234567890"
                className="w-full pl-6 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <p className="text-[10px] font-bold text-gray-400 leading-relaxed italic">
              {t('profile.whatsappHelp', "We'll send you transaction reminders and insights via WhatsApp")}
            </p>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-[#2C2C2E] text-white font-black rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              {saving ? <Loader2 size={20} className="animate-spin" /> : t('common.save', 'Update Settings')}
            </button>
          </form>
        </div>
      </div>

      <FloatingNavBar />
    </div>
  );
}
