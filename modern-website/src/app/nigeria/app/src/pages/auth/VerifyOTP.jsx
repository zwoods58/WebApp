import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone;
  const whatsapp = location.state?.whatsapp;
  const isSignup = location.state?.isSignup;

  useEffect(() => {
    if (!phone) {
      navigate('/login');
    }
  }, [phone, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      // If signup, create user profile
      if (isSignup && data.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          phone_number: phone,
          whatsapp_number: whatsapp || phone,
          subscription_status: 'trial',
          trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Continue even if profile creation fails - user can retry
        }
      }

      toast.success('Welcome to BeeZee!');
      navigate('/');
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'sms',
        },
      });

      if (error) throw error;

      toast.success('New code sent!');
      setOtp('');
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-primary-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-white mb-6 flex items-center gap-2 hover:opacity-80"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📱</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
            <p className="text-gray-600">
              We sent a 6-digit code to
              <br />
              <span className="font-medium">{phone}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="input text-center text-2xl tracking-widest font-bold"
                disabled={loading}
                autoFocus
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="btn btn-primary w-full py-3 text-lg"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-primary font-medium hover:text-primary-dark disabled:opacity-50"
            >
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


