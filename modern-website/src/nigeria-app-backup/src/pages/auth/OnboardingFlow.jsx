import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, User, Bell, CheckCircle, ArrowRight, Loader2, Lock, Eye, EyeOff, Key, AlertTriangle, Shield } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { pinVault } from '../../utils/pinVault';
import { recoveryPhrase } from '../../utils/recoveryPhrase';
import toast from 'react-hot-toast';
import { generateDeviceFingerprint } from '../../utils/deviceFingerprint';
import { formatPhoneNumber, normalizePhoneNumber, isValidPhoneNumber, detectCountryFromPhone } from '../../utils/phoneFormatter';
import { useAuthStore } from '../../store/authStore';
import { useCountryStore } from '../../store/countryStore.js';
import { AuthService } from '../../services/AuthService';
import OnboardingProgress from '../../components/OnboardingProgress';

const STEPS = {
  WHATSAPP: 1,
  PROFILE: 2,
  PIN_SETUP: 3,
  RECOVERY_PHRASE: 4,
  NOTIFICATIONS: 5,
};

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(STEPS.WHATSAPP);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const { detectCountryFromPhone: detectAndSetCountry, userCountry } = useCountryStore();

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

  // Step 4: PIN Setup
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);

  // Debug: Log PIN array length
  console.log('Nigeria PIN array length:', pin.length);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [pinStrength, setPinStrength] = useState('');

  // Step 5: Recovery Phrase
  const [recoveryPhraseText, setRecoveryPhraseText] = useState('');
  const [recoveryWords, setRecoveryWords] = useState([]);
  const [showPhrase, setShowPhrase] = useState(false);
  const [userConfirmed, setUserConfirmed] = useState(false);

  useEffect(() => {
    // If we're coming from signup or login with a number, skip to profile step
    if (location.state?.whatsappNumber) {
      setStep(STEPS.PROFILE);
    }

    // Request persistent storage
    pinVault.requestPersistentStorage();

    // Check browser compatibility
    const browserCheck = pinVault.detectBrowserSupport();
    if (!browserCheck.supported) {
      toast.error(browserCheck.message, { duration: 10000 });
    }
  }, []);

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

    // Detect and set country from phone number
    const countryDetected = detectAndSetCountry(fullWhatsapp);

    if (!countryDetected) {
      toast.error('Unsupported country. BeeZee is currently available in Kenya, Nigeria, and South Africa.');
      return;
    }

    // Proceed to profile step - uniqueness check is handled by Edge Function
    setStep(STEPS.PROFILE);
  };

  const handleProfileSubmit = async () => {
    if (!firstName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    // We don't save to DB here yet, we'll do it in final signup call after PIN is set
    setStep(STEPS.PIN_SETUP);
  };

  const handleNotificationsSubmit = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('beezee_user_id');
      if (!userId) throw new Error('Not authenticated');

      // Update notification preferences
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

      // Update user record with notifications preference
      await supabase
        .from('users')
        .update({
          notifications_enabled: notificationsEnabled,
          onboarding_completed: true,
        })
        .eq('id', userId);

      toast.success('Welcome to BeeZee! 🎉 Your account is now secure.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Notifications submit error:', error);
      toast.error('Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = async () => {
    const pinValue = pin.join('');
    const confirmPinValue = confirmPin.join('');

    if (pinValue.length !== 6) {
      toast.error('Please enter a 6-digit PIN');
      return;
    }

    if (pinValue !== confirmPinValue) {
      toast.error('PINs do not match');
      return;
    }

    try {
      setLoading(true);

      const fullWhatsapp = normalizePhoneNumber(whatsappNumber);
      const activeCountry = useCountryStore.getState().activeCountry;
      const countryCode = activeCountry?.dialCode || '+234';

      // Remove dial code from full number for localPhone if it starts with it
      const localPhone = fullWhatsapp.startsWith(countryCode)
        ? fullWhatsapp.substring(countryCode.length)
        : fullWhatsapp.startsWith('+') ? fullWhatsapp.substring(4) : fullWhatsapp;

      const countryStr = activeCountry?.name?.toLowerCase().replace(' ', '_') || 'nigeria';

      const signupData = await AuthService.signup(
        localPhone,
        countryCode,
        pinValue,
        businessName.trim(),
        countryStr,
        firstName.trim()
      );

      if (!signupData.success) {
        // If user already exists, redirect to login with the phone number
        if (signupData.userExists) {
          console.log('User exists, redirecting to login:', { phoneNumber: fullWhatsapp });
          toast.error(signupData.error);

          // Small delay to ensure toast is shown
          setTimeout(() => {
            navigate('/login', {
              state: {
                phoneNumber: fullWhatsapp,
                message: 'Please login with your existing account'
              }
            });
          }, 100);
          return;
        }
        toast.error(signupData.error || 'Failed to create account');
        return;
      }

      // Store basic info
      localStorage.setItem('beezee_user_id', signupData.userId);
      localStorage.setItem('beezee_whatsapp', fullWhatsapp);
      localStorage.setItem('lastWhatsapp', fullWhatsapp);

      // Store Session Token if provided (Auto Login)
      if (signupData.sessionToken) {
        localStorage.setItem('beezee_session_token', signupData.sessionToken);
        // Also update the global auth store state immediately
        useAuthStore.getState().setSession({
          user: { id: signupData.userId, phone: fullWhatsapp },
          token: signupData.sessionToken
        });
      }

      // Set recovery phrase from response
      setRecoveryPhraseText(signupData.recoveryPhrase.join(' '));
      setRecoveryWords(signupData.recoveryPhrase);

      setStep(STEPS.RECOVERY_PHRASE);
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to set up account');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryPhraseSubmit = async () => {
    if (!userConfirmed) {
      toast.error('Please confirm you have safely stored your recovery phrase');
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem('beezee_user_id');

      // Auto-login if we have session items (which we should from signup)
      // Check if signup response gave us a session token (it should have)
      // If not, we fall back to login screen but usually we want to go straight to dashboard

      toast.success('Account setup complete!');
      navigate('/dashboard');

    } catch (error) {
      console.error('Recovery Setup Error:', error);
      toast.error('Failed to complete setup');
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

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.split('');

    if (digits.length === 6 && /^\d{6}$/.test(pastedData)) {
      setPin(digits);
      // Skip strength check for paste
      setPinStrength('Strong');
    }
  };

  const steps = [
    { id: STEPS.WHATSAPP, label: 'Phone' },
    { id: STEPS.PROFILE, label: 'Profile' },
    { id: STEPS.PIN_SETUP, label: 'PIN Setup' },
    { id: STEPS.RECOVERY_PHRASE, label: 'Recovery Phrase' },
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
        totalSteps={5}
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
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d+]/g, '');
                    setWhatsappNumber(value);
                  }}
                  placeholder="+234802345678"
                  className="auth-phone-input"
                  style={{ paddingLeft: '16px' }}
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
                placeholder="John's Shop"
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
                  Continuing...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        )}

        {step === STEPS.PIN_SETUP && (
          <div className="auth-form animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="auth-card-header mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 transform rotate-3">
                <Lock className="text-white transform -rotate-3" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Security PIN</h2>
              <p className="text-gray-600">Choose a 6-digit PIN to secure your wallet</p>
            </div>

            {/* PIN Strength Indicator */}
            <div className="mb-10 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">PIN Strength</span>
                <span className={`text-sm font-bold ${pinStrength === 'Strong' ? 'text-green-600' :
                  pinStrength === 'Medium' ? 'text-yellow-600' :
                    pinStrength === 'Weak' ? 'text-red-600' :
                      'text-gray-400'
                  }`}>
                  {pinStrength || 'Waiting...'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${pinStrength === 'Strong' ? 'w-full bg-green-500' :
                  pinStrength === 'Medium' ? 'w-2/3 bg-yellow-500' :
                    pinStrength === 'Weak' ? 'w-1/3 bg-red-500' :
                      'w-0 bg-gray-300'
                  }`} />
              </div>
            </div>

            <div className="space-y-8">
              {/* PIN Input */}
              <div className="auth-form-field">
                <label className="text-sm font-bold text-gray-700 mb-4 block text-center">
                  Enter 6-Digit PIN
                </label>
                <div className="flex justify-center space-x-2 sm:space-x-3">
                  {pin.map((digit, index) => (
                    <input
                      key={`pin-setup-${index}`}
                      id={`pin-setup-${index}`}
                      type={showPin ? 'text' : 'password'}
                      value={digit}
                      onChange={(e) => {
                        const value = e.target.value.slice(-1);
                        const newPin = [...pin];
                        newPin[index] = value;
                        setPin(newPin);

                        if (newPin.every(digit => digit !== '')) {
                          const validation = pinVault.validatePIN(newPin.join(''));
                          setPinStrength(validation.valid ? validation.strength : 'Invalid');
                        } else {
                          setPinStrength('');
                        }

                        if (value && index < 5) {
                          const nextInput = document.getElementById(`pin-setup-${index + 1}`);
                          if (nextInput) nextInput.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !digit && index > 0) {
                          const prevInput = document.getElementById(`pin-setup-${index - 1}`);
                          if (prevInput) prevInput.focus();
                        }
                      }}
                      onPaste={handlePaste}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold text-center bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
                      maxLength={1}
                      autoFocus={index === 0}
                      inputMode="numeric"
                    />
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center transition-colors px-4 py-2 rounded-xl hover:bg-blue-50"
                  >
                    {showPin ? <EyeOff size={18} className="mr-2" /> : <Eye size={18} className="mr-2" />}
                    {showPin ? 'Hide PIN' : 'Show PIN'}
                  </button>
                </div>
              </div>

              {/* Confirm PIN */}
              <div className="auth-form-field">
                <label className="text-sm font-bold text-gray-700 mb-4 block text-center">
                  Confirm 6-Digit PIN
                </label>
                <div className="flex justify-center space-x-2 sm:space-x-3">
                  {confirmPin.map((digit, index) => (
                    <input
                      key={`pin-confirm-${index}`}
                      id={`pin-confirm-${index}`}
                      type={showConfirmPin ? 'text' : 'password'}
                      value={digit}
                      onChange={(e) => {
                        const value = e.target.value.slice(-1);
                        const newPin = [...confirmPin];
                        newPin[index] = value;
                        setConfirmPin(newPin);

                        if (value && index < 5) {
                          const nextInput = document.getElementById(`pin-confirm-${index + 1}`);
                          if (nextInput) nextInput.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !digit && index > 0) {
                          const prevInput = document.getElementById(`pin-confirm-${index - 1}`);
                          if (prevInput) prevInput.focus();
                        }
                      }}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold text-center bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
                      maxLength={1}
                      inputMode="numeric"
                    />
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center transition-colors px-4 py-2 rounded-xl hover:bg-blue-50"
                  >
                    {showConfirmPin ? <EyeOff size={18} className="mr-2" /> : <Eye size={18} className="mr-2" />}
                    {showConfirmPin ? 'Hide PIN' : 'Show PIN'}
                  </button>
                </div>
              </div>

              {/* Match Indicator */}
              {pin.join('').length === 6 && confirmPin.join('').length === 6 && (
                <div className={`p-4 rounded-2xl flex items-center transition-all animate-in zoom-in-95 duration-300 ${pin.join('') === confirmPin.join('')
                  ? 'bg-green-50 border border-green-100'
                  : 'bg-red-50 border border-red-100'
                  }`}>
                  {pin.join('') === confirmPin.join('') ? (
                    <>
                      <div className="bg-green-500 rounded-full p-1 mr-3 shadow-lg shadow-green-500/20">
                        <CheckCircle className="text-white" size={20} />
                      </div>
                      <span className="text-green-800 font-bold">PINs match perfectly!</span>
                    </>
                  ) : (
                    <>
                      <div className="bg-red-500 rounded-full p-1 mr-3 shadow-lg shadow-red-500/20">
                        <AlertTriangle className="text-white" size={20} />
                      </div>
                      <span className="text-red-800 font-bold">PINs do not match</span>
                    </>
                  )}
                </div>
              )}

              <button
                onClick={handlePinSubmit}
                disabled={loading || pin.join('').length !== 6 || confirmPin.join('').length !== 6 || pin.join('') !== confirmPin.join('')}
                className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-5 px-6 rounded-2xl font-bold hover:shadow-xl hover:shadow-blue-500/40 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center text-lg mt-4 shadow-lg shadow-blue-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-3" size={24} />
                    Securing Account...
                  </>
                ) : (
                  <>
                    Continue to Recovery
                    <ArrowRight size={22} className="ml-3" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === STEPS.RECOVERY_PHRASE && (
          <div className="auth-form">
            <div className="auth-card-header">
              <Key className="text-powder-blue mx-auto mb-4" size={32} />
              <h2 className="auth-card-title">Save Your Recovery Phrase</h2>
              <p className="auth-card-subtitle">This is only way to recover your account if you forget your PIN</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-amber-600 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Important Security Notice</h3>
                  <p className="text-amber-700 text-sm mb-3">
                    Write down these 12 words in order and store them safely. This phrase is ONLY way to recover your account if you forget your PIN.
                  </p>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Store offline in a safe place</li>
                    <li>• Never share with anyone</li>
                    <li>• Don't take screenshots</li>
                    <li>• Keep away from fire and water</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-4 text-center">Your Recovery Phrase</h4>

              <div className="flex flex-wrap gap-3 justify-center mb-2">
                {recoveryWords.map((word, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm"
                  >
                    <span className="text-xs font-bold text-blue-500 mr-2 bg-blue-50 w-5 h-5 flex items-center justify-center rounded-full">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-700 text-base">
                      {word}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="auth-form-field">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userConfirmed}
                  onChange={(e) => setUserConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">
                  I have written down my 12-word recovery phrase and stored it in a safe, private place. I understand that this phrase is only way to recover my account if I forget my PIN.
                </span>
              </label>
            </div>

            <button
              onClick={handleRecoveryPhraseSubmit}
              disabled={loading || !userConfirmed}
              className="auth-cta-button"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Completing Setup...
                </>
              ) : (
                <>
                  Complete Setup
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
