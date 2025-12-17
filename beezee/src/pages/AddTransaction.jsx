import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { useOfflineStore } from '../store/offlineStore';
import { addOfflineTransaction } from '../utils/offlineSync';
import { receiptToTransaction } from '../utils/supabase';
import { ArrowLeft, Mic, Camera, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import VoiceRecorder from '../components/VoiceRecorder';
import ReceiptScanner from '../components/ReceiptScanner';

const CATEGORIES = {
  income: ['Sales', 'Services', 'Other Income'],
  expense: [
    'Stock/Inventory',
    'Rent',
    'Utilities',
    'Transport',
    'Salaries',
    'Marketing',
    'Supplies',
    'Maintenance',
    'Taxes',
    'Other Expenses',
  ],
};

export default function AddTransaction() {
  const { user } = useAuthStore();
  const { isOnline } = useOfflineStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showReceiptScanner, setShowReceiptScanner] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !category || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    const transaction = {
      user_id: user.id,
      amount: parseFloat(amount),
      type,
      category,
      description,
      date,
      source: 'manual',
    };

    try {
      if (isOnline) {
        // Save directly to Supabase
        const { data, error } = await supabase
          .from('transactions')
          .insert(transaction)
          .select()
          .single();

        if (error) throw error;

        toast.success('Transaction added!');
      } else {
        // Save to IndexedDB for offline sync
        await addOfflineTransaction(transaction);
        toast.success('Transaction saved offline. Will sync when online.');
      }

      navigate('/dashboard/transactions');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    try {
      // Check if browser supports MediaRecorder
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Voice recording not supported on this device');
        return;
      }

      setShowVoiceRecorder(true);
    } catch (error) {
      console.error('Voice input error:', error);
      toast.error('Voice recording failed');
    }
  };

  const handleVoiceTransactionCreated = async (transaction) => {
    try {
      if (isOnline) {
        // Transaction already saved by VoiceRecorder component
        navigate('/dashboard/transactions');
      } else {
        // Save offline
        await addOfflineTransaction(transaction);
        navigate('/dashboard/transactions');
      }
    } catch (error) {
      console.error('Error handling voice transaction:', error);
      throw error;
    }
  };

  const handleReceiptCapture = () => {
    setShowReceiptScanner(true);
  };

  const handleReceiptTransactionCreated = async (transaction) => {
    try {
      if (isOnline) {
        // Transaction data from receipt, save to database
        const { data, error } = await supabase
          .from('transactions')
          .insert(transaction)
          .select()
          .single();

        if (error) throw error;
        navigate('/dashboard/transactions');
      } else {
        // Save offline
        await addOfflineTransaction(transaction);
        navigate('/dashboard/transactions');
      }
    } catch (error) {
      console.error('Error handling receipt transaction:', error);
      throw error;
    }
  };

  return (
    <>
      {/* Voice Recorder Modal */}
      {showVoiceRecorder && (
        <VoiceRecorder
          onTransactionCreated={handleVoiceTransactionCreated}
          onCancel={() => setShowVoiceRecorder(false)}
        />
      )}

      {/* Receipt Scanner Modal */}
      {showReceiptScanner && (
        <ReceiptScanner
          onTransactionCreated={handleReceiptTransactionCreated}
          onCancel={() => setShowReceiptScanner(false)}
        />
      )}

      <div className="add-transaction-container">
        <div className="space-y-6">
          {/* Header */}
          <div className="add-transaction-header flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add Transaction</h1>
              <p className="text-gray-600">Record your income or expense</p>
            </div>
          </div>

      {/* Quick Input Methods */}
      <div className="quick-input-methods">
        <button
          onClick={handleVoiceInput}
          disabled={loading}
          className="quick-input-button"
        >
          <div className="quick-input-icon">
            <Mic size={28} />
          </div>
          <span className="quick-input-text">Voice Input</span>
        </button>
        <button
          onClick={handleReceiptCapture}
          disabled={loading}
          className="quick-input-button"
        >
          <div className="quick-input-icon">
            <Camera size={28} />
          </div>
          <span className="quick-input-text">Scan Receipt</span>
        </button>
      </div>

      {/* Manual Form */}
      <form onSubmit={handleSubmit} className="manual-transaction-form">
        <h2 className="manual-form-title">Or enter manually</h2>

        {/* Type Toggle */}
        <div className="type-toggle-container">
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategory('');
            }}
            className={`type-toggle-button income ${type === 'income' ? 'active' : ''}`}
          >
            Money In
          </button>
          <button
            type="button"
            onClick={() => {
              setType('expense');
              setCategory('');
            }}
            className={`type-toggle-button expense ${type === 'expense' ? 'active' : ''}`}
          >
            Money Out
          </button>
        </div>

        {/* Amount */}
        <div className="transaction-form-field">
          <label htmlFor="amount" className="transaction-form-label">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="R 0.00"
            className="transaction-form-input amount-input"
            required
          />
        </div>

        {/* Description */}
        <div className="transaction-form-field">
          <label htmlFor="description" className="transaction-form-label">
            What was it for?
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="transaction-form-input"
            required
          />
        </div>

        {/* Category */}
        <div className="transaction-form-field">
          <label htmlFor="category" className="transaction-form-label">
            Category
          </label>
          <div className="category-pills-container">
            {CATEGORIES[type].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`category-pill ${category === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="transaction-form-field">
          <label htmlFor="date" className="transaction-form-label">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="transaction-form-input"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="transaction-submit-button"
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Transaction
            </>
          )}
        </button>
      </form>

      {/* Offline Notice */}
      {!isOnline && (
        <div className="card bg-yellow-50 border-yellow-200">
          <p className="text-yellow-800 text-sm">
            📱 You're offline. Transaction will be saved locally and synced when you're back online.
          </p>
        </div>
      )}
        </div>
      </div>
    </>
  );
}

