'use client';

import React from 'react';
import { useLanguage } from '@/hooks/LanguageContext';

export function SimpleTest() {
  const { t, currentLanguage } = useLanguage();
  
  // Debug logging
  console.log('[DEBUG] Language:', currentLanguage);
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '3px solid blue', 
      margin: '20px',
      backgroundColor: 'lightblue',
      fontFamily: 'monospace'
    }}>
      <h3>Simple Translation Test</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <p><strong>Current Language:</strong> {currentLanguage}</p>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4>Translation Tests:</h4>
        <p><strong>Save:</strong> {t('common.save', 'FALLBACK')}</p>
        <p><strong>Cancel:</strong> {t('common.cancel', 'FALLBACK')}</p>
        <p><strong>Services Title:</strong> {t('services.title', 'FALLBACK')}</p>
        <p><strong>Home:</strong> {t('nav.home', 'FALLBACK')}</p>
        <p><strong>Cash:</strong> {t('payment.cash', 'FALLBACK')}</p>
      </div>

      <div>
        <h4>Language Switcher:</h4>
        <button onClick={() => {
          const { setLanguage } = useLanguage();
          setLanguage('en');
        }} style={{ margin: '5px', padding: '5px 10px' }}>
          English
        </button>
        <button onClick={() => {
          const { setLanguage } = useLanguage();
          setLanguage('sw');
        }} style={{ margin: '5px', padding: '5px 10px' }}>
          Swahili
        </button>
      </div>
    </div>
  );
}
