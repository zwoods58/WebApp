"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Users, Package, Target, AlertTriangle, Clock, Calendar as CalendarIcon, CheckCircle, DollarSign, User, Calendar, Wrench, Car } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/LanguageContext';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useBusinessProfile, useCurrency } from '@/contexts/BusinessProfileContext';
import { formatDate } from '@/utils/currency';

// Universal Components
import { 
  DailyTarget, 
  MoneyInButton, 
  MoneyOutButton, 
  CreditList, 
  InventoryList, 
  BottomNav, 
  Header,
  DashboardSkeleton,
  HomepageCalendar,
  PageLoading
} from '@/components/universal';
import BuzzInsights from '@/components/universal/BuzzInsights';
import AddAppointmentModal from '@/components/universal/AddAppointmentModal';
import EditServiceModal from '@/components/universal/EditServiceModal';
import AddCustomerModal from '@/components/universal/AddCustomerModal';
import AddInventoryForm from '@/components/universal/AddInventoryForm';
import AppointmentList from '@/components/universal/AppointmentList';
import ServiceList from '@/components/universal/ServiceList';
import CustomerList from '@/components/universal/CustomerList';

// Utility functions
import { formatCurrency } from '@/utils/currency';
import { analyzeTransportTransactions } from '@/utils/transportAnalytics';

// Supabase hooks
import { useTransactionsTanStack, useExpensesTanStack, useCreditTanStack, useInventoryTanStack, useTargetsTanStack } from '@/hooks';
import type { Inventory } from '@/hooks/useInventoryTanStack';
import { useAppointments, useServices } from '@/hooks';
import { useToastContext } from '@/providers/ToastProvider';
import { useRefreshContext } from '@/contexts/RefreshContext';

// Define types for better type safety
interface Transaction {
  transaction_date: string;
  amount: number;
  metadata?: {
    inventory_item_id?: string;
    quantity_sold?: number;
  };
}

interface Expense {
  expense_date: string;
  amount: number;
}

