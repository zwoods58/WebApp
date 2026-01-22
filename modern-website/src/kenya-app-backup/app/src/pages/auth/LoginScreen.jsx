import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { useAuthStore } from '../../store/authStore';
import { useCountryStore } from '../../store/countryStore.js';
import { validatePhoneNumber } from '../../utils/phoneValidation';
import { formatPhoneNumber, normalizePhoneNumber } from '../../utils/phoneFormatter';
import toast from 'react-hot-toast';
import { AuthService } from '../../services/AuthService';
import PinLogin from '../../components/PinLogin';
import RecoveryLogin from '../../components/RecoveryLogin';
import { Phone, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [formattedWhatsapp, setFormattedWhatsapp] = useState('');
  const [loginStage, setLoginStage] = useState('phone_entry'); // 'phone_entry', 'pin_login', 'recovery'
  const [isInitializing, setIsInitializing] = useState(true);
  const { userCountry } = useCountryStore();
  const { setSession } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      // Check for active session using the new V2 verifySession (with auto-refresh)
      const res = await AuthService.verifySession();
      if (res.success && res.user) {
        setSession({ user: res.user });
        navigate('/dashboard');
        return;
      }

      await loadLastWhatsapp();
      setIsInitializing(false);
    };
    initialize();
  }, []);

  const loadLastWhatsapp = async () => {
    let lastPhone = localStorage.getItem('lastWhatsapp') || localStorage.getItem('beezee_whatsapp');

    if (lastPhone) {
      const formatted = formatPhoneNumber(lastPhone);
      setWhatsappNumber(lastPhone.replace('+', ''));
      setFormattedWhatsapp(formatted);
      setLoginStage('pin_login');
    }
  };

  const handlePhoneChange = (value) => {
    setWhatsappNumber(value);
    const formatted = formatPhoneNumber(value);
    setFormattedWhatsapp(formatted);
  };

  const handleLoginSuccess = ({ user }) => {
    // AuthService._storeTokens was already called inside AuthService.login
    setSession({ user });
    toast.success('Welcome back! 🎉');
    navigate('/dashboard');
  };

  const handlePhoneSubmit = async () => {
    const fullPhone = normalizePhoneNumber(whatsappNumber);
    const validation = validatePhoneNumber(fullPhone, userCountry?.code || 'KE');

    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid phone number');
      return;
    }

    setLoading(true);
    try {
      // Check if user exists in V2 system
      const { data: businessUser } = await supabase
        .from('business_users')
        .select('id')
        .eq('phone_number', fullPhone)
        .maybeSingle();

      localStorage.setItem('lastWhatsapp', fullPhone);

      if (businessUser) {
        setLoginStage('pin_login');
      } else {
        // Not in V2 system - Hard Cutoff: Send to onboarding
        toast.info('Welcome! Please complete your account setup.');
        navigate('/onboarding', { state: { whatsappNumber: fullPhone } });
      }
    } catch (error) {
      toast.error('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchAccount = () => {
    setLoginStage('phone_entry');
    setWhatsappNumber('');
    setFormattedWhatsapp('');
    localStorage.removeItem('lastWhatsapp');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-400 to-primary-600 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  const renderContent = () => {
    switch (loginStage) {
      case 'pin_login':
        return (
          <PinLogin
            onLoginSuccess={handleLoginSuccess}
            phoneNumber={whatsappNumber}
            onForgotPin={() => setLoginStage('recovery')}
            onSwitchAccount={handleSwitchAccount}
          />
        );
      case 'recovery':
        return (
          <RecoveryLogin
            phoneNumber={whatsappNumber}
            onSuccess={() => setLoginStage('pin_login')}
            onBack={() => setLoginStage('pin_login')}
          />
        );
      default:
        return (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>
            <div className="space-y-6">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={formattedWhatsapp}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="+254 712 345 678"
                  className="auth-phone-input pl-10"
                />
              </div>

              <button
                onClick={handlePhoneSubmit}
                disabled={loading || whatsappNumber.length < 7}
                className="auth-cta-button"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Continue <ArrowRight size={20} /></>}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-400 to-primary-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🐝</div>
          <h1 className="text-3xl font-bold text-white mb-2">BeeZee Finance</h1>
          <p className="text-primary-100">Kenya's Secure Business Wallet</p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
