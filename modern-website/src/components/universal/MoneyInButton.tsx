"use client";

import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, Store, Utensils, Car, Scissors, Ruler, Wrench, Laptop } from 'lucide-react';
import { formatCurrency, getCurrency } from '@/utils/currency';
import { useLanguage } from '@/hooks/useLanguage';
import { useServices } from '@/hooks';
import { addCreditUnified } from '@/app/Beezee-App/services/creditService';

type Service = {
  id: string;
  service_name: string;
  price?: number;
  category?: string;
};

interface MoneyInButtonProps {
  industry: string;
  country: string;
  businessId: string;
  onSuccess: (transactionData: any) => void;
  disabled?: boolean;
}

const industryLabels = {
  retail: { buttonKey: 'retail.new_sale', placeholderKey: 'retail.sale_amount', icon: Store },
  food: { buttonKey: 'food.new_order', placeholderKey: 'food.order_amount', icon: Utensils },
  transport: { buttonKey: 'nav.trips', placeholderKey: 'transport.fare_amount', icon: Car },
  salon: { buttonKey: 'nav.services', placeholderKey: 'salon.service_amount', icon: Scissors },
  tailor: { buttonKey: 'nav.jobs', placeholderKey: 'tailor.payment_amount', icon: Ruler },
  repairs: { buttonKey: 'repairs.new_repair', placeholderKey: 'repairs.repair_fee', icon: Wrench },
  freelance: { buttonKey: 'freelance.new_project', placeholderKey: 'freelance.payment_amount', icon: Laptop }
};

// Helper function to get default due date (30 days from today)
const getDefaultDueDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split('T')[0];
};

