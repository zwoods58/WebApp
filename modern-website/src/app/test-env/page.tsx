'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';

export default function TestEnvPage() {
  const [isClient, setIsClient] = useState(false);
  const [envVars, setEnvVars] = useState({
    url: 'CHECKING...',
    key: 'CHECKING...',
    serviceKey: 'CHECKING...',
  });
  const [details, setDetails] = useState({
    urlLength: 0,
    keyLength: 0,
    urlStartsWithHttps: false,
    keyFormatCorrect: false,
  });

  useEffect(() => {
    setIsClient(true);
    
    // Set environment variables on client side only
    setEnvVars({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
    });

    setDetails({
      urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      urlStartsWithHttps: process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://') || false,
      keyFormatCorrect: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith('eyJ') || false,
    });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Variables Test</h1>
      
      <h2>Status:</h2>
      <ul>
        <li>NEXT_PUBLIC_SUPABASE_URL: <strong>{envVars.url}</strong></li>
        <li>NEXT_PUBLIC_SUPABASE_ANON_KEY: <strong>{envVars.key}</strong></li>
        <li>SUPABASE_SERVICE_ROLE_KEY: <strong>{envVars.serviceKey}</strong></li>
      </ul>

      <h2>Details:</h2>
      <ul>
        <li>URL Length: {details.urlLength}</li>
        <li>Key Length: {details.keyLength}</li>
        <li>URL starts with https: {details.urlStartsWithHttps ? 'YES' : 'NO'}</li>
        <li>Key format correct: {details.keyFormatCorrect ? 'YES' : 'NO'}</li>
      </ul>

      <h2>Environment:</h2>
      <p>Node Environment: {process.env.NODE_ENV}</p>
      <p>Browser: {isClient ? 'YES' : 'NO'}</p>
      <p>Rendered: {isClient ? 'CLIENT' : 'SERVER'}</p>

      <h2>Test Supabase Client:</h2>
      <button 
        onClick={() => {
          try {
            const { supabase } = require('@/lib/supabase');
            alert('Supabase client loaded successfully!');
          } catch (error) {
            alert('Error loading Supabase: ' + (error instanceof Error ? error.message : 'Unknown error'));
          }
        }}
      >
        Test Supabase Client
      </button>
    </div>
  );
}

