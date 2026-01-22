import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { recoveryPhrase } from '../utils/recoveryPhrase';
import { pinVault } from '../utils/pinVault';
import toast from 'react-hot-toast';
import { Loader2, ArrowRight, Key, AlertTriangle } from 'lucide-react';

export default function RecoveryLogin({ phoneNumber, onSuccess, onBack }) {
    const [recoveryWords, setRecoveryWords] = useState(Array(12).fill(''));
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [recoveryVerified, setRecoveryVerified] = useState(false);

    // New PIN state
    const [newPin, setNewPin] = useState(['', '', '', '']);
    const [confirmNewPin, setConfirmNewPin] = useState(['', '', '', '']);

    const handleWordChange = (index, value) => {
        const newWords = [...recoveryWords];
        newWords[index] = value.toLowerCase().trim();
        setRecoveryWords(newWords);
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const words = pastedText.trim().toLowerCase().split(/\s+/);

        if (words.length === 12) {
            setRecoveryWords(words);
            toast.success('Recovery phrase pasted successfully');
        } else {
            toast.error(`Please paste exactly 12 words (got ${words.length})`);
        }
    };

    const handleVerifyRecoveryPhrase = async () => {
        try {
            setVerifying(true);

            // Validate phrase format
            const phraseText = recoveryWords.join(' ');
            const validation = recoveryPhrase.validatePhrase(phraseText);
            if (!validation.valid) {
                toast.error(validation.error);
                return;
            }

            // Fetch user's recovery phrase from Supabase
            const { data: userData, error } = await supabase
                .from('users')
                .select('recovery_phrase, phrase_salt')
                .eq('phone_number', phoneNumber)
                .single();

            if (error || !userData) {
                toast.error('Account not found');
                return;
            }

            if (!userData.recovery_phrase || !userData.phrase_salt) {
                toast.error('No recovery phrase found for this account');
                return;
            }

            // Verify the phrase
            const verifyResult = recoveryPhrase.verifyRemotePhrase(
                phraseText,
                userData.recovery_phrase,
                userData.phrase_salt
            );

            if (verifyResult.success) {
                toast.success('Recovery phrase verified! Now set a new PIN.');
                setRecoveryVerified(true);
            } else {
                toast.error(verifyResult.error || 'Recovery phrase does not match');
            }
        } catch (error) {
            console.error('Recovery verification error:', error);
            toast.error('Failed to verify recovery phrase');
        } finally {
            setVerifying(false);
        }
    };

    const handlePinChange = (index, value, isConfirm = false) => {
        const newValue = value.slice(-1);
        if (!/^\d*$/.test(newValue)) return;

        const pinArray = isConfirm ? [...confirmNewPin] : [...newPin];
        pinArray[index] = newValue;

        if (isConfirm) {
            setConfirmNewPin(pinArray);
        } else {
            setNewPin(pinArray);
        }

        // Auto-focus next input
        if (newValue && index < 3) {
            const nextInput = document.getElementById(
                `${isConfirm ? 'confirm-' : ''}pin-${index + 1}`
            );
            if (nextInput) nextInput.focus();
        }
    };

    const handleResetPin = async () => {
        const newPinValue = newPin.join('');
        const confirmPinValue = confirmNewPin.join('');

        if (newPinValue.length !== 4) {
            toast.error('Please enter a 4-digit PIN');
            return;
        }

        if (newPinValue !== confirmPinValue) {
            toast.error('PINs do not match');
            return;
        }

        try {
            setLoading(true);

            // Validate PIN strength
            const validation = pinVault.validatePIN(newPinValue);
            if (!validation.valid) {
                toast.error(validation.error);
                return;
            }

            // Encrypt the new PIN
            const pinResult = pinVault.encryptSecret('user_secret', newPinValue);
            if (!pinResult.success) {
                toast.error('Failed to encrypt PIN');
                return;
            }

            // Update PIN in Supabase
            const { error } = await supabase
                .from('users')
                .update({
                    encrypted_pin: pinResult.encrypted,
                    pin_salt: pinResult.salt,
                    updated_at: new Date().toISOString(),
                })
                .eq('phone_number', phoneNumber);

            if (error) {
                throw error;
            }

            toast.success('PIN reset successfully! You can now log in with your new PIN.');
            onSuccess?.();
        } catch (error) {
            console.error('PIN reset error:', error);
            toast.error('Failed to reset PIN');
        } finally {
            setLoading(false);
        }
    };

    if (recoveryVerified) {
        // Step 2: Set New PIN
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto">
                <div>
                    <div className="text-center mb-8">
                        <Key className="text-blue-600 mx-auto mb-4" size={32} />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Set New PIN</h2>
                        <p className="text-gray-600 text-sm">Create a new 4-digit PIN for your account</p>
                    </div>

                    <div className="auth-form-field">
                        <label className="auth-form-label">New PIN</label>
                        <div className="pin-input-container">
                            {newPin.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`pin-${index}`}
                                    type="password"
                                    value={digit}
                                    onChange={(e) => handlePinChange(index, e.target.value)}
                                    className="pin-input"
                                    maxLength={1}
                                    inputMode="numeric"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="auth-form-field">
                        <label className="auth-form-label">Confirm New PIN</label>
                        <div className="pin-input-container">
                            {confirmNewPin.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`confirm-pin-${index}`}
                                    type="password"
                                    value={digit}
                                    onChange={(e) => handlePinChange(index, e.target.value, true)}
                                    className="pin-input"
                                    maxLength={1}
                                    inputMode="numeric"
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleResetPin}
                        disabled={loading || newPin.join('').length !== 4 || confirmNewPin.join('').length !== 4}
                        className="auth-cta-button"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Resetting PIN...
                            </>
                        ) : (
                            <>
                                Reset PIN
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    // Step 1: Enter Recovery Phrase
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto">
            <div>
                <div className="text-center mb-8">
                    <Key className="text-blue-600 mx-auto mb-4" size={32} />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Recover Your Account</h2>
                    <p className="text-gray-600 text-sm">Enter your 12-word recovery phrase</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="text-amber-600 mt-0.5 flex-shrink-0" size={20} />
                        <div>
                            <p className="text-amber-800 text-sm font-medium mb-1">Important</p>
                            <p className="text-amber-700 text-xs">
                                Enter the 12-word recovery phrase you were given when you created your account.
                                The words must be in the correct order.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    {recoveryWords.map((word, index) => (
                        <div key={index} className="auth-form-field">
                            <label className="auth-form-label text-xs">{index + 1}</label>
                            <input
                                type="text"
                                value={word}
                                onChange={(e) => handleWordChange(index, e.target.value)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                className="description-input text-sm"
                                placeholder={`Word ${index + 1}`}
                                autoFocus={index === 0}
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleVerifyRecoveryPhrase}
                    disabled={verifying || recoveryWords.some(w => !w)}
                    className="auth-cta-button"
                >
                    {verifying ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Verifying...
                        </>
                    ) : (
                        <>
                            Verify Recovery Phrase
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>

                {onBack && (
                    <button
                        onClick={onBack}
                        className="w-full mt-3 text-gray-600 hover:text-gray-800 text-sm"
                    >
                        Back to Login
                    </button>
                )}
            </div>
        </div>
    );
}
