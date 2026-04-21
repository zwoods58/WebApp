"use client";

import React, { useState, useEffect } from 'react';
import { Users, Plus, Clock, CheckCircle, AlertCircle, Calendar, Search, Filter, Copy, MessageSquare, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import { formatCurrency, getCurrency } from '@/utils/currency';
import { useCreditTanStack, useTransactionsTanStack, useCreditItems } from '@/hooks/index';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/index';
import { findMatchingCreditCustomer, validateCreditData, generateDefaultDescription, calculateNewCreditTotal } from '@/utils/creditMatching';
import { addCreditUnified } from '@/app/Beezee-App/services/creditService';
import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import PaymentModal from '@/components/universal/PaymentModal';
import WhatsAppShare from '@/components/universal/WhatsAppShare';
import AddCreditLineItemModal from '@/components/credit/AddCreditLineItemModal';
import CreditCustomerCard from '@/components/credit/CreditCustomerCard';
import PayableCreditCard from '@/components/credit/PayableCreditCard';

export default function CreditPage() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const { t } = useLanguage();
  
  const { business } = useSupabaseAuth();
  
  // TanStack Query handles online/offline automatically
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  
  // ✅ ADDED: refetch to force refresh
  const { data: credit, isLoading, addCredit, addCreditAsync, updateCredit, updateCreditAsync, isOffline, refetch } = useCreditTanStack({ 
    industry,
    businessId: business?.id 
  });
  const { addTransaction, addTransactionAsync } = useTransactionsTanStack({ 
    industry,
    businessId: business?.id 
  });
  const addCreditItem = useCreditItems({ 
    businessId: business?.id,
    industry 
  });
  
  // ✅ ADDED: Refresh credit data when businessId is available
  useEffect(() => {
    if (business?.id) {
      console.log('🔄 [CreditPage] Refreshing credit data for business:', business.id);
      refetch();
    }
  }, [business?.id, refetch]);
  
  // Tab state for Customers/Personal split
  const [activeTab, setActiveTab] = useState<'customers' | 'personal'>('customers');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'outstanding' | 'partial' | 'paid'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedCreditForShare, setSelectedCreditForShare] = useState<any>(null);
  const [copiedCredit, setCopiedCredit] = useState<string | null>(null);
  const [showAddLineItemModal, setShowAddLineItemModal] = useState(false);
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate credit statistics from data
  // Helper function to check if credit is overdue
  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'paid' || !dueDate) return false;
    
    const dueDateTime = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDateTime.setHours(0, 0, 0, 0);
    
    return dueDateTime < today;
  };

  const creditData = credit || [];
  
  // Filter by tab type: customers (receivable) or personal (payable)
  const tabFilteredData = creditData.filter((c: any) => {
    const creditType = c.type || 'receivable'; // Default to receivable for existing data
    return activeTab === 'customers' ? creditType === 'receivable' : creditType === 'payable';
  });
  
  const outstandingCredit = tabFilteredData.filter((c: any) => c.status === 'outstanding');
  const partialCredit = tabFilteredData.filter((c: any) => c.status === 'partial');
  const overdueCredit = tabFilteredData.filter((c: any) => isOverdue(c.due_date || '', c.status));
  
  const totalOwed = tabFilteredData.reduce((sum: number, c: any) => {
    const remainingAmount = c.status === 'paid' ? 0 : 
                           c.status === 'partial' ? c.amount - (c.paid_amount || 0) : 
                           c.amount;
    console.log(`💳 Credit calculation: ${c.customer_name} - Original: ${c.amount}, Paid: ${c.paid_amount || 0}, Status: ${c.status}, Remaining: ${remainingAmount}`);
    return sum + remainingAmount;
  }, 0);
  const overdueAmount = overdueCredit.reduce((sum: number, c: any) => {
    const remainingAmount = c.status === 'paid' ? 0 : 
                           c.status === 'partial' ? c.amount - (c.paid_amount || 0) : 
                           c.amount;
    return sum + remainingAmount;
  }, 0);
  
  console.log(`📊 Credit Summary (${activeTab}): Total Owed: ${totalOwed}, Overdue: ${overdueAmount}, Count: ${tabFilteredData.length}`);

  const filteredCredit = tabFilteredData.filter((item: any) => {
    const matchesSearch = item.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddCredit = async (newCredit: any) => {
    if (!business?.id) {
      showError(t('credit.business_id_not_found'));
      return;
    }
    
    const currency = getCurrency(business.country || country);
    const creditType = activeTab === 'customers' ? 'receivable' : 'payable';
    
    // Disable button and show loading state
    setIsSubmitting(true);
    
    try {
      // Use unified credit service - this handles BOTH new and existing customers
      const result = await addCreditUnified(
        newCredit.customer_name.trim(),
        parseFloat(newCredit.amount),
        newCredit.due_date,
        newCredit.description?.trim() || generateDefaultDescription(newCredit.customer_name),
        business.id,
        industry,
        currency,
        creditType
      );
      
      if (!result) {
        throw new Error(`Failed to add credit for ${newCredit.customer_name}`);
      }
      
      // Show appropriate success message based on type
      if (result.isNew) {
        if (creditType === 'payable') {
          showSuccess(t('credit.new_vendor_created').replace('{name}', newCredit.customer_name).replace('{currency}', getCurrency(business.country || country)).replace('{amount}', parseFloat(newCredit.amount).toString()));
        } else {
          showSuccess(t('credit.new_customer_created').replace('{name}', newCredit.customer_name).replace('{currency}', getCurrency(business.country || country)).replace('{amount}', parseFloat(newCredit.amount).toString()));
        }
      } else {
        if (creditType === 'payable') {
          showSuccess(t('credit.added_to_vendor').replace('{name}', newCredit.customer_name).replace('{currency}', getCurrency(business.country || country)).replace('{amount}', parseFloat(newCredit.amount).toString()).replace('{total}', result.customer.amount.toString()));
        } else {
          showSuccess(t('credit.added_to_customer').replace('{name}', newCredit.customer_name).replace('{currency}', getCurrency(business.country || country)).replace('{amount}', parseFloat(newCredit.amount).toString()).replace('{total}', result.customer.amount.toString()));
        }
      }
      
      // Close modal and refresh data
      setShowAddModal(false);
      await refetch();
      
    } catch (error: any) {
      console.error(' Failed to add credit:', error);
      showError(error.message || t('credit.failed_to_add') + ' ' + newCredit.customer_name);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCredit = async (id: string, updates: any) => {
    try {
      await updateCredit(id, updates);
      showSuccess(t('credit.updated_successfully', 'Credit updated successfully'));
      // ✅ Force refresh after update
      await refetch();
    } catch (error) {
      console.error('Failed to update credit:', error);
      showError(t('credit.failed_to_update', 'Failed to update credit'));
    }
  };

  const handleDeleteCredit = async (id: string) => {
    // This would be handled by the useCredit hook delete function
    // For now, just close detail view
    setShowAddModal(false);
  };

  const handlePayment = async (creditId: string, paymentAmount: number) => {
    if (!business?.id) {
      showError(t('credit.business_id_not_found'));
      return;
    }
    
    const creditRecord = creditData.find((c: any) => c.id === creditId);
    if (!creditRecord) {
      showError(t('credit.record_not_found', 'Credit record not found'));
      return;
    }
    
    // Calculate new amounts
    const currentPaid = creditRecord.paid_amount || 0;
    const newPaidAmount = currentPaid + paymentAmount;
    const newStatus = newPaidAmount >= creditRecord.amount
      ? 'paid'
      : newPaidAmount > 0
      ? 'partial'
      : 'outstanding';
    
    console.log(`Payment processing: ${creditRecord.customer_name}`);
    console.log(`- Original amount: ${creditRecord.amount}`);
    console.log(`- Payment amount: ${paymentAmount}`);
    console.log(`- Current paid: ${currentPaid}`);
    console.log(`- New paid amount: ${newPaidAmount}`);
    console.log(`- New status: ${newStatus}`);
    console.log(`- Remaining balance: ${creditRecord.amount - newPaidAmount}`);
    
    try {
      // Update credit record with payment - AWAIT to complete before transaction
      await updateCreditAsync(creditId, { 
          status: newStatus
        });
      
      // Record payment transaction - AWAIT to ensure it completes
      await addTransactionAsync({
        business_id: business.id,
        industry,
        currency: getCurrency(business.country || country),
        type: 'money_in',
        amount: paymentAmount,
        category: 'payment',
        description: `Payment for credit: ${creditRecord.customer_name}`,
        transaction_date: new Date().toISOString().split('T')[0],
        metadata: {
          credit_id: creditId,
          customer_name: creditRecord.customer_name,
          payment_amount: paymentAmount
        }
      });
      
      // Force refresh to show updated balance
      await refetch();
      
      console.log(`Payment completed successfully for ${creditRecord.customer_name}`);
      showSuccess(t('credit.payment_recorded'));
      setShowPaymentModal(false);
    } catch (error) {
      console.error('Failed to record payment:', error);
      showError(t('credit.payment_failed', 'Failed to record payment. Please try again.'));
    }
  };

  const handleCustomerClick = (customer: any) => {
    setSelectedCustomer(customer);
    setShowPaymentModal(true);
  };
  
  const handleAddNewCreditToExisting = () => {
    // Close payment modal and open add line item modal
    setShowPaymentModal(false);
    setShowAddLineItemModal(true);
  };

  const handleToggleExpand = (customerId: string) => {
    setExpandedCustomers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(customerId)) {
        newSet.delete(customerId);
      } else {
        newSet.add(customerId);
      }
      return newSet;
    });
  };

  const generateCreditDetailsText = (creditItem: any): string => {
    const remainingAmount = creditItem.status === 'paid' ? 0 : 
                           creditItem.status === 'partial' ? creditItem.amount - creditItem.paid_amount : 
                           creditItem.amount;
    const daysOverdue = creditItem.due_date ? Math.max(0, Math.ceil((new Date().getTime() - new Date(creditItem.due_date).getTime()) / (1000 * 60 * 60 * 24))) : 0;
    
    let text = `${t('credit.reminder_from', 'Credit Reminder from')} ${business?.business_name || t('business.default_name', 'My Business')}\n\n`;
    text += `${t('common.customer', 'Customer')}: ${creditItem.customer_name}\n`;
    text += `${t('credit.amount_owed', 'Amount Owed')}: ${formatCurrency(remainingAmount, country)}\n`;
    text += `${t('credit.original_amount', 'Original Amount')}: ${formatCurrency(creditItem.amount, country)}\n`;
    
    if (creditItem.status === 'partial' || creditItem.status === 'paid') {
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

  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header industry={industry} country={country} />

      <div className="p-4 max-w-md mx-auto">

        {/* Tab Switcher - Customers/Personal */}
        <div className="fade-in mt-6">
          <div className="bg-gray-100 rounded-xl p-1 flex">
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'customers'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Users size={18} />
                {t('credit.customers_tab')}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'personal'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Wallet size={18} />
                {t('credit.personal_tab', 'Personal')}
              </div>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="fade-in mt-6">
          <div className={`p-4 rounded-xl border ${
            activeTab === 'customers' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              {activeTab === 'customers' ? <Users size={16} /> : <Wallet size={16} />}
              {activeTab === 'customers' 
                ? t('credit.total_owed_to_you')
                : t('credit.total_you_owe')}
            </div>
            <div className={`text-2xl font-bold ${
              activeTab === 'customers' ? 'text-green-600' : 'text-orange-600'
            }`}>
              {formatCurrency(totalOwed, country)}
            </div>
            <div className="text-xs text-gray-500">
              {tabFilteredData.length} {activeTab === 'customers' 
                ? t('credit.customers_tab') 
                : t('common.suppliers')}
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-xl border border-red-200 mt-4">
            <div className="flex items-center gap-2 text-sm text-red-700 mb-1">
              <AlertCircle size={16} />
              {t('credit.overdue')}
            </div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(overdueAmount, country)}
            </div>
            <div className="text-xs text-red-500">{overdueCredit.length} {t('credit.overdue')}</div>
          </div>
        </div>

        {/* Add Credit Button */}
        <div className="fade-in mt-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            {activeTab === 'customers' 
              ? t('credit.add_credit_customer')
              : t('credit.add_personal_credit')}
          </button>
        </div>

        {/* Search and Filter */}
        <div className="fade-in mt-6">
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

          <div className="flex gap-3 mt-4">
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
        </div>

        
        {/* All Credit */}
        <div className="fade-in mt-6">
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
              {filteredCredit.map((item: any, index: number) => (
                activeTab === 'customers' ? (
                  <CreditCustomerCard
                    key={item.id || index}
                    customer={item}
                    country={country}
                    industry={industry}
                    businessId={business?.id}
                    onCustomerClick={handleCustomerClick}
                    isExpanded={expandedCustomers.has(item.id || index.toString())}
                    onToggleExpand={handleToggleExpand}
                  />
                ) : (
                  <PayableCreditCard
                    key={item.id || index}
                    credit={item}
                    country={country}
                    industry={industry}
                    businessId={business?.id}
                    onRefresh={refetch}
                  />
                )
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav industry={industry} country={country} />

      {/* Add Credit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {activeTab === 'customers' ? t('credit.add_credit_customer') : t('credit.add_personal_credit')}
            </h3>
            
            {activeTab === 'customers' ? (
              <AddCreditForm onSubmit={handleAddCredit} onCancel={() => setShowAddModal(false)} t={t} isSubmitting={isSubmitting} />
            ) : (
              <PersonalCreditForm onSubmit={handleAddCredit} onCancel={() => setShowAddModal(false)} t={t} isSubmitting={isSubmitting} />
            )}
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
          industry={industry}
          onPayment={handlePayment}
          onAddNewCredit={handleAddNewCreditToExisting}
        />
      )}

      {/* Add Credit Line Item Modal */}
      {showAddLineItemModal && selectedCustomer && (
        <AddCreditLineItemModal
          isOpen={showAddLineItemModal}
          onClose={() => {
            setShowAddLineItemModal(false);
            setSelectedCustomer(null);
          }}
          creditId={selectedCustomer.id}
          customerName={selectedCustomer.customer_name}
          industry={industry}
          country={country}
          onSuccess={async () => {
            await refetch();
            showSuccess(t('credit.credit_added_successfully', 'Credit added successfully'));
          }}
        />
      )}

      {/* WhatsApp Share Modal */}
      {showShareModal && selectedCreditForShare && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('credit.share_credit_details', 'Share Credit Details')}</h3>
            
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <div className="font-medium text-gray-900 mb-1">{selectedCreditForShare.customer_name}</div>
              <div className="text-sm text-gray-600">
                {t('credit.amount_owed', 'Amount Owed')}: {formatCurrency(
                  selectedCreditForShare.status === 'paid' ? 0 :
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

function AddCreditForm({ onSubmit, onCancel, t, isSubmitting }: { 
  onSubmit: (data: any) => void, 
  onCancel: () => void,
  t: (key: string, defaultText?: string, vars?: Record<string, any>) => string,
  isSubmitting?: boolean
}) {
  const [formData, setFormData] = useState({
    customer_name: '',
    amount: '',
    due_date: '',
    description: ''
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('common.description')} ({t('common.optional', 'Optional')})
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t('credit.description_placeholder', 'What was this credit for?')}
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
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('credit.processing') : t('credit.add_customer')}
        </button>
      </div>
    </form>
  );
}

function PersonalCreditForm({ onSubmit, onCancel, t, isSubmitting }: { 
  onSubmit: (data: any) => void, 
  onCancel: () => void,
  t: (key: string, defaultText?: string, vars?: Record<string, any>) => string,
  isSubmitting?: boolean
}) {
  const { business } = useSupabaseAuth();
  const [creditCustomers, setCreditCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [showNewCustomerInput, setShowNewCustomerInput] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '',
    due_date: '',
    description: ''
  });
  
  // Load existing payable customers
  useEffect(() => {
    loadPayableCustomers();
  }, []);
  
  const loadPayableCustomers = async () => {
    if (!business?.id) return;
    
    try {
      const { data } = await supabase
        .from('credit')
        .select('*')
        .eq('business_id', business.id)
        .eq('type', 'payable')
        .order('customer_name');
      
      setCreditCustomers(data || []);
    } catch (error) {
      console.error('Error loading payable customers:', error);
    }
  };
  
  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'new') {
      setShowNewCustomerInput(true);
      setSelectedCustomer('');
      setNewCustomerName('');
    } else {
      setShowNewCustomerInput(false);
      setSelectedCustomer(value);
      setNewCustomerName('');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCustomerName = showNewCustomerInput ? newCustomerName : selectedCustomer;
    
    if (!finalCustomerName) {
      alert(t('credit.select_vendor_required'));
      return;
    }
    
    onSubmit({
      customer_name: finalCustomerName,
      amount: formData.amount,
      due_date: formData.due_date,
      description: formData.description || t('credit.cost_personal_description', 'Cost - Personal') 
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Who do you owe? - Same as Money Out */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('credit.who_do_you_owe')} <span className="text-red-500">*</span>
        </label>
        <select
          value={showNewCustomerInput ? 'new' : selectedCustomer}
          onChange={handleCustomerSelect}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t('credit.select_vendor_person')}</option>
          {creditCustomers.map((customer) => (
            <option key={customer.id} value={customer.customer_name}>
              {customer.customer_name} - Owed: ${customer.amount}
            </option>
          ))}
          <option value="new">{t('credit.add_new_vendor')}</option>
        </select>
      </div>
      
      {/* New vendor name input - conditionally shown */}
      {showNewCustomerInput && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('credit.new_vendor_name')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={newCustomerName}
            onChange={(e) => setNewCustomerName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder={t('credit.enter_vendor_name', 'Enter vendor or person name')}
          />
        </div>
      )}
      
      {/* Description - Changed from "Cost" to "Description" */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('credit.description_optional')}
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder={t('credit.what_is_this_credit_for')}
        />
      </div>
      
      {/* Amount Owed */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('credit.amount_owed')} ($)
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="0.00"
          required
        />
      </div>
      
      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('credit.due_date')} <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={formData.due_date}
          onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>
      
      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? t('credit.processing') : t('credit.add_customer')}
        </button>
      </div>
    </form>
  );
}