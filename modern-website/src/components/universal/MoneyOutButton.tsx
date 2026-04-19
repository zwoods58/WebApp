"use client";

import React, { useState, useEffect } from 'react';
import { Store, Utensils, Car, Scissors, Ruler, Wrench, Laptop } from 'lucide-react';
import { getCurrency } from '@/utils/currency';
import { useLanguage } from '@/hooks/useLanguage';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { getPayableCustomers, addCreditUnified, CreditCustomer } from '@/app/Beezee-App/services/creditService';

interface MoneyOutButtonProps {
  industry: string;
  country: string;
  onSuccess: (expenseData: any) => void;
  disabled?: boolean;
}

const industryLabels = {
  retail: { buttonKey: 'nav.expenses', placeholderKey: 'retail.expense_amount', icon: Store },
  food: { buttonKey: 'food.supplies', placeholderKey: 'food.supply_cost', icon: Utensils },
  transport: { buttonKey: 'transport.fuel', placeholderKey: 'transport.fuel_cost', icon: Car },
  salon: { buttonKey: 'salon.products', placeholderKey: 'salon.product_cost', icon: Scissors },
  tailor: { buttonKey: 'tailor.materials', placeholderKey: 'tailor.material_cost', icon: Ruler },
  repairs: { buttonKey: 'repairs.parts', placeholderKey: 'repairs.parts_cost', icon: Wrench },
  freelance: { buttonKey: 'freelance.software', placeholderKey: 'freelance.software_cost', icon: Laptop }
};

