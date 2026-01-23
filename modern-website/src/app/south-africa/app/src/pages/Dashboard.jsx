import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// import { supabase } from '../utils/supabase'; // Disabled for demo
import { useAuthStore } from '../store/authStore';
import { useCountryStore } from '../store/countryStore.js';
// import { format, startOfMonth, endOfMonth, subDays } from 'date-fns'; // Unused in demo mode
import toast from 'react-hot-toast';
import DashboardHeader from '../components/DashboardHeader';
import HeroBalanceCard from '../components/HeroBalanceCard';
import QuickActionButtons from '../components/QuickActionButtons';
import RecentTransactionsList from '../components/RecentTransactionsList';
import FloatingNavBar from '../components/FloatingNavBar';
import ProactiveInsights from '../components/ProactiveInsights';
import TransactionEntryModal from '../components/TransactionEntryModal';
import ReceiptEntryModal from '../components/ReceiptEntryModal';
import InventoryEntryModal from '../components/InventoryEntryModal';
import ReceiptScanner from '../components/ReceiptScanner';
// import AddInventoryModal from '../components/AddInventoryModal'; // Unused
import AddBookingModal from '../components/AddBookingModal';
import VoiceBookingRecorder from '../components/VoiceBookingRecorder';
import { SuccessModal, LoadingModal } from '../components/ConfirmationModals';
import { PageSkeleton, BalanceCardSkeleton, ListSkeleton, Skeleton } from '../components/LoadingSkeleton';
import PWAInstallButton from '../components/PWAInstallButton';
import OfflineBanner from '../components/OfflineBanner';
import SwipeToRefresh from '../components/SwipeToRefresh';
import ScheduleSection from '../components/ScheduleSection';
import { useTranslation } from 'react-i18next';
// import { createInventoryPurchaseTransaction } from '../utils/inventoryTransactions'; // Replaced by local logic
import { useOfflineStore } from '../store/offlineStore';
// import { getAllOfflineTransactions } from '../utils/offlineSync'; // Unused
import { useDemoData } from '../hooks/useDemoData';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { formatCurrency } = useCountryStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Use Demo Data Hook
  const {
    transactions,
    stats,
    bookings,
    addTransaction,
    addInventory,
    addBooking,
    updateBooking,
    loading: demoLoading
  } = useDemoData();

  const [notificationCount, setNotificationCount] = useState(0); // Mock notification count
  const [sparklineData, setSparklineData] = useState([]); // Mock sparkline

  // Modal states
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isInventoryVoiceRecording, setIsInventoryVoiceRecording] = useState(false);
  const [showReceiptScanner, setShowReceiptScanner] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [savedTransaction, setSavedTransaction] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);

  // Generate mock sparkline data from transactions or random
  useEffect(() => {
    // Simple mock sparkline
    setSparklineData([120, 150, 100, 200, 180, 250, 300, 280, 320, 350, 400, 380, 420, 450]);
  }, []);

  const handleTransactionSubmit = async (transactionData) => {
    setIsLoadingModalOpen(true);
    setIsTransactionModalOpen(false);

    try {
      const data = await addTransaction({
        ...transactionData,
        type: transactionData.type,
      });

      setSavedTransaction(data);
      setIsLoadingModalOpen(false);
      setIsSuccessModalOpen(true);

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
    setReceiptFile(null);
    setShowReceiptScanner(true);
  };

  const handleReceiptUpload = (file) => {
    setIsReceiptModalOpen(false);
    setReceiptFile(file);
    setShowReceiptScanner(true);
  };

  const handleReceiptTransactionCreated = async (transaction) => {
    setShowReceiptScanner(false);
    setReceiptFile(null);
    setIsLoadingModalOpen(true);

    try {
      const data = await addTransaction(transaction);

      setSavedTransaction(data);
      setIsLoadingModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Error saving receipt transaction:', error);
      setIsLoadingModalOpen(false);
      toast.error('Failed to save transaction');
    }
  };

  const handleInventorySubmit = async (inventoryData) => {
    setIsLoadingModalOpen(true);
    setIsInventoryModalOpen(false);

    try {
      console.log('[Dashboard Demo] Saving inventory:', inventoryData);

      const newItem = await addInventory(inventoryData);

      console.log('[Dashboard Demo] Inventory saved:', newItem);

      // Create expense transaction for inventory purchase
      if (inventoryData.cost_price > 0 && inventoryData.quantity > 0) {
        const cost = parseFloat(inventoryData.cost_price);
        const qty = parseFloat(inventoryData.quantity);
        const totalCost = cost * qty;

        await addTransaction({
          type: 'expense',
          amount: totalCost,
          category: 'Inventory',
          description: `Stock Purchase: ${inventoryData.name} (${qty})`,
          method: 'Cash', // Default
          date: new Date().toISOString()
        });

        toast.success(`Expense transaction created: R${totalCost.toFixed(2)}`);
      }

      setIsLoadingModalOpen(false);
      toast.success('Inventory added successfully');
    } catch (error) {
      console.error('[Dashboard Demo] Error saving inventory:', error);
      setIsLoadingModalOpen(false);
      toast.error('Failed to save inventory');
    }
  };

  const handleBookingSubmit = async (bookingData) => {
    // For demo, just toast success
    await addBooking(bookingData);
    toast.success('Booking saved');
    setIsBookingModalOpen(false);
  };

  const handleCompleteBooking = async (booking) => {
    try {
      setIsLoadingModalOpen(true);

      // 1. Add to ledger as income if there's a cost
      if (booking.service_cost && Number(booking.service_cost) > 0) {
        await addTransaction({
          type: 'income',
          amount: Number(booking.service_cost),
          category: 'Sales',
          description: `Booking: ${booking.client_name} - ${booking.service}`,
          date: new Date().toISOString(),
          method: 'Cash'
        });
      }

      // 2. Mark booking as completed
      await updateBooking(booking.id, { status: 'completed' });

      setIsLoadingModalOpen(false);
      toast.success(t('bookings.completed', 'Booking completed and added to ledger!'));
    } catch (error) {
      console.error('Error completing booking:', error);
      setIsLoadingModalOpen(false);
      toast.error('Failed to complete booking');
    }
  };

  const handleCancelBooking = async (booking) => {
    if (confirm(t('bookings.confirmCancel', 'Are you sure you want to cancel this booking?'))) {
      try {
        await updateBooking(booking.id, { status: 'cancelled' });
        toast.success(t('bookings.cancelled', 'Booking cancelled'));
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  // Mock Trend
  const calculateTrend = () => {
    return { value: 15, isPositive: true };
  };

  if (demoLoading) {
    return (
      <div className="dashboard-container">
        <DashboardHeader notificationCount={0} />
        <BalanceCardSkeleton />
        <div className="flex gap-4 mx-4 mt-6">
          <Skeleton width="50%" height="120px" borderRadius="20px" />
          <Skeleton width="50%" height="120px" borderRadius="20px" />
        </div>
        <ListSkeleton count={3} />
      </div>
    );
  }

  const handleRefresh = async () => {
    // No-op for demo
    return Promise.resolve();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <SwipeToRefresh onRefresh={handleRefresh}>
      <motion.div
        className="dashboard-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <OfflineBanner />
        <DashboardHeader notificationCount={notificationCount} />

        <motion.div variants={itemVariants}>
          <HeroBalanceCard
            balance={stats.profit}
            income={stats.totalIncome}
            expenses={stats.totalExpenses}
            trend={calculateTrend()}
            sparklineData={sparklineData}
            accountNumber={user?.user_metadata?.whatsapp_number || "Personal Account"}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <QuickActionButtons
            onVoiceClick={() => setIsTransactionModalOpen(true)}
            onReceiptClick={() => setIsReceiptModalOpen(true)}
            onInventoryClick={() => setIsInventoryModalOpen(true)}
            onBookingClick={() => setIsBookingModalOpen(true)}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ScheduleSection
            bookings={bookings}
            onComplete={handleCompleteBooking}
            onCancel={handleCancelBooking}
          />
        </motion.div>

        <motion.div className="px-4 -mt-2" variants={itemVariants}>
          <ProactiveInsights
            currentIncome={stats.totalIncome}
            currentExpenses={stats.totalExpenses}
            currentProfit={stats.profit}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <RecentTransactionsList transactions={transactions.slice(0, 5)} />
        </motion.div>

        <FloatingNavBar />

        {/* PWA Install Button */}
        <PWAInstallButton />

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

        <AddBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onSubmit={handleBookingSubmit}
        />
      </motion.div>
    </SwipeToRefresh>
  );
}

