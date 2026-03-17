"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Calendar, Filter, Search, Receipt, Copy, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { formatCurrency } from '@/utils/currency';
import { useTransactions } from '@/hooks';
import { useBusiness } from '@/contexts/BusinessContext';
import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import MoneyInButton from '@/components/universal/MoneyInButton';
import ReceiptGenerator from '@/components/universal/ReceiptGenerator';
import WhatsAppShare from '@/components/universal/WhatsAppShare';
import { useLanguage } from '@/hooks/LanguageContext';

export default function TransactionsPage() {
  const { t } = useLanguage();
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  
  // Use Supabase hook instead of mock data
  const { business } = useBusiness();
  const { transactions, loading, insert: addTransaction } = useTransactions({ 
    industry,
    businessId: business?.id 
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [copiedTransaction, setCopiedTransaction] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTransactionForShare, setSelectedTransactionForShare] = useState<any>(null);

  const handleNewTransaction = async (newTransaction: any) => {
    if (!business?.id) {
      console.error('No business ID found');
      return;
    }
    
    await addTransaction({
      ...newTransaction,
      business_id: business.id,
      industry,
      transaction_date: new Date().toISOString().split('T')[0]
    });
  };

  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowReceiptModal(true);
  };

  const handleCloseReceiptModal = () => {
    setShowReceiptModal(false);
    setSelectedTransaction(null);
  };

  const generateReceiptText = (transaction: any): string => {
    let text = `${t('receipt.receipt_from', 'Receipt from')} ${business?.businessName || t('business.default_name', 'My Business')}\n\n`;
    text += `${t('receipt.transaction_id', 'Transaction ID')}: #${transaction.id}\n`;
    text += `${t('receipt.date', 'Date')}: ${new Date(transaction.transaction_date).toLocaleDateString()}\n`;
    text += `${t('receipt.description', 'Description')}: ${transaction.description}\n`;
    
    if (transaction.customer_name) {
      text += `${t('receipt.customer', 'Customer')}: ${transaction.customer_name}\n`;
    }
    
    text += `${t('receipt.amount', 'Amount')}: ${formatCurrency(transaction.amount, country)}\n`;
    
    if (transaction.payment_method) {
      text += `${t('receipt.payment_method', 'Payment Method')}: ${transaction.payment_method}\n`;
    }
    
    text += `\n${t('receipt.thank_you', 'Thank you for your business!')}`;
    
    return text;
  };

  const handleCopyReceipt = async (transaction: any) => {
    const receiptText = generateReceiptText(transaction);
    
    try {
      await navigator.clipboard.writeText(receiptText);
      setCopiedTransaction(transaction.id);
      setTimeout(() => setCopiedTransaction(null), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy receipt:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = receiptText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedTransaction(transaction.id);
      setTimeout(() => setCopiedTransaction(null), 2000);
    }
  };

  const handleShareReceipt = (transaction: any) => {
    setSelectedTransactionForShare(transaction);
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setSelectedTransactionForShare(null);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.customer_name || 'No customer').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = filterDate === 'all' || transaction.transaction_date === filterDate;
    
    return matchesSearch && matchesDate;
  });

  const totalSales = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const todaySales = filteredTransactions
    .filter(t => t.transaction_date === new Date().toISOString().split('T')[0])
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header industry={industry} country={country} />

      <div className="p-4 max-w-md mx-auto pt-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 p-4 rounded-xl border border-green-200"
          >
            <div className="flex items-center gap-2 text-sm text-green-700 mb-1">
              <TrendingUp size={16} />
              {t('common.today', 'Today')}
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(todaySales, country)}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-50 p-4 rounded-xl border border-blue-200"
          >
            <div className="flex items-center gap-2 text-sm text-blue-700 mb-1">
              <Calendar size={16} />
              {t('common.total', 'Total')}
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalSales, country)}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl p-4 border border-gray-200 mb-6"
        >
          <h3 className="font-bold text-gray-900 mb-4">{t('cash.recent_activity', 'Recent Activity')}</h3>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <TrendingUp size={48} className="mx-auto" />
              </div>
              <p className="text-gray-600">{t('transactions.no_found', 'No transactions found')}</p>
              <p className="text-sm text-gray-500 mt-1">{t('transactions.start_first', 'Start by adding your first sale')}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {transactions.slice(0, 5).map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">
                      {transaction.description}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{new Date(transaction.transaction_date).toLocaleDateString()}</span>
                      {transaction.customer_name && (
                        <span>{transaction.customer_name}</span>
                      )}
                      {transaction.payment_method && (
                        <span className={`px-2 py-1 rounded-full ${
                          transaction.payment_method === 'cash' 
                            ? 'bg-green-100 text-green-700'
                            : transaction.payment_method === 'transfer'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {transaction.payment_method}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      +{formatCurrency(transaction.amount, country)}
                    </div>
                    
                    {/* Copy and Share Buttons */}
                    <div className="flex gap-1 mt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyReceipt(transaction);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          copiedTransaction === transaction.id
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={copiedTransaction === transaction.id ? t('common.copied', 'Copied!') : t('common.copy', 'Copy Details')}
                      >
                        <Copy size={14} />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareReceipt(transaction);
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

        {/* Add Transaction Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <MoneyInButton 
            industry={industry} 
            country={country}
            onSuccess={handleNewTransaction}
          />
        </motion.div>

        {/* Search and Filter */}
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
              placeholder={t('transactions.search_placeholder', 'Search transactions...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterDate('all')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterDate === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {t('common.all', 'All')}
            </button>
            <button
              onClick={() => setFilterDate(new Date().toISOString().split('T')[0])}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterDate === new Date().toISOString().split('T')[0]
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {t('common.today', 'Today')}
            </button>
            <button
              onClick={() => setFilterDate('2026-03-10')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterDate === '2026-03-10'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {t('common.yesterday', 'Yesterday')}
            </button>
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="text-gray-400 mb-2">
                <TrendingUp size={48} className="mx-auto" />
              </div>
              <p className="text-gray-600">{t('transactions.no_found', 'No transactions found')}</p>
              <p className="text-sm text-gray-500 mt-1">{t('transactions.start_first', 'Start by adding your first sale')}</p>
            </div>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-xl p-4 border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
                onClick={() => handleTransactionClick(transaction)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">
                      {transaction.description}
                    </div>
                    {transaction.customer_name && (
                      <div className="text-sm text-gray-500 mb-1">
                        {t('common.customer', 'Customer')}: {transaction.customer_name}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{new Date(transaction.transaction_date).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        transaction.payment_method === 'cash' 
                          ? 'bg-green-100 text-green-700'
                          : transaction.payment_method === 'transfer'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {transaction.payment_method}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">
                      +KES {transaction.amount.toLocaleString()}
                    </div>
                    
                    {/* Receipt Action Buttons */}
                    <div className="flex gap-1 mt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyReceipt(transaction);
                        }}
                        className={`p-1 rounded transition-colors ${
                          copiedTransaction === transaction.id
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={copiedTransaction === transaction.id ? t('common.copied', 'Copied!') : t('common.copy_to_clipboard', 'Copy Receipt')}
                      >
                        <Copy size={12} />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareReceipt(transaction);
                        }}
                        className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        title={t('receipt.share_whatsapp', 'Share via WhatsApp')}
                      >
                        <MessageSquare size={12} />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTransactionClick(transaction);
                        }}
                        className="p-1 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        title={t('receipt.view_details', 'View Receipt Details')}
                      >
                        <Receipt size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      <BottomNav industry={industry} country={country} />

      {/* Receipt Modal */}
      {selectedTransaction && (
        <ReceiptGenerator
          isOpen={showReceiptModal}
          onClose={handleCloseReceiptModal}
          transaction={selectedTransaction}
          businessName={business?.businessName || t('business.default_name', 'My Business')}
          country={country}
          customerPhone={selectedTransaction.customer_phone}
        />
      )}

      {/* WhatsApp Share Modal */}
      {showShareModal && selectedTransactionForShare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('receipt.share_receipt', 'Share Receipt')}</h3>
            
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <div className="font-medium text-gray-900 mb-1">{selectedTransactionForShare.description}</div>
              <div className="text-sm text-gray-600">
                {formatCurrency(selectedTransactionForShare.amount, country)}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  handleCopyReceipt(selectedTransactionForShare);
                  handleCloseShareModal();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
              >
                <Copy size={18} />
                {t('common.copy_to_clipboard', 'Copy to Clipboard')}
              </button>

              <WhatsAppShare
                message={generateReceiptText(selectedTransactionForShare)}
                phoneNumber={selectedTransactionForShare.customer_phone}
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
    </div>
  );
}
