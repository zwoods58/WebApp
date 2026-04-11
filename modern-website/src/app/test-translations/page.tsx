'use client';

import { useLanguage } from '@/hooks/LanguageContext';

export default function TestTranslations() {
  const { t } = useLanguage();
  
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Translation Test Page</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Testing New Keys:</h2>
        
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>credit.no_customers:</strong> {t('credit.no_customers')}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>credit.add_first:</strong> {t('credit.add_first')}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>appointments.no_upcoming:</strong> {t('appointments.no_upcoming')}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>services.no_services:</strong> {t('services.no_services')}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>inventory.no_items:</strong> {t('inventory.no_items')}</p>
        </div>
        
        <h2 className="text-xl font-semibold mt-6">Testing Existing Keys:</h2>
        
        <div className="bg-blue-100 p-4 rounded">
          <p><strong>common.save:</strong> {t('common.save')}</p>
        </div>
        
        <div className="bg-blue-100 p-4 rounded">
          <p><strong>appointments.title:</strong> {t('appointments.title')}</p>
        </div>
        
        <div className="bg-blue-100 p-4 rounded">
          <p><strong>retail.title:</strong> {t('retail.title')}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <p className="text-sm text-gray-600">
          Open browser console to see translation debug logs
        </p>
      </div>
    </div>
  );
}