export default function MoneyInButton({ industry, country, businessId, onSuccess, disabled = false }: MoneyInButtonProps) {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dueDateRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    customer_name: '',
    payment_method: 'cash',
    // Transport-specific fields
    service_id: '',
    distance: '',
    tips: '',
    use_base_amount: false,
    // Credit due date
    due_date: getDefaultDueDate(),
  });

  // Get services for transport industry
  const servicesHook = industry === 'transport' ? useServices({ industry }) : { data: [], loading: false, error: null };
  const services = servicesHook.data || [];

  const labels = industryLabels[industry as keyof typeof industryLabels] || industryLabels.retail;
  const Icon = labels.icon;

  // Calculate fare for transport
  const calculateTransportFare = () => {
    if (!formData.service_id) return 0;
    
    const service = services.find((s: Service) => s.id === formData.service_id);
    if (!service) return 0;

    if (formData.use_base_amount) {
      return (service.price || 0) + (parseFloat(formData.tips) || 0);
    }

    const distance = parseFloat(formData.distance) || 0;
    const pricePerKm = service.price || 0;
    const baseAmount = service.price || 0;
    const tips = parseFloat(formData.tips) || 0;

    return (distance * pricePerKm) + baseAmount + tips;
  };

  // Update amount when transport fields change
  React.useEffect(() => {
    if (industry === 'transport' && formData.service_id) {
      const fare = calculateTransportFare();
      setFormData(prev => ({ ...prev, amount: fare.toString() }));
      // Update description with service name
      const service = services.find((s: Service) => s.id === formData.service_id);
      if (service) {
        const description = formData.use_base_amount 
          ? `${service.service_name} (Base only${formData.tips ? ' + tips' : ''})`
          : `${service.service_name} (${formData.distance || '0'} km${formData.tips ? ' + tips' : ''})`;
        setFormData(prev => ({ ...prev, description }));
      }
    }
  }, [formData.service_id, formData.distance, formData.tips, formData.use_base_amount, industry, services]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const amount = parseFloat(formData.amount);
    const currency = getCurrency(country);
    
    try {
      // Handle credit payments with unified service
      if (formData.payment_method === 'credit' || formData.payment_method === 'Credit') {
        console.log(' [MoneyInButton] Processing credit payment for:', formData.customer_name);
        
        if (!formData.customer_name || formData.customer_name.trim() === '') {
          alert(t('credit.customer_name_required'));
          setIsSubmitting(false);
          return;
        }
        
        // Use unified credit service - this handles BOTH new and existing customers
        const result = await addCreditUnified(
          formData.customer_name.trim(),
          amount,
          formData.due_date,
          formData.description || `Credit purchase - ${industry || 'General'}`,
          businessId,
          industry,
          currency,
          'receivable'  // Money In is always receivable (customers owe you)
        );
        
        if (!result) {
          throw new Error(t('credit.failed_to_add') + ` ${formData.customer_name}`);
        }
        
        // Show appropriate success message
        if (result.isNew) {
          alert(t('credit.new_customer_created').replace('{name}', formData.customer_name).replace('{currency}', currency).replace('{amount}', amount.toString()));
        } else {
          alert(t('credit.added_to_customer').replace('{name}', formData.customer_name).replace('{currency}', currency).replace('{amount}', amount.toString()).replace('{total}', result.customer.amount.toString()));
        }
        
        // Continue with normal transaction creation
        const transactionData = {
          amount,
          currency,
          description: formData.description,
          customer_name: formData.customer_name,
          payment_method: formData.payment_method,
          transaction_date: new Date().toISOString().split('T')[0],
          due_date: formData.due_date,
        };
        
        console.log('[MoneyInButton] Transaction data:', transactionData);
        onSuccess(transactionData);
      } else {
        // Handle non-credit payments normally
        const transactionData = {
          amount,
          currency,
          description: formData.description,
          customer_name: formData.customer_name,
          payment_method: formData.payment_method,
          transaction_date: new Date().toISOString().split('T')[0],
          due_date: undefined,
        };
        
        console.log('[MoneyInButton] Transaction data:', transactionData);
        onSuccess(transactionData);
      }
      
      // Reset and close modal
      setShowModal(false);
      setFormData({ 
        amount: '', 
        description: '', 
        customer_name: '', 
        payment_method: 'cash',
        service_id: '',
        distance: '',
        tips: '',
        use_base_amount: false,
        due_date: getDefaultDueDate(),
      });
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert(error instanceof Error ? error.message : t('credit.payment_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal handler
  const closeModal = () => setShowModal(false);

  // Auto-scroll to due date when credit is selected
  useEffect(() => {
    if (formData.payment_method === 'credit' && dueDateRef.current && scrollContainerRef.current) {
      // Small delay to ensure the DOM has updated
      setTimeout(() => {
        dueDateRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start'
        });
        
        // Optional: Add a temporary highlight effect
        dueDateRef.current?.classList.add('bg-yellow-50', 'transition-colors', 'duration-500');
        setTimeout(() => {
          dueDateRef.current?.classList.remove('bg-yellow-50', 'transition-colors', 'duration-500');
        }, 1000);
      }, 100);
    }
  }, [formData.payment_method]);

  return (
    <>
      {/* ✅ REPLACED: motion.button with CSS button-tap class */}
      <button
        onClick={() => {
          if (disabled) return;
          if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
          }
          setShowModal(true);
        }}
        className={`w-full py-5 px-6 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-white shadow-lg transition-all bg-gradient-to-r from-[var(--color-success)] to-emerald-500 hover:shadow-xl active:shadow-md no-select button-tap ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={disabled}
      >
        {t('common.money_in')}
      </button>

      {/* ✅ REPLACED: AnimatePresence with CSS-based show/hide */}
      {showModal && (
        <>
          {/* BACKDROP - 100% SOLID WHITE - NO TRANSPARENCY */}
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
              overflow: 'hidden',
              zIndex: 70
            }}
          >
            <div className="p-4 flex justify-center">
              <div className="w-12 h-1.5 bg-[var(--text-3)] opacity-50 rounded-full" />
            </div>
            
            <div 
              ref={scrollContainerRef}
              className="px-6 pb-8 overflow-y-auto overscroll-contain" 
              style={{ 
                maxHeight: 'calc(100vh - 8rem - env(safe-area-inset-bottom))',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border border-green-200">
                  <Icon className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-1)]">{t('common.add')} {t('common.transaction', 'Transaction')}</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                    {t(labels.placeholderKey)}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-[var(--text-3)] font-semibold">{country === 'ke' ? 'KSh' : '$'}</span>
                    </div>
                    <input
                      type="number"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full pl-14 pr-4 py-4 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-green-500/50 focus:border-green-300 shadow-sm text-xl font-bold text-[var(--text-1)] placeholder-gray-500"
                      style={{ backgroundColor: '#ffffff' }}
                      placeholder="0.00"
                      inputMode="decimal"
                    />
                  </div>
                </div>

                {/* Transport-specific fields */}
                {industry === 'transport' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                        {t('services.service', 'Service')}
                      </label>
                      <select
                        value={formData.service_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, service_id: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300/50 focus:ring-2 focus:ring-green-500/50 focus:border-green-300 shadow-sm text-[var(--text-1)] placeholder-gray-500"
                        style={{ backgroundColor: '#ffffff' }}
                        required
                      >
                        <option value="">{t('transport.select_service', 'Select service')}</option>
                        {services.map((service: Service) => (
                          <option key={service.id} value={service.id}>
                            {service.service_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                        {t('transport.distance_km', 'Distance (km)')}
                      </label>
                      <input
                        type="number"
                        value={formData.distance}
                        onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300/50 focus:ring-2 focus:ring-green-500/50 focus:border-green-300 shadow-sm text-[var(--text-1)] placeholder-gray-500"
                        style={{ backgroundColor: '#ffffff' }}
                        placeholder="0.0"
                        step="0.1"
                        disabled={formData.use_base_amount}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="useBaseAmount"
                        checked={formData.use_base_amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, use_base_amount: e.target.checked }))}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="useBaseAmount" className="text-sm text-[var(--text-2)]">
                        {t('transport.use_base_amount', 'Use base amount only')}
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                        {t('transport.tips_optional', 'Tips (optional)')}
                      </label>
                      <input
                        type="number"
                        value={formData.tips}
                        onChange={(e) => setFormData(prev => ({ ...prev, tips: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300/50 focus:ring-2 focus:ring-green-500/50 focus:border-green-300 shadow-sm text-[var(--text-1)] placeholder-gray-500"
                        style={{ backgroundColor: '#ffffff' }}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>

                    {/* Fare calculation display */}
                    {formData.service_id && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-green-900">{t('transport.calculated_fare', 'Calculated Fare:')}</span>
                          <span className="text-lg font-bold text-green-900">
                            {country === 'ke' ? 'KSh' : '$'} {calculateTransportFare().toFixed(2)}
                          </span>
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                          {formData.use_base_amount 
                            ? t('transport.base_amount_only', 'Base amount only') + (formData.tips ? ` + ${country === 'ke' ? 'KSh' : '$'} ${formData.tips} ${t('transport.tips', 'tips')}` : '')
                            : `${formData.distance || '0'} km × ${t('transport.rate', 'rate')}` + (formData.tips ? ` + ${country === 'ke' ? 'KSh' : '$'} ${formData.tips} ${t('transport.tips', 'tips')}` : '')
                          }
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                    {t('common.description')}
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300/50 focus:ring-2 focus:ring-green-500/50 focus:border-green-300 shadow-sm text-[var(--text-1)] placeholder-gray-500"
                    style={{ backgroundColor: '#ffffff' }}
                    placeholder={t('common.description_placeholder_money_in', 'What was this for?')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                    {t('customerName')} ({t('common.optional', 'Optional')})
                  </label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300/50 focus:ring-2 focus:ring-green-500/50 focus:border-green-300 shadow-sm text-[var(--text-1)] placeholder-gray-500"
                    style={{ backgroundColor: '#ffffff' }}
                    placeholder={t('customerName')}
                  />
                </div>

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
                          console.log('🔧 Payment method clicked:', method);
                          if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
                            window.navigator.vibrate(20);
                          }
                          setFormData(prev => ({ ...prev, payment_method: method }));
                        }}
                        className={`py-3 rounded-xl font-medium text-sm transition-all button-tap ${
                          formData.payment_method === method
                            ? 'bg-green-500/20 text-green-700 border-2 border-green-500/50 shadow-sm'
                            : 'text-[var(--text-2)] border-2 border-transparent shadow-sm'
                        }`}
                        style={{ backgroundColor: '#ffffff' }}
                      >
                        {t(`payment.${method}`, method === 'mobile_money' ? 'Mobile Money' : method.charAt(0).toUpperCase() + method.slice(1))}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ✅ Due Date field - REQUIRED when credit selected */}
                {formData.payment_method === 'credit' && (
                  <div ref={dueDateRef} className="scroll-mt-4">
                    <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                      {t('credit.due_date')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.due_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500/50 focus:border-green-300 shadow-sm text-[var(--text-1)]"
                      style={{ backgroundColor: '#ffffff' }}
                    />
                    <p className="text-xs text-[var(--text-3)] mt-1">
                      {t('common.payment_due_note', 'Payment due date (default: 30 days from today)')}
                    </p>
                  </div>
                )}

                <div className="pt-4 space-y-3">
                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-colors"
                  >
                    {t('common.cancel', 'Cancel')}
                  </button>

                  {/* Existing Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold text-lg hover:from-green-400 hover:to-green-500 transition-colors shadow-lg button-tap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? t('common.processing', 'Processing...') : t('transaction.save', 'Save Transaction')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
