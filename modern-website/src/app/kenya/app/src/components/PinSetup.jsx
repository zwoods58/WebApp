import { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Check, X } from 'lucide-react';
import { pinVault } from '../utils/pinVault';
import { recoveryPhrase } from '../utils/recoveryPhrase';
import toast from 'react-hot-toast';

export default function PinSetup({ onPinSet, phoneNumber, countryName }) {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: PIN, 2: Confirm
  const [pinStrength, setPinStrength] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);

  useEffect(() => {
    // Request persistent storage
    pinVault.requestPersistentStorage();

    // Check browser compatibility
    const browserCheck = pinVault.detectBrowserSupport();
    if (!browserCheck.supported) {
      toast.error(browserCheck.message, { duration: 10000 });
    }
  }, []);

  const handlePinChange = (index, value, isConfirm = false) => {
    if (value.length > 1) return;

    const newPin = isConfirm ? [...confirmPin] : [...pin];
    newPin[index] = value;

    if (isConfirm) {
      setConfirmPin(newPin);
    } else {
      setPin(newPin);

      // Check PIN strength when all 6 digits are entered
      if (newPin.every(digit => digit !== '')) {
        const fullPin = newPin.join('');
        const validation = pinVault.validatePIN(fullPin);
        if (validation.valid) {
          setPinStrength(validation.strength);
        } else {
          setPinStrength('Invalid');
          toast.error(validation.message);
        }
      } else {
        setPinStrength('');
      }
    }
  };

  const handleKeyDown = (e, index, isConfirm = false) => {
    if (e.key === 'Backspace' && e.target.value === '') {
      // Move to previous input
      const prevInput = document.getElementById(`pin-${isConfirm ? 'confirm' : 'setup'}-${index - 1}`);
      if (prevInput) prevInput.focus();
    }

    // Auto-focus next input
    if (e.target.value && index < 5) {
      const nextInput = document.getElementById(`pin-${isConfirm ? 'confirm' : 'setup'}-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.split('');

    if (digits.length === 6 && /^\d{6}$/.test(pastedData)) {
      if (currentStep === 1) {
        setPin(digits);
        const validation = pinVault.validatePIN(pastedData);
        if (validation.valid) {
          setPinStrength(validation.strength);
        } else {
          setPinStrength('Invalid');
          toast.error(validation.message);
        }
      } else {
        setConfirmPin(digits);
      }
    }
  };

  const handleNext = () => {
    const fullPin = pin.join('');
    const validation = pinVault.validatePIN(fullPin);

    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    setCurrentStep(2);
  };

  const handleConfirm = async () => {
    const fullPin = pin.join('');
    const fullConfirmPin = confirmPin.join('');

    if (fullPin !== fullConfirmPin) {
      toast.error('PINs do not match. Please try again.');
      setConfirmPin(['', '', '', '', '', '']);
      return;
    }

    setIsSettingUp(true);

    try {
      // Generate recovery phrase for this user
      const phraseResult = recoveryPhrase.generatePhrase();

      if (!phraseResult.success) {
        toast.error('Failed to generate recovery phrase');
        return;
      }

      // Encrypt secret with PIN
      const result = pinVault.encryptSecret('user_secret', fullPin);

      if (result.success) {
        // Store recovery data
        const recoveryWords = generateRecoveryWords();
        localStorage.setItem('beezee_recovery_words', JSON.stringify(recoveryWords));

        toast.success('Security PIN set successfully! Save your recovery words safely.');

        // Call parent callback with all required data
        onPinSet({
          secretKey: result.encrypted, // Use the encrypted secret key from the result
          phoneNumber,
          recoveryWords
        });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error setting up PIN:', error);
      toast.error('Failed to set up security. Please try again.');
    } finally {
      setIsSettingUp(false);
    }
  };

  const generateRecoveryWords = () => {
    const simpleWords = [
      'cow', 'table', 'sun', 'moon', 'star', 'tree', 'water', 'fire', 'stone',
      'book', 'door', 'window', 'chair', 'phone', 'money', 'food', 'house'
    ];

    const shuffled = [...simpleWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  };

  const handleInputClick = (inputId) => {
    document.getElementById(inputId).focus();
  };

  const getStrengthColor = () => {
    switch (pinStrength) {
      case 'Good': return 'text-green-600';
      case 'Too Weak': return 'text-red-600';
      case 'Invalid': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Set Your Security PIN
        </h2>
        <p className="text-gray-600 text-sm">
          Like M-Pesa - 6 digits to protect your {countryName} account
        </p>
      </div>

      {/* Step 1: Set PIN */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Enter 6-digit Security PIN
            </label>
            <div className="flex justify-center space-x-3">
              {pin.map((digit, index) => (
                <input
                  key={`pin-${index}`}
                  id={`pin-setup-${index}`}
                  type={showPin ? 'text' : 'password'}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-14 h-14 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                  maxLength={1}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </div>

            {/* PIN Strength Indicator */}
            {pinStrength && (
              <div className="text-center mt-3">
                <span className={`text-sm font-medium ${getStrengthColor()}`}>
                  PIN Strength: {pinStrength}
                </span>
              </div>
            )}
          </div>

          {/* Show/Hide PIN Toggle */}
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setShowPin(!showPin)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm">{showPin ? 'Hide' : 'Show'} PIN</span>
            </button>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={pin.some(digit => digit === '') || pinStrength === 'Too Weak' || pinStrength === 'Invalid'}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2: Confirm PIN */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Confirm Your Security PIN
            </label>
            <div className="flex justify-center space-x-3">
              {confirmPin.map((digit, index) => (
                <input
                  key={`confirm-${index}`}
                  id={`pin-confirm-${index}`}
                  type={showConfirmPin ? 'text' : 'password'}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value, true)}
                  onKeyDown={(e) => handleKeyDown(e, index, true)}
                  className="w-14 h-14 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                  maxLength={1}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </div>
          </div>

          {/* Show/Hide Confirm PIN Toggle */}
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setShowConfirmPin(!showConfirmPin)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm">{showConfirmPin ? 'Hide' : 'Show'} PIN</span>
            </button>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleConfirm}
              disabled={confirmPin.some(digit => digit === '') || isSettingUp}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSettingUp ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Check className="w-5 h-5 mr-2" />
              )}
              {isSettingUp ? 'Setting Up Security...' : 'Confirm Security PIN'}
            </button>

            <button
              onClick={() => {
                setCurrentStep(1);
                setConfirmPin(['', '', '', '', '', '']);
              }}
              className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <Shield className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Important Security Notice:</p>
            <ul className="space-y-1 text-xs">
              <li>• Never share your 6-digit PIN with anyone</li>
              <li>• Your recovery words will be shown after setup</li>
              <li>• Write down recovery words and keep them safe</li>
              <li>• If you forget your PIN, you'll need recovery words</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
