"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar, Filter, Search, ArrowUpDown, Copy, MessageSquare, RefreshCw, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { formatCurrency } from '@/utils/currency';
import { useTransactionsTanStack, useExpensesTanStack } from '@/hooks';
import { useLanguage } from '@/hooks/LanguageContext';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useToast } from '@/hooks/useToast';
import { 
  Header, 
  BottomNav,
  PageLoading,
  PageLoadingBar
} from '@/components/universal';
import MoneyInButton from '@/components/universal/MoneyInButton';
import MoneyOutButton from '@/components/universal/MoneyOutButton';
import WhatsAppShare from '@/components/universal/WhatsAppShare';
import { handleCreditTransaction } from '@/services/creditService';

export default function CashPage() {
  // ✅ STEP 1: ALL hooks called at top level, unconditionally
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const { t } = useLanguage();
  
  const { business, loading: authLoading } = useUnifiedAuth();
  const businessId = business?.id;
  
  // ✅ STEP 2: Network status detection
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
  
  // ✅ STEP 3: Show offline component if network is offline
  if (isNetworkOffline) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-900">Cash Transactions</h1>
        </div>
        
        {/* Offline Message */}
        <div className="p-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <WifiOff className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-yellow-900 mb-2">
              You're Offline
            </h2>
            <p className="text-yellow-700 mb-4">
              Cash transactions are not available offline. Please check your internet connection and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
          
          {/* Recent Transactions Placeholder */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Recent Transactions</h3>
            </div>
            <div className="p-8 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <WifiOff className="w-8 h-8 text-gray-400" />
              </div>
              <p>Connect to the internet to view your cash transactions</p>
            </div>
          </div>
        </div>
        
        <BottomNav industry={industry} country={country} />
      </div>
    );
  }
  
  // ✅ STEP 2: Toast hook
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  
  // ✅ STEP 3: Data hooks - ALWAYS called, but with safe defaults
  const transactionsHook = useTransactionsTanStack({ 
    businessId: businessId,
    industry: business?.industry || industry,
    country: country
  });
  const expensesHook = useExpensesTanStack({ 
    businessId: businessId,
    industry: business?.industry || industry,
    country: country
  });
  
  // ✅ STEP 4: Safely extract data with fallbacks
  const transactions = transactionsHook?.data || [];
  const expenses = expensesHook?.data || [];
  const isTransactionsOffline = transactionsHook?.isOffline || false;
  const isExpensesOffline = expensesHook?.isOffline || false;
  const isTransactionsPending = transactionsHook?.isAdding || false;
  const isExpensesPending = expensesHook?.isPending || false;
  const addTransaction = transactionsHook?.addTransaction || (() => Promise.resolve());
  const addExpense = expensesHook?.addExpense || (() => Promise.resolve());
  const isTransactionsLoading = transactionsHook?.isLoading || false;
  const isExpensesLoading = expensesHook?.isLoading || false;
  
  // ✅ STEP 5: Derived state
  const isOffline = isTransactionsOffline || isExpensesOffline;
  const isSyncing = isTransactionsPending || isExpensesPending;
  const totalPending = (isTransactionsPending ? 1 : 0) + (isExpensesPending ? 1 : 0);
  
  // ✅ STEP 6: useState hooks - all called unconditionally
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedItemForShare, setSelectedItemForShare] = useState<any>(null);
  
  // ✅ STEP 7: Combined data for display
  const allCashFlow = [
    ...transactions.map((t: any) => ({ ...t, type: 'in' as const })),
    ...expenses.map((e: any) => ({ ...e, type: 'out' as const }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  // ✅ STEP 8: useEffect hooks - all called unconditionally
  useEffect(() => {
    console.log('[CashPage] Business ID:', businessId);
    console.log('[CashPage] Transactions count:', transactions.length);
    console.log('[CashPage] Expenses count:', expenses.length);
  }, [businessId, transactions.length, expenses.length]);
  
  // ✅ STEP 9: Handler functions
  const handleMoneyIn = async (transactionData: any) => {
    console.log('🚀 [CashPage] handleMoneyIn START', { businessId, isOffline });
    
    if (!businessId) {
      console.error('❌ [CashPage] No business ID');
      showError('Please set up your business profile first before adding transactions.');
      return;
    }
    
    // Remove due_date from transaction data as it belongs to credit table, not transactions table
    const { due_date, ...cleanTransactionData } = transactionData;
    
    const fullTransactionData = {
      ...cleanTransactionData,
      business_id: businessId,
      industry,
      transaction_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };

    console.log('� [CashPage] Transaction data prepared:', {
      fullTransactionData,
      isOffline,
      hasAddTransaction: typeof addTransaction === 'function'
    });

    try {
      // Step 1: Create the transaction
      console.log('� [CashPage] Calling addTransaction...');
      const result = await addTransaction(fullTransactionData);
      console.log('✅ [CashPage] addTransaction completed:', { result, isOffline });
      
      // Step 2: If payment method is 'credit', handle credit record
      if (transactionData.payment_method === 'credit' && transactionData.customer_name) {
        console.log('💳 [CashPage] Credit transaction detected, processing credit record...');
        
        const { credit, wasExisting } = await handleCreditTransaction(
          transactionData.customer_name,
          transactionData.amount,
          transactionData.due_date,
          businessId
        );
        
        const formattedAmount = formatCurrency(transactionData.amount, country);
        
        if (wasExisting) {
          showSuccess(
            `Transaction added! Credit balance updated for "${credit.customer_name}". ` +
            `New total owed: ${formatCurrency(credit.amount, country)}`
          );
          console.log(`✅ [CashPage] Added ${formattedAmount} to existing credit for ${credit.customer_name}`);
        } else {
          showSuccess(
            `Transaction added! New credit record created for "${credit.customer_name}" for ${formattedAmount}. ` +
            `Due date: ${new Date(credit.due_date!).toLocaleDateString()}`
          );
          console.log(`✅ [CashPage] Created new credit record for ${credit.customer_name}`);
        }
      } else {
        showSuccess('Transaction added successfully');
        console.log('✅ [CashPage] Regular transaction completed successfully');
      }
      
    } catch (error) {
      console.error('❌ [CashPage] Failed to add transaction:', error);
      showError('Failed to add transaction. Please try again.');
    }
    
    console.log('🏁 [CashPage] handleMoneyIn END');
  };
  
  const handleMoneyOut = async (expenseData: any) => {
    console.log('🚀 [CashPage] handleMoneyOut START', { businessId, isOffline });
    
    if (!businessId) {
      console.error('❌ [CashPage] No business ID for expense');
      showError('Please set up your business profile first before adding expenses.');
      return;
    }
    
    const { payment_method, ...cleanExpenseData } = expenseData;
    
    const fullExpenseData = {
      ...cleanExpenseData,
      payment_method,
      business_id: businessId,
      industry,
      expense_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };

    console.log('📝 [CashPage] Expense data prepared:', {
      fullExpenseData,
      isOffline,
      hasAddExpense: typeof addExpense === 'function'
    });

    try {
      // Use TanStack mutation which handles online/offline automatically
      console.log('💾 [CashPage] Calling addExpense...');
      const result = await addExpense(fullExpenseData);
      console.log('✅ [CashPage] addExpense completed:', { result, isOffline });
      
      // Show appropriate success message based on online status
      if (isOffline) {
        showInfo('Expense added - will sync when you\'re back online');
        console.log('✅ [CashPage] Expense queued for offline sync');
      } else {
        showSuccess('Expense added successfully');
        console.log('✅ [CashPage] Expense saved online');
      }
      
    } catch (error) {
      console.error('❌ [CashPage] Failed to add expense:', error);
      showError('Failed to add expense. Please try again.');
    }
    
    console.log('🏁 [CashPage] handleMoneyOut END');
  };
  
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
      console.error('Failed to copy item:', error);
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
  
  // ✅ STEP 10: Loading state - AFTER all hooks
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <PageLoading message="Loading cash flow..." fullScreen={false} />
      </div>
    );
  }
  
  // ✅ STEP 11: No business warning - AFTER all hooks
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
  
  // ✅ STEP 12: Main render
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header industry={industry} country={country} />
      
      <main className="flex-1 container mx-auto px-4 pt-24 py-6 max-w-md">
        {/* Sync Status */}
        {(isOffline || isSyncing) && (
          <div className="mb-4 p-3 rounded-lg border border-[var(--border)] bg-[var(--glass)] animate-fade-in">
            <div className="flex items-center gap-2 text-sm">
              {isSyncing && <RefreshCw size={16} className="animate-spin" />}
              <span className={`font-medium ${
                isOffline ? 'text-orange-600' : 'text-blue-600'
              }`}>
                {isOffline 
                  ? t('common.offline_mode', 'Offline Mode')
                  : isSyncing 
                  ? t('common.syncing_data', 'Syncing data...')
                  : t('common.online', 'Online')
                }
              </span>
              {totalPending > 0 && (
                <span className="text-xs text-gray-500">
                  ({totalPending} {t('common.pending', 'pending')})
                </span>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6 mt-8">
          <div className="add-transaction-btn flex-1">
            <MoneyInButton 
              industry={industry}
              country={country}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
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