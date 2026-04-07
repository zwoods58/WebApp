'use client';

import React from 'react';
import { useLanguage } from '@/hooks/LanguageContext';

export default function SimpleTranslationTest() {
  const { t, currentLanguage } = useLanguage();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      left: '10px', 
      background: 'lightblue', 
      border: '2px solid blue', 
      padding: '10px', 
      zIndex: 9999,
      fontSize: '12px',
      borderRadius: '8px'
    }}>
      <div><strong>Current Language:</strong> {currentLanguage}</div>
      <div><strong>Test Translation:</strong></div>
      <div>appointments.title: {t('appointments.title', 'Appointments')}</div>
      <div>nav.home: {t('nav.home', 'Home')}</div>
    </div>
  );
}
