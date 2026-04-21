"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search, ArrowUpDown, Copy, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { formatCurrency, getCurrency } from '@/utils/currency';
import { useTransactionsTanStack, useCreditTanStack, useCreditItems } from '@/hooks/index';
import { CreditCustomer } from '@/app/Beezee-App/services/creditService';
import { useLanguage } from '@/hooks/useLanguage';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/index';
import {
  Header,
  BottomNav,
  PageLoading,
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

  // ✅ STEP 3: Toast hook
  const { showSuccess, showError } = useToast();

  const { data: transactions, isLoading, addTransaction, refetch: refetchTransactions } = useTransactionsTanStack({
    industry,
    businessId
  });

  // Filter transactions by type for display purposes
  const moneyInTransactions = transactions?.filter(t => t.type === 'money_in') || [];
  const moneyOutTransactions = transactions?.filter(t => t.type === 'money_out') || [];

  // ✅ STEP 5: Safely extract data with fallbacks
  const isTransactionsOffline = isLoading || false;
  const isTransactionsPending = isLoading || false;

  // Credit data extraction
  const { data: credit, addCredit, updateCredit } = creditHook;
  const addCreditItem = creditItemsHook?.addCreditItem || (() => Promise.resolve());

  // ✅ STEP 6: Derived state
  const isOffline = isTransactionsOffline || isNetworkOffline;

  // ✅ STEP 7: useState hooks
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedItemForShare, setSelectedItemForShare] = useState<any>(null);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);

  // ✅ STEP 8: Combined data for display
  const allCashFlow = [...moneyInTransactions, ...moneyOutTransactions].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // ✅ STEP 9: useEffect hooks
  useEffect(() => {
    console.log('[CashPage] Business ID:', businessId);
    console.log('[CashPage] Money In transactions count:', moneyInTransactions.length);
    console.log('[CashPage] Money Out transactions count:', moneyOutTransactions.length);
    console.log('[CashPage] Total transactions count:', transactions.length);
    console.log('[CashPage] Offline status:', isOffline);
  }, [businessId, moneyInTransactions.length, moneyOutTransactions.length, transactions.length, isOffline]);

  // ✅ Handler: Money In
  const handleMoneyIn = async (transactionData: any) => {
    setIsAddingTransaction(true);
    try {
      if (!businessId) {
        console.error('[CashPage] No business ID available for transaction');
        showError(t('alert.setup_profile_first', 'Please set up your business profile first before adding transactions.'));
        return;
      }

      if (transactionData.payment_method === 'credit' && transactionData.customer_name) {
        const existingCredit = findMatchingCreditCustomer((credit as CreditCustomer[]) || [], transactionData.customer_name, 'receivable');

        if (existingCredit) {
          await addCreditItem({
            name: transactionData.description || generateDefaultDescription(transactionData.customer_name, 'Credit purchase'),
            price: transactionData.amount,
            category: 'credit',
            business_id: businessId
          });

          const newTotalAmount = calculateNewCreditTotal(existingCredit.amount, transactionData.amount);
          await updateCredit(existingCredit.id, {
            amount: newTotalAmount,
            due_date: transactionData.due_date,
            updated_at: new Date().toISOString(),
            status: 'outstanding'
          });
        } else {
          const newCredit: any = await addCredit({
            business_id: businessId,
            customer_name: transactionData.customer_name,
            amount: transactionData.amount,
            due_date: transactionData.due_date,
            notes: transactionData.description,
            status: 'outstanding',
            industry,
            currency: getCurrency(country),
            date_given: transactionData.transaction_date
          });

          const creditId = newCredit?.id;
          if (creditId) {
            await addCreditItem({
              name: transactionData.description || generateDefaultDescription(transactionData.customer_name, 'Credit purchase'),
              price: transactionData.amount,
              category: 'credit',
              business_id: businessId
            });
          }
        }

        // ✅ FIX: Use correct query key structure matching the hooks
        queryClient.invalidateQueries({ queryKey: ['credit'] });
        queryClient.invalidateQueries({ queryKey: ['credit-items'] });
      }

      await addTransaction({
        ...transactionData,
        type: 'money_in',
        business_id: businessId,
        industry
      });

      // ✅ FIX: Use correct query key structure matching useTransactionsTanStack
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      // ✅ IMMEDIATE REFETCH: Ensure data updates immediately
      await refetchTransactions();

      showSuccess(`Money in: ${formatCurrency(transactionData.amount, country)} received successfully!`);
    } catch (error) {
      console.error('Failed to add transaction:', error);
      showError(t('alert.failed_transaction', 'Failed to add transaction. Please try again.'));
    } finally {
      setIsAddingTransaction(false);
    }
  };

  // ✅ Handler: Money Out
  const handleMoneyOut = async (expenseData: any) => {
    setIsAddingTransaction(true);
    try {
      if (!businessId) {
        console.error('[CashPage] No business ID available for transaction');
        showError(t('alert.setup_profile_first_expenses', 'Please set up your business profile first before adding transactions.'));
        return;
      }

      if (expenseData.payment_method === 'credit' && expenseData.customer_name) {
        const existingCredit = credit?.find((c: any) =>
          c.customer_name.toLowerCase() === expenseData.customer_name.toLowerCase() &&
          c.type === 'payable'
        );

        let creditId = existingCredit?.id;

        if (existingCredit) {
          await addCreditItem({
            name: expenseData.description || t('credit.expense', 'Credit expense'),
            price: expenseData.amount,
            category: 'credit',
            business_id: businessId
          });

          const newTotalAmount = existingCredit.amount + expenseData.amount;
          await updateCredit(existingCredit.id, {
            amount: newTotalAmount,
            due_date: expenseData.due_date,
            industry,
            currency: getCurrency(country),
            date_given: expenseData.expense_date || new Date().toISOString().split('T')[0]
          });

          // creditId is already set from existingCredit.id above

          if (creditId) {
            await addCreditItem({
              name: expenseData.description || t('credit.expense', 'Credit expense'),
              price: expenseData.amount,
              category: 'credit',
              business_id: businessId
            });
          }
        }

        // ✅ FIX: Use correct query key structure matching the hooks
        queryClient.invalidateQueries({ queryKey: ['credit'] });
        queryClient.invalidateQueries({ queryKey: ['credit-items'] });
      }

      // Convert expense data to transaction data with money_out type
      const transactionData = {
        business_id: businessId,
        type: 'money_out' as const,
        industry,
        amount: expenseData.amount,
        currency: getCurrency(country),
        description: expenseData.description,
        category: expenseData.category,
        payment_method: expenseData.payment_method,
        transaction_date: expenseData.expense_date || new Date().toISOString().split('T')[0],
        vendor_name: expenseData.customer_name || undefined,
        supplier_phone: expenseData.customer_phone || undefined
      };

      // Use unified transaction system
      await addTransaction(transactionData);

      // ✅ FIX: Use correct query key structure matching useTransactionsTanStack
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      // ✅ IMMEDIATE REFETCH: Ensure data updates immediately
      await refetchTransactions();

      showSuccess(`Money out: ${formatCurrency(expenseData.amount, country)} paid successfully!`);
    } catch (error) {
      console.error('Failed to add transaction:', error);
      showError(t('alert.failed_expense', 'Failed to add transaction. Please try again.'));
    } finally {
      setIsAddingTransaction(false);
    }
  };

  // ✅ STEP 10: Filtered cash flow
  const filteredCashFlow = allCashFlow.filter(item => {
    const matchesSearch = !searchTerm || (
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.customer_name && item.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.vendor_name && item.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const matchesType = filterType === 'all' || 
      (filterType === 'in' && item.type === 'money_in') || 
      (filterType === 'out' && item.type === 'money_out');
    return matchesSearch && matchesType;
  });

  const generateCashItemText = (item: any): string => {
    const date = item.transaction_date;
    let text = `${t('receipt.receipt_from', 'Receipt from')} ${business?.business_name || t('business.default_name', 'My Business')}\n\n`;
    text += `${t('receipt.description', 'Description')}: ${item.description}\n`;
    text += `${t('receipt.amount', 'Amount')}: ${item.type === 'money_in' ? '+' : '-'}${formatCurrency(item.amount, country)}\n`;
    text += `${t('receipt.date', 'Date')}: ${new Date(date).toLocaleDateString()}\n`;
    if (item.type === 'money_in' && item.customer_name) {
      text += `${t('receipt.customer', 'Customer')}: ${item.customer_name}\n`;
    }
    if (item.type === 'money_out' && item.vendor_name) {
      text += `${t('business.suppliers', 'Supplier')}: ${item.vendor_name}\n`;
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
    .filter(item => (item.transaction_date) === today && item.type === 'money_in')
    .reduce((sum, item) => sum + item.amount, 0);
  const todayMoneyOut = allCashFlow
    .filter(item => (item.transaction_date) === today && item.type === 'money_out')
    .reduce((sum, item) => sum + item.amount, 0);
  const todayProfit = todayMoneyIn - todayMoneyOut;

  // ✅ STEP 11: Loading state
  if (authLoading && !isOffline) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <PageLoading message={t('cash.loading_cash_flow', 'Loading cash flow...')} fullScreen={false} />
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
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">{t('cash.business_setup_required', 'Business Setup Required')}</h2>
            <p className="text-yellow-700 mb-4">{t('cash.complete_business_profile', 'Please complete your business profile to start adding transactions.')}</p>
            <Link
              href="/Beezee-App/setup"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              {t('cash.set_up_business', 'Set Up Business')}
            </Link>
          </div>
        </div>
        <BottomNav industry={industry} country={country} />
      </div>
    );
  }

  // ✅ STEP 13: Main render
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header industry={industry} country={country} />

      <main className="flex-1 container mx-auto px-4 pt-24 py-6 max-w-md">

        {/* Top Action Buttons */}
        <div className="flex justify-end gap-3 mb-6">
          <MoneyInButton
            industry={industry}
            country={country}
            businessId={businessId || ''}
            onSuccess={handleMoneyIn}
            disabled={!businessId || isAddingTransaction}
          />
          <MoneyOutButton
            industry={industry}
            country={country}
            onSuccess={handleMoneyOut}
            disabled={!businessId || isAddingTransaction}
          />
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
          <h3 className="font-bold text-[var(--text-1)] mb-4">{t('cash.recent_activity', 'Recent Activity')}</h3>

          {filteredCashFlow.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <ArrowUpDown size={48} className="mx-auto" />
              </div>
              <p className="text-gray-600">{t('cash.no_cash_activity_found', 'No cash activity found')}</p>
              <p className="text-sm text-gray-500 mt-1">{t('cash.start_by_recording_first_transaction', 'Start by recording your first transaction')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCashFlow.map((item: any) => (
                <div key={item.id} className="glass-card p-4 border border-[var(--border)] animate-fade-in">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-[var(--text-1)] mb-1">
                        {item.description}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[var(--text-3)]">
                        <span>{new Date(item.transaction_date).toLocaleDateString()}</span>
                        {item.customer_name && <span>{item.customer_name}</span>}
                        {item.vendor_name && <span>{item.vendor_name}</span>}
                        {item.status === 'pending' && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                            {t('common.pending', 'Pending')}
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
                        {item.type === 'money_in' ? '+' : '-'}{formatCurrency(item.amount, country)}
                      </div>

                      <div className="flex gap-1 mt-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopyItem(item); }}
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
                          onClick={(e) => { e.stopPropagation(); handleShareItem(item); }}
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
                onClick={() => { handleCopyItem(selectedItemForShare); handleCloseShareModal(); }}
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