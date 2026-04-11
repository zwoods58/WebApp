'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/hooks/LanguageContext';

export default function DebugTranslations() {
  const { t } = useLanguage();
  
  useEffect(() => {
    // Test a few key translations
    console.log('=== Translation Debug ===');
    console.log('credit.no_customers:', t('credit.no_customers'));
    console.log('credit.add_first:', t('credit.add_first'));
    console.log('appointments.no_upcoming:', t('appointments.no_upcoming'));
    console.log('services.no_services:', t('services.no_services'));
    console.log('inventory.no_items:', t('inventory.no_items'));
    console.log('common.save:', t('common.save'));
    console.log('appointments.title:', t('appointments.title'));
    console.log('========================');
  }, [t]);
  
  return (
    <div className="p-8">
      <h1>Debug Translations</h1>
      <p>Check browser console for translation output</p>
      
      <div className="space-y-2 mt-4">
        <p>credit.no_customers: <span className="font-mono bg-gray-100 px-2">{t('credit.no_customers')}</span></p>
        <p>credit.add_first: <span className="font-mono bg-gray-100 px-2">{t('credit.add_first')}</span></p>
        <p>appointments.no_upcoming: <span className="font-mono bg-gray-100 px-2">{t('appointments.no_upcoming')}</span></p>
        <p>services.no_services: <span className="font-mono bg-gray-100 px-2">{t('services.no_services')}</span></p>
        <p>inventory.no_items: <span className="font-mono bg-gray-100 px-2">{t('inventory.no_items')}</span></p>
        <p>common.save: <span className="font-mono bg-gray-100 px-2">{t('common.save')}</span></p>
        <p>appointments.title: <span className="font-mono bg-gray-100 px-2">{t('appointments.title')}</span></p>
      </div>
    </div>
  );
}
