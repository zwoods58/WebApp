'use client';

import { useLanguage } from '@/hooks/LanguageContext';

export default function TestSimple() {
  const { t } = useLanguage();
  
  return (
    <div className="p-8">
      <h1>Simple Translation Test</h1>
      <p>credit.no_customers: {t('credit.no_customers')}</p>
      <p>services.no_services: {t('services.no_services')}</p>
      <p>common.save: {t('common.save')}</p>
    </div>
  );
}
