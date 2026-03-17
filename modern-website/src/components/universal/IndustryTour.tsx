"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Target, TrendingUp, Users, Package, FileText, DollarSign, MoreHorizontal, Home, Plus } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';

interface TourContextType {
  isTourActive: boolean;
  currentStep: number;
  totalSteps: number;
  currentPage: string;
  industry: string;
  country: string;
  startTour: () => void;
  completeTour: () => void;
  skipTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  target?: string;
  position?: 'top' | 'bottom' | 'center';
  page: string;
}

const getIndustryTourSteps = (t: any, industry: string): TourStep[] => {
  const baseSteps: TourStep[] = [
    {
      id: 'welcome',
      title: t('tour.welcome_dashboard', 'Welcome to Your Dashboard!'),
      description: t('tour.dashboard_description', 'This is your business command center. Track everything that matters in one place.'),
      icon: Home,
      position: 'center',
      page: 'dashboard'
    },
    {
      id: 'daily-target',
      title: t('tour.set_daily_goal', 'Set Your Daily Goal'),
      description: t('tour.daily_goal_description', 'Aim high! Set a daily sales target to keep yourself motivated and track your progress.'),
      icon: Target,
      target: '.daily-target-section',
      position: 'bottom',
      page: 'dashboard'
    },
    {
      id: 'buzz-insights',
      title: t('tour.buzz_insights', 'Buzz Insights'),
      description: t('tour.buzz_description', 'Get smart insights about your business - low stock alerts, overdue payments, and quick summaries.'),
      icon: TrendingUp,
      target: '.buzz-section',
      position: 'bottom',
      page: 'dashboard'
    },
    {
      id: 'quick-add',
      title: t('tour.quick_add_money', 'Quick Add Money'),
      description: t('tour.quick_add_description', 'Tap these buttons to instantly record sales or expenses. It\'s that simple!'),
      icon: Plus,
      target: '.money-in-button',
      position: 'top',
      page: 'dashboard'
    }
  ];

  const cashSteps: TourStep[] = [
    {
      id: 'cash-overview',
      title: t('tour.track_cash_flow', 'Track Your Cash Flow'),
      description: t('tour.cash_flow_description', 'See all your money coming in and going out. Know your financial health at a glance.'),
      icon: DollarSign,
      position: 'center',
      page: 'cash'
    },
    {
      id: 'add-transaction',
      title: t('tour.add_transactions', 'Add Transactions'),
      description: t('tour.transactions_description', 'Record every sale and expense. This helps you understand your business patterns.'),
      icon: Plus,
      target: '.add-transaction-btn',
      position: 'bottom',
      page: 'cash'
    }
  ];

  const creditSteps: TourStep[] = [
    {
      id: 'credit-overview',
      title: t('tour.manage_customer_credit', 'Manage Customer Credit'),
      description: t('tour.credit_description', 'Keep track of customers who owe you money. Never forget a payment again!'),
      icon: Users,
      position: 'center',
      page: 'credit'
    },
    {
      id: 'add-credit',
      title: t('tour.record_credit_sales', 'Record Credit Sales'),
      description: t('tour.credit_sales_description', 'When a customer buys on credit, record it here to stay organized.'),
      icon: Plus,
      target: '.add-credit-btn',
      position: 'bottom',
      page: 'credit'
    }
  ];

  // Industry-specific steps
  let industrySteps: TourStep[] = [];

  if (industry === 'retail') {
    industrySteps = [
      {
        id: 'inventory-overview',
        title: t('tour.manage_inventory', 'Manage Your Inventory'),
        description: t('tour.inventory_description', 'Keep track of your stock levels. Get alerts when items are running low.'),
        icon: Package,
        position: 'center',
        page: 'stock'
      },
      {
        id: 'add-product',
        title: t('tour.add_product', 'Add New Product'),
        description: t('tour.add_product_description', 'Click here to add new products to your inventory.'),
        icon: Plus,
        target: '.add-product-btn',
        position: 'bottom',
        page: 'stock'
      }
    ];
  } else if (industry === 'services') {
    industrySteps = [
      {
        id: 'services-overview',
        title: t('tour.manage_services', 'Manage Your Services'),
        description: t('tour.services_description', 'List all the services you offer. Help customers know what you provide.'),
        icon: Package,
        position: 'center',
        page: 'services'
      },
      {
        id: 'add-service',
        title: t('tour.add_service', 'Add New Service'),
        description: t('tour.add_service_description', 'Click here to add a new service to your business offerings.'),
        icon: Plus,
        target: '.add-service-btn',
        position: 'bottom',
        page: 'services'
      }
    ];
  } else if (industry === 'restaurant') {
    industrySteps = [
      {
        id: 'inventory-overview',
        title: t('tour.manage_ingredients', 'Manage Your Ingredients'),
        description: t('tour.ingredients_description', 'Track your ingredients and supplies. Never run out of what you need.'),
        icon: Package,
        position: 'center',
        page: 'stock'
      },
      {
        id: 'add-ingredient',
        title: t('tour.add_ingredient', 'Add New Ingredient'),
        description: t('tour.add_ingredient_description', 'Add ingredients to your kitchen inventory.'),
        icon: Plus,
        target: '.add-product-btn',
        position: 'bottom',
        page: 'stock'
      }
    ];
  } else if (['salon', 'transport', 'tailor', 'freelance'].includes(industry)) {
    // Calendar industries get calendar tour steps
    const calendarSteps: TourStep[] = [
      {
        id: 'calendar-overview',
        title: t('tour.manage_calendar', 'Manage Your Calendar'),
        description: t('tour.calendar_description', 'View and manage all your appointments in one place.'),
        icon: FileText,
        position: 'center',
        page: 'calendar'
      },
      {
        id: 'add-appointment',
        title: t('tour.add_appointment', 'Add New Appointment'),
        description: t('tour.add_appointment_description', 'Schedule new appointments and manage your bookings.'),
        icon: Plus,
        target: '.add-appointment-btn',
        position: 'bottom',
        page: 'calendar'
      }
    ];

    // Add industry-specific steps first, then calendar
    if (industry === 'salon') {
      industrySteps = [
        {
          id: 'services-overview',
          title: t('tour.manage_services', 'Manage Your Services'),
          description: t('tour.services_description', 'List all your salon services and pricing.'),
          icon: Package,
          position: 'center',
          page: 'services'
        },
        ...calendarSteps
      ];
    } else if (industry === 'transport') {
      industrySteps = [
        {
          id: 'services-overview',
          title: t('tour.manage_trips', 'Manage Your Trips'),
          description: t('tour.trips_description', 'List all your transport routes and services.'),
          icon: Package,
          position: 'center',
          page: 'services'
        },
        ...calendarSteps
      ];
    } else if (industry === 'tailor') {
      industrySteps = [
        {
          id: 'services-overview',
          title: t('tour.manage_jobs', 'Manage Your Jobs'),
          description: t('tour.jobs_description', 'Track all your tailoring jobs and measurements.'),
          icon: Package,
          position: 'center',
          page: 'services'
        },
        ...calendarSteps
      ];
    } else if (industry === 'freelance') {
      industrySteps = [
        {
          id: 'services-overview',
          title: t('tour.manage_projects', 'Manage Your Projects'),
          description: t('tour.projects_description', 'Track all your freelance projects and deliverables.'),
          icon: Package,
          position: 'center',
          page: 'services'
        },
        ...calendarSteps
      ];
    }
  }

  const commonSteps: TourStep[] = [
    {
      id: 'beehive-overview',
      title: t('tour.join_community', 'Join the Beehive'),
      description: t('tour.beehive_description', 'Connect with other business owners, share experiences, and get helpful tips.'),
      icon: Users,
      position: 'center',
      page: 'beehive'
    },
    {
      id: 'reports-overview',
      title: t('tour.view_reports', 'View Business Reports'),
      description: t('tour.reports_description', 'Get detailed insights into your business performance with comprehensive reports.'),
      icon: FileText,
      position: 'center',
      page: 'reports'
    },
    {
      id: 'more-overview',
      title: t('tour.more_business_tools', 'More Business Tools'),
      description: t('tour.more_tools_description', 'Additional features to help you run your business like a pro!'),
      icon: MoreHorizontal,
      position: 'center',
      page: 'more'
    },
    {
      id: 'tour-complete',
      title: t('tour.all_set', 'You\'re All Set! 🎉'),
      description: t('tour.complete_description', 'You\'ve mastered the basics! Explore each feature and watch your business grow. Success awaits!'),
      icon: Target,
      position: 'center',
      page: 'complete'
    }
  ];

  return [...baseSteps, ...cashSteps, ...creditSteps, ...industrySteps, ...commonSteps];
};

