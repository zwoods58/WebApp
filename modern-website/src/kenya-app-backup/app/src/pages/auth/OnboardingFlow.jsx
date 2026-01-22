import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, User, Bell, CheckCircle, ArrowRight, Loader2, Lock, Eye, EyeOff, Key, AlertTriangle, Shield, Mail, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPhoneNumber, normalizePhoneNumber, isValidPhoneNumber } from '../../utils/phoneFormatter';
import { useAuthStore } from '../../store/authStore';
import { useCountryStore } from '../../store/countryStore.js';
import { AuthService } from '../../services/AuthService';
import OnboardingProgress from '../../components/OnboardingProgress';

const STEPS = {
  PHONE: 1,
  OTP: 2,
  PROFILE: 3,
  PIN_SETUP: 4,
  SUCCESS: 5,
};

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(STEPS.PHONE);
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuthStore();
  const { detectCountryFromPhone: detectAndSetCountry, activeCountry } = useCountryStore();

  // Data State
  const [phone, setPhone] = useState(location.state?.whatsappNumber?.replace('+', '') || '');
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [backupEmail, setBackupEmail] = useState('');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  useEffect(() => {
    if (location.state?.whatsappNumber) {
      // If we already have a phone, we still need to verify it via OTP in V2
      setPhone(location.state.whatsappNumber.replace('+', ''));
    }
  }, []);

  // --- Step 1: Submit Phone Number ---
  const handlePhoneSubmit = async () => {
    const fullPhone = normalizePhoneNumber(phone);
    if (!isValidPhoneNumber(fullPhone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    const countryDetected = detectAndSetCountry(fullPhone);
    if (!countryDetected) {
      toast.error('Unsupported country. BeeZee is currently in KE, NG, ZA.');
      return;
    }

    setLoading(true);
    try {
      const countryCode = activeCountry?.dialCode || '+254';
      const localPhone = fullPhone.replace(countryCode, '');

      const res = await AuthService.requestVerification(localPhone, activeCountry?.code || 'KE', 'signup');

      if (res.success) {
        toast.success(`Verification code sent! 📱`);
        setStep(STEPS.OTP);
      } else {
        toast.error(res.error || 'Failed to send code');
      }
    } catch (err) {
      toast.error('Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Verify OTP ---
  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      toast.error('Enter the 6-digit code');
      return;
    }
    // In our V2 signup, we verify OTP as part of the final signup call to reduce round-trips
    // but we can add a pre-check here if we want. For now, we'll just proceed to profile.
    setStep(STEPS.PROFILE);
  };

  // --- Step 3: Profile Details ---
  const handleProfileSubmit = () => {
    if (!firstName.trim() || !backupEmail.trim()) {
      toast.error('Please fill in required fields');
      return;
    }
    // Basic email validation
    if (!backupEmail.includes('@')) {
      toast.error('Enter a valid email address');
      return;
    }
    setStep(STEPS.PIN_SETUP);
  };

  // --- Step 4: Final Signup (Submit PIN + Save) ---
  const handleSignupSubmit = async () => {
    const pinValue = pin.join('');
    const confirmPinValue = confirmPin.join('');

    if (pinValue.length !== 6) {
      toast.error('PIN must be 6 digits');
      return;
    }
    if (pinValue !== confirmPinValue) {
      toast.error('PINs do not match');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = normalizePhoneNumber(phone);
      const countryCode = activeCountry?.dialCode || '+254';
      const localPhone = fullPhone.replace(countryCode, '');

      const res = await AuthService.signup(
        localPhone,
        activeCountry?.code || 'KE',
        otp,
        pinValue,
        confirmPinValue,
        businessName.trim() || firstName.trim(),
        backupEmail.trim()
      );

      if (res.success) {
        toast.success('Account created successfully! 🎉');

        // Update Auth Store
        setSession({
          user: res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken
        });

        localStorage.setItem('beezee_user_id', res.user.id);
        localStorage.setItem('lastWhatsapp', fullPhone);

        setStep(STEPS.SUCCESS);
      } else {
        toast.error(res.error || 'Signup failed');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > STEPS.PHONE) {
      setStep(step - 1);
    } else {
      navigate('/get-started');
    }
  };

  const steps = [
    { id: STEPS.PHONE, label: 'Phone' },
    { id: STEPS.OTP, label: 'Verify' },
    { id: STEPS.PROFILE, label: 'Profile' },
    { id: STEPS.PIN_SETUP, label: 'Security' },
  ];

  return (
    <div className="auth-container">
      <button className="auth-back-button" onClick={handleBack}>
        <ChevronLeft size={24} />
      </button>

      <OnboardingProgress
        currentStep={step}
        totalSteps={4}
        steps={steps}
      />

      <div className="auth-card">
        {/* STEP 1: PHONE */}
        {step === STEPS.PHONE && (
          <div className="auth-form">
            <div className="auth-card-header">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-blue-600" size={32} />
              </div>
              <h2 className="auth-card-title">Welcome to BeeZee</h2>
              <p className="auth-card-subtitle">Enter your phone number to get started</p>
            </div>

            <div className="auth-form-field">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ''))}
                placeholder="+254700000000"
                className="auth-phone-input"
                autoFocus
              />
            </div>

            <button onClick={handlePhoneSubmit} disabled={loading} className="auth-cta-button">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Next <ArrowRight size={20} /></>}
            </button>
          </div>
        )}

        {/* STEP 2: OTP */}
        {step === STEPS.OTP && (
          <div className="auth-form">
            <div className="auth-card-header">
              <h2 className="auth-card-title">Verification Code</h2>
              <p className="auth-card-subtitle">Enter the 6-digit code sent to {phone}</p>
            </div>

            <div className="auth-form-field">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="description-input text-center text-3xl font-bold tracking-widest"
                autoFocus
                inputMode="numeric"
              />
            </div>

            <button onClick={handleOtpSubmit} className="auth-cta-button">
              Verify Code <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* STEP 3: PROFILE */}
        {step === STEPS.PROFILE && (
          <div className="auth-form">
            <div className="auth-card-header">
              <User className="text-blue-500 mx-auto mb-4" size={32} />
              <h2 className="auth-card-title">Setup Your Profile</h2>
              <p className="auth-card-subtitle">Help us secure your business</p>
            </div>

            <div className="auth-form-field">
              <label className="auth-form-label">Full Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John Doe"
                className="description-input"
              />
            </div>

            <div className="auth-form-field">
              <label className="auth-form-label">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="My Awesome Shop"
                className="description-input"
              />
            </div>

            <div className="auth-form-field">
              <label className="auth-form-label">Backup Email (For Recovery) *</label>
              <div className="relative">
                <input
                  type="email"
                  value={backupEmail}
                  onChange={(e) => setBackupEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="description-input pl-10"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <p className="text-xs text-gray-500 mt-1">Crucial for account recovery if you lose your phone</p>
            </div>

            <button onClick={handleProfileSubmit} className="auth-cta-button">
              Security Setup <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* STEP 4: PIN SETUP */}
        {step === STEPS.PIN_SETUP && (
          <div className="auth-form">
            <div className="auth-card-header">
              <Lock className="text-blue-600 mx-auto mb-4" size={32} />
              <h2 className="auth-card-title">Create Security PIN</h2>
              <p className="auth-card-subtitle">Choose a 6-digit PIN for daily access</p>
            </div>

            {/* PIN Input */}
            <div className="auth-form-field">
              <div className="flex justify-center gap-2 mb-4">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type={showPin ? 'text' : 'password'}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.slice(-1);
                      const newPin = [...pin];
                      newPin[index] = val;
                      setPin(newPin);
                      if (val && index < 5) document.getElementById(`pin-${index + 1}`).focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && index > 0) document.getElementById(`pin-${index - 1}`).focus();
                    }}
                    className="w-10 h-12 text-center text-xl font-bold border-2 rounded-lg"
                    maxLength={1}
                    inputMode="numeric"
                  />
                ))}
              </div>
              <button onClick={() => setShowPin(!showPin)} className="text-xs text-gray-500 block mx-auto underline">
                {showPin ? 'Hide' : 'Show'} PIN
              </button>
            </div>

            <div className="auth-form-field">
              <label className="auth-form-label text-center block mb-2">Confirm PIN</label>
              <div className="flex justify-center gap-2 mb-4">
                {confirmPin.map((digit, index) => (
                  <input
                    key={index}
                    id={`confirm-${index}`}
                    type={showConfirmPin ? 'text' : 'password'}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.slice(-1);
                      const newPin = [...confirmPin];
                      newPin[index] = val;
                      setConfirmPin(newPin);
                      if (val && index < 5) document.getElementById(`confirm-${index + 1}`).focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && index > 0) document.getElementById(`confirm-${index - 1}`).focus();
                    }}
                    className="w-10 h-12 text-center text-xl font-bold border-2 rounded-lg"
                    maxLength={1}
                    inputMode="numeric"
                  />
                ))}
              </div>
              <button onClick={() => setShowConfirmPin(!showConfirmPin)} className="text-xs text-gray-500 block mx-auto underline">
                {showConfirmPin ? 'Hide' : 'Show'} PIN
              </button>
            </div>

            <button onClick={handleSignupSubmit} disabled={loading} className="auth-cta-button bg-green-600 hover:bg-green-700">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Complete Signup <CheckCircle size={20} /></>}
            </button>
          </div>
        )}

        {/* STEP 5: SUCCESS */}
        {step === STEPS.SUCCESS && (
          <div className="auth-form text-center p-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h2>
            <p className="text-gray-600 mb-8">Your BeeZee account is secured and ready to use.</p>
            <button onClick={() => navigate('/dashboard')} className="auth-cta-button">
              Go to Dashboard <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
