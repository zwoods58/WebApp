"use client";

import { useEffect } from 'react';
import { useTour } from '@/components/universal/IndustryTour';

interface TourTriggerOptions {
  industry?: string;
  country?: string;
  autoStart?: boolean;
  delay?: number;
}

export function useTourTrigger(options: TourTriggerOptions = {}) {
  const { 
    industry: tourIndustry = 'retail', 
    country: tourCountry = 'ke', 
    startTour, 
    isTourActive 
  } = useTour();

  const {
    industry = tourIndustry,
    country = tourCountry,
    autoStart = false,
    delay = 2000
  } = options;

  useEffect(() => {
    // Check if tour was already completed
    const tourCompleted = localStorage.getItem('beezee-industry-tour-completed');
    
    // Auto-start tour if conditions are met
    if (autoStart && !tourCompleted && !isTourActive) {
      const timer = setTimeout(() => {
        startTour();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [autoStart, delay, isTourActive, startTour]);

  const shouldShowTourForPage = (currentPage: string) => {
    // Define which pages should show tour steps
    const validPages = [
      'dashboard', 'cash', 'credit', 'stock', 'services', 
      'beehive', 'reports', 'more'
    ];
    
    return validPages.includes(currentPage);
  };

  const getRelevantSteps = (currentPage: string) => {
    // Filter steps based on current page
    const pageSteps: Record<string, string[]> = {
      dashboard: ['welcome', 'daily-target', 'buzz-insights', 'quick-add'],
      cash: ['cash-overview', 'add-transaction'],
      credit: ['credit-overview', 'add-credit'],
      stock: industry === 'retail' ? ['inventory-overview', 'add-product'] : 
             industry === 'services' ? ['services-overview', 'add-service'] :
             industry === 'restaurant' ? ['inventory-overview', 'add-ingredient'] : [],
      services: industry === 'services' ? ['services-overview', 'add-service'] : [],
      beehive: ['beehive-overview'],
      reports: ['reports-overview'],
      more: ['more-overview']
    };

    return pageSteps[currentPage] || [];
  };

  return {
    startTour,
    isTourActive,
    shouldShowTourForPage,
    getRelevantSteps,
    industry,
    country
  };
}

// Hook for page-specific tour triggers
export function usePageTour(pageName: string) {
  const { startTour, isTourActive, shouldShowTourForPage, getRelevantSteps } = useTourTrigger();

  const startPageTour = () => {
    if (shouldShowTourForPage(pageName)) {
      startTour();
    }
  };

  const getPageSteps = () => {
    return getRelevantSteps(pageName);
  };

  return {
    startPageTour,
    isTourActive,
    shouldShowTour: shouldShowTourForPage(pageName),
    pageSteps: getPageSteps()
  };
}
