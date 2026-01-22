import { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, AlertCircle, RefreshCw } from 'lucide-react';
import { pinVault } from '../utils/pinVault';
import toast from 'react-hot-toast';
import { supabase } from '../utils/supabase';
import { normalizePhoneNumber } from '../utils/phoneFormatter';
import { AuthService } from '../services/AuthService';
import { useCountryStore } from '../store/countryStore.js';

export default function PinLogin({ onLoginSuccess, phoneNumber, countryCode, countryName, remoteAuthData, onForgotPin, onSwitchAccount }) {
  const [pin, setPin] = useState(['', '', '', '', '', '']); // FIXED: Changed from 8 to 6
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutInfo, setLockoutInfo] = useState(null);
  const [currentRemoteData, setCurrentRemoteData] = useState(remoteAuthData);
  const [isFetchingData, setIsFetchingData] = useState(!remoteAuthData && !!phoneNumber);

  useEffect(() => {
    // Check browser compatibility
    const browserCheck = pinVault.detectBrowserSupport();
    if (!browserCheck.supported) {
      toast.error(browserCheck.message, { duration: 10000 });
    }

    const fetchRemoteData = async () => {
      if (!currentRemoteData && phoneNumber) {
        try {
          setIsFetchingData(true);
          // Don't query database directly - use AuthService instead
          // Just set currentRemoteData if we have it (for existing users)
          setCurrentRemoteData({
            encrypted: 'existing_user_encrypted_pin',
            salt: 'existing_user_pin_salt',
            userId: 'existing_user_id'
          });
        } catch (err) {
          console.error('Fetch remote data failed:', err);
        } finally {
          setIsFetchingData(false);
        }
      } else {
        setIsFetchingData(false);
      }
    };

    fetchRemoteData();
  }, [phoneNumber, currentRemoteData]);

  const handlePinChange = (index, value) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-login-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '') {
      // Move to previous input
      const prevInput = document.getElementById(`pin-login-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.split('');

    if (digits.length === 6 && /^\d{6}$/.test(pastedData)) {
      setPin(digits);
    }
  };

  const handleLogin = async () => {
    const fullPin = pin.join('');

    if (fullPin.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);

    try {
      // Use the phoneNumber and countryCode passed as props
      console.log('PinLogin handleLogin:', {
        phoneNumber,
        countryCode,
        pinLength: fullPin.length
      });

      const loginData = await AuthService.login(phoneNumber, countryCode, fullPin);

      if (loginData.success) {
        toast.success('Login successful!');
        // Pass the full phone number with country code back
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;
        onLoginSuccess({
          phoneNumber: fullPhoneNumber,
          user: loginData.user
        });
      } else {
        toast.error(loginData.error || 'Login failed');
        // Clear PIN inputs on error
        setPin(['', '', '', '', '', '']);
        // Focus first input
        const firstInput = document.getElementById('pin-login-0');
        if (firstInput) firstInput.focus();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecovery = () => {
    if (onForgotPin) {
      onForgotPin();
    } else {
      // Fallback: Navigate to recovery page
      window.location.href = '/recover-account';
    }
  };

  const handleInputClick = (inputId) => {
    document.getElementById(inputId).focus();
  };

  // Add haptic feedback (if available)
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50); // 50ms vibration
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full border border-white/20">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 transform rotate-3">
          <Shield className="w-10 h-10 text-white transform -rotate-3" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600">
          Enter your 6-digit PIN to login
        </p>
      </div>

      {/* Lockout Warning */}
      {lockoutInfo && (
        <div className="mb-8 p-5 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-semibold text-base">{lockoutInfo.message}</p>
              {lockoutInfo.type === 'lockout' && (
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 flex items-center text-red-600 hover:text-red-700 text-sm font-bold bg-white px-4 py-2 rounded-xl shadow-sm transition-all active:scale-95"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PIN Input */}
      {!lockoutInfo && (
        <div className="space-y-8">
          <div>
            <div className="flex justify-center space-x-2 sm:space-x-3">
              {pin.map((digit, index) => (
                <input
                  key={`pin-${index}`}
                  id={`pin-login-${index}`}
                  type={showPin ? 'text' : 'password'}
                  value={digit}
                  onChange={(e) => {
                    handlePinChange(index, e.target.value);
                    triggerHaptic();
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  onClick={() => triggerHaptic()}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold text-center bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
                  maxLength={1}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          {/* Show/Hide PIN Toggle */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                setShowPin(!showPin);
                triggerHaptic();
              }}
              className="group flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-all font-medium py-2 px-4 rounded-xl hover:bg-blue-50"
              disabled={isLoading}
            >
              {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              <span className="text-sm">{showPin ? 'Hide PIN' : 'Show PIN'}</span>
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={pin.some(digit => digit === '') || isLoading}
              className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-500/40 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center text-lg shadow-blue-500/20 shadow-xl"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              ) : (
                <Shield className="w-6 h-6 mr-3" />
              )}
              {isLoading ? 'Verifying...' : 'Unlock Account'}
            </button>

            {/* Links */}
            <div className="flex flex-col space-y-4 items-center pt-2">
              <button
                onClick={handleRecovery}
                className="text-blue-600 hover:text-indigo-700 text-sm font-bold transition-colors py-2"
                disabled={isLoading}
              >
                Forgot your PIN?
              </button>

              {onSwitchAccount && (
                <button
                  onClick={onSwitchAccount}
                  className="text-gray-500 hover:text-gray-700 text-xs font-semibold transition-colors flex items-center"
                  disabled={isLoading}
                >
                  Sign in with a different number
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}