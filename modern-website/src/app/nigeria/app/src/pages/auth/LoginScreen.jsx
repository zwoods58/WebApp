import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { useAuthStore } from '../../store/authStore';
import { useCountryStore } from '../../store/countryStore.js';
import { validatePhoneNumber } from '../../utils/phoneValidation';
import { formatPhoneNumber, normalizePhoneNumber } from '../../utils/phoneFormatter';
import toast from 'react-hot-toast';
import { pinVault } from '../../utils/pinVault';
import { AuthService } from '../../services/AuthService';
import PinLogin from '../../components/PinLogin';
import PinSetup from '../../components/PinSetup';
import RecoveryLogin from '../../components/RecoveryLogin';
import { Phone, ArrowRight, Loader2, Lock } from 'lucide-react';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [formattedWhatsapp, setFormattedWhatsapp] = useState('');
  const [loginStage, setLoginStage] = useState('phone_entry'); // 'phone_entry', 'pin_setup', 'pin_login', 'recovery'
  const [isInitializing, setIsInitializing] = useState(true);
  const [remoteAuthData, setRemoteAuthData] = useState(null);
  const { userCountry, getCountryByCode } = useCountryStore();

  const loadLastWhatsapp = async () => {
    try {
      let lastPhone = localStorage.getItem('lastWhatsapp') || localStorage.getItem('beezee_whatsapp');

      // Check persisted auth state if simple keys are missing
      if (!lastPhone) {
        try {
          const authStorage = localStorage.getItem('beezee-ng-auth');
          if (authStorage) {
            const parsed = JSON.parse(authStorage);
            if (parsed.state?.user?.phone) {
              lastPhone = parsed.state.user.phone;
            }
          }
        } catch (e) {
          console.warn('Failed to parse auth storage', e);
        }
      }

      // Check for User ID (Deepest Persistence)
      if (!lastPhone) {
        const userId = localStorage.getItem('beezee_user_id');
        if (userId) {
          try {
            // We have an ID but lost phone number - fetch it!
            const { data: userData } = await supabase
              .from('users')
              .select('phone_number')
              .eq('id', userId)
              .single();

            if (userData?.phone_number) {
              lastPhone = userData.phone_number;
            }
          } catch (e) {
            console.warn('Failed to recover user from ID', e);
          }
        }
      }

      // Nigeria always uses PIN login - no phone entry screen
      // Always show PIN login for Nigeria users
      if (lastPhone) {
        const formatted = formatPhoneNumber(lastPhone);
        setWhatsappNumber(lastPhone.replace('+', ''));
        setFormattedWhatsapp(formatted);
      } else {
        // Fallback: Use a default phone number for testing
        setWhatsappNumber('8023456789');
        setFormattedWhatsapp('+234 802 345 6789');
      }
      setLoginStage('pin_login');
    } catch (error) {
      console.error('Error loading last session:', error);
      // Fallback to phone entry if anything goes wrong
    }
  };

  useEffect(() => {
    const initialize = async () => {
      // Check for active session first
      const sessionToken = localStorage.getItem('session_token');
      if (sessionToken) {
        const session = await AuthService.verifySession(sessionToken);
        if (session && session.authenticated) {
          const { setUser } = useAuthStore.getState();
          setUser({
            id: session.user.id,
            phone: session.user.phone_number,
            user_metadata: {
              full_name: session.user.full_name,
              business_name: session.user.business_name,
              country: session.user.country
            }
          });
          navigate('/dashboard');
          return;
        }
      }

      await loadLastWhatsapp();
      setIsInitializing(false);
    };
    initialize();
  }, [navigate]);

  const handlePhoneChange = (value) => {
    setWhatsappNumber(value);
    const formatted = formatPhoneNumber(value);
    setFormattedWhatsapp(formatted);
  };

  const handlePinSet = async ({ secretKey, phoneNumber, recoveryWords }) => {
    try {
      setLoading(true);

      // Get current country configuration
      const currentCountry = getCountryByCode(userCountry?.code || 'NG');

      // Upsert user in Supabase (Update if exists, Insert if new)
      const { data, error } = await supabase
        .from('users')
        .upsert({
          phone_number: phoneNumber,
          country_code: currentCountry.code,
          full_name: 'User', // Will be updated during onboarding if new
          preferred_language: currentCountry.languages?.find(lang => lang.default)?.code || 'en',
          phone_verified: true,
          encrypted_pin: secretKey.encrypted || secretKey,
          onboarding_completed: true,
          last_login: new Date().toISOString()
        }, { onConflict: 'phone_number' })
        .select()
        .single();

      if (error) {
        toast.error('Failed to update account. Please try again.');
        console.error('Supabase error:', error);
        return;
      }

      // Update auth store
      const { setUser } = useAuthStore.getState();
      setUser({
        id: data.id,
        phone: phoneNumber,
        user_metadata: {
          country_code: currentCountry.code,
          recovery_words: recoveryWords
        }
      });

      toast.success('Security PIN set successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Setup error:', error);
      toast.error('Setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async ({ phoneNumber, user }) => {
    try {
      // Use user data from login response - no need to query database again
      console.log('Using user data from login response:', user);

      // Update auth store with data from login response
      const { setUser } = useAuthStore.getState();
      setUser({
        id: user.id,
        phone: user.phoneNumber,
        user_metadata: {
          country_code: userCountry?.code || 'NG',
          full_name: user.fullName,
          business_name: user.businessName,
          country: user.country,
          is_verified: user.isVerified
        }
      });

      // Store session token from login response
      if (user.session && user.session.token) {
        localStorage.setItem('session_token', user.session.token);
        localStorage.setItem('refresh_token', user.session.refreshToken);
      }

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const handlePhoneSubmit = async () => {
    const fullWhatsapp = normalizePhoneNumber(whatsappNumber);

    // Validate using detected country's phone validation
    const validation = validatePhoneNumber(fullWhatsapp, userCountry?.code || 'NG');
    if (!validation.isValid) {
      toast.error(validation.error || 'Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      const activeCountry = useCountryStore.getState().activeCountry;
      const countryCode = activeCountry?.dialCode || '+234';

      // Main check: Does this user exist in our new auth system?
      const { data: businessUser, error: userError } = await supabase
        .from('business_users')
        .select('id, phone_number')
        .eq('phone_number', fullWhatsapp)
        .maybeSingle();

      // Store phone number for next time
      localStorage.setItem('lastWhatsapp', fullWhatsapp);
      setLoginStage('pin_login');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPin = () => {
    setLoginStage('recovery');
  };

  const handleRecoverySuccess = () => {
    // After successful recovery and PIN reset, go back to PIN login
    toast.success('PIN reset successfully! Please log in with your new PIN.');
    setLoginStage('pin_login');
  };

  const handleSwitchAccount = () => {
    setLoginStage('phone_entry');
    setWhatsappNumber('');
    setFormattedWhatsapp('');
    setRemoteAuthData(null);
    localStorage.removeItem('lastWhatsapp');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-400 to-primary-600 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-4xl">🐝</span>
          </div>
          <Loader2 className="animate-spin text-white mx-auto mb-4" size={32} />
          <p className="text-white font-medium">Securing your connection...</p>
        </div>
      </div>
    );
  }

  // Unified Layout Wrapper
  const renderCardContent = () => {
    switch (loginStage) {
      case 'pin_setup':
        return (
          <PinSetup
            onPinSet={handlePinSet}
            phoneNumber={normalizePhoneNumber(whatsappNumber)}
            countryName={userCountry?.name || 'Nigeria'}
          />
        );
      case 'pin_login': {
        // FIXED: Get the full normalized phone number
        const fullPhone = normalizePhoneNumber(whatsappNumber);
        const activeCountry = useCountryStore.getState().activeCountry;
        const countryCode = activeCountry?.dialCode || '+234';

        // Extract just the local number (remove country code)
        const localPhone = fullPhone.startsWith(countryCode)
          ? fullPhone.substring(countryCode.length)
          : fullPhone.replace(/^\+\d{1,4}/, ''); // Remove any country code

        console.log('PIN Login Data:', {
          whatsappNumber,
          fullPhone,
          countryCode,
          localPhone,
          localPhoneLength: localPhone.length
        });

        return (
          <PinLogin
            onLoginSuccess={handleLoginSuccess}
            phoneNumber={localPhone}
            countryCode={countryCode}
            countryName={userCountry?.name || 'Nigeria'}
            remoteAuthData={remoteAuthData}
            onForgotPin={handleForgotPin}
            onSwitchAccount={handleSwitchAccount}
          />
        );
      }
      case 'recovery':
        return (
          <RecoveryLogin
            phoneNumber={normalizePhoneNumber(whatsappNumber)}
            onSuccess={handleRecoverySuccess}
            onBack={() => setLoginStage('pin_login')}
          />
        );
      default:
        return (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-primary">Welcome</h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="whatsapp"
                    type="tel"
                    value={formattedWhatsapp}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+234 802 345 678"
                    className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                    disabled={loading}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && whatsappNumber.length >= 7) {
                        handlePhoneSubmit();
                      }
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handlePhoneSubmit}
                disabled={loading || whatsappNumber.length < 7}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Checking...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2" size={20} />
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/onboarding')}
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-400 to-primary-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand (Always visible) */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🐝</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">BeeZee Finance</h1>
          <p className="text-primary-100">Manage your business finances with ease</p>
        </div>

        {renderCardContent()}

        {/* Trial Info */}
        <div className="mt-6 text-center text-white text-sm">
          <p>
            7-day free trial • NGN 600/week after trial
          </p>
        </div>
      </div>
    </div>
  );
}