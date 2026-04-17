"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/currency';
import { useCreditItems } from '@/hooks/useCreditItems';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { makePaymentOnLineItem } from '@/app/Beezee-App/services/creditService';
import PaymentModal from './PaymentModal';
import { debugCustomerLineItems } from '@/app/Beezee-App/services/creditService';

interface PayableCreditCardProps {
  credit: any;
  country: string;
  industry: string;
  businessId?: string;
  onRefresh?: () => void;
}

export default function PayableCreditCard({ 
  credit, 
  country, 
  industry, 
  businessId,
  onRefresh
}: PayableCreditCardProps) {
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();
  const { data: creditItems, isLoading: itemsLoading, refetch: refetchItems } = useCreditItems({ 
    businessId, 
    industry,
    creditId: credit.id 
  });

  const [localExpanded, setLocalExpanded] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLineItem, setSelectedLineItem] = useState<any>(null);
  const [fallbackItems, setFallbackItems] = useState<any[]>([]);
  const [debugMode, setDebugMode] = useState(false);

  const expanded = localExpanded;

  // Fallback data fetching when expanded and no items found
  useEffect(() => {
    if (expanded && businessId && (!creditItems || creditItems.length === 0)) {
      console.log(`[PayableCreditCard] No line items found for ${credit.customer_name}, trying fallback fetch`);
      fetchFallbackData();
    }
  }, [expanded, businessId, creditItems, credit.customer_name]);

  const fetchFallbackData = async () => {
    if (!businessId) return;
    
    try {
      const debugResult = await debugCustomerLineItems(credit.customer_name, businessId);
      if (debugResult && debugResult.lineItems.length > 0) {
        console.log(`[PayableCreditCard] Fallback fetch found ${debugResult.lineItems.length} items`);
        setFallbackItems(debugResult.lineItems);
      } else {
        console.log(`[PayableCreditCard] Fallback fetch also found no items`);
      }
    } catch (error) {
      console.error('[PayableCreditCard] Fallback fetch failed:', error);
    }
  };

  // Use creditItems or fallbackItems
  const displayItems = creditItems && creditItems.length > 0 ? creditItems : fallbackItems;
  const isItemsLoading = itemsLoading || (expanded && !displayItems.length && businessId);

  // Calculate totals from line items
  const calculateTotals = () => {
    if (!displayItems || displayItems.length === 0) {
      return {
        totalAmount: credit.amount || 0,
        totalPaid: credit.paid_amount || 0,
        totalOutstanding: credit.status === 'paid' ? 0 : 
                          credit.status === 'partial' ? credit.amount - (credit.paid_amount || 0) : 
                          credit.amount
      };
    }

    const totalAmount = displayItems.reduce((sum, item) => sum + item.amount, 0);
    const totalPaid = displayItems.reduce((sum, item) => sum + item.paid_amount, 0);
    const totalOutstanding = totalAmount - totalPaid;

    return { totalAmount, totalPaid, totalOutstanding };
  };

  const totals = calculateTotals();
  const isOverdue = credit.due_date && credit.status !== 'paid' && 
                   new Date(credit.due_date) < new Date();

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

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalExpanded(!localExpanded);
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
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className={`p-3 rounded-lg border cursor-pointer transition-all ${
      isOverdue 
        ? 'bg-red-50 border-red-200 hover:bg-red-100' 
        : credit.status === 'paid'
        ? 'bg-green-50 border-green-200 hover:bg-green-100'
        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 flex-1">
          {getStatusIcon(credit.status)}
          <div className="flex-1">
            <div className="font-medium text-gray-900">{credit.customer_name}</div>
            <div className="text-xs text-gray-500">
              {isOverdue && (
                <span className="text-red-600 ml-2 font-medium">
                  {Math.max(0, Math.ceil((new Date().getTime() - new Date(credit.due_date || '').getTime()) / (1000 * 60 * 60 * 24)))} {t('credit.days_overdue')}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-right mr-2">
            <div className="font-bold text-red-600">
              {formatCurrency(totals.totalOutstanding, country)}
            </div>
            <div className="text-xs text-gray-500">
              You owe
            </div>
          </div>
          
          {/* Expand/Collapse Button */}
          <button
            onClick={handleExpandClick}
            className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
            title={expanded ? "Collapse details" : "Show cost details"}
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
        <div className={`text-xs px-2 py-1 rounded-full inline-block ${getStatusColor(credit.status)}`}>
          {credit.status}
        </div>
      </div>

      {/* Expanded Content - Cost Line Items */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
          {/* Total Summary */}
          <div className="bg-white rounded-lg p-3 mb-3 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-900">{t('credit.total_amount', 'Total Amount')}</span>
              <span className="font-bold text-lg text-red-600">
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
              <span className="text-gray-600">{t('credit.outstanding_amount', 'You Owe')}</span>
              <span className="text-red-600 font-medium">
                {formatCurrency(totals.totalOutstanding, country)}
              </span>
            </div>
          </div>

          {/* Line Items List */}
          {isItemsLoading ? (
            <div className="text-center py-4">
              <div className="text-gray-400 text-sm">{t('common.loading', 'Loading...')}</div>
            </div>
          ) : displayItems && displayItems.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <h4 className="font-medium text-gray-900 text-sm mb-2">
                {t('credit.costs', 'Costs')} ({displayItems.length})
              </h4>
              {displayItems.map((item) => {
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
                          {item.description || 'Cost'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {t('credit.date_given', 'Incurred')}: {formatDate(item.date_given)}
                        </div>
                      </div>
                      <div className="text-right ml-2">
                        <div className="font-bold text-sm text-red-600">
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
                          <span className="text-xs font-medium text-red-600">
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
                              onClick={() => handlePayment(item)}
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
                {t('credit.no_costs_found', 'No individual costs found')}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Payment Modal - Using Customer Credit Style */}
      {showPaymentModal && selectedLineItem && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedLineItem(null);
          }}
          lineItem={selectedLineItem}
          credit={credit}
          country={country}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

