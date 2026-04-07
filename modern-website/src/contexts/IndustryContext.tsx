'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface IndustryContextType {
  industry: string;
  country: string;
  setIndustry: (industry: string) => void;
  setCountry: (country: string) => void;
}

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

export const useIndustry = () => {
  const context = useContext(IndustryContext);
  if (!context) {
    throw new Error('useIndustry must be used within an IndustryProvider');
  }
  return context;
};

interface IndustryProviderProps {
  children: ReactNode;
}

export const IndustryProvider: React.FC<IndustryProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const [industry, setIndustry] = useState('retail');
  const [country, setCountry] = useState('ke');

  useEffect(() => {
    // Extract country and industry from pathname
    // Pattern: /Beezee-App/app/[country]/[industry]/...
    const pathMatch = pathname.match(/\/Beezee-App\/app\/([^\/]+)\/([^\/]+)/);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Industry Context Debug:', { pathname, pathMatch });
    }
    
    if (pathMatch) {
      const extractedCountry = pathMatch[1];
      const extractedIndustry = pathMatch[2];
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Extracted:', { country: extractedCountry, industry: extractedIndustry });
      }
      
      if (extractedCountry && extractedIndustry) {
        setCountry(extractedCountry);
        setIndustry(extractedIndustry);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Industry Context Updated:', { country: extractedCountry, industry: extractedIndustry });
        }
      }
    }
  }, [pathname]);

  return (
    <IndustryContext.Provider 
      value={{ 
        industry, 
        country, 
        setIndustry, 
        setCountry 
      }}
    >
      {children}
    </IndustryContext.Provider>
  );
};
