import { useState } from 'react';
import { AuthService } from '../services/AuthService';
import { useCountryStore } from '../store/countryStore';
import toast from 'react-hot-toast';
import { Loader2, ArrowRight, Key, AlertTriangle, Smartphone, Mail, Lock, ShieldCheck } from 'lucide-react';

export default function RecoveryLogin({ phoneNumber, onSuccess, onBack }) {
    const [step, setStep] = useState(1); // 1: Request, 2: Verify Codes, 3: Set PIN
    const [loading, setLoading] = useState(false);

    // Recovery Data
    const [smsCode, setSmsCode] = useState('');
    const [emailCode, setEmailCode] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPin, setNewPin] = useState(['', '', '', '', '', '']);
    const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);

    const activeCountry = useCountryStore.getState().activeCountry;

    // --- Step 1: Request Recovery Codes ---
    const handleRequestRecovery = async () => {
        setLoading(true);
        try {
            const countryCode = activeCountry?.dialCode || '+27';
            const localPhone = phoneNumber.replace(countryCode.replace('+', ''), '');

            const res = await AuthService.requestRecovery(localPhone, activeCountry?.code || 'ZA');
            if (res.success) {
                toast.success('Recovery codes sent! 🛡️');
                setStep(2);
            } else {
                toast.error(res.error || 'Recovery request failed');
            }
        } catch (err) {
            toast.error('Failed to initiate recovery');
        } finally {
            setLoading(false);
        }
    };

    // --- Step 2: Verify Codes & Reset PIN ---
    const handleResetSubmit = async () => {
        const pinVal = newPin.join('');
        const confirmVal = confirmPin.join('');

        if (smsCode.length !== 6 || emailCode.length !== 6) {
            toast.error('Enter both 6-digit codes');
            return;
        }
        if (!securityAnswer.trim()) {
            toast.error('Enter your business name (security answer)');
            return;
        }
        if (pinVal.length !== 6 || pinVal !== confirmVal) {
            toast.error('PINs must match and be 6 digits');
            return;
        }

        setLoading(true);
        try {
            const countryCode = activeCountry?.dialCode || '+27';
            const localPhone = phoneNumber.replace(countryCode.replace('+', ''), '');

            const res = await AuthService.completeRecovery(
                localPhone,
                activeCountry?.code || 'ZA',
                smsCode,
                emailCode,
                securityAnswer.trim(),
                pinVal,
                confirmVal
            );

            if (res.success) {
                toast.success('Account recovered! Please login with your new PIN.');
                onSuccess();
            } else {
                toast.error(res.error || 'Recovery failed. Check your codes and answer.');
            }
        } catch (err) {
            toast.error('An error occurred during recovery');
        } finally {
            setLoading(false);
        }
    };

    // Helper for PIN inputs
    const handlePinInput = (index, val, isConfirm = false) => {
        const digit = val.slice(-1);
        if (isConfirm) {
            const next = [...confirmPin];
            next[index] = digit;
            setConfirmPin(next);
            if (digit && index < 5) document.getElementById(`recover-confirm-${index + 1}`).focus();
        } else {
            const next = [...newPin];
            next[index] = digit;
            setNewPin(next);
            if (digit && index < 5) document.getElementById(`recover-pin-${index + 1}`).focus();
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="text-orange-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Account Recovery</h2>
                <p className="text-gray-600 text-sm">Securely reset your access in South Africa</p>
            </div>

            {step === 1 && (
                <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
                        <AlertTriangle className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                        <p className="text-sm text-blue-800">
                            We will send verification codes to your phone and backup email to verify your identity.
                        </p>
                    </div>
                    <button onClick={handleRequestRecovery} disabled={loading} className="auth-cta-button bg-orange-600 hover:bg-orange-700 w-full flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : <>Request Recovery Codes <ArrowRight /></>}
                    </button>
                    <button onClick={onBack} className="w-full text-gray-500 text-sm">Back to Login</button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    {/* OTP Inputs */}
                    <div className="space-y-4">
                        <div className="auth-form-field">
                            <label className="auth-form-label flex items-center gap-2">
                                <Smartphone size={16} /> SMS Code
                            </label>
                            <input
                                type="text"
                                value={smsCode}
                                onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                className="description-input text-center tracking-widest font-bold"
                            />
                        </div>

                        <div className="auth-form-field">
                            <label className="auth-form-label flex items-center gap-2">
                                <Mail size={16} /> Email Code
                            </label>
                            <input
                                type="text"
                                value={emailCode}
                                onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                className="description-input text-center tracking-widest font-bold"
                            />
                        </div>

                        <div className="auth-form-field">
                            <label className="auth-form-label flex items-center gap-2">
                                <Lock size={16} /> Security Answer (Business Name)
                            </label>
                            <input
                                type="text"
                                value={securityAnswer}
                                onChange={(e) => setSecurityAnswer(e.target.value)}
                                placeholder="e.g. Jozi Market"
                                className="description-input"
                            />
                        </div>
                    </div>

                    <div className="auth-form-field">
                        <label className="auth-form-label text-center block mb-2">New 6-Digit PIN</label>
                        <div className="flex justify-center gap-2">
                            {newPin.map((d, i) => (
                                <input key={i} id={`recover-pin-${i}`} type="password" value={d} onChange={(e) => handlePinInput(i, e.target.value)} className="w-10 h-12 border-2 rounded-lg text-center font-bold text-xl" maxLength={1} inputMode="numeric" />
                            ))}
                        </div>
                    </div>

                    <div className="auth-form-field">
                        <label className="auth-form-label text-center block mb-2">Confirm New PIN</label>
                        <div className="flex justify-center gap-2">
                            {confirmPin.map((d, i) => (
                                <input key={i} id={`recover-confirm-${i}`} type="password" value={d} onChange={(e) => handlePinInput(i, e.target.value, true)} className="w-10 h-12 border-2 rounded-lg text-center font-bold text-xl" maxLength={1} inputMode="numeric" />
                            ))}
                        </div>
                    </div>

                    <button onClick={handleResetSubmit} disabled={loading} className="auth-cta-button w-full flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : <>Recover Account <Lock /></>}
                    </button>
                    <button onClick={() => setStep(1)} className="w-full text-gray-500 text-sm">Resend Codes</button>
                </div>
            )}
        </div>
    );
}
