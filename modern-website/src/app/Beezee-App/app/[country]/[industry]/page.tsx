"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Users, Package, Target, AlertTriangle, Clock, Calendar as CalendarIcon, CheckCircle, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
  HomepageCalendar
} from '@/components/universal';
import BuzzInsights from '@/components/universal/BuzzInsights';

// Utility functions
import { formatCurrency } from '@/utils/currency';
import { analyzeTransportTransactions } from '@/utils/transportAnalytics';

// Supabase hooks
import { useTransactionsTanStack, useExpensesTanStack, useCreditTanStack, useInventoryTanStack, useTargetsTanStack } from '@/hooks';
import type { Inventory } from '@/hooks/useInventoryTanStack';
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

function IndustryDashboardContent() {
  // Add immediate error boundary at the very start
  console.log('🔍 Component Starting...');
  
  const { t } = useLanguage();
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const queryClient = useQueryClient();
  
  console.log('🔍 Basic Hooks Loaded:', { t: !!t, params: !!params, country, industry, queryClient: !!queryClient });
  
  // Add a try-catch wrapper around the entire component logic
  try {
    // Get business profile from signup
    const { profile, syncProfileWithBusiness } = useBusinessProfile();
    const currencyData = useCurrency();
    
    console.log('🔍 Business Profile Hooks Loaded:', { profile: !!profile, syncProfileWithBusiness: !!syncProfileWithBusiness });
    
    const { business } = useUnifiedAuth();
    const businessId = business?.id;
    
    console.log('🔍 Auth Hook Loaded:', { business: !!business, businessId });
    
    const { showSuccess, showError } = useToastContext();
    const { user: authUser } = useUnifiedAuth();
    const { registerRefreshHandler, unregisterRefreshHandler } = useRefreshContext();
  
  // Use Supabase hooks with business ID filtering to prevent data leakage
  let transactionsHook, expensesHook, creditHook, inventoryHook, targetsHook;
  
  try {
    transactionsHook = useTransactionsTanStack({ industry, businessId });
    expensesHook = useExpensesTanStack({ industry, businessId });
    creditHook = useCreditTanStack({ industry, businessId });
    inventoryHook = useInventoryTanStack({ industry, businessId });
    targetsHook = useTargetsTanStack({ industry, businessId });
  } catch (hookError) {
    console.error('❌ Hook initialization error:', hookError);
    // Fallback empty hooks but keep basic functionality
    transactionsHook = { data: [], isLoading: false, addTransaction: async (data: any) => {
      console.log('🔄 Fallback addTransaction called:', data);
      // Try to save to localStorage directly as fallback
      try {
        const storageKey = `beezee_${industry}_${country}_transactions`;
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const newTransaction = {
          ...data,
          id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          pendingSync: true
        };
        existing.unshift(newTransaction);
        localStorage.setItem(storageKey, JSON.stringify(existing));
        console.log('💾 Fallback: Saved transaction to localStorage');
        return newTransaction;
      } catch (error) {
        console.error('❌ Fallback save failed:', error);
      }
    }};
    expensesHook = { data: [], isLoading: false, addExpense: async (data: any) => {
      console.log('🔄 Fallback addExpense called:', data);
      // Try to save to localStorage directly as fallback
      try {
        const storageKey = `beezee_${industry}_${country}_expenses`;
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const newExpense = {
          ...data,
          id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          pendingSync: true
        };
        existing.unshift(newExpense);
        localStorage.setItem(storageKey, JSON.stringify(existing));
        console.log('💾 Fallback: Saved expense to localStorage');
        return newExpense;
      } catch (error) {
        console.error('❌ Fallback save failed:', error);
      }
    }};
    creditHook = { data: [], isLoading: false };
    inventoryHook = { data: [], isLoading: false };
    targetsHook = { data: [], isLoading: false };
  }
  
  // Safely extract values with fallbacks - add extra defensive checks
  let transactions = Array.isArray(transactionsHook?.data) ? transactionsHook.data : [];
  let expenses = Array.isArray(expensesHook?.data) ? expensesHook.data : [];
  const credit = Array.isArray(creditHook?.data) ? creditHook.data : [];
  const inventory = Array.isArray(inventoryHook?.data) ? inventoryHook.data : [];
  const targets = Array.isArray(targetsHook?.data) ? targetsHook.data : [];
  
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
  
  // Additional safety check - add early return if critical data is missing
  if (!transactionsHook || !expensesHook || !creditHook || !inventoryHook || !targetsHook) {
    console.error('❌ Critical: One or more hooks failed to initialize');
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading...</div>
          <div className="text-sm text-gray-600">Initializing application...</div>
        </div>
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

    // Also set up periodic checks for offline data sync
    const interval = setInterval(() => {
      // Check if there are pending offline operations
      const transactionsKey = `beezee_${industry}_${country}_transactions`;
      const inventoryKey = `beezee_${industry}_${country}_inventory`;
      
      const transactions = localStorage.getItem(transactionsKey);
      const inventory = localStorage.getItem(inventoryKey);
      
      if (transactions || inventory) {
        try {
          const parsedTransactions = JSON.parse(transactions || '[]');
          const parsedInventoryItemItemItem = JSON.parse(inventory || '[]');
          
          const hasPendingTransactions = parsedTransactions.some((t: any) => t.pendingSync);
          const hasPendingInventoryItemItemItem = parsedInventoryItemItemItem.some((i: any) => i.pendingSync);
          
          if (hasPendingTransactions || hasPendingInventoryItemItemItem) {
            console.log('🔄 Detected pending offline operations, updating BuzzInsights...');
            handleInventoryItemItemItemChange();
            handleTransactionChange();
          }
        } catch (error) {
          console.warn('Error checking for pending operations:', error);
        }
      }
    }, 5000); // Check every 5 seconds

    return () => {
      window.removeEventListener('storage', storageListener);
      clearInterval(interval);
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

  const todayProfit = (todayStats?.sales || 0) - (todayStats?.expenses || 0);

  return (
    <div className="scroll-container bg-[var(--bg)]">
        {/* Header */}
        <Header industry={industry} country={country} />

        {/* Main Content - Scrollable */}
        <main className="scroll-content">
          <div className="p-5 space-y-5 max-w-md mx-auto pb-20">
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

        {/* Stats Row - Universal */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 border border-[var(--border)]"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[var(--text-3)] uppercase tracking-wider mb-3">
              <TrendingUp size={16} className="text-[var(--color-success)]" strokeWidth={2.5} />
              {t('common.money_in')}
            </div>
            <div className="text-2xl font-bold text-[var(--color-success)]">
              {formatCurrency(todayStats?.sales || 0, country)}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 border border-[var(--border)]"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[var(--text-3)] uppercase tracking-wider mb-3">
              <TrendingDown size={16} className="text-[var(--color-danger)]" strokeWidth={2.5} />
              {t('common.money_out')}
            </div>
            <div className="text-2xl font-bold text-[var(--color-danger)]">
              {formatCurrency(todayStats?.expenses || 0, country)}
            </div>
          </motion.div>
        </div>

        {/* Today's Profit */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 border border-[var(--border)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-[var(--text-3)] uppercase tracking-wider mb-2">{t('daily_profit', 'Daily Profit')}</div>
              <div className={`text-3xl font-bold tracking-tight ${
                todayProfit >= 0 ? 'text-[var(--powder-dark)]' : 'text-[var(--color-danger)]'
              }`}>
                {formatCurrency(todayProfit, country)}
              </div>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              todayProfit >= 0 ? 'bg-[var(--powder)]/15' : 'bg-[var(--color-danger-light)]'
            }`}>
              <Target className={todayProfit >= 0 ? 'text-[var(--powder-dark)]' : 'text-[var(--color-danger)]'} size={28} strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>

        {/* Homepage Calendar - Service Industries Only */}
        <HomepageCalendar industry={industry} country={country} />

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-5 border border-[var(--border)]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[var(--text-1)]">{t('cash.recent_activity', 'Recent Activity')}</h3>
            <Link href={`/${country}/${industry}/transactions`} className="text-[var(--color-primary)] text-sm hover:underline">
              View all
            </Link>
          </div>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="text-gray-400" size={20} />
              </div>
              <p className="text-gray-500 text-sm">No recent activity</p>
              <p className="text-gray-400 text-xs mt-1">Your transactions and appointments will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-[var(--bg2)] rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {transaction.category === 'appointment_booking' && <CalendarIcon size={14} className="text-blue-500" />}
                      {transaction.category === 'service_payment' && <CheckCircle size={14} className="text-green-500" />}
                      {transaction.category === 'payment' && <DollarSign size={14} className="text-purple-500" />}
                      <span className="text-sm font-medium text-[var(--text-1)] truncate">
                        {transaction.description}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--text-3)]">
                      {formatDate(transaction.transaction_date)}
                      {transaction.customer_name && ` • ${transaction.customer_name}`}
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${
                    transaction.category === 'appointment_booking' ? 'text-blue-600' :
                    transaction.category === 'service_payment' ? 'text-green-600' :
                    transaction.category === 'payment' ? 'text-purple-600' :
                    transaction.amount > 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
                  }`}>
                    {transaction.category === 'appointment_booking' ? 'Booked' : 
                     formatCurrency(transaction.amount, country)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Credit List - Universal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="credit-list-section"
        >
          <CreditList 
            industry={industry} 
            country={country} 
            credit={safeCredit?.map(c => ({
              id: c.id,
              customer_name: c.customer_name || 'Unknown Customer',
              amount: c.amount,
              status: c.status || 'pending',
              due_date: c.due_date,
              paid_amount: c.paid_amount,
              sync_status: 'synced'
            })) || []} 
          />
        </motion.div>

        {/* InventoryItemItemItem - Universal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="inventory-list-section"
        >
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
        </motion.div>
            </>
          )}
        </div>
        </main>

        {/* Bottom Nav - Universal */}
        <BottomNav industry={industry} country={country} />
    </div>
  );
  } catch (componentError) {
    console.error('❌ Component Error:', componentError);
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl border border-red-200 shadow-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Loading Error
            </h1>
            <p className="text-gray-600 text-center mb-6">
              We encountered an issue while loading this page. Please try refreshing.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default function IndustryDashboard() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';

  return <IndustryDashboardContent />;
}
