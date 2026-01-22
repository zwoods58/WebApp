import { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Building, Wallet, Loader2, CheckCircle } from 'lucide-react';
import DLocalPaymentProcessor from '../utils/dlocal';
import toast from 'react-hot-toast';

export default function DLocalPaymentForm({ 
  countryCode, 
  amount, 
  description, 
  onSuccess, 
  onError,
  planType = 'manual' 
}) {
  const [processor, setProcessor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('CARD');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    document: '',
    phone: ''
  });

  useEffect(() => {
    try {
      const dlocalProcessor = new DLocalPaymentProcessor(countryCode, true);
      setProcessor(dlocalProcessor);
      const methods = dlocalProcessor.getAvailablePaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Failed to initialize D-Local processor:', error);
      toast.error('Payment system initialization failed');
    }
  }, [countryCode]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!processor) {
      toast.error('Payment processor not ready');
      return;
    }

    setLoading(true);

    try {
      const customerInfo = {
        name: formData.name,
        email: formData.email,
        document: formData.document,
        phone: formData.phone
      };

      const result = await processor.processPayment(
        amount,
        description,
        selectedMethod,
        customerInfo
      );

      if (result.requiresRedirect) {
        // The user will be redirected to D-Local's payment page
        toast.success('Redirecting to payment page...');
        // onSuccess will be called when user returns from payment
      } else {
        // Direct payment completed
        toast.success('Payment processed successfully!');
        onSuccess(result.paymentIntent);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error(error.message || 'Payment failed');
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentIcon = (methodType) => {
    switch (methodType) {
      case 'CARD':
        return <CreditCard className="w-5 h-5" />;
      case 'WALLET':
        return <Wallet className="w-5 h-5" />;
      case 'BANK_TRANSFER':
        return <Building className="w-5 h-5" />;
      default:
        return <Smartphone className="w-5 h-5" />;
    }
  };

  if (!processor) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Initializing payment system...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-6 text-center">Complete Your Subscription</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+254700000000"
            />
          </div>

          {countryCode === 'NG' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Number (BVN or NIN)
              </label>
              <input
                type="text"
                name="document"
                value={formData.document}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12345678901"
              />
            </div>
          )}
        </div>

        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Payment Method
          </label>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <label
                key={method.key}
                className={`
                  flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                  ${selectedMethod === method.key 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.key}
                  checked={selectedMethod === method.key}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center flex-1">
                  {getPaymentIcon(method.type)}
                  <span className="ml-3 font-medium">{method.name}</span>
                </div>
                {selectedMethod === method.key && (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Order Summary</h4>
          <div className="flex justify-between text-sm">
            <span>{description}</span>
            <span className="font-medium">
              {countryCode === 'KE' && `KSh ${amount}`}
              {countryCode === 'ZA' && `R ${amount}`}
              {countryCode === 'NG' && `₦${amount}`}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !formData.name || !formData.email || !formData.phone}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            `Pay ${countryCode === 'KE' ? `KSh ${amount}` : countryCode === 'ZA' ? `R ${amount}` : `₦${amount}`}`
          )}
        </button>
      </form>

      {/* Security Notice */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Secured by D-Local • All transactions are encrypted</p>
      </div>
    </div>
  );
}
