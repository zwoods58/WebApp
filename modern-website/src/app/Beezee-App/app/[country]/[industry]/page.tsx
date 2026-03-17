"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Users, Package, Target } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/hooks/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useBusinessProfile, useCurrency } from '@/contexts/BusinessProfileContext';
import { useBusiness } from '@/contexts/BusinessContext';

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
  TourProvider,
  useTour,
  HomepageCalendar
} from '@/components/universal';
import BuzzInsights from '@/components/universal/BuzzInsights';

// Utility functions
import { formatCurrency } from '@/utils/currency';
import { analyzeTransportTransactions } from '@/utils/transportAnalytics';

// Supabase hooks
import { useTransactions, useExpenses, useCredit, useInventory, useTargets } from '@/hooks';
import { useToastContext } from '@/providers/ToastProvider';
import { useRefreshContext } from '@/contexts/RefreshContext';

function IndustryDashboardContent() {
  const { t } = useLanguage();
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  
  // Get business profile from signup
  const { profile } = useBusinessProfile();
  const currencyData = useCurrency();
  
  const { business } = useBusiness();
  const businessId = business?.id;
  
  const { showSuccess, showError } = useToastContext();
  const { user: authUser } = useAuth();
  const { registerRefreshHandler, unregisterRefreshHandler } = useRefreshContext();
  
  // Use Supabase hooks with business ID filtering to prevent data leakage
  const { transactions, loading: transactionsLoading, addTransaction } = useTransactions({ industry, businessId });
  const { expenses, loading: expensesLoading, addExpense } = useExpenses({ industry, businessId });
  const { credit, loading: creditLoading } = useCredit({ industry, businessId });
  const { inventory, loading: inventoryLoading } = useInventory({ industry, businessId });
  const { targets, loading: targetsLoading } = useTargets({ industry, businessId });
  
  // Get daily target from signup data or fallback to targets
  const signupDailyTarget = profile?.dailyTarget || 0;
  
  // Debug logging
  useEffect(() => {
    console.log('Homepage Debug:', {
      business,
      businessId,
      transactionsCount: transactions.length,
      expensesCount: expenses.length
    });
  }, [business, businessId, transactions.length, expenses.length]);
  
  const [todayStats, setTodayStats] = useState({ sales: 0, expenses: 0 });
  const isLoading = transactionsLoading || expensesLoading || creditLoading || inventoryLoading || targetsLoading;
  
  // Tour state management
  const { isTourActive, startTour, completeTour, skipTour } = useTour();

  useEffect(() => {
    // Check if this is a new user (you can replace this with actual user data)
    const hasSeenTour = localStorage.getItem('beezee-multi-page-tour-completed');
    if (!hasSeenTour && !isLoading) {
      setTimeout(() => {
        startTour();
      }, 1000); // Start tour after page loads
    }
  }, [isLoading, startTour]);

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

  const handleTourComplete = () => {
    completeTour();
  };

  const handleTourSkip = () => {
    skipTour();
  };

  useEffect(() => {
    // Calculate today's totals using hook data
    const today = new Date().toISOString().split('T')[0];
    console.log('🔍 Debug - Today Stats Calculation:', {
      today,
      transactions: transactions.length,
      expenses: expenses.length,
      businessId: businessId,
      allTransactions: transactions,
      allExpenses: expenses
    });
    
    const todaySales = transactions
      .filter(t => t.transaction_date === today)
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const todayExpenses = expenses
      .filter(e => e.expense_date === today)
      .reduce((sum, e) => sum + Number(e.amount), 0);

    console.log('🔍 Debug - Filtered Results:', {
      todaySales,
      todayExpenses,
      todayTransactions: transactions.filter(t => t.transaction_date === today),
      todayExpensesData: expenses.filter(e => e.expense_date === today)
    });

    setTodayStats({ sales: todaySales, expenses: todayExpenses });
  }, [transactions, expenses, businessId]);

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
      
      showSuccess(`Money in: ${formatCurrency(transactionData.amount, country)} received successfully!`);
      
      console.log('Transaction added successfully');
    } catch (error) {
      console.error('Failed to add transaction:', error);
      showError(t('alert.failed_transaction', 'Failed to add transaction. Please try again.'));
    }
  };

  // Helper functions for BuzzInsights data
  const calculateTopSellers = (transactions: any[], inventory: any[]) => {
    const sales = transactions.reduce((acc, t) => {
      if (t.metadata?.inventory_item_id) {
        const itemId = t.metadata.inventory_item_id;
        acc[itemId] = (acc[itemId] || 0) + (t.metadata.quantity_sold || 1);
      }
      return acc;
    }, {});
    
    return Object.entries(sales)
      .map(([itemId, quantity]) => {
        const item = inventory.find(i => i.id === itemId);
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
    if (overdueCredits.length === 0) return 0;
    
    const totalDays = overdueCredits.reduce((sum, credit) => {
      const daysOverdue = Math.floor((Date.now() - new Date(credit.date_given).getTime()) / (1000 * 60 * 60 * 24));
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
      
      await addExpense({
        ...cleanExpenseData,
        business_id: businessId,
        industry
      });
      
      showSuccess(`Money out: ${formatCurrency(expenseData.amount, country)} paid successfully!`);
      
      console.log('Expense added successfully');
    } catch (error) {
      console.error('Failed to add expense:', error);
      showError(t('alert.failed_expense', 'Failed to add expense. Please try again.'));
    }
  };

  const handleRefresh = async () => {
    console.log('Dashboard refresh triggered');
    // Trigger refetch for all data hooks
    // Note: The hooks will automatically refetch when their dependencies change
    // For now, we'll rely on router.refresh() from GlobalPullToRefresh
    showSuccess(t('refresh.data_refreshed', 'Data refreshed successfully!'));
  };

  const effectiveDailyTarget = signupDailyTarget || (targets.find(t => t.daily_target > 0)?.daily_target || 800);
  const todayProfit = todayStats.sales - todayStats.expenses;

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
                  today_total={todayStats.sales}
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
                        {t('business.auth_user', 'Auth User')}: {authUser?.email || t('business.not_authenticated', 'Not authenticated')}<br/>
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
          lowStockItems={inventory
            .filter(item => item.threshold !== undefined && item.quantity <= item.threshold)
            .map(item => ({
              item_name: item.item_name,
              quantity: item.quantity,
              threshold: item.threshold!
            }))}
          overdueCredit={{
            count: credit.filter(c => c.status !== 'paid' && new Date(c.due_date || '') < new Date()).length,
            amount: credit
              .filter(c => c.status !== 'paid' && new Date(c.due_date || '') < new Date())
              .reduce((sum, c) => sum + (c.status === 'partial' ? c.amount - c.paid_amount : c.amount), 0),
            avgDays: calculateAverageOverdueDays(
                credit.filter(c => c.status !== 'paid' && new Date(c.due_date || '') < new Date())
              )
          }}
          topSellers={calculateTopSellers(transactions, inventory)}
          transactions={transactions}
          cashData={{
            todayIn: todayStats.sales,
            todayOut: todayStats.expenses,
            profit: todayStats.sales - todayStats.expenses
          }}
          inventoryData={{
            totalItems: inventory.length,
            lowStock: inventory.filter(item => item.threshold !== undefined && item.quantity <= item.threshold).length,
            totalValue: inventory.reduce((sum, item) => sum + (item.quantity * (item.cost_price || 0)), 0)
          }}
          creditData={{
            outstandingCount: credit.filter(c => c.status !== 'paid').length,
            totalOwed: credit
              .filter(c => c.status !== 'paid')
              .reduce((sum, c) => sum + (c.status === 'partial' ? c.amount - c.paid_amount : c.amount), 0),
            overdueAmount: credit
              .filter(c => c.status !== 'paid' && new Date(c.due_date || '') < new Date())
              .reduce((sum, c) => sum + (c.status === 'partial' ? c.amount - c.paid_amount : c.amount), 0)
          }}
          transportData={industry === 'transport' ? analyzeTransportTransactions(transactions) : undefined}
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
              {formatCurrency(todayStats.sales, country)}
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
              {formatCurrency(todayStats.expenses, country)}
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

        {/* Credit List - Universal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="credit-list-section"
        >
          <CreditList industry={industry} country={country} credit={credit} />
        </motion.div>

        {/* Inventory - Universal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="inventory-list-section"
        >
          <InventoryList 
            industry={industry} 
            country={country} 
            items={inventory.map(item => ({
              ...item,
              threshold: item.threshold ?? 0,
              unit: item.unit ?? ''
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
}

export default function IndustryDashboard() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';

  return (
    <TourProvider industry={industry} country={country}>
      <IndustryDashboardContent />
    </TourProvider>
  );
}
