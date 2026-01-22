import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { Bell, Check, Loader2, Clock, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import SupportButton from '../components/SupportButton';

export default function NotificationSettings() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    trial_reminders: true,
    payment_reminders: true,
    milestone_celebrations: true,
    weekly_summaries: true,
    insights: true,
    feature_announcements: true,
    inactivity_nudges: true,
    quiet_hours_start: '21:00',
    quiet_hours_end: '07:00',
  });

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          trial_reminders: data.trial_reminders ?? true,
          payment_reminders: data.payment_reminders ?? true,
          milestone_celebrations: data.milestone_celebrations ?? true,
          weekly_summaries: data.weekly_summaries ?? true,
          insights: data.insights ?? true,
          feature_announcements: data.feature_announcements ?? true,
          inactivity_nudges: data.inactivity_nudges ?? true,
          quiet_hours_start: data.quiet_hours_start || '21:00',
          quiet_hours_end: data.quiet_hours_end || '07:00',
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast.success('Notification preferences saved!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (loading) {
    return (
      <div className="container-app flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="notification-settings-container">
      <div className="container-app">
        <div className="notification-settings-header mb-6">
          <div className="page-header-with-back">
            <button
              className="page-back-button"
              onClick={() => navigate('/dashboard/settings')}
              aria-label="Go back"
            >
              <ChevronLeft size={22} />
            </button>
            <div>
              <h1 className="text-h1 mb-1">Notification Settings</h1>
              <p className="text-body text-neutral-600">
                Control which notifications you receive in the app
              </p>
            </div>
          </div>
        </div>

      {/* Info Card */}
      <div className="card bg-info-50 border-info-200 mb-6">
        <div className="flex items-start gap-3">
          <Bell className="text-info-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-body font-semibold text-neutral-900 mb-1">
              How notifications work
            </p>
            <p className="text-small text-neutral-700">
              Notifications appear in the app. You can click "Chat with us" to get help via WhatsApp anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div className="card mb-6">
        <h2 className="text-h3 font-bold mb-4">Notification Types</h2>
        
        <div className="space-y-4">
          <NotificationToggle
            label="Trial Reminders"
            description="Get reminders about your trial period"
            checked={preferences.trial_reminders}
            onChange={() => togglePreference('trial_reminders')}
          />

          <NotificationToggle
            label="Payment Reminders"
            description="Reminders about subscription payments"
            checked={preferences.payment_reminders}
            onChange={() => togglePreference('payment_reminders')}
          />

          <NotificationToggle
            label="Milestone Celebrations"
            description="Celebrate your achievements"
            checked={preferences.milestone_celebrations}
            onChange={() => togglePreference('milestone_celebrations')}
          />

          <NotificationToggle
            label="Weekly Summaries"
            description="Weekly business performance reports"
            checked={preferences.weekly_summaries}
            onChange={() => togglePreference('weekly_summaries')}
          />

          <NotificationToggle
            label="AI Coach Insights"
            description="Insights and tips from your financial coach"
            checked={preferences.insights}
            onChange={() => togglePreference('insights')}
          />

          <NotificationToggle
            label="Feature Announcements"
            description="New features and updates"
            checked={preferences.feature_announcements}
            onChange={() => togglePreference('feature_announcements')}
          />

          <NotificationToggle
            label="Inactivity Reminders"
            description="Reminders if you haven't used the app in a while"
            checked={preferences.inactivity_nudges}
            onChange={() => togglePreference('inactivity_nudges')}
          />
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="card mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Clock className="text-neutral-600 flex-shrink-0 mt-1" size={20} />
          <div className="flex-1">
            <h2 className="text-h3 font-bold mb-1">Quiet Hours</h2>
            <p className="text-small text-neutral-600">
              No notifications during these hours (notifications are in-app only, but you can set preferences)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-small font-medium text-neutral-700 mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={preferences.quiet_hours_start}
              onChange={(e) => setPreferences(prev => ({ ...prev, quiet_hours_start: e.target.value }))}
              className="input"
            />
          </div>
          <div>
            <label className="block text-small font-medium text-neutral-700 mb-2">
              End Time
            </label>
            <input
              type="time"
              value={preferences.quiet_hours_end}
              onChange={(e) => setPreferences(prev => ({ ...prev, quiet_hours_end: e.target.value }))}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary flex-1"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Saving...
            </>
          ) : (
            <>
              <Check size={20} />
              Save Preferences
            </>
          )}
        </button>
      </div>

      {/* Support */}
      <div className="mt-8 pt-6 border-t border-neutral-200">
        <p className="text-small text-neutral-600 mb-3">
          Questions about notifications?
        </p>
        <SupportButton context="notification settings" />
      </div>
      </div>
    </div>
  );
}

function NotificationToggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
      <div className="flex-1">
        <label className="text-body font-semibold text-neutral-900 cursor-pointer" onClick={onChange}>
          {label}
        </label>
        <p className="text-small text-neutral-600 mt-1">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-success-500' : 'bg-neutral-300'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
