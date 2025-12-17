import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { Plus, Filter, Search, Trash2, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import OfflineBanner from '../components/OfflineBanner';
import { useTranslation } from 'react-i18next';
import FloatingNavBar from '../components/FloatingNavBar';

export default function Transactions() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, income, expense
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTransactions();
  }, [user]);

  const loadTransactions = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error(t('common.noData', 'Failed to load transactions'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('transactions.confirmDelete', 'Are you sure you want to delete this transaction?'))) {
      return;
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTransactions(transactions.filter((t) => t.id !== id));
      toast.success(t('transactions.deleted', 'Transaction deleted'));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error(t('transactions.deleteFailed', 'Failed to delete transaction'));
    }
  };

  // Filter and search transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter = filter === 'all' || t.type === filter;
    const matchesSearch = searchQuery === '' || 
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="transactions-container">
        <OfflineBanner />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="spinner"></div>
        </div>
        <FloatingNavBar />
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <OfflineBanner />
      <div className="space-y-6">
        {/* Header */}
        <div className="transactions-header">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
              aria-label={t('common.back', 'Go back')}
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{t('transactions.title', 'Transactions')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t('common.search', 'Search transactions...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <Link
              to="/dashboard/transactions/add"
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              aria-label={t('transactions.addTransaction', 'Add Transaction')}
            >
              <Plus size={24} />
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 px-4 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {t('common.all', 'All')}
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === 'income' ? 'bg-success-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {t('dashboard.income', 'Income')}
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {t('dashboard.expense', 'Expense')}
          </button>
        </div>

        {/* Transaction List */}
        <div className="px-4 space-y-6 pb-20">
          {Object.keys(groupedTransactions).length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-500">{t('transactions.noTransactions', 'No transactions found')}</p>
            </div>
          ) : (
            Object.entries(groupedTransactions).map(([date, items]) => (
              <div key={date} className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {isToday(new Date(date)) ? t('common.today', 'Today') : format(new Date(date), 'MMMM dd, yyyy')}
                </h3>
                <div className="space-y-1">
                  {items.map((t) => (
                    <div
                      key={t.id}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900">{t.description}</span>
                          <span className={`font-bold ${t.type === 'income' ? 'text-success-600' : 'text-red-600'}`}>
                            {t.type === 'income' ? '+' : '-'} R{parseFloat(t.amount).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                            {t.category}
                          </span>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <FloatingNavBar />
    </div>
  );
}

function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}
