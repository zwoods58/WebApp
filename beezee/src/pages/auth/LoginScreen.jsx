import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { supabase, sendOTPWhatsApp, verifyOTPCustom } from '../../utils/supabase';
import { MessageCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateDeviceFingerprint, isTrustedDevice, trustDevice } from '../../utils/deviceFingerprint';
import { formatPhoneNumber, normalizePhoneNumber, isValidPhoneNumber } from '../../utils/phoneFormatter';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [formattedWhatsapp, setFormattedWhatsapp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [displayedOTP, setDisplayedOTP] = useState('');
  const [showTrustPrompt, setShowTrustPrompt] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    checkExistingSession();
    loadLastWhatsapp();
  }, []);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  useEffect(() => {
    const formatted = formatPhoneNumber(whatsappNumber);
    setFormattedWhatsapp(formatted);
  }, [whatsappNumber]);

  const checkExistingSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: user } = await supabase
          .from('users')
          .select('onboarding_completed')
          .eq('id', session.user.id)
          .single();
        if (user?.onboarding_completed) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  const loadLastWhatsapp = () => {
    const lastWhatsapp = localStorage.getItem('lastWhatsapp');
    if (lastWhatsapp) {
      setWhatsappNumber(lastWhatsapp.replace('+', ''));
    }
  };

  const handleWhatsappSubmit = async () => {
    const fullWhatsapp = normalizePhoneNumber(whatsappNumber);
    
    if (!isValidPhoneNumber(fullWhatsapp)) {
      toast.error('Please enter a valid WhatsApp number');
      return;
    }

    try {
      setLoading(true);
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, onboarding_completed')
        .eq('whatsapp_number', fullWhatsapp)
        .single();

      if (!existingUser) {
        toast.error('WhatsApp number not registered. Please sign up first.');
        setTimeout(() => navigate('/onboarding'), 1500);
        return;
      }

      const fingerprint = await generateDeviceFingerprint();
      await isTrustedDevice(fingerprint, existingUser.id, supabase);

      const result = await sendOTPWhatsApp(fullWhatsapp);
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate OTP');
      }

      if (result.otp_code) {
        setDisplayedOTP(result.otp_code);
        const otpArray = result.otp_code.split('');
        setOtp(otpArray);
        try {
          await navigator.clipboard.writeText(result.otp_code);
        } catch (err) {
          console.log('Clipboard copy failed:', err);
        }
      }

      localStorage.setItem('lastWhatsapp', fullWhatsapp);
      setUserId(existingUser.id);
      setResendCountdown(60);
      setShowOTP(true);
      toast.success('Code sent! Check your WhatsApp.');
    } catch (error) {
      console.error('WhatsApp submit error:', error);
      toast.error(error.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next box
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every(digit => digit) && newOtp.length === 6) {
      handleOTPSubmit(newOtp.join(''));
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOTPSubmit = async (otpValue = null) => {
    const otpToVerify = otpValue || otp.join('');
    const cleanOtp = otpToVerify.replace(/\D/g, '');
    
    if (cleanOtp.length !== 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }

    try {
      setLoading(true);
      const fullWhatsapp = normalizePhoneNumber(whatsappNumber);
      const result = await verifyOTPCustom(fullWhatsapp, cleanOtp);

      if (!result || !result.success) {
        throw new Error(result?.error || 'Invalid code');
      }

      const { setUser } = useAuthStore.getState();
      setUser({
        id: result.user_id,
        phone: fullWhatsapp,
        user_metadata: { whatsapp_number: fullWhatsapp },
      });

      localStorage.setItem('beezee_user_id', result.user_id);
      localStorage.setItem('beezee_whatsapp', fullWhatsapp);

      await supabase
        .from('users')
        .update({
          last_login: new Date().toISOString(),
          login_count: supabase.raw('login_count + 1'),
        })
        .eq('id', result.user_id);

      const fingerprint = await generateDeviceFingerprint();
      const trusted = await isTrustedDevice(fingerprint, result.user_id, supabase);

      if (!trusted && userId) {
        setShowTrustPrompt(true);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('OTP verify error:', error);
      toast.error(error.message || 'Invalid code');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCountdown > 0) return;
    try {
      setLoading(true);
      const fullWhatsapp = normalizePhoneNumber(whatsappNumber);
      const result = await sendOTPWhatsApp(fullWhatsapp);
      if (!result.success) throw new Error(result.error);
      if (result.otp_code) {
        setDisplayedOTP(result.otp_code);
        setOtp(result.otp_code.split(''));
      }
      setResendCountdown(60);
      toast.success('New code sent!');
    } catch (error) {
      toast.error('Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  const handleTrustDevice = async (trust) => {
    if (trust) {
      const userId = localStorage.getItem('beezee_user_id');
      if (userId) {
        await trustDevice(userId, 'Current Device', supabase);
        toast.success('Device trusted for 30 days');
      }
    }
    setShowTrustPrompt(false);
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      {/* Back Button */}
      <button className="auth-back-button" onClick={() => navigate('/')}>
        <ChevronLeft size={24} />
      </button>

      {/* Trust Device Modal */}
      {showTrustPrompt && (
        <div className="modal-backdrop" onClick={() => handleTrustDevice(false)}>
          <div className="confirmation-modal">
            <h3 className="confirmation-title">Trust This Device?</h3>
            <p className="confirmation-description">
              Skip entering OTP for the next 30 days on this device.
            </p>
            <div className="confirmation-actions">
              <button className="confirmation-button cancel-button" onClick={() => handleTrustDevice(false)}>
                No
              </button>
              <button className="confirmation-button" onClick={() => handleTrustDevice(true)}>
                Yes, Trust
              </button>
            </div>
          </div>
        </div>
      )}

      {!showOTP ? (
        <div className="auth-card">
          <div className="auth-card-header">
            <MessageCircle className="text-powder-blue mx-auto mb-4" size={32} />
            <h2 className="auth-card-title">Enter your phone number</h2>
            <p className="auth-card-subtitle">We'll send you a code to verify</p>
          </div>

          <div className="auth-form">
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
                  Sending Code...
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
        </div>
      ) : (
        <div className="auth-card">
          <div className="auth-card-header">
            <CheckCircle className="text-success-green mx-auto mb-4" size={32} />
            <h2 className="auth-card-title">Enter verification code</h2>
            <p className="auth-card-subtitle">We sent a code to {formattedWhatsapp}</p>
          </div>

          {displayedOTP && (
            <div className="auth-otp-display">
              <p className="text-sm text-gray-600 mb-2">Your code:</p>
              <div className="auth-otp-code">{displayedOTP}</div>
            </div>
          )}

          <div className="auth-otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleOTPKeyDown(index, e)}
                className="auth-otp-box"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <div className="auth-resend-text">
            {resendCountdown > 0 ? (
              <p>Didn't get it? Resend in {resendCountdown}s</p>
            ) : (
              <button onClick={handleResendOTP} className="auth-resend-button">
                Didn't get it? Resend code
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setShowOTP(false);
              setOtp(['', '', '', '', '', '']);
              setDisplayedOTP('');
            }}
            className="auth-cta-button"
            style={{ background: 'var(--color-subtle-gray)', color: 'var(--color-text-primary)', boxShadow: 'none' }}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
