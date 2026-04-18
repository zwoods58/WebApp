"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar, Filter, Search, ArrowUpDown, Copy, MessageSquare, RefreshCw, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { formatCurrency, getCurrency } from '@/utils/currency';
import { useTransactionsTanStack, useExpensesTanStack, useCreditTanStack, useCreditItems } from '@/hooks/index';
import { useLanguage } from '@/hooks/useLanguage';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/index';
import { 
  Header, 
  BottomNav,
  PageLoading,
  PageLoadingBar
} from '@/components/universal';
import MoneyInButton from '@/components/universal/MoneyInButton';
import MoneyOutButton from '@/components/universal/MoneyOutButton';
import WhatsAppShare from '@/components/universal/WhatsAppShare';
import { findMatchingCreditCustomer, generateDefaultDescription, calculateNewCreditTotal } from '@/utils/creditMatching';

export default function CashPage() {
  // ✅ STEP 1: ALL hooks called at top level, unconditionally
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const { t } = useLanguage();
  
  const { business, loading: authLoading } = useSupabaseAuth();
  const businessId = business?.id;
  const queryClient = useQueryClient();
  const creditHook = useCreditTanStack({ businessId: businessId, industry: business?.industry || industry });
  const creditItemsHook = useCreditItems({ businessId: businessId, industry: business?.industry || industry });
  
  // ✅ STEP 2: Network status detection (for UI indicator only, NOT to block)
  const [isNetworkOffline, setIsNetworkOffline] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => setIsNetworkOffline(false);
    const handleOffline = () => setIsNetworkOffline(true);
    
    setIsNetworkOffline(!navigator.onLine);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // ✅ STEP 3: Toast hook
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  
  // ✅ STEP 4: Data hooks - ALWAYS called
  const transactionsHook = useTransactionsTanStack({ 
    businessId: businessId,
    industry: business?.industry || industry
  });
  const expensesHook = useExpensesTanStack({ 
    businessId: businessId,
    industry: business?.industry || industry
  });
  
  // ✅ STEP 5: Safely extract data with fallbacks
  const transactions = transactionsHook?.data || [];
  const expenses = expensesHook?.data || [];
  const isTransactionsOffline = transactionsHook?.isOffline || false;
  const isExpensesOffline = expensesHook?.isOffline || false;
  const isTransactionsPending = transactionsHook?.isAdding || false;
  const isExpensesPending = expensesHook?.isLoading || false;
  const addTransaction = transactionsHook?.addTransaction || (() => Promise.resolve());
  const addExpense = expensesHook?.addExpense || (() => Promise.resolve());
  const isTransactionsLoading = transactionsHook?.isLoading || false;
  const isExpensesLoading = expensesHook?.isLoading || false;
  
  // Credit data extraction
  const { data: credit, addCredit, updateCredit, refetch: refetchCredit } = creditHook;
  const addCreditItem = creditItemsHook?.addCreditItem || (() => Promise.resolve());
  const addCreditItemAsync = async (item: any) => {
    try {
      await addCreditItem(item);
      return { data: item, error: undefined };
    } catch (error) {
      return { data: undefined, error };
    }
  };
  
  // ✅ STEP 6: Derived state
  const isOffline = isTransactionsOffline || isExpensesOffline || isNetworkOffline;
  const isSyncing = isTransactionsPending || isExpensesPending;
  const totalPending = (isTransactionsPending ? 1 : 0) + (isExpensesPending ? 1 : 0);
  
  // ✅ STEP 7: useState hooks
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedItemForShare, setSelectedItemForShare] = useState<any>(null);
  
  // ✅ STEP 8: Combined data for display
  const allCashFlow = [
    ...transactions.map((t: any) => ({ ...t, type: 'in' as const })),
    ...expenses.map((e: any) => ({ ...e, type: 'out' as const }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  // ✅ STEP 9: useEffect hooks
  useEffect(() => {
    console.log('[CashPage] Business ID:', businessId);
    console.log('[CashPage] Transactions count:', transactions.length);
    console.log('[CashPage] Expenses count:', expenses.length);
    console.log('[CashPage] Offline status:', isOffline);
    console.log('[CashPage] Network offline:', isNetworkOffline);
  }, [businessId, transactions.length, expenses.length, isOffline, isNetworkOffline]);
  
  // Handler functions - matching homepage logic
  const handleMoneyIn = async (transactionData: any) => {
    try {
      console.log('Tenant data:', { business, businessId });
      
      if (!businessId) {
        console.error('No business ID found. Tenant:', business);
        alert(t('alert.setup_profile_first', 'Please set up your business profile first before adding transactions.'));
        return;
      }
      
      // If payment method is credit, create/update credit account and line item
      if (transactionData.payment_method === 'credit' && transactionData.customer_name) {
        // Find existing customer using unified matching logic
        const existingCredit = findMatchingCreditCustomer(credit || [], transactionData.customer_name, 'receivable');
        
        if (existingCredit) {
          // Customer exists - create new line item
          console.log('Adding line item to existing customer:', existingCredit.customer_name);
          
          // Create new credit line item
          await addCreditItemAsync({
            credit_id: existingCredit.id,
            business_id: businessId,
            industry,
            description: transactionData.description || generateDefaultDescription(transactionData.customer_name, 'Credit purchase'),
            amount: transactionData.amount,
            paid_amount: 0,
            currency: transactionData.currency || getCurrency(country),
            status: 'pending',
            due_date: transactionData.due_date,
            date_given: transactionData.transaction_date,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
          // Update credit account totals
          const newTotalAmount = calculateNewCreditTotal(existingCredit.amount, transactionData.amount);
          await updateCredit(existingCredit.id, {
              amount: newTotalAmount,
              due_date: transactionData.due_date, // Update to latest due date
              updated_at: new Date().toISOString()
            });
          
          console.log(' Credit line item added successfully:', {
            customer: existingCredit.customer_name,
            lineAmount: transactionData.amount,
            newTotal: newTotalAmount
          });
        } else {
          // New customer - create credit account and first line item
          console.log('Creating new credit account for:', transactionData.customer_name);
          const newCredit: any = await addCredit({
            business_id: businessId,
            customer_name: transactionData.customer_name,
            amount: transactionData.amount,
            due_date: transactionData.due_date,
            description: transactionData.description,
            status: 'pending'
          });
          
          const creditId = newCredit?.id;
          
          // Create first line item for new customer
          if (creditId) {
            await addCreditItemAsync({
              credit_id: creditId,
              business_id: businessId,
              industry,
              description: transactionData.description || generateDefaultDescription(transactionData.customer_name, 'Credit purchase'),
              amount: transactionData.amount,
              paid_amount: 0,
              currency: transactionData.currency || getCurrency(country),
              status: 'pending',
              due_date: transactionData.due_date,
              date_given: transactionData.transaction_date,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
            console.log(' New credit account created successfully:', {
              customer: transactionData.customer_name,
              amount: transactionData.amount,
              creditId
            });
          }
        }
        
        // Invalidate credit queries
        queryClient.invalidateQueries({ queryKey: [industry, country, 'credit'] });
        queryClient.invalidateQueries({ queryKey: [industry, country, 'credit_items'] });
      }
      
      const newTransaction = await addTransaction({
        ...transactionData,
        type: 'money_in',
        business_id: businessId,
        industry
      });
      
      // Update data immediately after adding transaction
      queryClient.invalidateQueries({ queryKey: [industry, country, 'transactions'] });
      queryClient.invalidateQueries({ queryKey: [industry, country, 'inventory'] });
      
      showSuccess(`Money in: ${formatCurrency(transactionData.amount, country)} received successfully!`);
      
      console.log('Transaction added successfully and data updated');
    } catch (error) {
      console.error('Failed to add transaction:', error);
      showError(t('alert.failed_transaction', 'Failed to add transaction. Please try again.'));
    }
  };

  const handleMoneyOut = async (expenseData: any) => {
    try {
      console.log('Tenant data:', { business, businessId });
      
      if (!businessId) {
        console.error('No business ID found. Tenant:', business);
        alert(t('alert.setup_profile_first_expenses', 'Please set up your business profile first before adding expenses.'));
        return;
      }
      
      // If payment method is credit, create/update payable credit account and line item
      if (expenseData.payment_method === 'credit' && expenseData.customer_name) {
        // Check if customer already has a credit account
        const existingCredit = credit?.find((c: any) => 
          c.customer_name.toLowerCase() === expenseData.customer_name.toLowerCase() &&
          c.type === 'payable'
        );
        
        let creditId = existingCredit?.id;
        
        if (existingCredit) {
          // Customer exists - create new line item
          console.log('Adding line item to existing supplier:', existingCredit.customer_name);
          
          // Create new credit line item
          await addCreditItemAsync({
            credit_id: existingCredit.id,
            business_id: businessId,
            industry,
            description: expenseData.description || 'Credit expense',
            amount: expenseData.amount,
            paid_amount: 0,
            currency: expenseData.currency || getCurrency(country),
            status: 'pending',
            due_date: expenseData.due_date,
            date_given: expenseData.expense_date || new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
          // Update credit account totals
          const newTotalAmount = existingCredit.amount + expenseData.amount;
          await updateCredit(existingCredit.id, {
              amount: newTotalAmount,
              due_date: expenseData.due_date, // Update to latest due date
              updated_at: new Date().toISOString()
            });
        } else {
          // New supplier - create credit account and first line item
          console.log('Creating new payable credit account for:', expenseData.customer_name);
          const newCredit: any = await addCredit({
            business_id: businessId,
            customer_name: expenseData.customer_name, // Using customer_name field for supplier
            amount: expenseData.amount,
            due_date: expenseData.due_date,
            description: expenseData.description,
            status: 'pending'
          });
          
          creditId = newCredit?.id;
          
          // Create first line item for new supplier
          if (creditId) {
            await addCreditItemAsync({
              credit_id: creditId,
              business_id: businessId,
              industry,
              description: expenseData.description || 'Credit expense',
              amount: expenseData.amount,
              paid_amount: 0,
              currency: expenseData.currency || getCurrency(country),
              status: 'pending',
              due_date: expenseData.due_date,
              date_given: expenseData.expense_date || new Date().toISOString().split('T')[0],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        }
        
        // Invalidate credit queries
        queryClient.invalidateQueries({ queryKey: [industry, country, 'credit'] });
        queryClient.invalidateQueries({ queryKey: [industry, country, 'credit_items'] });
      }
      
      // Remove payment_method from expense data as it doesn't exist in the database
      const { payment_method, customer_name, due_date, ...cleanExpenseData } = expenseData;
      
      if (addExpense) {
        await addExpense({
          ...cleanExpenseData,
          business_id: businessId,
          industry
        });
      }
      
      // Update data immediately after adding expense
      queryClient.invalidateQueries({ queryKey: [industry, country, 'expenses'] });
      queryClient.invalidateQueries({ queryKey: [industry, country, 'transactions'] });
      
      showSuccess(`Money out: ${formatCurrency(expenseData.amount, country)} paid successfully!`);
      
      console.log('Expense added successfully and data updated');
    } catch (error) {
      console.error('Failed to add expense:', error);
      showError(t('alert.failed_expense', 'Failed to add expense. Please try again.'));
    }
  };

  // ✅ STEP 10:  
    
  const filteredCashFlow = allCashFlow.filter(item => {
    const matchesSearch = !searchTerm || (
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.customer_name && item.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const matchesType = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesType;
  });
  
  const generateCashItemText = (item: any): string => {
    const date = item.transaction_date || item.expense_date;
    
    let text = `${t('receipt.receipt_from', 'Receipt from')} ${business?.business_name || t('business.default_name', 'My Business')}\n\n`;
    text += `${t('receipt.description', 'Description')}: ${item.description}\n`;
    text += `${t('receipt.amount', 'Amount')}: ${item.type === 'in' ? '+' : '-'}${formatCurrency(item.amount, country)}\n`;
    text += `${t('receipt.date', 'Date')}: ${new Date(date).toLocaleDateString()}\n`;
    
    if (item.type === 'in' && item.customer_name) {
      text += `${t('receipt.customer', 'Customer')}: ${item.customer_name}\n`;
    }
    
    if (item.type === 'out' && item.supplier) {
      text += `${t('business.suppliers', 'Supplier')}: ${item.supplier}\n`;
    }
    
    if (item.payment_method) {
      text += `${t('receipt.payment_method', 'Payment Method')}: ${item.payment_method}\n`;
    }
    
    text += `\n${t('receipt.thank_you', 'Thank you for your business!')}`;
    
    return text;
  };
  
  const handleCopyItem = async (item: any) => {
    const itemText = generateCashItemText(item);
    
    try {
      await navigator.clipboard.writeText(itemText);
      setCopiedItem(item.id);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = itemText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedItem(item.id);
      setTimeout(() => setCopiedItem(null), 2000);
    }
  };
  
  const handleShareItem = (item: any) => {
    setSelectedItemForShare(item);
    setShowShareModal(true);
  };
  
  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setSelectedItemForShare(null);
  };
  
  const today = new Date().toISOString().split('T')[0];
  const todayMoneyIn = allCashFlow
    .filter(item => {
      const itemDate = item.transaction_date || item.expense_date;
      return itemDate === today && item.type === 'in';
    })
    .reduce((sum, item) => sum + item.amount, 0);
  const todayMoneyOut = allCashFlow
    .filter(item => {
      const itemDate = item.transaction_date || item.expense_date;
      return itemDate === today && item.type === 'out';
    })
    .reduce((sum, item) => sum + item.amount, 0);
  const todayProfit = todayMoneyIn - todayMoneyOut;
  
  // ✅ STEP 11: Loading state
  // Don't show loading when offline - use cached data instead
  if (authLoading && !isOffline) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <PageLoading message="Loading cash flow..." fullScreen={false} />
      </div>
    );
  }
  
    
  // ✅ STEP 12: No business warning
  if (!businessId && !authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <Header industry={industry} country={country} />
        <div className="p-8 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Business Setup Required</h2>
            <p className="text-yellow-700 mb-4">Please complete your business profile to start adding transactions.</p>
            <Link 
              href="/Beezee-App/setup"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Set Up Business
            </Link>
          </div>
        </div>
        <BottomNav industry={industry} country={country} />
      </div>
    );
  }
  
  // ✅ STEP 13: Main render - REMOVED the offline block!
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header industry={industry} country={country} />
      
      <main className="flex-1 container mx-auto px-4 pt-24 py-6 max-w-md">
        {/* Removed offline indicator - silent offline mode */}

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6 mt-8">
          <div className="add-transaction-btn flex-1">
            <MoneyInButton 
              industry={industry}
              country={country}
              businessId={business?.id || ''}
              onSuccess={handleMoneyIn}
            />
          </div>
          <div className="add-transaction-btn flex-1">
            <MoneyOutButton 
              industry={industry}
              country={country}
              onSuccess={handleMoneyOut}
            />
          </div>
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6 mt-8 animate-fade-in">
          <div className="glass-card p-4 border border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-3)] mb-2">
              <TrendingUp size={14} strokeWidth={2.5} />
              {t('cash.in')}
            </div>
            <div className="text-lg font-bold text-[var(--color-success)]">
              {formatCurrency(todayMoneyIn, country)}
            </div>
          </div>

          <div className="glass-card p-4 border border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-3)] mb-2">
              <TrendingDown size={14} strokeWidth={2.5} />
              {t('cash.out')}
            </div>
            <div className="text-lg font-bold text-[var(--color-danger)]">
              {formatCurrency(todayMoneyOut, country)}
            </div>
          </div>

          <div className="glass-card p-4 border border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-3)] mb-2">
              <ArrowUpDown size={14} strokeWidth={2.5} />
              {t('cash.profit')}
            </div>
            <div className={`text-lg font-bold ${
              todayProfit >= 0 ? 'text-[var(--powder-dark)]' : 'text-[var(--color-danger)]'
            }`}>
              {formatCurrency(todayProfit, country)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 animate-fade-in">
          <div className="relative mb-3">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('cash.search_cash_flow')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass-card border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)]"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                filterType === 'all'
                  ? 'bg-[var(--powder-dark)] text-white'
                  : 'glass-card text-[var(--text-2)] border border-[var(--border)]'
              }`}
            >
              {t('cash.all')}
            </button>
            <button
              onClick={() => setFilterType('in')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                filterType === 'in'
                  ? 'bg-[var(--color-success)] text-white'
                  : 'glass-card text-[var(--text-2)] border border-[var(--border)]'
              }`}
            >
              {t('cash.money_in')}
            </button>
            <button
              onClick={() => setFilterType('out')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                filterType === 'out'
                  ? 'bg-[var(--color-danger)] text-white'
                  : 'glass-card text-[var(--text-2)] border border-[var(--border)]'
              }`}
            >
              {t('cash.money_out')}
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="animate-fade-in">
          <h3 className="font-bold text-[var(--text-1)] mb-4">{t('cash.recent_activity')}</h3>
          
          {filteredCashFlow.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <ArrowUpDown size={48} className="mx-auto" />
              </div>
              <p className="text-gray-600">{t('cash.no_cash_activity_found')}</p>
              <p className="text-sm text-gray-500 mt-1">{t('cash.start_by_recording_first_transaction')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCashFlow.map((item: any, index: number) => (
                <div key={item.id} className="glass-card p-4 border border-[var(--border)] animate-fade-in">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-[var(--text-1)] mb-1">
                        {item.description}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[var(--text-3)]">
                        <span>{new Date(item.transaction_date || item.expense_date).toLocaleDateString()}</span>
                        {item.customer_name && (
                          <span>{item.customer_name}</span>
                        )}
                        {item.supplier && (
                          <span>{item.supplier}</span>
                        )}
                        {item.status === 'pending' && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                            Pending
                          </span>
                        )}
                        {item.payment_method && (
                          <span className={`px-2 py-1 rounded-full ${
                            item.payment_method === 'cash' 
                              ? 'bg-green-100 text-green-700'
                              : item.payment_method === 'transfer'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {item.payment_method}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className={`text-lg font-bold ${
                        item.type === 'in' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
                      }`}>
                        {item.type === 'in' ? '+' : '-'}{formatCurrency(item.amount, country)}
                      </div>
                      
                      <div className="flex gap-1 mt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyItem(item);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            copiedItem === item.id
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={copiedItem === item.id ? t('common.copied', 'Copied!') : t('common.copy', 'Copy Details')}
                        >
                          <Copy size={14} />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareItem(item);
                          }}
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          title={t('credit.share_via_whatsapp', 'Share via WhatsApp')}
                        >
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* WhatsApp Share Modal */}
      {showShareModal && selectedItemForShare && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-slide-up">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('receipt.share_receipt', 'Share Receipt')}</h3>
            
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <div className="font-medium text-gray-900 mb-1">{selectedItemForShare.description}</div>
              <div className="text-sm text-gray-600">
                {selectedItemForShare.type === 'in' ? '+' : '-'}{formatCurrency(selectedItemForShare.amount, country)}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  handleCopyItem(selectedItemForShare);
                  handleCloseShareModal();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
              >
                <Copy size={18} />
                {t('common.copy_to_clipboard', 'Copy to Clipboard')}
              </button>

              <WhatsAppShare
                message={generateCashItemText(selectedItemForShare)}
                phoneNumber={selectedItemForShare.customer_phone}
                buttonText={t('receipt.share_whatsapp', 'Share via WhatsApp')}
                buttonClassName="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
              />

              <button
                onClick={handleCloseShareModal}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav industry={industry} country={country} />
    </div>
  );
}