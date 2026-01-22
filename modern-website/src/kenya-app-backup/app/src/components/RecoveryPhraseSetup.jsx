import { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Copy, Check, AlertTriangle, Key } from 'lucide-react';
import { recoveryPhrase } from '../utils/recoveryPhrase';
import toast from 'react-hot-toast';

export default function RecoveryPhraseSetup({ onPhraseConfirmed, countryName }) {
  const [phrase, setPhrase] = useState('');
  const [words, setWords] = useState([]);
  const [showPhrase, setShowPhrase] = useState(false);
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1); // 1: Generate, 2: Confirm Backup, 3: Complete

  useEffect(() => {
    generatePhrase();
  }, []);

  const generatePhrase = async () => {
    setIsGenerating(true);
    try {
      const result = recoveryPhrase.generatePhrase();
      if (result.success) {
        setPhrase(result.phrase);
        setWords(result.words);
        
        // Store phrase (unconfirmed initially)
        await recoveryPhrase.storePhrase(result.phrase, false);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to generate recovery phrase');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(phrase);
      setCopied(true);
      toast.success('Recovery phrase copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const confirmBackup = () => {
    if (!userConfirmed) {
      toast.error('Please confirm you have safely stored your recovery phrase');
      return;
    }

    const result = recoveryPhrase.confirmBackup();
    if (result.success) {
      setStep(3);
      onPhraseConfirmed?.();
      toast.success('Recovery phrase secured successfully');
    } else {
      toast.error(result.error);
    }
  };

  const regeneratePhrase = () => {
    if (confirm('Are you sure you want to generate a new recovery phrase? The current one will be replaced.')) {
      generatePhrase();
      setUserConfirmed(false);
      setStep(1);
    }
  };

  const instructions = recoveryPhrase.getRecoveryInstructions();

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating secure recovery phrase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Key className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Account Recovery Setup
          </h1>
          <p className="text-gray-600">
            Secure your {countryName} business account with a recovery phrase
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800">Important Security Notice</h3>
                  <p className="text-amber-700 text-sm mt-1">
                    This recovery phrase is the ONLY way to recover your account if you forget your PIN.
                    Store it safely offline and never share it with anyone.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Recovery Phrase</h3>
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {words.map((word, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-white px-3 py-2 rounded border">
                      <span className="text-sm font-medium text-gray-500 w-4">{index + 1}</span>
                      <span className="font-mono text-sm">
                        {showPhrase ? word : '•'.repeat(word.length)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowPhrase(!showPhrase)}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    {showPhrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{showPhrase ? 'Hide' : 'Show'} Phrase</span>
                  </button>
                  
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">How to Store Safely:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {instructions.steps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={regeneratePhrase}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Generate New Phrase
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                I've Written It Down
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Final Confirmation</h3>
              <p className="text-yellow-700 text-sm">
                Please confirm that you have safely stored your recovery phrase in a secure location.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userConfirmed}
                  onChange={(e) => setUserConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">
                  I have written down my 12-word recovery phrase and stored it in a safe, private place.
                  I understand that this phrase is the only way to recover my account if I forget my PIN.
                </span>
              </label>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <h4 className="font-semibold text-red-800 mb-2">Critical Warnings:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {instructions.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-red-600 mt-0.5">⚠</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Go Back
              </button>
              <button
                onClick={confirmBackup}
                disabled={!userConfirmed}
                className={`flex-1 px-4 py-3 rounded-lg font-medium ${
                  userConfirmed
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Confirm & Complete Setup
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Complete!</h2>
              <p className="text-gray-600">
                Your recovery phrase has been secured. Your {countryName} business account is now protected.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-green-800 mb-2">What's Next:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Your PIN will be required to access sensitive features</li>
                <li>• Use your recovery phrase if you ever forget your PIN</li>
                <li>• Keep your recovery phrase safe and offline</li>
                <li>• Never share your recovery phrase with anyone</li>
              </ul>
            </div>

            <button
              onClick={() => onPhraseConfirmed?.()}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Continue to App
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
