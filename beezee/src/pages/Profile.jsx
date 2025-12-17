import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, Phone, MessageSquare, Calendar, Crown, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import OfflineBanner from '../components/OfflineBanner';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setWhatsappNumber(data.whatsapp_number || data.phone_number);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error(t('common.noData', 'Failed to load profile'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({ whatsapp_number: whatsappNumber })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(t('profile.saveSuccess', 'Profile updated successfully'));
      loadProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(t('profile.saveFailed', 'Failed to save profile'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <OfflineBanner />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">{t('common.noData', 'Failed to load profile')}</p>
      </div>
    );
  }

  const daysRemaining = profile.trial_end_date
    ? Math.ceil((new Date(profile.trial_end_date) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="profile-container">
      <OfflineBanner />
      <div className="space-y-6">
        {/* Header */}
        <div className="profile-header flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 p-2 -ml-2"
            aria-label={t('common.back', 'Go back')}
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('profile.title', 'Profile')}</h1>
            <p className="text-gray-600">{t('profile.subtitle', 'Manage your account information')}</p>
          </div>
        </div>

      {/* Profile Avatar */}
      <div className="card text-center">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-5xl">👤</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">{profile.phone_number}</h2>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
          <Crown size={16} />
          {profile.subscription_status === 'trial'
            ? `${t('subscription.trial', 'Trial')} • ${daysRemaining} ${t('common.daysLeft', 'days left')}`
            : profile.subscription_status === 'active'
            ? t('subscription.active', 'Active Subscriber')
            : profile.subscription_status}
        </div>
      </div>

      {/* Account Info */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.accountInfo', 'Account Information')}</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600">{t('common.phone', 'Phone Number')}</p>
              <p className="font-medium text-gray-900">{profile.phone_number}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600">{t('profile.memberSince', 'Member Since')}</p>
              <p className="font-medium text-gray-900">
                {format(new Date(profile.created_at), 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Number */}
      <form onSubmit={handleSave} className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.whatsappSettings', 'WhatsApp Settings')}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
              {t('profile.whatsappNumber', 'WhatsApp Number')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MessageSquare size={20} className="text-gray-400" />
              </div>
              <input
                id="whatsapp"
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+27812345678"
                className="input pl-10"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {t('profile.whatsappHelp', "We'll send you transaction reminders and insights via WhatsApp")}
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary w-full"
          >
            {saving ? t('common.loading', 'Saving...') : t('common.save', 'Save Changes')}
          </button>
        </div>
      </form>

      {/* Subscription Info */}
      {profile.subscription_status === 'trial' && (
        <div className="card bg-primary-50 border-primary-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('profile.upgradeTitle', 'Upgrade to Premium')}</h2>
          <p className="text-gray-700 mb-4">
            {t('profile.upgradeDesc', 'Get unlimited access to all features for only R55.50/month')}
          </p>
          <button
            onClick={() => navigate('/dashboard/subscription')}
            className="btn btn-primary w-full"
          >
            {t('settings.subscribeNow', 'Subscribe Now')}
          </button>
        </div>
      )}

      {/* Danger Zone */}
      <div className="card border-red-200">
        <h2 className="text-lg font-semibold text-red-600 mb-4">{t('profile.dangerZone', 'Danger Zone')}</h2>
        <button
          onClick={() => toast.error(t('profile.deleteSoon', 'Account deletion coming soon'))}
          className="btn btn-danger w-full"
        >
          {t('profile.deleteAccount', 'Delete Account')}
        </button>
      </div>
      </div>
    </div>
  );
}