export default function MoneyOutButton({ industry, country, onSuccess, disabled = false }: MoneyOutButtonProps) {
  const { t } = useLanguage();
  const { business } = useUnifiedAuth();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creditCustomers, setCreditCustomers] = useState<CreditCustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [newCustomerName, setNewCustomerName] = useState<string>('');
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'supplies',
    payment_method: 'cash',
    due_date: ''
  });

  const labels = industryLabels[industry as keyof typeof industryLabels] || industryLabels.retail;
  const Icon = labels.icon;

  // Close modal handler
  const closeModal = () => setShowModal(false);
  
  // Load payable customers when modal opens or payment method changes to credit
  useEffect(() => {
    if (showModal && formData.payment_method === 'credit' && business?.id) {
      loadPayableCustomers();
    }
  }, [showModal, formData.payment_method, business?.id]);

  const loadPayableCustomers = async () => {
    if (!business?.id) return;
    
    try {
      const customers = await getPayableCustomers(business.id);
      setCreditCustomers(customers);
      setShowCustomerSelect(true);
      console.log(`[MoneyOutButton] Loaded ${customers.length} payable customers`);
    } catch (error) {
      console.error('[MoneyOutButton] Error loading payable customers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Handle credit payments differently
    if (formData.payment_method === 'credit') {
      await handleCreditPayment();
      return;
    }

    // Handle regular payments
    const expenseData = {
      amount: parseFloat(formData.amount),
      currency: getCurrency(country),
      description: formData.description,
      category: formData.category,
      expense_date: new Date().toISOString().split('T')[0]
    };

    onSuccess(expenseData);
    setShowModal(false);
    setFormData({ amount: '', description: '', category: 'supplies', payment_method: 'cash', due_date: '' });
  };

  const handleCreditPayment = async () => {
    if (!business?.id) {
      alert(t('credit.business_id_not_found'));
      return;
    }

    const customerName = selectedCustomer || newCustomerName;
    if (!customerName || customerName.trim() === '') {
      alert(t('credit.select_vendor_required'));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addCreditUnified(
        customerName.trim(),
        parseFloat(formData.amount),
        formData.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        formData.description || `Cost - ${formData.category || 'General'}`,
        business.id,
        industry,
        getCurrency(country),
        'payable'  // KEY: 'payable' for money out (who YOU owe)
      );

      if (!result) {
        throw new Error(t('credit.payment_failed'));
      }

      if (result.isNew) {
        alert(t('credit.new_vendor_created').replace('{name}', customerName).replace('{currency}', getCurrency(country)).replace('{amount}', formData.amount));
      } else {
        alert(t('credit.added_to_vendor').replace('{name}', customerName).replace('{currency}', getCurrency(country)).replace('{amount}', formData.amount).replace('{total}', result.customer.amount.toString()));
      }

      // Create expense record as well
      const expenseData = {
        amount: parseFloat(formData.amount),
        currency: getCurrency(country),
        description: formData.description,
        category: formData.category,
        expense_date: new Date().toISOString().split('T')[0],
        payment_method: 'credit',
        customer_name: customerName
      };

      onSuccess(expenseData);
      setShowModal(false);
      setFormData({ amount: '', description: '', category: 'supplies', payment_method: 'cash', due_date: '' });
      setSelectedCustomer('');
      setNewCustomerName('');

    } catch (error: any) {
      console.error('[MoneyOutButton] Credit payment failed:', error);
      alert(error.message || t('credit.payment_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Money Out Button */}
      <button
        onClick={() => {
          if (disabled) return;
          if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
          }
          setShowModal(true);
        }}
        className={`w-full py-5 px-6 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-white shadow-lg transition-all bg-gradient-to-r from-[var(--color-danger)] to-rose-500 hover:shadow-xl active:shadow-md no-select button-tap ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={disabled}
      >
        {t('common.money_out')}
      </button>

      {/* Modal */}
      {showModal && (
        <>
          {/* BACKDROP */}
          <div
            onClick={closeModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#ffffff',
              zIndex: 40
            }}
          />
          
          {/* MODAL CONTENT */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
              paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))',
              maxHeight: 'calc(100vh - 5rem - env(safe-area-inset-bottom))',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 70
            }}
          >
            <div className="p-4 flex justify-center flex-shrink-0">
              <div className="w-12 h-1.5 bg-[var(--text-3)] opacity-50 rounded-full" />
            </div>
            
            <div className="px-6 pb-0 flex-1 overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(100vh - 8rem - env(safe-area-inset-bottom))' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 glass-regular rounded-xl flex items-center justify-center border border-orange-200/50">
                  <Icon className="text-orange-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-1)]">{t('common.add')} {t('common.transaction', 'Transaction')}</h3>
              </div>

              <form id="money-out-form" onSubmit={handleSubmit} className="space-y-4">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                    {(industry === 'transport' || industry === 'services') && formData.category === 'transport' 
                      ? t('transport.distance', 'Distance (km)')
                      : t(labels.placeholderKey)
                    }
                  </label>
                  <div className="relative">
                    {(industry === 'transport' || industry === 'services') && formData.category === 'transport' ? (
                      <>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-[var(--text-3)] font-semibold">km</span>
                        </div>
                        <input
                          type="number"
                          required
                          value={formData.amount}
                          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                          className="w-full pl-14 pr-4 py-4 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-300/50 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300 shadow-sm text-xl font-bold text-[var(--text-1)] placeholder-gray-500"
                          placeholder={t('transport.distance_placeholder', '0.0')}
                          inputMode="decimal"
                          step="0.1"
                        />
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-[var(--text-3)] font-semibold">{country === 'ke' ? 'KSh' : '$'}</span>
                        </div>
                        <input
                          type="number"
                          required
                          value={formData.amount}
                          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                          className="w-full pl-14 pr-4 py-4 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-300/50 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300 shadow-sm text-xl font-bold text-[var(--text-1)] placeholder-gray-500"
                          placeholder={t('cash.enter_amount', '0.00')}
                          inputMode="decimal"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                    {t('common.description_optional', 'Description (optional)')}
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-md rounded-xl border border-gray-300/50 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300 shadow-sm text-[var(--text-1)] placeholder-gray-500"
                    placeholder={t('credit.description_placeholder_money_out', 'What is this credit for?')}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                    {t('common.category', 'Category')}
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-md rounded-xl border border-gray-300/50 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300 shadow-sm text-[var(--text-1)] placeholder-gray-500"
                    placeholder={t('expense_tracker.other', 'e.g., Supplies, Utilities, Rent')}
                  />
                </div>

                {/* Credit Payment UI - Show when payment method is credit */}
                {formData.payment_method === 'credit' && (
                  <>
                    {/* Customer/Vendor Selection */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                        {t('credit.who_do_you_owe')} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                        className="w-full px-4 py-3 bg-white/90 backdrop-blur-md rounded-xl border border-gray-300/50 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300 shadow-sm text-[var(--text-1)]"
                      >
                        <option value="">{t('credit.select_vendor_person')}</option>
                        {creditCustomers.map((customer) => (
                          <option key={customer.id} value={customer.customer_name}>
                            {customer.customer_name} - {t('credit.owed_label')} {getCurrency(country)} {customer.amount}
                          </option>
                        ))}
                      </select>
                      {creditCustomers.length === 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {t('credit.no_vendors_found')}
                        </p>
                      )}
                    </div>

                    {/* New Customer Name */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                        {t('credit.new_vendor_name')} <span className="text-gray-400 text-xs">{t('credit.if_not_listed')}</span>
                      </label>
                      <input
                        type="text"
                        value={newCustomerName}
                        onChange={(e) => setNewCustomerName(e.target.value)}
                        className="w-full px-4 py-3 bg-white/90 backdrop-blur-md rounded-xl border border-gray-300/50 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300 shadow-sm text-[var(--text-1)] placeholder-gray-500"
                        placeholder={t('credit.enter_vendor_person_name')}
                      />
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                        {t('credit.due_date')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.due_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/90 backdrop-blur-md rounded-xl border border-gray-300/50 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300 shadow-sm text-[var(--text-1)]"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                    {t('payment_method.title', 'Payment Method')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['cash', 'mobile_money', 'credit'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => {
                          if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
                            window.navigator.vibrate(20);
                          }
                          setFormData(prev => ({ ...prev, payment_method: method }));
                        }}
                        className={`py-3 rounded-xl font-medium text-sm transition-all button-tap ${
                          formData.payment_method === method
                            ? 'bg-orange-500/20 text-orange-700 border-2 border-orange-500/50 bg-white/90 backdrop-blur-md shadow-sm'
                            : 'bg-white/90 backdrop-blur-md text-[var(--text-2)] border-2 border-transparent hover:bg-white/95 shadow-sm'
                        }`}
                      >
                        {t(`payment.${method}`, method === 'mobile_money' ? 'Mobile Money' : method.charAt(0).toUpperCase() + method.slice(1))}
                      </button>
                    ))}
                  </div>
                </div>

                </form>
            </div>
            
            {/* Fixed Action Buttons at Bottom */}
            <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0 bg-white">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-colors"
                >
                  {t('common.cancel', 'Cancel')}
                </button>

                <button
                  type="submit"
                  form="money-out-form" // Link to form ID
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-lg hover:from-orange-400 hover:to-orange-500 transition-colors shadow-lg button-tap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('common.processing', 'Processing...') : t('common.save', 'Save') + ' ' + t('common.transaction', 'Transaction')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

