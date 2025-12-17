import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import toast from 'react-hot-toast';
import { Phone } from 'lucide-react';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    setLoading(true);

    try {
      // Format phone number for South Africa (+27)
      const formattedPhone = phoneNumber.startsWith('+')
        ? phoneNumber
        : phoneNumber.startsWith('0')
        ? `+27${phoneNumber.slice(1)}`
        : `+27${phoneNumber}`;

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          channel: 'sms',
        },
      });

      if (error) throw error;

      toast.success('Verification code sent!');
      navigate('/verify-otp', { state: { phone: formattedPhone } });
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-400 to-primary-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🐝</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">BeeZee Finance</h1>
          <p className="text-primary-100">Manage your business finances with ease</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={20} className="text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0812345678"
                  className="input pl-10"
                  disabled={loading}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Enter your South African phone number
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-lg"
            >
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-500 font-medium hover:text-primary-600">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Trial Info */}
        <div className="mt-6 text-center text-white text-sm">
          <p>7-day free trial • R55.50/month after trial</p>
        </div>
      </div>
    </div>
  );
}


