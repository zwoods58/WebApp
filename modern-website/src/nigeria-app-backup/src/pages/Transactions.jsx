import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { Plus, Search, Trash2, ChevronLeft, Calendar, Tag, ArrowUpRight, ArrowDownLeft, X, Filter } from 'lucide-react';
import { format, isToday } from 'date-fns';
import toast from 'react-hot-toast';
import OfflineBanner from '../components/OfflineBanner';
import { useTranslation } from 'react-i18next';
import FloatingNavBar from '../components/FloatingNavBar';
import SwipeToRefresh from '../components/SwipeToRefresh';
import EmptyState from '../components/EmptyState';
import BeeZeeLogo from '../components/BeeZeeLogo';
import { useOfflineStore } from '../store/offlineStore';
import { getAllOfflineTransactions } from '../utils/offlineSync';
import PendingBadge from '../components/PendingBadge';

export default function Transactions() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formatCurrency } = useCountryStore();
  const { syncCompleted } = useOfflineStore();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, income, expense
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, [user]);

  // Refresh when sync completes (syncCompleted is a counter that increments)
  useEffect(() => {
    if (syncCompleted > 0) {
      console.log('Sync completed - refreshing Transactions...');
      loadTransactions();
    }
  }, [syncCompleted]);

  const loadTransactions = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get offline transactions and merge
      let allTransactions = [...(data || [])];
      try {
        const offlineTransactions = await getAllOfflineTransactions();
        const unsyncedOffline = offlineTransactions.filter(t => !t.synced);

        const pendingTransactions = unsyncedOffline.map(t => ({
          ...t,
          pending: true,
          synced: false,
          id: t.offline_id || `offline_${t.id}`,
        }));

        allTransactions = [...allTransactions, ...pendingTransactions];
        allTransactions.sort((a, b) => {
          const dateA = new Date(a.created_at || a.date);
          const dateB = new Date(b.created_at || b.date);
          return dateB - dateA;
        });
      } catch (offlineError) {
        console.error('Error loading offline transactions:', offlineError);
      }

      setTransactions(allTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('transactions.confirmDelete', 'Delete this transaction?'))) return;

    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      setTransactions(transactions.filter((t) => t.id !== id));
      toast.success(t('transactions.deleted', 'Transaction deleted'));
    } catch (error) {
      toast.error(t('transactions.deleteFailed', 'Failed to delete transaction'));
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter = filter === 'all' || t.type === filter;
    const matchesSearch = searchQuery === '' ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(transaction);
    return groups;
  }, {});

  return (
    <SwipeToRefresh onRefresh={loadTransactions}>
      <div className="transactions-container pb-24">
        <OfflineBanner />

        {/* Modern Header */}
        <div className="reports-header-section pt-4">
          <div className="reports-title-row">
            <div className="px-4">
              <BeeZeeLogo />
            </div>
            <div className="flex items-center gap-2">
              {!isSearchOpen ? (
                <h1 className="reports-title">{t('transactions.title', 'History')}</h1>
              ) : (
                <div className="flex-1 flex items-center bg-gray-50 rounded-2xl px-3 py-1 animate-slide-right">
                  <Search size={18} className="text-gray-400 mr-2" />
                  <input
                    autoFocus
                    type="text"
                    placeholder={t('common.search', 'Search...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-sm font-bold flex-1 py-2"
                  />
                  <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}>
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>
              )}
            </div>
            {!isSearchOpen && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"
                >
                  <Search size={20} />
                </button>
                <Link
                  to="/dashboard/transactions/add"
                  className="w-10 h-10 rounded-full bg-[#2C2C2E] flex items-center justify-center text-white"
                >
                  <Plus size={20} strokeWidth={3} />
                </Link>
              </div>
            )}
          </div>

          {/* Premium Filter Tabs */}
          <div className="reports-tabs-container">
            <button
              onClick={() => setFilter('all')}
              className={`reports-tab-button ${filter === 'all' ? 'active' : ''}`}
            >
              {t('common.all', 'All')}
            </button>
            <button
              onClick={() => setFilter('income')}
              className={`reports-tab-button ${filter === 'income' ? 'active' : ''}`}
            >
              <div className="w-2 h-2 rounded-full bg-[#67C4A7] mr-2" />
              {t('dashboard.income', 'Income')}
            </button>
            <button
              onClick={() => setFilter('expense')}
              className={`reports-tab-button ${filter === 'expense' ? 'active' : ''}`}
            >
              <div className="w-2 h-2 rounded-full bg-[#FF9B9B] mr-2" />
              {t('dashboard.expense', 'Expense')}
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="px-4 mt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mb-4" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <EmptyState
              type="transactions"
              title={t('transactions.noTransactions', 'No Transactions')}
              description={t('transactions.noDataDesc', 'Your history will appear here.')}
              actionLabel={t('transactions.addTransaction', 'Add First')}
              onAction={() => navigate('/dashboard/transactions/add')}
            />
          ) : (
            <div className="space-y-8 pb-10">
              {Object.entries(groupedTransactions).map(([date, items]) => (
                <div key={date} className="space-y-4 animate-slide-up">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      {isToday(new Date(date)) ? t('common.today', 'Today') : format(new Date(date), 'MMMM dd')}
                    </h3>
                    <div className="h-[1px] flex-1 bg-gray-50 ml-4" />
                  </div>

                  <div className="space-y-3">
                    {items.map((tx) => (
                      <div
                        key={tx.id || tx.offline_id || `offline_${tx.created_at}`}
                        className={`bg-white p-5 rounded-[24px] border border-gray-50 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all ${tx.pending ? 'opacity-75' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'income' ? 'bg-[#F0FDF4] text-[#166534]' : 'bg-[#FEF2F2] text-[#991B1B]'} ${tx.pending ? 'opacity-60' : ''}`}>
                            {tx.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900 mb-0.5 flex items-center gap-2">
                              {tx.description || tx.category}
                              {tx.pending && <PendingBadge />}
                            </p>
                            <div className="flex items-center gap-2">
                              <Tag size={10} className="text-gray-400" />
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{tx.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-sm font-black ${tx.type === 'income' ? 'text-[#166534]' : 'text-[#991B1B]'}`}>
                            {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                          </span>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="p-2 text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <FloatingNavBar />
      </div>
    </SwipeToRefresh>
  );
}