export default function IndustryDashboard() {
  // ✅ STEP 1: ALL hooks called at top level, unconditionally
  console.log('🔍 Component Starting...');
  
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const queryClient = useQueryClient();
  
  console.log('🔍 Basic Hooks Loaded:', { t: !!t, params: !!params, country, industry, queryClient: !!queryClient });
  
  // ✅ Get business profile from signup - NO try-catch around hooks
  const { profile, syncProfileWithBusiness } = useBusinessProfile();
  const currencyData = useCurrency();
  
  console.log('🔍 Business Profile Hooks Loaded:', { profile: !!profile, syncProfileWithBusiness: !!syncProfileWithBusiness });
  
  const { business, loading: authLoading } = useUnifiedAuth();
  const businessId = business?.id;
  
  console.log('🔍 Auth Hook Loaded:', { business: !!business, businessId });
  
  const { showSuccess, showError } = useToastContext();
  const { user: authUser } = useUnifiedAuth();
  const { registerRefreshHandler, unregisterRefreshHandler } = useRefreshContext();
  
  // ✅ Use Supabase hooks with business ID filtering - called unconditionally
  const transactionsHook = useTransactionsTanStack({ industry, businessId });
  const expensesHook = useExpensesTanStack({ industry, businessId });
  const creditHook = useCreditTanStack({ industry, businessId });
  const inventoryHook = useInventoryTanStack({ industry, businessId });
  const targetsHook = useTargetsTanStack({ industry, businessId });
  
  // Additional hooks for appointments and services
  const appointmentsHook = useAppointments({ industry, businessId });
  const servicesHook = useServices({ industry, businessId });
  
  // Safely extract values with fallbacks - add extra defensive checks
  let transactions = Array.isArray(transactionsHook?.data) ? transactionsHook.data : [];
  let expenses = Array.isArray(expensesHook?.data) ? expensesHook.data : [];
  const credit = Array.isArray(creditHook?.data) ? creditHook.data : [];
  const inventory = Array.isArray(inventoryHook?.data) ? inventoryHook.data : [];
  const targets = Array.isArray(targetsHook?.data) ? targetsHook.data : [];
  const appointments = Array.isArray(appointmentsHook?.data) ? appointmentsHook.data : [];
  const services = Array.isArray(servicesHook?.data) ? servicesHook.data : [];
  
  // Fallback to localStorage if hooks return empty data
  if (transactions.length === 0) {
    try {
      const stored = localStorage.getItem(`beezee_${industry}_${country}_transactions`);
      if (stored) {
        transactions = JSON.parse(stored);
        console.log(`📦 Fallback: Loaded ${transactions.length} transactions from localStorage`);
      }
    } catch (error) {
      console.warn('Failed to load transactions from localStorage:', error);
    }
  }
  
  if (expenses.length === 0) {
    try {
      const stored = localStorage.getItem(`beezee_${industry}_${country}_expenses`);
      if (stored) {
        expenses = JSON.parse(stored);
        console.log(`📦 Fallback: Loaded ${expenses.length} expenses from localStorage`);
      }
    } catch (error) {
      console.warn('Failed to load expenses from localStorage:', error);
    }
  }
  
  // Extract refetch functions for manual refresh when needed
  const refetchTransactions = transactionsHook?.refetch || (() => Promise.resolve());
  const refetchExpenses = expensesHook?.refetch || (() => Promise.resolve());
  const refetchCredit = creditHook?.refetch || (() => Promise.resolve());
  const refetchInventory = inventoryHook?.refetch || (() => Promise.resolve());
  const refetchTargets = targetsHook?.refetch || (() => Promise.resolve());
  
  const transactionsLoading = transactionsHook?.isLoading || false;
  const expensesLoading = expensesHook?.isLoading || false;
  const creditLoading = creditHook?.isLoading || false;
  const inventoryLoading = inventoryHook?.isLoading || false;
  const targetsLoading = targetsHook?.isLoading || false;
  
  const addTransaction = transactionsHook?.addTransaction;
  const addExpense = expensesHook?.addExpense;
  
  // Ensure arrays are never undefined
  const safeTransactions = transactions || [];
  const safeExpenses = expenses || [];
  const safeCredit = credit || [];
  const safeInventory = inventory || [];
  const safeTargets = targets || [];
  
  // Debug: Log hook returns to identify issues
  console.log('🔍 Hook Debug:', {
    transactionsHook: !!transactionsHook,
    expensesHook: !!expensesHook,
    creditHook: !!creditHook,
    inventoryHook: !!inventoryHook,
    targetsHook: !!targetsHook,
    transactions: transactions ? transactions.length : 'undefined',
    expenses: expenses ? expenses.length : 'undefined',
    credit: credit ? credit.length : 'undefined',
    inventory: inventory ? inventory.length : 'undefined',
    targets: targets ? targets.length : 'undefined',
    businessId,
    profile: !!profile,
    business: !!business,
    // Check the raw hook returns
    rawTransactions: transactionsHook?.data,
    rawExpenses: expensesHook?.data,
    rawCredit: creditHook?.data,
    rawInventory: inventoryHook?.data,
    rawTargets: targetsHook?.data
  });
  
  // Debug BuzzInsights data
  useEffect(() => {
    console.log('� BuzzInsights Debug Data:', {
      inventoryLength: safeInventory.length,
      transactionsLength: safeTransactions.length,
      inventoryItems: safeInventory.slice(0, 3).map((item: Inventory) => ({
        id: item.id,
        item_name: item.item_name,
        quantity: item.quantity,
        selling_price: item.selling_price,
        threshold: item.threshold
      })),
      transactions: safeTransactions.slice(0, 3).map(t => ({
        id: t.id,
        amount: t.amount,
        metadata: t.metadata
      })),
      topSellers: calculateTopSellers(safeTransactions, safeInventory),
      inventoryValue: safeInventory.reduce((sum: number, item: Inventory) => sum + (item.quantity * (item.selling_price || 0)), 0)
    });
  }, [safeInventory, safeTransactions]);
  
  // 🔥 ROUTE VALIDATION: Ensure user is on correct industry/country page
  useEffect(() => {
    if (authLoading) return;
    
    if (!business) {
      console.log('🔓 User not authenticated, redirecting to login');
      router.replace('/Beezee-App/auth/login');
      return;
    }
    
    // Redirect if wrong industry/country
    if (business.country?.toLowerCase() !== country || 
        business.industry?.toLowerCase() !== industry) {
      console.log('🔄 Wrong route, redirecting to correct industry/country:', {
        currentRoute: { country, industry },
        businessData: { country: business.country, industry: business.industry }
      });
      router.replace(`/Beezee-App/app/${business.country?.toLowerCase()}/${business.industry?.toLowerCase()}`);
      return;
    }
    
    console.log('✅ Route validation passed:', { country, industry, business: business.business_name });
  }, [business, country, industry, authLoading, router]);

  // Additional safety check - add early return if critical data is missing
  if (!transactionsHook || !expensesHook || !creditHook || !inventoryHook || !targetsHook) {
    console.log('🔍 Hooks not ready, showing loading');
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <PageLoading message="Initializing application..." fullScreen={false} />
      </div>
    );
  }

  // 🔒 LOADING GATE: Prevent data-dependent UI from rendering until businessId is confirmed
  if (authLoading || !businessId) {
    console.log('🔍 Waiting for business authentication...', { authLoading, businessId });
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <PageLoading message="Loading your business..." fullScreen={false} />
      </div>
    );
  }
  
  // Get daily target from business settings (primary), signup profile (secondary), or database targets (fallback)
  const businessDailyTarget = business?.settings?.daily_target || 0;
  const signupDailyTarget = profile?.dailyTarget || 0;
  const effectiveDailyTarget = businessDailyTarget || signupDailyTarget || (safeTargets.find(t => t.target_type === 'sales' && t.period === 'daily')?.target_value || 500);
  
  // Sync profile with business settings when business data loads
  useEffect(() => {
    if (business && profile) {
      syncProfileWithBusiness(business);
    }
  }, [business, profile, syncProfileWithBusiness]);
  
  // Debug logging
  useEffect(() => {
    console.log('Homepage Debug:', {
      business,
      businessId,
      businessDailyTarget,
      signupDailyTarget,
      effectiveDailyTarget,
      businessSettings: business?.settings,
      transactionsCount: safeTransactions.length,
      expensesCount: safeExpenses.length
    });
  }, [business, businessId, businessDailyTarget, signupDailyTarget, effectiveDailyTarget, safeTransactions.length, safeExpenses.length]);
  
  const [todayStats, setTodayStats] = useState({ sales: 0, expenses: 0 });
  const isLoading = transactionsLoading || expensesLoading || creditLoading || inventoryLoading || targetsLoading || !todayStats;
  
  // Modal state management for homepage quick actions
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  
  // Add real-time BuzzInsights updates when data changes
  useEffect(() => {
    // Listen for inventory changes (from offline sales)
    const handleInventoryItemItemItemChange = () => {
      console.log('🔔 InventoryItemItemItem data changed, updating BuzzInsights...');
      queryClient.invalidateQueries({ queryKey: [industry, country, 'inventory'] });
      queryClient.invalidateQueries({ queryKey: [industry, country, 'transactions'] });
    };

    // Listen for transaction changes (from offline sales)
    const handleTransactionChange = () => {
      console.log('💰 Transaction data changed, updating BuzzInsights...');
      queryClient.invalidateQueries({ queryKey: [industry, country, 'transactions'] });
      queryClient.invalidateQueries({ queryKey: [industry, country, 'inventory'] });
    };

    // Set up listeners for localStorage changes (for offline operations)
    const storageListener = (e: StorageEvent) => {
      if (e.key?.includes('transactions') || e.key?.includes('inventory')) {
        console.log('📱 LocalStorage changed, updating BuzzInsights:', e.key);
        handleInventoryItemItemItemChange();
        handleTransactionChange();
      }
    };

    window.addEventListener('storage', storageListener);

    // ✅ REMOVED: setInterval polling - TanStack Query + Service Worker handle sync automatically
    // The polling was causing disruptive refreshes when offline

    return () => {
      window.removeEventListener('storage', storageListener);
    };
  }, [industry, country, queryClient]);

  // Register refresh handler
  useEffect(() => {
    registerRefreshHandler(handleRefresh);
    return () => {
      unregisterRefreshHandler();
    };
  }, [registerRefreshHandler, unregisterRefreshHandler]);

  // Start monitoring when business is loaded
  useEffect(() => {
    // Get business ID from localStorage to ensure consistency
    const sessionData = localStorage.getItem('sessionData');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        const localStorageBusinessId = parsed.userId;
        
        if (localStorageBusinessId && business) {
          console.log('Business ID found:', localStorageBusinessId);
          // Notification monitoring has been disabled
        }
      } catch (error) {
        console.error('Error parsing session data:', error);
      }
    }
  }, [business]);

  useEffect(() => {
    // Only calculate stats when data is ready and business context is loaded
    if (!businessId || transactionsLoading || expensesLoading) {
      console.log('🔍 Debug - Skipping stats calculation, data not ready:', {
        businessId,
        transactionsLoading,
        expensesLoading
      });
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    console.log('🔍 Debug - Today Stats Calculation:', {
      today,
      transactions: safeTransactions.length,
      expenses: safeExpenses.length,
      businessId: businessId,
      allTransactions: safeTransactions,
      allExpenses: safeExpenses
    });
    
    const todaySales = safeTransactions
      .filter((t: Transaction) => t.transaction_date === today)
      .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);
      
    const todayExpenses = safeExpenses
      .filter((e: Expense) => e.expense_date === today)
      .reduce((sum: number, e: Expense) => sum + Number(e.amount), 0);

    console.log('🔍 Debug - Filtered Results:', {
      todaySales,
      todayExpenses,
      todayTransactions: safeTransactions.filter((t: Transaction) => t.transaction_date === today),
      todayExpensesData: safeExpenses.filter((e: Expense) => e.expense_date === today)
    });

    setTodayStats({ 
      sales: todaySales || 0, 
      expenses: todayExpenses || 0 
    });
  }, [safeTransactions, safeExpenses, businessId, transactionsLoading, expensesLoading]);

  const handleMoneyIn = async (transactionData: any) => {
    try {
      console.log('Tenant data:', { business, businessId });
      
      if (!businessId) {
        console.error('No business ID found. Tenant:', business);
        alert(t('alert.setup_profile_first', 'Please set up your business profile first before adding transactions.'));
        return;
      }
      
      const newTransaction = await addTransaction({
        ...transactionData,
        business_id: businessId,
        industry
      });
      
      // Update BuzzInsights data immediately after adding transaction
      queryClient.invalidateQueries({ queryKey: [industry, country, 'transactions'] });
      queryClient.invalidateQueries({ queryKey: [industry, country, 'inventory'] });
      
      showSuccess(`Money in: ${formatCurrency(transactionData.amount, country)} received successfully!`);
      
      console.log('Transaction added successfully and BuzzInsights updated');
    } catch (error) {
      console.error('Failed to add transaction:', error);
      showError(t('alert.failed_transaction', 'Failed to add transaction. Please try again.'));
    }
  };

  // Helper functions for BuzzInsights data
  const calculateTopSellers = (transactions: Transaction[], inventory: Inventory[]) => {
    if (!transactions || !inventory || !Array.isArray(transactions) || !Array.isArray(inventory)) return [];
    
    const sales = transactions.reduce((acc: Record<string, number>, t: Transaction) => {
      if (t.metadata?.inventory_item_id) {
        const itemId = t.metadata.inventory_item_id;
        acc[itemId] = (acc[itemId] || 0) + (t.metadata.quantity_sold || 1);
      }
      return acc;
    }, {});
    
    return Object.entries(sales)
      .map(([itemId, quantity]: [string, number]) => {
        const item = inventory.find((i: Inventory) => i.id === itemId);
        if (!item) return null;
        return {
          name: item.item_name,
          quantity: quantity as number,
          revenue: (quantity as number) * (item.selling_price || 0)
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3);
  };

  const calculateAverageOverdueDays = (overdueCredits: any[]) => {
    if (!overdueCredits || overdueCredits.length === 0) return 0;
    
    const totalDays = overdueCredits.reduce((sum: number, credit: any) => {
      const daysOverdue = Math.floor((Date.now() - new Date(credit.created_at || credit.due_date).getTime()) / (1000 * 60 * 60 * 24));
      return sum + daysOverdue;
    }, 0);
    
    return Math.round(totalDays / overdueCredits.length);
  };

  const handleMoneyOut = async (expenseData: any) => {
    try {
      console.log('Tenant data:', { business, businessId });
      
      if (!businessId) {
        console.error('No business ID found. Tenant:', business);
        alert(t('alert.setup_profile_first_expenses', 'Please set up your business profile first before adding expenses.'));
        return;
      }
      
      // Remove payment_method from expense data as it doesn't exist in the database
      const { payment_method, ...cleanExpenseData } = expenseData;
      
      if (addExpense) {
        await addExpense({
          ...cleanExpenseData,
          business_id: businessId,
          industry
        });
      }
      
      // Update BuzzInsights data immediately after adding expense
      queryClient.invalidateQueries({ queryKey: [industry, country, 'expenses'] });
      queryClient.invalidateQueries({ queryKey: [industry, country, 'transactions'] });
      
      showSuccess(`Money out: ${formatCurrency(expenseData.amount, country)} paid successfully!`);
      
      console.log('Expense added successfully and BuzzInsights updated');
    } catch (error) {
      console.error('Failed to add expense:', error);
      showError(t('alert.failed_expense', 'Failed to add expense. Please try again.'));
    }
  };

  const handleRefresh = async () => {
    console.log('Dashboard refresh triggered - refetching all data');
    
    try {
      // Trigger refetch for all data hooks simultaneously
      await Promise.all([
        refetchTransactions(),
        refetchExpenses(),
        refetchCredit(),
        refetchInventory(),
        refetchTargets()
      ]);
      
      showSuccess(t('refresh.data_refreshed', 'Data refreshed successfully!'));
      console.log('✅ All dashboard data refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing dashboard data:', error);
      showError(t('refresh.refresh_failed', 'Failed to refresh some data. Please try again.'));
    }
  };

  // Modal handlers for homepage quick actions
  const handleAddAppointment = () => {
    setShowAppointmentModal(true);
  };

  const handleAddService = () => {
    setShowServiceModal(true);
  };

  const handleAddCustomer = (customerData: any) => {
    // This would integrate with the credit/customers system
    console.log('Adding customer:', customerData);
    showSuccess('Customer added successfully!');
  };

  const handleUpdateService = (serviceId: string, updates: any) => {
    // This would integrate with the services system
    console.log('Updating service:', serviceId, updates);
    showSuccess('Service updated successfully!');
  };

  const handleAppointmentSuccess = () => {
    setShowAppointmentModal(false);
    // Invalidate appointments query to update both homepage and calendar
    queryClient.invalidateQueries({ queryKey: ['appointments', industry, country, businessId] });
    showSuccess('Appointment scheduled successfully!');
  };

  const todayProfit = (todayStats?.sales || 0) - (todayStats?.expenses || 0);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
        {/* Header */}
        <Header industry={industry} country={country} />

        {/* Main Content - Dynamic scrolling */}
        <main className="flex-1">
          <div className="pt-12 p-5 space-y-5 max-w-md mx-auto pb-20">
          {isLoading ? (
            <DashboardSkeleton />
          ) : (
            <>
              {/* Daily Target - Universal */}
              <div className="daily-target-section">
                <DailyTarget 
                  industry={industry}
                  country={country}
                  today_total={todayStats?.sales || 0}
                  daily_target={effectiveDailyTarget}
                />
              </div>

              {/* Business Setup Warning */}
              {!business && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-yellow-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-yellow-800">{t('business.setup_required', 'Business Setup Required')}</h3>
                      <p className="text-xs text-yellow-700 mt-1">{t('business.setup_message', 'Please complete your business profile to start adding transactions and expenses.')}</p>
                      <div className="mt-2 text-xs text-yellow-600">
                        {t('business.auth_user', 'Auth User')}: {authUser?.phone_number || t('business.not_authenticated', 'Not authenticated')}<br/>
                        {t('business.business_status', 'Tenant Status')}: {business ? 'Loaded' : 'Not loaded'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

        {/* Buzz Insights - Business Intelligence */}
        <div className="buzz-section">
          <BuzzInsights
            country={country}
            industry={industry}
          lowStockItems={safeInventory
            ? safeInventory.filter((item: Inventory) => item.threshold !== undefined && item.quantity <= item.threshold)
                .map((item: Inventory) => ({
                  item_name: item.item_name,
                  quantity: item.quantity,
                  threshold: item.threshold!
                }))
            : []}
          overdueCredit={{
            count: safeCredit ? safeCredit.filter((c: any) => c.status !== 'paid' && new Date(c.due_date || '') < new Date()).length : 0,
            amount: safeCredit ? safeCredit
              .filter((c: any) => c.status !== 'paid' && new Date(c.due_date || '') < new Date())
              .reduce((sum: number, c: any) => sum + (c.status === 'partial' ? c.amount - (c.paid_amount || 0) : c.amount), 0) : 0,
            avgDays: calculateAverageOverdueDays(
                safeCredit ? safeCredit.filter((c: any) => c.status !== 'paid' && new Date(c.due_date || '') < new Date()) : []
              )
          }}
          topSellers={calculateTopSellers(safeTransactions, safeInventory)}
          transactions={safeTransactions}
          cashData={{
            todayIn: todayStats?.sales || 0,
            todayOut: todayStats?.expenses || 0,
            profit: (todayStats?.sales || 0) - (todayStats?.expenses || 0)
          }}
          inventoryData={{
            totalItems: safeInventory ? safeInventory.length : 0,
            lowStock: safeInventory ? safeInventory.filter((item: Inventory) => item.threshold !== undefined && item.quantity <= item.threshold).length : 0,
            totalValue: safeInventory ? safeInventory.reduce((sum: number, item: Inventory) => sum + (item.quantity * (item.selling_price || 0)), 0) : 0
          }}
          creditData={{
            outstandingCount: safeCredit ? safeCredit.filter((c: any) => c.status !== 'paid').length : 0,
            totalOwed: safeCredit ? safeCredit
              .filter((c: any) => c.status !== 'paid')
              .reduce((sum: number, c: any) => sum + (c.status === 'partial' ? c.amount - (c.paid_amount || 0) : c.amount), 0) : 0,
            overdueAmount: safeCredit ? safeCredit
              .filter((c: any) => c.status !== 'paid' && new Date(c.due_date || '') < new Date())
              .reduce((sum: number, c: any) => sum + (c.status === 'partial' ? c.amount - (c.paid_amount || 0) : c.amount), 0) : 0
          }}
          transportData={industry === 'transport' ? analyzeTransportTransactions(safeTransactions) : undefined}
          />
        </div>

        {/* Money In/Out Row - Universal */}
        <div className="grid grid-cols-2 gap-4">
          <div className="money-in-button">
            <MoneyInButton 
              industry={industry} 
              country={country}
              onSuccess={handleMoneyIn}
              disabled={!business}
            />
          </div>
          <div className="money-out-button">
            <MoneyOutButton 
              industry={industry} 
              country={country}
              onSuccess={handleMoneyOut}
              disabled={!business}
            />
          </div>
        </div>

        {/* Industry-Specific Lists */}
        <div className="space-y-5">
          {/* Customer List - All Industries */}
          <CustomerList
            industry={industry}
            country={country}
            customers={credit}
            onViewAll={() => window.location.href = `/Beezee-App/app/${country}/${industry}/credit`}
            onAddCustomer={() => setShowCustomerModal(true)}
          />

          {/* Appointment List - Calendar Industries */}
          {['salon', 'tailor', 'freelance', 'repairs'].includes(industry) && (
            <AppointmentList
              industry={industry}
              country={country}
              appointments={appointments}
              onManageAppointments={() => window.location.href = `/Beezee-App/app/${country}/${industry}/calendar`}
              onScheduleAppointment={handleAddAppointment}
            />
          )}

          {/* Service List - Service Industries */}
          {['transport', 'salon', 'tailor', 'freelance', 'repairs'].includes(industry) && (
            <ServiceList
              industry={industry}
              country={country}
              services={services}
              onManageServices={() => window.location.href = `/Beezee-App/app/${country}/${industry}/services`}
              onAddService={handleAddService}
            />
          )}
        </div>

        {/* Inventory List - Universal */}
        <div className="inventory-section">
          <InventoryList 
            industry={industry}
            country={country}
            items={safeInventory.map((item: Inventory) => ({
              id: item.id,
              item_name: item.item_name,
              quantity: item.quantity,
              threshold: item.threshold ?? 0,
              unit: '', // Unit doesn't exist in new interface, default to empty string
              cost_price: item.cost_price,
              selling_price: item.selling_price
            }))} 
          />
        </div>
            </>
          )}
        </div>
        </main>

        {/* Bottom Nav - Universal */}
        <BottomNav industry={industry} country={country} />

        {/* Modals for Quick Actions */}
        {showCustomerModal && (
          <AddCustomerModal
            isOpen={showCustomerModal}
            onClose={() => setShowCustomerModal(false)}
            onAddCustomer={handleAddCustomer}
            country={country}
            industry={industry}
          />
        )}

        {showAppointmentModal && (
          <AddAppointmentModal
            isOpen={showAppointmentModal}
            onClose={() => setShowAppointmentModal(false)}
            onSuccess={handleAppointmentSuccess}
            industry={industry}
            country={country}
          />
        )}

        {showServiceModal && (
          <EditServiceModal
            isOpen={showServiceModal}
            onClose={() => setShowServiceModal(false)}
            onUpdate={handleUpdateService}
            isAddMode={true}
            country={country}
            industry={industry}
          />
        )}
    </div>
  );
}
