'use client';

import React from 'react';
import { useLanguage } from '@/hooks/LanguageContext';

export default function TranslationDebugTest() {
  const { t, currentLanguage, supportedLanguages, setLanguage } = useLanguage();
  
  // Test common keys that should exist
  const testKeys = [
    'services.title',
    'services.services_tab',
    'services.inventory_tab',
    'services.no_services',
    'nav.home',
    'nav.more',
    'payment.cash',
    'payment.transfer',
    'credit.customer_name',
    'credit.cancel'
  ];

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid red', 
      margin: '20px',
      backgroundColor: 'white',
      fontFamily: 'monospace'
    }}>
      <h2>Translation Debug Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Current Language:</strong> {currentLanguage}<br/>
        <strong>Supported Languages:</strong> {supportedLanguages.join(', ')}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Translation Key Tests:</h3>
        {testKeys.map(key => (
          <div key={key} style={{ marginBottom: '5px' }}>
            <code>{key}</code>: <strong>{t(key, 'FALLBACK')}</strong>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Language Switch Test:</h3>
        {supportedLanguages.map(lang => (
          <button 
            key={lang}
            onClick={() => setLanguage(lang)}
            style={{ 
              margin: '5px', 
              padding: '5px 10px',
              border: '1px solid #ccc',
              backgroundColor: '#f0f0f0'
            }}
          >
            Test {lang}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <strong>Debug Info:</strong><br/>
        - If all show "FALLBACK" = LanguageProvider not working<br/>
        - If some show English = Those keys missing from translations<br/>
        - If all show proper translations = Individual components have issues<br/>
        - Check browser console for [TRANSLATION] debug logs
      </div>
    </div>
  );
}
