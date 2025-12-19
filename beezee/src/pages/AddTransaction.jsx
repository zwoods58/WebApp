import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { useOfflineStore } from '../store/offlineStore';
import { addOfflineTransaction } from '../utils/offlineSync';
import { ChevronLeft, Mic, Camera, Save, Loader2, ArrowUpRight, ArrowDownLeft, Calendar, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import VoiceRecorder from '../components/VoiceRecorder';
import ReceiptScanner from '../components/ReceiptScanner';
import { useTranslation } from 'react-i18next';
import FloatingNavBar from '../components/FloatingNavBar';

const CATEGORIES = {
  income: ['Sales', 'Services', 'Other Income'],
  expense: ['Stock/Inventory', 'Rent', 'Utilities', 'Transport', 'Salaries', 'Marketing', 'Supplies', 'Maintenance', 'Taxes', 'Other Expenses'],
};

export default function AddTransaction() {
  const { user } = useAuthStore();
  const { isOnline } = useOfflineStore();
  const { t } = useTranslation();
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
      toast.error(t('common.fillRequired', 'Please fill in all fields'));
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
        const { error } = await supabase.from('transactions').insert(transaction).select().single();
        if (error) throw error;
        toast.success(t('transactions.added', 'Added successfully!'));
      } else {
        await addOfflineTransaction(transaction);
        toast.success(t('transactions.offlineSaved', 'Saved offline.'));
      }
      navigate('/dashboard/transactions');
    } catch (error) {
      toast.error(t('transactions.addFailed', 'Failed to add'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-transaction-container pb-24">
      {showVoiceRecorder && (
        <VoiceRecorder onTransactionCreated={() => navigate('/dashboard/transactions')} onCancel={() => setShowVoiceRecorder(false)} />
      )}
      {showReceiptScanner && (
        <ReceiptScanner onTransactionCreated={() => navigate('/dashboard/transactions')} onCancel={() => setShowReceiptScanner(false)} />
      )}

      {/* Modern Header */}
      <div className="reports-header-section">
        <div className="reports-title-row">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400">
              <ChevronLeft size={24} strokeWidth={3} />
            </button>
            <h1 className="reports-title">{t('transactions.addTransaction', 'New Transaction')}</h1>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-8">
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowVoiceRecorder(true)}
            className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-transform"
          >
            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
              <Mic size={24} />
            </div>
            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Voice</span>
          </button>
          <button
            onClick={() => setShowReceiptScanner(true)}
            className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-transform"
          >
            <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center">
              <Camera size={24} />
            </div>
            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Receipt</span>
          </button>
        </div>

        {/* Manual Form */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-50 space-y-8 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">{t('common.manual', 'Manual Entry')}</h2>
            <div className="bg-gray-50 px-3 py-1 rounded-full text-[10px] font-bold text-gray-400">Details</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Type Switch */}
            <div className="reports-tabs-container p-1.5 bg-gray-50">
              <button
                type="button"
                onClick={() => { setType('income'); setCategory(''); }}
                className={`reports-tab-button ${type === 'income' ? 'active shadow-lg' : ''}`}
              >
                <ArrowDownLeft size={16} />
                Money In
              </button>
              <button
                type="button"
                onClick={() => { setType('expense'); setCategory(''); }}
                className={`reports-tab-button ${type === 'expense' ? 'active shadow-lg' : ''}`}
              >
                <ArrowUpRight size={16} />
                Money Out
              </button>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Amount</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-300">R</span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-12 pr-6 py-6 bg-gray-50 border-none rounded-[28px] text-3xl font-black text-gray-900 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Category Grid */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES[type].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-[#2C2C2E] text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was this for?"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Date</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#2C2C2E] text-white font-black rounded-[28px] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
              {t('common.save', 'Save Transaction')}
            </button>
          </form>
        </div>
      </div>

      <FloatingNavBar />
    </div>
  );
}