interface TourProviderProps {
  children: React.ReactNode;
  industry: string;
  country: string;
}

export function TourProvider({ children, industry, country }: TourProviderProps) {
  const { t } = useLanguage();
  const tourSteps = getIndustryTourSteps(t, industry);
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const step = tourSteps[currentStep];
  const totalSteps = tourSteps.length;
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  const startTour = () => {
    setCurrentStep(0);
    setIsTourActive(true);
  };

  const completeTour = () => {
    setIsTourActive(false);
    localStorage.setItem('beezee-multi-page-tour-completed', 'true');
  };

  const skipTour = () => {
    setIsTourActive(false);
  };

  const nextStep = () => {
    if (isLastStep) {
      completeTour();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const previousStep = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (isTourActive && step.target) {
      const targetElement = document.querySelector(step.target);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, isTourActive, step.target]);

  return (
    <TourContext.Provider
      value={{
        isTourActive,
        currentStep,
        totalSteps,
        currentPage: step?.page || '',
        industry,
        country,
        startTour,
        completeTour,
        skipTour,
        nextStep,
        previousStep
      }}
    >
      {children}
      {isTourActive && step && (
        <TourTooltip
          step={step}
          currentStep={currentStep}
          totalSteps={totalSteps}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onNext={nextStep}
          onPrevious={previousStep}
          onSkip={skipTour}
          onComplete={completeTour}
        />
      )}
    </TourContext.Provider>
  );
}

interface TourTooltipProps {
  step: TourStep;
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

function TourTooltip({
  step,
  currentStep,
  totalSteps,
  isFirstStep,
  isLastStep,
  onNext,
  onPrevious,
  onSkip,
  onComplete
}: TourTooltipProps) {
  const { t } = useLanguage();

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
        onClick={onSkip}
      />

      {/* Tour Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="fixed z-[82] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-1rem)] max-w-sm px-4"
      >
        <div className="glass-strong rounded-3xl p-4 sm:p-6 shadow-float-lg">
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="text-[11px] font-medium text-[var(--text-3)] mb-2">
                {step.page} • {t('tour.step', 'Step')} {currentStep + 1} {t('tour.of', 'of')} {totalSteps}
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalSteps }, (_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-[var(--powder-dark)]' : 'bg-[var(--border)]'
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={onSkip}
              className="ml-4 p-2 rounded-xl hover:bg-[var(--powder)]/10 transition-colors"
            >
              <X size={20} className="text-[var(--text-3)]" />
            </button>
          </div>

          {/* Content */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[var(--powder)]/15 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <step.icon size={24} className="text-[var(--powder-dark)]" strokeWidth={2.5} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-1)] mb-2">
              {step.title}
            </h3>
            <p className="text-sm sm:text-base text-[var(--text-2)] leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {!isFirstStep && (
              <button
                onClick={onPrevious}
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--bg2)] transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="font-medium">{t('common.previous', 'Previous')}</span>
              </button>
            )}
            
            <button
              onClick={isLastStep ? onComplete : onNext}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-[var(--powder-dark)] text-white hover:bg-[var(--powder-darker)] transition-colors ${
                isFirstStep ? 'col-span-2' : ''
              }`}
            >
              <span className="font-medium">
                {isLastStep ? t('tour.complete_tour', 'Complete Tour') : t('common.next', 'Next')}
              </span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
