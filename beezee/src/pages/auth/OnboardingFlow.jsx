import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, User, Bell, CheckCircle, ArrowRight, Loader2, Lock } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import toast from 'react-hot-toast';
import { generateDeviceFingerprint } from '../../utils/deviceFingerprint';
import { formatPhoneNumber, normalizePhoneNumber, isValidPhoneNumber } from '../../utils/phoneFormatter';
import { useAuthStore } from '../../store/authStore';
import OnboardingProgress from '../../components/OnboardingProgress';

const STEPS = {
  WHATSAPP: 1,
  PROFILE: 2,
  NOTIFICATIONS: 3,
};

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(STEPS.WHATSAPP);
  const [loading, setLoading] = useState(false);

  // Step 1: WhatsApp Number
  const [whatsappNumber, setWhatsappNumber] = useState(
    location.state?.whatsappNumber?.replace('+', '') || ''
  );
  const [formattedWhatsapp, setFormattedWhatsapp] = useState('');

  // Step 2: Profile
  const [firstName, setFirstName] = useState('');
  const [businessName, setBusinessName] = useState('');

  // Step 3: Notifications
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const formatted = formatPhoneNumber(whatsappNumber);
    setFormattedWhatsapp(formatted);
  }, [whatsappNumber]);

  const handleWhatsappSubmit = async () => {
    let fullWhatsapp = normalizePhoneNumber(whatsappNumber);
    
    if (!isValidPhoneNumber(fullWhatsapp)) {
      toast.error('Please enter a valid WhatsApp number');
      return;
    }

    try {
      setLoading(true);
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('whatsapp_number', fullWhatsapp)
        .single();

      if (existingUser && existingUser.onboarding_completed) {
        const { setUser } = useAuthStore.getState();
        setUser({
          id: existingUser.id,
          phone: fullWhatsapp,
          user_metadata: { whatsapp_number: fullWhatsapp },
        });
        localStorage.setItem('beezee_user_id', existingUser.id);
        localStorage.setItem('beezee_whatsapp', fullWhatsapp);
        navigate('/dashboard');
        return;
      }

      setStep(STEPS.PROFILE);
    } catch (error) {
      setStep(STEPS.PROFILE);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async () => {
    if (!firstName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      setLoading(true);
      const fullWhatsapp = normalizePhoneNumber(whatsappNumber);
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('whatsapp_number', fullWhatsapp)
        .single();

      let userId;

      if (existingUser) {
        userId = existingUser.id;
        await supabase
          .from('users')
          .update({
            phone_number: fullWhatsapp,
            first_name: firstName.trim(),
            business_name: businessName.trim() || firstName.trim(),
            whatsapp_number: fullWhatsapp,
            privacy_policy_accepted: true,
            privacy_policy_accepted_at: new Date().toISOString(),
          })
          .eq('id', userId);
      } else {
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            phone_number: fullWhatsapp,
            first_name: firstName.trim(),
            business_name: businessName.trim() || firstName.trim(),
            whatsapp_number: fullWhatsapp,
            subscription_status: 'trial',
            trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            privacy_policy_accepted: true,
            privacy_policy_accepted_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (createError) throw createError;
        userId = newUser.id;
      }

      const { setUser } = useAuthStore.getState();
      setUser({
        id: userId,
        phone: fullWhatsapp,
        user_metadata: { whatsapp_number: fullWhatsapp },
      });

      localStorage.setItem('beezee_user_id', userId);
      localStorage.setItem('beezee_whatsapp', fullWhatsapp);

      setStep(STEPS.NOTIFICATIONS);
    } catch (error) {
      console.error('Profile submit error:', error);
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsSubmit = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('beezee_user_id');
      if (!userId) throw new Error('Not authenticated');

      await supabase
        .from('users')
        .update({
          onboarding_completed: true,
          last_login: new Date().toISOString(),
          login_count: 1,
        })
        .eq('id', userId);

      await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          trial_reminders: notificationsEnabled,
          payment_reminders: notificationsEnabled,
          milestone_celebrations: notificationsEnabled,
          weekly_summaries: notificationsEnabled,
          insights: notificationsEnabled,
          feature_announcements: notificationsEnabled,
          inactivity_nudges: notificationsEnabled,
          whatsapp_opted_in: false,
        }, { onConflict: 'user_id' });

      const fingerprint = await generateDeviceFingerprint();
      await supabase
        .from('trusted_devices')
        .insert({
          user_id: userId,
          device_fingerprint: fingerprint,
          device_name: 'Current Device',
          device_type: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          browser: navigator.userAgent.split(' ').pop(),
        });

      toast.success('Welcome to BeeZee! 🎉');
      navigate('/dashboard');
    } catch (error) {
      console.error('Notifications submit error:', error);
      toast.error('Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > STEPS.WHATSAPP) {
      setStep(step - 1);
    } else {
      navigate('/get-started');
    }
  };

  const steps = [
    { id: STEPS.WHATSAPP, label: 'Phone' },
    { id: STEPS.PROFILE, label: 'Profile' },
    { id: STEPS.NOTIFICATIONS, label: 'Notifications' },
  ];

  return (
    <div className="auth-container">
      {/* Back Button */}
      <button className="auth-back-button" onClick={handleBack}>
        <ChevronLeft size={24} />
      </button>

      {/* Progress Bar */}
      <OnboardingProgress
        currentStep={step}
        totalSteps={3}
        steps={steps}
      />

      {/* Step Content */}
      <div className="auth-card">
        {step === STEPS.WHATSAPP && (
          <div className="auth-form">
            <div className="auth-card-header">
              <h2 className="auth-card-title">Enter your phone number</h2>
              <p className="auth-card-subtitle">We'll send you a code to verify</p>
            </div>

            <div className="auth-form-field">
              <div className="auth-phone-input-container">
                <div className="auth-country-code">+27</div>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setWhatsappNumber(value);
                  }}
                  placeholder="XX XXX XXXX"
                  className="auth-phone-input"
                  inputMode="tel"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && isValidPhoneNumber(normalizePhoneNumber(whatsappNumber))) {
                      handleWhatsappSubmit();
                    }
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleWhatsappSubmit}
              disabled={loading || !isValidPhoneNumber(normalizePhoneNumber(whatsappNumber))}
              className="auth-cta-button"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Checking...
                </>
              ) : (
                <>
                  Send Code
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <div className="auth-trust-badge">
              <Lock className="auth-trust-icon" size={16} />
              <span>Your number is safe with us</span>
            </div>
          </div>
        )}

        {step === STEPS.PROFILE && (
          <div className="auth-form">
            <div className="auth-card-header">
              <User className="text-powder-blue mx-auto mb-4" size={32} />
              <h2 className="auth-card-title">What should we call you?</h2>
              <p className="auth-card-subtitle">Tell us a bit about yourself</p>
            </div>

            <div className="auth-form-field">
              <label className="auth-form-label">Your First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="description-input"
                autoFocus
              />
            </div>

            <div className="auth-form-field">
              <label className="auth-form-label">Business Name (optional)</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="John's Spaza"
                className="description-input"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to use your first name</p>
            </div>

            <button
              onClick={handleProfileSubmit}
              disabled={loading || !firstName.trim()}
              className="auth-cta-button"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                <>
                  Next
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        )}

        {step === STEPS.NOTIFICATIONS && (
          <div className="auth-form">
            <div className="auth-card-header">
              <Bell className="text-powder-blue mx-auto mb-4" size={32} />
              <h2 className="auth-card-title">Enable In-App Notifications?</h2>
              <p className="auth-card-subtitle">Get helpful reminders and insights</p>
            </div>

            <div className="card" style={{ background: 'var(--gradient-soft-blue-fade)', border: '1px solid var(--color-powder-blue)' }}>
              <p className="text-sm font-medium text-gray-900 mb-3">You'll receive notifications for:</p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-powder-blue flex-shrink-0 mt-0.5" size={16} />
                  <span>Weekly business summaries</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-powder-blue flex-shrink-0 mt-0.5" size={16} />
                  <span>Milestone celebrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-powder-blue flex-shrink-0 mt-0.5" size={16} />
                  <span>Payment reminders</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-powder-blue flex-shrink-0 mt-0.5" size={16} />
                  <span>Business insights</span>
                </li>
              </ul>
            </div>

            <div className="settings-row" style={{ margin: 'var(--spacing-large) 0' }}>
              <Bell className="settings-row-icon" />
              <span className="settings-row-label">Enable Notifications</span>
              <div
                className={`settings-toggle-switch ${notificationsEnabled ? 'active' : ''}`}
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              >
                <div className="settings-toggle-thumb" />
              </div>
            </div>

            <button
              onClick={handleNotificationsSubmit}
              disabled={loading}
              className="auth-cta-button"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Completing...
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
