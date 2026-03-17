"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Clock, CheckCircle, AlertCircle, Calendar, Search, Filter, Copy, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { formatCurrency, getCurrency } from '@/utils/currency';
import { useCredit } from '@/hooks';
import { useBusiness } from '@/contexts/BusinessContext';
import { useLanguage } from '@/hooks/LanguageContext';
import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import PaymentModal from '@/components/universal/PaymentModal';
import WhatsAppShare from '@/components/universal/WhatsAppShare';

export default function CreditPage() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const { t } = useLanguage();
  
  // Use Supabase hook instead of mock data
  const { business } = useBusiness();
  const { credit, loading, insert: addCredit, getTotalOwed, getOverdueAmount, getOverdueCredit, getOutstandingCredit, getPartialCredit, markAsPaid, makePartialPayment } = useCredit({ 
    industry,
    businessId: business?.id 
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'outstanding' | 'partial' | 'paid'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedCreditForShare, setSelectedCreditForShare] = useState<any>(null);
  const [copiedCredit, setCopiedCredit] = useState<string | null>(null);

  const outstandingCredit = getOutstandingCredit();
  const partialCredit = getPartialCredit();
  const overdueCredit = getOverdueCredit();
  
  const totalOwed = getTotalOwed();
  const overdueAmount = getOverdueAmount();

  const filteredCredit = credit.filter(item => {
    const matchesSearch = item.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddCredit = async (newCredit: any) => {
    if (!business?.id) {
      console.error('No business ID found');
      return;
    }
    
    // Get currency from business country
    const currency = getCurrency(business.country || country);
    
    await addCredit({
      ...newCredit,
      business_id: business.id,
      industry,
      currency,
      date_given: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(false);
  };

  const handleUpdateCredit = async (id: string, updates: any) => {
    // This would be handled by the useCredit hook update function
    // For now, just close modal
    setShowAddModal(false);
  };

  const handleDeleteCredit = async (id: string) => {
    // This would be handled by the useCredit hook delete function
    // For now, just close detail view
    setShowAddModal(false);
  };

  const handlePayment = async (creditId: string, paymentAmount: number) => {
    await makePartialPayment(creditId, paymentAmount);
  };

  const handleCustomerClick = (customer: any) => {
    setSelectedCustomer(customer);
    setShowPaymentModal(true);
  };

  const generateCreditDetailsText = (creditItem: any): string => {
    const remainingAmount = creditItem.status === 'partial' ? creditItem.amount - (creditItem.paid_amount || 0) : creditItem.amount;
    const daysOverdue = creditItem.due_date ? Math.ceil((new Date().getTime() - new Date(creditItem.due_date).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    let text = `${t('credit.reminder_from', 'Credit Reminder from')} ${business?.businessName || t('business.default_name', 'My Business')}\n\n`;
    text += `${t('common.customer', 'Customer')}: ${creditItem.customer_name}\n`;
    text += `${t('credit.amount_owed', 'Amount Owed')}: ${formatCurrency(remainingAmount, country)}\n`;
    text += `${t('credit.original_amount', 'Original Amount')}: ${formatCurrency(creditItem.amount, country)}\n`;
    
    if (creditItem.status === 'partial') {
      text += `${t('credit.amount_paid', 'Amount Paid')}: ${formatCurrency(creditItem.paid_amount || 0, country)}\n`;
    }
    
    text += `${t('credit.date_given', 'Date Given')}: ${new Date(creditItem.date_given).toLocaleDateString()}\n`;
    
    if (creditItem.due_date) {
      text += `${t('credit.due_date', 'Due Date')}: ${new Date(creditItem.due_date).toLocaleDateString()}\n`;
      if (daysOverdue > 0) {
        text += `${t('credit.days_overdue', 'Days Overdue')}: ${daysOverdue}\n`;
      }
    }
    
    text += `\n${t('credit.payment_request', 'Please arrange payment as soon as possible. Thank you!')}`;
    
    return text;
  };

  const handleCopyCreditDetails = async (creditItem: any) => {
    const creditText = generateCreditDetailsText(creditItem);
    
    try {
      await navigator.clipboard.writeText(creditText);
      setCopiedCredit(creditItem.id);
      setTimeout(() => setCopiedCredit(null), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy credit details:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = creditText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedCredit(creditItem.id);
      setTimeout(() => setCopiedCredit(null), 2000);
    }
  };

  const handleShareCredit = (creditItem: any) => {
    setSelectedCreditForShare(creditItem);
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setSelectedCreditForShare(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'outstanding':
        return <AlertCircle size={16} className="text-orange-500" />;
      case 'partial':
        return <Clock size={16} className="text-blue-500" />;
      case 'paid':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'outstanding':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'partial':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'paid':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status !== 'paid' && new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header industry={industry} country={country} />

      <div className="p-4 max-w-md mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900 mb-6"
        >
          {t('credit')}
        </motion.h1>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Users className="text-gray-600" size={16} />
              {t('credit.total_owed')}
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalOwed, country)}
            </div>
            <div className="text-xs text-gray-500">{credit.length} {t('credit.customers')}</div>
          </div>

          <div className="bg-red-50 p-4 rounded-xl border border-red-200">
            <div className="flex items-center gap-2 text-sm text-red-700 mb-1">
              <AlertCircle size={16} />
              {t('credit.overdue')}
            </div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(overdueAmount, country)}
            </div>
            <div className="text-xs text-red-500">{overdueCredit.length} {t('credit.overdue')}</div>
          </div>
        </motion.div>

        {/* Add Credit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            {t('credit.add_credit_customer')}
          </button>
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
              placeholder={t('credit.search_customers')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {t('credit.all')}
            </button>
            <button
              onClick={() => setFilterStatus('outstanding')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'outstanding'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {t('credit.outstanding')}
            </button>
            <button
              onClick={() => setFilterStatus('paid')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'paid'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {t('credit.paid')}
            </button>
          </div>
        </motion.div>

        {/* Overdue Alerts */}
        {overdueCredit.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-red-50 p-4 rounded-xl border border-red-200 mb-4"
          >
            <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
              <AlertCircle size={20} />
              {t('credit.overdue_payments')}
            </h3>
            <div className="space-y-2">
              {overdueCredit.map(c => {
                const remainingAmount = c.status === 'partial' ? c.amount - c.paid_amount : c.amount;
                return (
                  <div key={c.id} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-900">{c.customer_name}</span>
                      <span className="text-xs text-red-600 ml-2">
                        {Math.ceil((new Date().getTime() - new Date(c.due_date || '').getTime()) / (1000 * 60 * 60 * 24))} {t('credit.days_overdue')}
                      </span>
                    </div>
                    <span className="font-bold text-red-600">{formatCurrency(remainingAmount, country)}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* All Credit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-4 border border-gray-200"
        >
          <h3 className="font-semibold text-gray-900 mb-3">{t('credit.all_customers')}</h3>
          
          {filteredCredit.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <Users size={48} className="mx-auto" />
              </div>
              <p className="text-gray-600">{t('credit.no_credit_customers_found')}</p>
              <p className="text-sm text-gray-500 mt-1">{t('credit.start_by_adding_first_customer')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCredit.map((item, index) => {
                const remainingAmount = item.status === 'partial' ? item.amount - item.paid_amount : item.amount;
                const overdue = isOverdue(item.due_date || '', item.status);
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    onClick={() => handleCustomerClick(item)}
                    className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                      overdue 
                        ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                        : item.status === 'paid'
                        ? 'bg-green-50 border-green-200 hover:bg-green-100'
                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <div className="font-medium text-gray-900">{item.customer_name}</div>
                          <div className="text-xs text-gray-500">
                            Given: {new Date(item.date_given).toLocaleDateString()}
                            {overdue && (
                              <span className="text-red-600 ml-2 font-medium">
                                {Math.ceil((new Date().getTime() - new Date(item.due_date || '').getTime()) / (1000 * 60 * 60 * 24))} {t('credit.days_overdue')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {formatCurrency(remainingAmount, country)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Due: {new Date(item.due_date || '').toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${getStatusColor(item.status)}`}>
                        {item.status}
                      </div>
                      
                      {/* Copy and Share Buttons */}
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyCreditDetails(item);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            copiedCredit === item.id
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={copiedCredit === item.id ? t('common.copied', 'Copied!') : t('common.copy', 'Copy Details')}
                        >
                          <Copy size={14} />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareCredit(item);
                          }}
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          title={t('credit.share_via_whatsapp', 'Share via WhatsApp')}
                        >
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </div>

                    {item.status === 'partial' && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{t('credit.original')}: {formatCurrency(item.amount, country)}</span>
                          <span>{t('credit.paid')}: {formatCurrency(item.paid_amount || 0, country)}</span>
                          <span>{t('credit.remaining')}: {formatCurrency(remainingAmount, country)}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <BottomNav industry={industry} country={country} />

      {/* Add Credit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('credit.add_credit_customer')}</h3>
            
            <AddCreditForm onSubmit={handleAddCredit} onCancel={() => setShowAddModal(false)} t={t} />
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {selectedCustomer && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedCustomer(null);
          }}
          customer={selectedCustomer}
          country={country}
          onPayment={handlePayment}
        />
      )}

      {/* WhatsApp Share Modal */}
      {showShareModal && selectedCreditForShare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('credit.share_credit_details', 'Share Credit Details')}</h3>
            
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <div className="font-medium text-gray-900 mb-1">{selectedCreditForShare.customer_name}</div>
              <div className="text-sm text-gray-600">
                {t('credit.amount_owed', 'Amount Owed')}: {formatCurrency(
                  selectedCreditForShare.status === 'partial' 
                    ? selectedCreditForShare.amount - (selectedCreditForShare.paid_amount || 0)
                    : selectedCreditForShare.amount, 
                  country
                )}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  handleCopyCreditDetails(selectedCreditForShare);
                  handleCloseShareModal();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
              >
                <Copy size={18} />
                {t('common.copy', 'Copy to Clipboard')}
              </button>

              <WhatsAppShare
                message={generateCreditDetailsText(selectedCreditForShare)}
                buttonText={t('credit.share_via_whatsapp', 'Share via WhatsApp')}
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

function AddCreditForm({ onSubmit, onCancel, t }: { 
  onSubmit: (data: any) => void, 
  onCancel: () => void,
  t: (key: string, defaultText?: string, vars?: Record<string, any>) => string 
}) {
  const [formData, setFormData] = useState({
    customer_name: '',
    amount: '',
    due_date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('credit.customer_name')}</label>
        <input
          type="text"
          required
          value={formData.customer_name}
          onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t('credit.customer_name')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('credit.amount_owed')}</label>
        <input
          type="number"
          required
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('credit.due_date')}</label>
        <input
          type="date"
          required
          value={formData.due_date}
          onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {t('credit.cancel')}
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t('credit.add_customer')}
        </button>
      </div>
    </form>
  );
}
