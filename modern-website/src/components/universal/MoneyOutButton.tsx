"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, TrendingDown, Store, Utensils, Car, Scissors, Ruler, Wrench, Laptop } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';

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
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'supplies',
    payment_method: 'cash'
  });

  const labels = industryLabels[industry as keyof typeof industryLabels] || industryLabels.retail;
  const Icon = labels.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expenseData = {
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      payment_method: formData.payment_method,
      expense_date: new Date().toISOString().split('T')[0]
    };

    onSuccess(expenseData);
    setShowModal(false);
    setFormData({ amount: '', description: '', category: 'supplies', payment_method: 'cash' });
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
        className={`w-full py-5 px-6 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-white shadow-lg transition-all bg-gradient-to-r from-[var(--color-danger)] to-rose-500 hover:shadow-xl active:shadow-md no-select button-touch ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={disabled}
      >
        <Minus size={22} strokeWidth={2.5} />
        {t('common.money_out')}
      </motion.button>

      {/* Bottom Sheet */}
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
                  <div className="w-12 h-12 glass-regular rounded-xl flex items-center justify-center border border-orange-200/50">
                    <Icon className="text-orange-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-1)]">{t('common.add')} {t(labels.buttonKey)}</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            className="w-full pl-14 pr-4 py-4 glass-regular rounded-2xl border border-[var(--border)] focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300 backdrop-blur-sm bg-white/20 text-xl font-bold text-[var(--text-1)] placeholder-[var(--text-3)]"
                            placeholder="0.0"
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
                            className="w-full pl-14 pr-4 py-4 glass-regular rounded-2xl border border-[var(--border)] focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300 backdrop-blur-sm bg-white/20 text-xl font-bold text-[var(--text-1)] placeholder-[var(--text-3)]"
                            placeholder="0.00"
                            inputMode="decimal"
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                      {t('common.description')}
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 glass-regular rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300 backdrop-blur-sm bg-white/20 text-[var(--text-1)] placeholder-[var(--text-3)]"
                      placeholder={t('common.description_placeholder', 'What was this for?')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-2)] mb-1">
                      {t('common.category', 'Category')}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 glass-regular rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300 backdrop-blur-sm bg-white/20 text-[var(--text-1)]"
                    >
                      <option value="supplies">Supplies/Stock</option>
                      <option value="utilities">Utilities</option>
                      <option value="rent">Rent</option>
                      <option value="transport">Transport</option>
                      <option value="salary">Salaries</option>
                      <option value="other">Other</option>
                    </select>
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
                              ? 'bg-orange-500/20 text-orange-700 border-2 border-orange-500/50 glass-regular'
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
                      className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-lg hover:from-orange-400 hover:to-orange-500 transition-colors shadow-lg"
                    >
                      {t('common.save')} {t('nav.expenses')}
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
