import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { format, startOfMonth, endOfMonth, subDays } from 'date-fns';
import toast from 'react-hot-toast';
import DashboardHeader from '../components/DashboardHeader';
import BeeZeeLogo from '../components/BeeZeeLogo';
import HeroBalanceCard from '../components/HeroBalanceCard';
import QuickActionButtons from '../components/QuickActionButtons';
import RecentTransactionsList from '../components/RecentTransactionsList';
import FloatingNavBar from '../components/FloatingNavBar';
import ProactiveInsights from '../components/ProactiveInsights';
import TransactionEntryModal from '../components/TransactionEntryModal';
import ReceiptEntryModal from '../components/ReceiptEntryModal';
import InventoryEntryModal from '../components/InventoryEntryModal';
import ReceiptScanner from '../components/ReceiptScanner';
import AddInventoryModal from '../components/AddInventoryModal';
import VoiceBookingRecorder from '../components/VoiceBookingRecorder';
import { SuccessModal, LoadingModal } from '../components/ConfirmationModals';
import { PageSkeleton, BalanceCardSkeleton, ListSkeleton, Skeleton } from '../components/LoadingSkeleton';
import OfflineBanner from '../components/OfflineBanner';
import SwipeToRefresh from '../components/SwipeToRefresh';
import { useTranslation } from 'react-i18next';
import { createInventoryPurchaseTransaction } from '../utils/inventoryTransactions';

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
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isInventoryVoiceRecording, setIsInventoryVoiceRecording] = useState(false);
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
    let finalUserId = user?.id || localStorage.getItem('beezee_user_id');
    if (!finalUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      finalUserId = session?.user?.id;
    }

    if (!finalUserId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get user data
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', finalUserId)
        .single();

      setUserData(userProfile);

      // Get current month's transactions
      const startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');

      console.log('[Dashboard] Loading transactions for user:', finalUserId, 'Date range:', startDate, 'to', endDate);

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', finalUserId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Dashboard] Error loading transactions:', error);
        throw error;
      }

      console.log('[Dashboard] Loaded transactions:', transactions?.length || 0);
      console.log('[Dashboard] Transaction details:', transactions);

      // Calculate stats
      const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const expenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      console.log('[Dashboard] Calculated income:', income, 'expenses:', expenses);

      setStats({
        totalIncome: income,
        totalExpenses: expenses,
        netProfit: income - expenses,
        transactionCount: transactions.length,
      });

      setRecentTransactions(transactions.slice(0, 5));

      // Generate sparkline data (last 14 days for trend comparison)
      const last14Days = Array.from({ length: 14 }, (_, i) => {
        const date = format(subDays(new Date(), 13 - i), 'yyyy-MM-dd');
        const dayTransactions = transactions.filter(t => t.date === date);
        const dayIncome = dayTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const dayExpenses = dayTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        return dayIncome - dayExpenses; // Net profit per day
      });
      setSparklineData(last14Days);
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
    let finalUserId = user?.id || localStorage.getItem('beezee_user_id');
    if (!finalUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      finalUserId = session?.user?.id;
    }
    if (!finalUserId) return;

    setIsLoadingModalOpen(true);
    setIsTransactionModalOpen(false);

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: finalUserId,
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
    let finalUserId = user?.id || localStorage.getItem('beezee_user_id');
    if (!finalUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      finalUserId = session?.user?.id;
    }
    if (!finalUserId) return;

    setShowReceiptScanner(false);
    setReceiptFile(null); // Clear the file after success
    setIsLoadingModalOpen(true);
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          user_id: finalUserId,
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

  const handleInventorySubmit = async (inventoryData) => {
    let finalUserId = user?.id || localStorage.getItem('beezee_user_id');
    if (!finalUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      finalUserId = session?.user?.id;
    }
    if (!finalUserId) {
      throw new Error('Authentication required. Please log in again.');
    }

    setIsLoadingModalOpen(true);
    setIsInventoryModalOpen(false);

    try {
      console.log('[Dashboard] Saving inventory:', inventoryData);
      
      const { data, error } = await supabase
        .from('inventory')
        .insert({
          ...inventoryData,
          user_id: finalUserId,
        })
        .select()
        .single();

      if (error) {
        console.error('[Dashboard] Inventory insert error:', error);
        throw error;
      }

      console.log('[Dashboard] Inventory saved:', data);

      // Create expense transaction for inventory purchase
      if (data.cost_price > 0) {
        console.log('[Dashboard] Attempting to create purchase transaction for:', {
          item: data.name,
          cost_price: data.cost_price,
          quantity: data.quantity,
          userId: finalUserId,
        });
        
        const transaction = await createInventoryPurchaseTransaction(data, finalUserId);
        if (!transaction) {
          console.error('[Dashboard] ❌ Failed to create purchase transaction');
          toast.error('Inventory saved, but failed to create expense transaction. Check console for details.', { duration: 5000 });
        } else {
          console.log('[Dashboard] ✅ Purchase transaction created:', transaction);
          toast.success(`Expense transaction created: R${(data.cost_price * data.quantity).toFixed(2)}`);
        }
      } else {
        console.log('[Dashboard] No cost price, skipping transaction creation');
      }

      setIsLoadingModalOpen(false);
      
      // Reload dashboard data
      await loadDashboardData();
    } catch (error) {
      console.error('[Dashboard] Error saving inventory:', error);
      setIsLoadingModalOpen(false);
      throw error; // Re-throw so InventoryEntryModal can show error
    }
  };

  // Calculate trend (percentage change in net profit from previous period)
  const calculateTrend = () => {
    if (!stats || sparklineData.length < 14) {
      // If we don't have enough data, try with 7 days
      if (sparklineData.length >= 7) {
        const thisWeekTotal = sparklineData.slice(-7).reduce((a, b) => a + b, 0);
        // Compare to average of available days
        const avgPrevious = sparklineData.slice(0, Math.min(7, sparklineData.length)).reduce((a, b) => a + b, 0) / Math.min(7, sparklineData.length);
        if (avgPrevious === 0) {
          return thisWeekTotal > 0 ? { value: 100, isPositive: true } : null;
        }
        const change = ((thisWeekTotal - avgPrevious) / Math.abs(avgPrevious)) * 100;
        return {
          value: Math.round(change),
          isPositive: change >= 0,
        };
      }
      return null;
    }
    
    // Compare current week (last 7 days) to previous week (7 days before that)
    const thisWeekNetProfit = sparklineData.slice(-7).reduce((a, b) => a + b, 0);
    const lastWeekNetProfit = sparklineData.slice(-14, -7).reduce((a, b) => a + b, 0);
    
    if (lastWeekNetProfit === 0) {
      return thisWeekNetProfit > 0 ? { value: 100, isPositive: true } : thisWeekNetProfit < 0 ? { value: -100, isPositive: false } : null;
    }
    
    const change = ((thisWeekNetProfit - lastWeekNetProfit) / Math.abs(lastWeekNetProfit)) * 100;
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
        <div className="px-4 pt-2 pb-1">
          <BeeZeeLogo />
        </div>
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
          onInventoryClick={() => setIsInventoryModalOpen(true)}
        />

        <div className="px-4 -mt-2">
          <ProactiveInsights />
        </div>

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

      <InventoryEntryModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        onSubmit={handleInventorySubmit}
        onVoiceRecord={() => {
          setIsInventoryModalOpen(false);
          setIsInventoryVoiceRecording(true);
        }}
      />

      {isInventoryVoiceRecording && (
        <VoiceBookingRecorder
          type="inventory"
          onClose={() => setIsInventoryVoiceRecording(false)}
          onSuccess={(data) => {
            // Note: VoiceBookingRecorder handles confirmation UI internally
            // When user confirms in VoiceBookingRecorder, it calls onInventoryCreated
          }}
          onInventoryCreated={async (data) => {
            await handleInventorySubmit(data);
            setIsInventoryVoiceRecording(false);
          }}
        />
      )}

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
