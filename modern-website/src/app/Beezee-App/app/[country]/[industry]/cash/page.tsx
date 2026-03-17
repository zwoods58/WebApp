"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, Filter, Search, ArrowUpDown, Copy, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { formatCurrency } from '@/utils/currency';
import { useTransactions, useExpenses } from '@/hooks';
import { useLanguage } from '@/hooks/LanguageContext';
import { useBusiness } from '@/contexts/BusinessContext';
import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import MoneyInButton from '@/components/universal/MoneyInButton';
import MoneyOutButton from '@/components/universal/MoneyOutButton';
import WhatsAppShare from '@/components/universal/WhatsAppShare';
import { TourProvider, useTour } from '@/components/universal/MultiPageTour';

function CashPageContent() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const { t } = useLanguage();
  
  const { business } = useBusiness();
  const businessId = business?.id;
  
  
  const { transactions, loading: transactionsLoading, insert: addTransaction, fetchTransactions } = useTransactions({ 
    businessId: businessId,
    industry: business?.industry || industry
  });
  const { expenses, loading: expensesLoading, insert: addExpense } = useExpenses({ 
    businessId: businessId,
    industry: business?.industry || industry
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedItemForShare, setSelectedItemForShare] = useState<any>(null);

  // Combine transactions and expenses for cash flow
  const allCashFlow = [
    ...transactions.map((t: any) => ({ ...t, type: 'in' as const })),
    ...expenses.map((e: any) => ({ ...e, type: 'out' as const }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());


  const handleMoneyIn = async (transactionData: any) => {
    if (!businessId) {
      alert('Please set up your business profile first before adding transactions.');
      return;
    }
    
    await addTransaction({
      ...transactionData,
      business_id: businessId,
      industry
    });
  };

  const handleMoneyOut = async (expenseData: any) => {
    if (!businessId) {
      alert('Please set up your business profile first before adding expenses.');
      return;
    }
    
    const { payment_method, ...cleanExpenseData } = expenseData;
    
    await addExpense({
      ...cleanExpenseData,
      business_id: businessId,
      industry
    });
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
    
    let text = `${t('receipt.receipt_from', 'Receipt from')} ${business?.businessName || t('business.default_name', 'My Business')}\n\n`;
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
      setTimeout(() => setCopiedItem(null), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy item:', error);
      // Fallback for older browsers
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

  return (
    <div className="scroll-container bg-[var(--bg)]">
      <Header industry={industry} country={country} />

      <main className="scroll-content">
        <div className="p-5 max-w-md mx-auto pb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-[var(--text-1)] mb-6"
          >
            {t('cash')}
          </motion.h1>


          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div className="add-transaction-btn">
              <MoneyInButton 
                industry={industry}
                country={country}
                onSuccess={handleMoneyIn}
              />
            </div>
            <div className="add-transaction-btn">
              <MoneyOutButton 
                industry={industry}
                country={country}
                onSuccess={handleMoneyOut}
              />
            </div>
          </motion.div>

          {/* Today's Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
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
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 space-y-3"
          >
            <div className="relative">
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
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-5 border border-[var(--border)] transaction-list"
          >
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
              <div className="space-y-1">
                {filteredCashFlow.map((item: any, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center justify-between py-3 border-b border-[var(--border-soft)] last:border-b-0 hover:bg-[var(--bg2)] transition-colors"
                  >
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
                    
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        item.type === 'in' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger])'
                      }`}>
                        {item.type === 'in' ? '+' : '-'}{formatCurrency(item.amount, country)}
                      </div>
                      
                      {/* Copy and Share Buttons */}
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
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* WhatsApp Share Modal */}
      {showShareModal && selectedItemForShare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
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

export default function CashPage() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';

  return (
    <TourProvider industry={industry} country={country}>
      <CashPageContent />
    </TourProvider>
  );
}
