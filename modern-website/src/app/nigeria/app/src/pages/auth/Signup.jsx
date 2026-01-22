import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { formatPhoneNumber, normalizePhoneNumber, isValidPhoneNumber, detectCountryFromPhone } from '../../utils/phoneFormatter';
import { useCountryStore } from '../../store/countryStore.js';
import toast from 'react-hot-toast';

/**
 * Signup Page - Phone Number Entry
 * Matches design spec for onboarding step 2
 */
export default function Signup() {
  const navigate = useNavigate();
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [formattedWhatsapp, setFormattedWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const { detectCountryFromPhone: detectAndSetCountry } = useCountryStore();

  useEffect(() => {
    const formatted = formatPhoneNumber(whatsappNumber);
    setFormattedWhatsapp(formatted);
  }, [whatsappNumber]);

  const handleSubmit = async () => {
    const fullWhatsapp = normalizePhoneNumber(whatsappNumber);
    
    if (!isValidPhoneNumber(fullWhatsapp)) {
      toast.error('Please enter a valid WhatsApp number');
      return;
    }

    // Detect and set country from phone number
    const countryDetected = detectAndSetCountry(fullWhatsapp);
    
    if (!countryDetected) {
      toast.error('Unsupported country. BeeZee is currently available in South Africa, Nigeria, and Kenya.');
      return;
    }

    console.log(`Signup: Country detected for ${fullWhatsapp}`);
    console.log('Proceeding to onboarding with country set...');

    // Navigate to onboarding flow with phone number
    navigate('/onboarding', { state: { whatsappNumber: fullWhatsapp } });
  };

  return (
    <div className="auth-container">
      {/* Back Button */}
      <button className="auth-back-button" onClick={() => navigate('/')}>
        <ChevronLeft size={24} />
      </button>

      <div className="auth-card">
        <div className="auth-card-header">
          <h2 className="auth-card-title">Enter your phone number</h2>
          <p className="auth-card-subtitle">We'll send you a code to verify</p>
        </div>

        <div className="auth-form">
          <div className="auth-form-field">
            <div className="auth-phone-input-container">
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d+]/g, '');
                  setWhatsappNumber(value);
                }}
                placeholder="+1234567890"
                className="auth-phone-input"
                style={{ paddingLeft: '16px' }}
                inputMode="tel"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && isValidPhoneNumber(normalizePhoneNumber(whatsappNumber))) {
                    handleSubmit();
                  }
                }}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
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

          <a
            href="/login"
            className="auth-sign-in-link"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
          >
            Already have an account? Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
