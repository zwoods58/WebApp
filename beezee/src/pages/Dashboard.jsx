import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { format, startOfMonth, endOfMonth, subDays } from 'date-fns';
import toast from 'react-hot-toast';
import DashboardHeader from '../components/DashboardHeader';
import HeroBalanceCard from '../components/HeroBalanceCard';
import QuickActionButtons from '../components/QuickActionButtons';
import RecentTransactionsList from '../components/RecentTransactionsList';
import FloatingNavBar from '../components/FloatingNavBar';
import ProactiveInsights from '../components/ProactiveInsights';
import TransactionEntryModal from '../components/TransactionEntryModal';
import ReceiptEntryModal from '../components/ReceiptEntryModal';
import ReceiptScanner from '../components/ReceiptScanner';
import { SuccessModal, LoadingModal } from '../components/ConfirmationModals';
import { PageSkeleton, BalanceCardSkeleton, ListSkeleton, Skeleton } from '../components/LoadingSkeleton';
import OfflineBanner from '../components/OfflineBanner';
import SwipeToRefresh from '../components/SwipeToRefresh';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    transactionCount: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [sparklineData, setSparklineData] = useState([]);
  
  // Modal states
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [showReceiptScanner, setShowReceiptScanner] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [savedTransaction, setSavedTransaction] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);

  useEffect(() => {
    loadDashboardData();
    loadNotificationCount();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get user data
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      setUserData(userProfile);

      // Get current month's transactions
      const startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate stats
      const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const expenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      setStats({
        totalIncome: income,
        totalExpenses: expenses,
        netProfit: income - expenses,
        transactionCount: transactions.length,
      });

      setRecentTransactions(transactions.slice(0, 5));

      // Generate sparkline data (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
        const dayTransactions = transactions.filter(t => t.date === date);
        const dayIncome = dayTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const dayExpenses = dayTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        return dayIncome - dayExpenses;
      });
      setSparklineData(last7Days);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationCount = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('read', false);

      if (!error && data) {
        setNotificationCount(data.length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleTransactionSubmit = async (transactionData) => {
    if (!user) return;

    setIsLoadingModalOpen(true);
    setIsTransactionModalOpen(false);

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: transactionData.type,
          amount: transactionData.amount,
          description: transactionData.description,
          category: transactionData.category,
          date: transactionData.date,
        })
        .select()
        .single();

      if (error) throw error;

      setSavedTransaction(data);
      setIsLoadingModalOpen(false);
      setIsSuccessModalOpen(true);
      
      // Reload dashboard data
      await loadDashboardData();
      
      toast.success('Transaction saved successfully!');
    } catch (error) {
      console.error('Error saving transaction:', error);
      setIsLoadingModalOpen(false);
      toast.error('Failed to save transaction');
    }
  };

  const handleVoiceRecord = async () => {
    setIsTransactionModalOpen(true);
  };

  const handleReceiptScan = async () => {
    setIsReceiptModalOpen(true);
  };

  const handleReceiptTakePhoto = () => {
    setIsReceiptModalOpen(false);
    setReceiptFile(null); // Ensure no old file
    setShowReceiptScanner(true);
  };

  const handleReceiptUpload = (file) => {
    setIsReceiptModalOpen(false);
    setReceiptFile(file);
    setShowReceiptScanner(true);
    // The ReceiptScanner will handle the file upload
  };

  const handleReceiptTransactionCreated = async (transaction) => {
    setShowReceiptScanner(false);
    setReceiptFile(null); // Clear the file after success
    setIsLoadingModalOpen(true);
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setSavedTransaction(data);
      setIsLoadingModalOpen(false);
      setIsSuccessModalOpen(true);
      
      // Reload dashboard data
      await loadDashboardData();
    } catch (error) {
      console.error('Error saving receipt transaction:', error);
      setIsLoadingModalOpen(false);
      toast.error('Failed to save transaction');
    }
  };

  // Calculate trend (percentage change from previous week)
  const calculateTrend = () => {
    if (sparklineData.length < 7) return null;
    const thisWeek = sparklineData.slice(-7).reduce((a, b) => a + b, 0);
    const lastWeek = sparklineData.slice(0, 7).reduce((a, b) => a + b, 0);
    if (lastWeek === 0) return null;
    const change = ((thisWeek - lastWeek) / Math.abs(lastWeek)) * 100;
    return {
      value: Math.round(change),
      isPositive: change >= 0,
    };
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <DashboardHeader notificationCount={0} />
        <BalanceCardSkeleton />
        <div className="flex gap-4 mx-4 mt-6">
          <Skeleton width="50%" height="120px" borderRadius="20px" />
          <Skeleton width="50%" height="120px" borderRadius="20px" />
        </div>
        <ListSkeleton count={3} />
        <FloatingNavBar />
      </div>
    );
  }

  const handleRefresh = async () => {
    await Promise.all([
      loadDashboardData(),
      loadNotificationCount(),
    ]);
  };

  return (
    <SwipeToRefresh onRefresh={handleRefresh}>
      <div className="dashboard-container">
        <OfflineBanner />
        <DashboardHeader notificationCount={notificationCount} />
        
        <HeroBalanceCard
          balance={stats.netProfit}
          income={stats.totalIncome}
          expenses={stats.totalExpenses}
          trend={calculateTrend()}
          sparklineData={sparklineData}
          accountNumber={userData?.whatsapp_number || userData?.phone_number || null}
        />

                  <QuickActionButtons
                    onVoiceClick={() => setIsTransactionModalOpen(true)}
                    onReceiptClick={() => setIsReceiptModalOpen(true)}
                  />

        <ProactiveInsights />

        <RecentTransactionsList transactions={recentTransactions} />

        <FloatingNavBar />

      {/* Modals */}
      <TransactionEntryModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSubmit={handleTransactionSubmit}
        onVoiceRecord={handleVoiceRecord}
        onReceiptScan={handleReceiptScan}
      />

      <ReceiptEntryModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        onTakePhoto={handleReceiptTakePhoto}
        onUploadImage={handleReceiptUpload}
      />

      {showReceiptScanner && (
        <ReceiptScanner
          onTransactionCreated={handleReceiptTransactionCreated}
          onCancel={() => {
            setShowReceiptScanner(false);
            setReceiptFile(null);
          }}
          initialFile={receiptFile}
        />
      )}

      <LoadingModal isOpen={isLoadingModalOpen} />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          setSavedTransaction(null);
        }}
        transaction={savedTransaction}
      />
      </div>
    </SwipeToRefresh>
  );
}
