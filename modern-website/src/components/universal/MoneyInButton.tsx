"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, TrendingUp, Store, Utensils, Car, Scissors, Ruler, Wrench, Laptop } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { useLanguage } from '@/hooks/LanguageContext';
import { useServices } from '@/hooks';

type Service = {
  id: string;
  service_name: string;
  price?: number;
  category?: string;
};

interface MoneyInButtonProps {
  industry: string;
  country: string;
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
  freelance: { buttonKey: 'freelance.new_project', placeholderKey: 'freelance.payment_received', icon: Laptop }
};

export default function MoneyInButton({ industry, country, onSuccess, disabled = false }: MoneyInButtonProps) {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    customer_name: '',
    payment_method: 'cash',
    // Transport-specific fields
    service_id: '',
    distance: '',
    tips: '',
    use_base_amount: false
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData = {
      amount: parseFloat(formData.amount),
      description: formData.description,
      customer_name: formData.customer_name,
      payment_method: formData.payment_method,
      transaction_date: new Date().toISOString().split('T')[0]
    };

    onSuccess(transactionData);
    setShowModal(false);
    setFormData({ 
      amount: '', 
      description: '', 
      customer_name: '', 
      payment_method: 'cash',
      service_id: '',
      distance: '',
      tips: '',
      use_base_amount: false
    });
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          if (disabled) return;
          if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
          }
          setShowModal(true);
        }}
        className={`w-full py-5 px-6 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-white shadow-lg transition-all bg-gradient-to-r from-[var(--color-success)] to-emerald-500 hover:shadow-xl active:shadow-md no-select button-touch ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }}`}
        disabled={disabled}
      >
        <Plus size={22} strokeWidth={2.5} />
        {t('common.money_in')}
      </motion.button>

      {/* Bottom Sheet for better ergonomics */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 glass-card !border-x-0 !border-b-0 !rounded-t-3xl !rounded-b-none shadow-xl overflow-hidden"
              style={{ 
                paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))',
                maxHeight: 'calc(100vh - 5rem - env(safe-area-inset-bottom))'
              }}
            >
              <div className="p-4 flex justify-center">
                <div className="w-12 h-1.5 bg-[var(--text-3)] opacity-50 rounded-full" />
              </div>
              
              <div className="px-6 pb-8 overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(100vh - 8rem - env(safe-area-inset-bottom))' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 glass-regular rounded-xl flex items-center justify-center border border-green-200/50">
                    <Icon className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-1)]">{t('common.add')} {t(labels.buttonKey)}</h3>
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
                        className="w-full pl-14 pr-4 py-4 glass-regular rounded-2xl border border-[var(--border)] focus:ring-2 focus:ring-green-500/50 focus:border-green-300 backdrop-blur-sm bg-white/20 text-xl font-bold text-[var(--text-1)] placeholder-[var(--text-3)]"
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
                          className="w-full px-4 py-3 glass-regular rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-green-500/50 focus:border-green-300 backdrop-blur-sm bg-white/20 text-[var(--text-1)] placeholder-[var(--text-3)]"
                          required
                        >
                          <option value="">Select service</option>
                          {services.map((service: Service) => (
                            <option key={service.id} value={service.id}>
                              {service.service_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                          Distance (km)
                        </label>
                        <input
                          type="number"
                          value={formData.distance}
                          onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
                          className="w-full px-4 py-3 glass-regular rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-green-500/50 focus:border-green-300 backdrop-blur-sm bg-white/20 text-[var(--text-1)] placeholder-[var(--text-3)]"
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
                          Use base amount only
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                          Tips (optional)
                        </label>
                        <input
                          type="number"
                          value={formData.tips}
                          onChange={(e) => setFormData(prev => ({ ...prev, tips: e.target.value }))}
                          className="w-full px-4 py-3 glass-regular rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-green-500/50 focus:border-green-300 backdrop-blur-sm bg-white/20 text-[var(--text-1)] placeholder-[var(--text-3)]"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>

                      {/* Fare calculation display */}
                      {formData.service_id && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-green-900">Calculated Fare:</span>
                            <span className="text-lg font-bold text-green-900">
                              {country === 'ke' ? 'KSh' : '$'} {calculateTransportFare().toFixed(2)}
                            </span>
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            {formData.use_base_amount 
                              ? `Base amount only${formData.tips ? ` + ${country === 'ke' ? 'KSh' : '$'} ${formData.tips} tips` : ''}`
                              : `${formData.distance || '0'} km × rate${formData.tips ? ` + ${country === 'ke' ? 'KSh' : '$'} ${formData.tips} tips` : ''}`
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
                      className="w-full px-4 py-3 glass-regular rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-green-500/50 focus:border-green-300 backdrop-blur-sm bg-white/20 text-[var(--text-1)] placeholder-[var(--text-3)]"
                      placeholder={t('common.description_placeholder', 'What was this for?')}
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
                      className="w-full px-4 py-3 glass-regular rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-green-500/50 focus:border-green-300 backdrop-blur-sm bg-white/20 text-[var(--text-1)] placeholder-[var(--text-3)]"
                      placeholder={t('customerName')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                      {t('payment_method', 'Payment Method')}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['cash', 'transfer', 'credit'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => {
                            if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
                              window.navigator.vibrate(20);
                            }
                            setFormData(prev => ({ ...prev, payment_method: method }));
                          }}
                          className={`py-3 rounded-xl font-medium text-sm transition-all ${
                            formData.payment_method === method
                              ? 'bg-green-500/20 text-green-700 border-2 border-green-500/50 glass-regular'
                              : 'glass-regular text-[var(--text-2)] border-2 border-transparent hover:bg-white/30'
                          }`}
                        >
                          {t(`payment.${method}`, method.charAt(0).toUpperCase() + method.slice(1))}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold text-lg hover:from-green-400 hover:to-green-500 transition-colors shadow-lg"
                    >
                      {t('common.save')} {t('transaction', 'Transaction')}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
