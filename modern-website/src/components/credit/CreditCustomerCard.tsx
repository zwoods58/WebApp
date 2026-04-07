"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/currency';
import { useCreditItems } from '@/hooks/useCreditItems';
import { useLanguage } from '@/hooks/LanguageContext';
import { useToast } from '@/hooks/useToast';
import PaymentModal from './PaymentModal';

interface CreditCustomerCardProps {
  customer: any;
  country: string;
  industry: string;
  businessId?: string;
  onCustomerClick?: (customer: any) => void;
  isExpanded?: boolean;
  onToggleExpand?: (customerId: string) => void;
}

export default function CreditCustomerCard({ 
  customer, 
  country, 
  industry, 
  businessId,
  onCustomerClick,
  isExpanded = false,
  onToggleExpand
}: CreditCustomerCardProps) {
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();
  const { data: creditItems, isLoading: itemsLoading, refetch: refetchItems } = useCreditItems({ 
    businessId, 
    industry,
    creditId: customer.id 
  });

  const [localExpanded, setLocalExpanded] = useState(isExpanded);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLineItem, setSelectedLineItem] = useState<any>(null);

  // Calculate totals from line items
  const calculateTotals = () => {
    if (!creditItems || creditItems.length === 0) {
      return {
        totalAmount: customer.amount || 0,
        totalPaid: customer.paid_amount || 0,
        totalOutstanding: customer.status === 'paid' ? 0 : 
                          customer.status === 'partial' ? customer.amount - (customer.paid_amount || 0) : 
                          customer.amount
      };
    }

    const totalAmount = creditItems.reduce((sum, item) => sum + item.amount, 0);
    const totalPaid = creditItems.reduce((sum, item) => sum + item.paid_amount, 0);
    const totalOutstanding = totalAmount - totalPaid;

    return { totalAmount, totalPaid, totalOutstanding };
  };

  const totals = calculateTotals();
  const isOverdue = customer.due_date && customer.status !== 'paid' && 
                   new Date(customer.due_date) < new Date();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'outstanding':
        return <Clock size={14} className="text-orange-500" />;
      case 'partial':
        return <Clock size={14} className="text-blue-500" />;
      case 'paid':
        return <CheckCircle size={14} className="text-green-500" />;
      default:
        return <Clock size={14} className="text-gray-500" />;
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

  const getLineItemStatus = (item: any) => {
    if (item.paid_amount >= item.amount) return 'paid';
    if (item.paid_amount > 0) return 'partial';
    if (item.due_date && new Date(item.due_date) < new Date()) return 'overdue';
    return 'outstanding';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCustomerClick) {
      onCustomerClick(customer);
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleExpand) {
      onToggleExpand(customer.id);
    } else {
      setLocalExpanded(!localExpanded);
    }
  };

  const handlePayment = (lineItem: any) => {
    setSelectedLineItem(lineItem);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    showSuccess('Payment applied successfully');
    await refetchItems();
    setShowPaymentModal(false);
    setSelectedLineItem(null);
  };

  const expanded = onToggleExpand ? isExpanded : localExpanded;

  return (
    <div className={`p-3 rounded-lg border cursor-pointer transition-all ${
      isOverdue 
        ? 'bg-red-50 border-red-200 hover:bg-red-100' 
        : customer.status === 'paid'
        ? 'bg-green-50 border-green-200 hover:bg-green-100'
        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
    }`}>
      {/* Customer Header - Always Visible */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 flex-1" onClick={handleCardClick}>
          {getStatusIcon(customer.status)}
          <div className="flex-1">
            <div className="font-medium text-gray-900">{customer.customer_name}</div>
            <div className="text-xs text-gray-500">
              Given: {formatDate(customer.date_given)}
              {isOverdue && (
                <span className="text-red-600 ml-2 font-medium">
                  {Math.max(0, Math.ceil((new Date().getTime() - new Date(customer.due_date || '').getTime()) / (1000 * 60 * 60 * 24)))} {t('credit.days_overdue')}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-right mr-2" onClick={handleCardClick}>
            <div className="font-bold text-gray-900">
              {formatCurrency(totals.totalOutstanding, country)}
            </div>
            <div className="text-xs text-gray-500">
              Due: {formatDate(customer.due_date || '')}
            </div>
          </div>
          
          {/* Expand/Collapse Button */}
          <button
            onClick={handleExpandClick}
            className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
            title={expanded ? "Collapse details" : "Show credit details"}
          >
            {expanded ? (
              <ChevronUp size={18} className="text-gray-600" />
            ) : (
              <ChevronDown size={18} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <div className={`text-xs px-2 py-1 rounded-full inline-block ${getStatusColor(customer.status)}`}>
          {customer.status}
        </div>
      </div>

      {/* Expanded Content - Credit Line Items */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
          {/* Total Summary */}
          <div className="bg-white rounded-lg p-3 mb-3 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-900">{t('credit.total_amount', 'Total Amount')}</span>
              <span className="font-bold text-lg text-gray-900">
                {formatCurrency(totals.totalAmount, country)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('credit.paid_amount', 'Paid Amount')}</span>
              <span className="text-green-600 font-medium">
                {formatCurrency(totals.totalPaid, country)}
              </span>
            </div>
            <div className="flex justify-between text-sm pt-1">
              <span className="text-gray-600">{t('credit.outstanding_amount', 'Outstanding')}</span>
              <span className="text-orange-600 font-medium">
                {formatCurrency(totals.totalOutstanding, country)}
              </span>
            </div>
          </div>

          {/* Line Items List */}
          {itemsLoading ? (
            <div className="text-center py-4">
              <div className="text-gray-400 text-sm">{t('common.loading', 'Loading...')}</div>
            </div>
          ) : creditItems && creditItems.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <h4 className="font-medium text-gray-900 text-sm mb-2">
                {t('credit.credit_purchases', 'Credit Purchases')} ({creditItems.length})
              </h4>
              {creditItems.map((item) => {
                const itemStatus = getLineItemStatus(item);
                const itemOverdue = item.due_date && itemStatus !== 'paid' && 
                                 new Date(item.due_date) < new Date();
                const itemOutstanding = item.amount - item.paid_amount;

                return (
                  <div 
                    key={item.id} 
                    className={`p-3 rounded-lg border ${
                      itemOverdue 
                        ? 'bg-red-50 border-red-200' 
                        : itemStatus === 'paid'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {item.description || t('credit.credit_purchase', 'Credit Purchase')}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {t('credit.date_given', 'Given')}: {formatDate(item.date_given)}
                        </div>
                      </div>
                      <div className="text-right ml-2">
                        <div className="font-bold text-sm text-gray-900">
                          {formatCurrency(item.amount, country)}
                        </div>
                        {item.paid_amount > 0 && (
                          <div className="text-xs text-green-600">
                            {t('credit.paid', 'Paid')}: {formatCurrency(item.paid_amount, country)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(itemStatus)}
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(itemStatus)}`}>
                          {itemStatus}
                        </span>
                        {itemOutstanding > 0 && (
                          <span className="text-xs font-medium text-orange-600">
                            {t('credit.remaining', 'Remaining')}: {formatCurrency(itemOutstanding, country)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(item.due_date || '')}
                          {itemOverdue && (
                            <span className="text-red-600 font-medium ml-1">
                              ({Math.max(0, Math.ceil((new Date().getTime() - new Date(item.due_date).getTime()) / (1000 * 60 * 60 * 24)))} {t('credit.days_overdue')})
                            </span>
                          )}
                        </div>
                        
                        {/* Payment Buttons */}
                        {itemOutstanding > 0 && (
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePayment(item);
                              }}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                              title="Make payment"
                            >
                              Pay
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-gray-400 text-sm">
                {t('credit.no_line_items', 'No individual credit purchases found')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedLineItem && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedLineItem(null);
          }}
          lineItem={selectedLineItem}
          credit={customer}
          country={country}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
