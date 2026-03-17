"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Target, TrendingUp, Users, Package, FileText, DollarSign, MoreHorizontal, Home, Plus, Minus } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';

interface TourContextType {
  isTourActive: boolean;
  currentTourStep: number;
  currentTourPage: string;
  startTour: (startingPage?: string) => void;
  completeTour: () => void;
  skipTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
  goToPage: (page: string) => void;
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
  icon: React.ElementType | React.ComponentType<any>;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: string; // What user should do
}

interface TourPage {
  id: string;
  name: string;
  path: string;
  steps: TourStep[];
}

const getTourPages = (t: any, industry: string): TourPage[] => {
  const basePages = [
    {
      id: 'home',
      name: t('tour.home_dashboard', 'Home Dashboard'),
      path: '',
      steps: [
        {
          id: 'welcome-home',
          title: t('tour.welcome_dashboard', 'Welcome to Your Dashboard!'),
          description: t('tour.dashboard_description', 'This is your business command center. Track everything that matters in one place.'),
          icon: Home,
          position: 'center' as const
        },
        {
          id: 'daily-target',
          title: t('tour.set_daily_goal', 'Set Your Daily Goal'),
          description: t('tour.daily_goal_description', 'Aim high! Set a daily sales target to keep yourself motivated and track your progress.'),
          icon: Target,
          target: '.daily-target-section',
          position: 'bottom' as const
        },
        {
          id: 'buzz-insights',
          title: t('tour.buzz_insights', 'Buzz Insights'),
          description: t('tour.buzz_description', 'Get smart insights about your business - low stock alerts, overdue payments, and quick summaries.'),
          icon: TrendingUp,
          target: '.buzz-section',
          position: 'bottom' as const
        },
        {
          id: 'quick-add',
          title: t('tour.quick_add_money', 'Quick Add Money'),
          description: t('tour.quick_add_description', 'Tap these buttons to instantly record sales or expenses. It\'s that simple!'),
          icon: Plus,
          target: '.money-in-button',
          position: 'top' as const
        }
      ]
    },
    {
      id: 'cash',
      name: t('tour.cash_management', 'Cash Management'),
      path: '/cash',
      steps: [
        {
          id: 'cash-overview',
          title: t('tour.track_cash_flow', 'Track Your Cash Flow'),
          description: t('tour.cash_flow_description', 'See all your money coming in and going out. Know your financial health at a glance.'),
          icon: DollarSign,
          position: 'center' as const
        },
        {
          id: 'add-transaction',
          title: t('tour.add_transactions', 'Add Transactions'),
          description: t('tour.transactions_description', 'Record every sale and expense. This helps you understand your business patterns.'),
          icon: Plus,
          target: '.add-transaction-btn',
          position: 'bottom' as const
        },
        {
          id: 'view-history',
          title: t('tour.transaction_history', 'Transaction History'),
          description: t('tour.history_description', 'Review past transactions to make smarter business decisions.'),
          icon: FileText,
          target: '.transaction-list',
          position: 'top' as const
        }
      ]
    }
  ];

  // Industry-specific pages
  const industryPages: Record<string, TourPage[]> = {
    retail: [
      {
        id: 'inventory',
        name: t('tour.inventory_management', 'Inventory Management'),
        path: '/stock',
        steps: [
          {
            id: 'inventory-overview',
            title: t('tour.manage_inventory', 'Manage Your Inventory'),
            description: t('tour.inventory_description', 'Keep track of your stock levels. Get alerts when items are running low.'),
            icon: Package,
            position: 'center' as const
          },
          {
            id: 'add-product',
            title: t('tour.add_product', 'Add New Product'),
            description: t('tour.add_product_description', 'Click here to add new products to your inventory.'),
            icon: Plus,
            target: '.add-product-btn',
            position: 'bottom' as const
          },
          {
            id: 'stock-alerts',
            title: t('tour.stock_alerts', 'Stock Alerts'),
            description: t('tour.stock_alerts_description', 'Get notified when items are running low so you can restock on time.'),
            icon: Target,
            target: '.stock-alerts-section',
            position: 'top' as const
          }
        ]
      }
    ],
    services: [
      {
        id: 'services',
        name: t('tour.services_management', 'Services Management'),
        path: '/services',
        steps: [
          {
            id: 'services-overview',
            title: t('tour.manage_services', 'Manage Your Services'),
            description: t('tour.services_description', 'List all the services you offer. Help customers know what you provide.'),
            icon: Package,
            position: 'center' as const
          },
          {
            id: 'add-service',
            title: t('tour.add_service', 'Add New Service'),
            description: t('tour.add_service_description', 'Click here to add a new service to your business offerings.'),
            icon: Plus,
            target: '.add-service-btn',
            position: 'bottom' as const
          }
        ]
      }
    ],
    restaurant: [
      {
        id: 'inventory',
        name: t('tour.inventory_management', 'Inventory Management'),
        path: '/stock',
        steps: [
          {
            id: 'inventory-overview',
            title: t('tour.manage_ingredients', 'Manage Your Ingredients'),
            description: t('tour.ingredients_description', 'Track your ingredients and supplies. Never run out of what you need.'),
            icon: Package,
            position: 'center' as const
          },
          {
            id: 'add-ingredient',
            title: t('tour.add_ingredient', 'Add New Ingredient'),
            description: t('tour.add_ingredient_description', 'Add ingredients to your kitchen inventory.'),
            icon: Plus,
            target: '.add-product-btn',
            position: 'bottom' as const
          }
        ]
      }
    ]
  };

  // Credit management is common to all industries
  const creditPage = {
    id: 'credit',
    name: t('tour.credit_management', 'Credit Management'),
    path: '/credit',
    steps: [
      {
        id: 'credit-overview',
        title: t('tour.manage_customer_credit', 'Manage Customer Credit'),
        description: t('tour.credit_description', 'Keep track of customers who owe you money. Never forget a payment again!'),
        icon: Users,
        position: 'center' as const
      },
      {
        id: 'add-credit',
        title: t('tour.record_credit_sales', 'Record Credit Sales'),
        description: t('tour.credit_sales_description', 'When a customer buys on credit, record it here to stay organized.'),
        icon: Plus,
        target: '.add-credit-btn',
        position: 'bottom' as const
      },
      {
        id: 'track-payments',
        title: t('tour.track_payments', 'Track Payments'),
        description: t('tour.payments_description', 'Mark when customers pay you back. Keep your cash flow healthy!'),
        icon: DollarSign,
        target: '.payment-list',
        position: 'top' as const
      }
    ]
  };

  // Beehive and Reports are common to all
  const commonPages = [
    {
      id: 'beehive',
      name: t('tour.beehive_community', 'Beehive Community'),
      path: '/beehive',
      steps: [
        {
          id: 'beehive-overview',
          title: t('tour.join_community', 'Join the Beehive'),
          description: t('tour.beehive_description', 'Connect with other business owners, share experiences, and get helpful tips.'),
          icon: Users,
          position: 'center' as const
        },
        {
          id: 'share-insights',
          title: t('tour.share_insights', 'Share Your Insights'),
          description: t('tour.share_description', 'Help others by sharing your business experiences and learn from the community.'),
          icon: TrendingUp,
          target: '.share-section',
          position: 'bottom' as const
        }
      ]
    },
    {
      id: 'reports',
      name: t('tour.business_reports', 'Business Reports'),
      path: '/reports',
      steps: [
        {
          id: 'reports-overview',
          title: t('tour.view_reports', 'View Business Reports'),
          description: t('tour.reports_description', 'Get detailed insights into your business performance with comprehensive reports.'),
          icon: FileText,
          position: 'center' as const
        },
        {
          id: 'sales-reports',
          title: t('tour.sales_analytics', 'Sales Analytics'),
          description: t('tour.sales_description', 'Analyze your sales patterns and make data-driven decisions.'),
          icon: TrendingUp,
          target: '.sales-reports-section',
          position: 'bottom' as const
        }
      ]
    },
    {
      id: 'more',
      name: t('tour.more_options', 'More Options'),
      path: '/more',
      steps: [
        {
          id: 'more-overview',
          title: t('tour.more_business_tools', 'More Business Tools'),
          description: t('tour.more_tools_description', 'Additional features to help you run your business like a pro!'),
          icon: MoreHorizontal,
          position: 'center' as const
        },
        {
          id: 'business-settings',
          title: t('tour.business_settings', 'Business Settings'),
          description: t('tour.settings_description', 'Customize your business profile, prices, and preferences.'),
          icon: Target,
          target: '.settings-section',
          position: 'bottom' as const
        },
        {
          id: 'tour-complete',
          title: t('tour.all_set', 'You\'re All Set! 🎉'),
          description: t('tour.complete_description', 'You\'ve mastered the basics! Explore each feature and watch your business grow. Success awaits!'),
          icon: Target,
          position: 'center' as const
        }
      ]
    }
  ];

  // Combine pages based on industry
  let pages: TourPage[] = [...basePages];
  
  // Add industry-specific pages
  if (industryPages[industry]) {
    pages = pages.concat(industryPages[industry]);
  }
  
  // Add common pages
  pages = pages.concat([creditPage, ...commonPages]);

  return pages;
};

interface TourProviderProps {
  children: React.ReactNode;
  industry: string;
  country: string;
}

export function TourProvider({ children, industry, country }: TourProviderProps) {
  const { t } = useLanguage();
  const tourPages = getTourPages(t, industry);
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [currentTourPage, setCurrentTourPage] = useState(0);

  const currentPage = tourPages[currentTourPage];
  const currentStep = currentPage?.steps[currentTourStep];

  const startTour = (startingPage?: string) => {
    const pageIndex = startingPage ? tourPages.findIndex((p: TourPage) => p.id === startingPage) : 0;
    setCurrentTourPage(pageIndex >= 0 ? pageIndex : 0);
    setCurrentTourStep(0);
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
    if (!currentPage) return;

    if (currentTourStep < currentPage.steps.length - 1) {
      setCurrentTourStep(prev => prev + 1);
    } else {
      // Move to next page
      if (currentTourPage < tourPages.length - 1) {
        setCurrentTourPage(prev => prev + 1);
        setCurrentTourStep(0);
      } else {
        completeTour();
      }
    }
  };

  const previousStep = () => {
    if (currentTourStep > 0) {
      setCurrentTourStep(prev => prev - 1);
    } else if (currentTourPage > 0) {
      setCurrentTourPage(prev => prev - 1);
      const prevPage = tourPages[currentTourPage - 1];
      setCurrentTourStep(prevPage.steps.length - 1);
    }
  };

  const goToPage = (pageId: string) => {
    const pageIndex = tourPages.findIndex((p: TourPage) => p.id === pageId);
    if (pageIndex >= 0) {
      setCurrentTourPage(pageIndex);
      setCurrentTourStep(0);
    }
  };

  return (
    <TourContext.Provider
      value={{
        isTourActive,
        currentTourStep,
        currentTourPage: currentPage?.id || '',
        startTour,
        completeTour,
        skipTour,
        nextStep,
        previousStep,
        goToPage
      }}
    >
      {children}
      {isTourActive && currentStep && (
        <TourTooltip
          step={currentStep}
          currentPage={currentPage}
          currentStepIndex={currentTourStep}
          totalSteps={currentPage.steps.length}
          currentPageIndex={currentTourPage}
          totalPages={tourPages.length}
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
  currentPage: TourPage;
  currentStepIndex: number;
  totalSteps: number;
  currentPageIndex: number;
  totalPages: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

function TourTooltip({
  step,
  currentPage,
  currentStepIndex,
  totalSteps,
  currentPageIndex,
  totalPages,
  onNext,
  onPrevious,
  onSkip,
  onComplete
}: TourTooltipProps) {
  const { t } = useLanguage();
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    if (step.target) {
      const targetElement = document.querySelector(step.target);
      if (targetElement) {
        setIsHighlighted(true);
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setIsHighlighted(false);
    }
  }, [step]);

  const isLastStep = currentPageIndex === totalPages - 1 && currentStepIndex === totalSteps - 1;
  const isFirstStep = currentPageIndex === 0 && currentStepIndex === 0;

  const getSpotlightPosition = () => {
    if (!step.target || step.position === 'center') return null;
    
    const targetElement = document.querySelector(step.target);
    if (!targetElement) return null;

    const rect = targetElement.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    };
  };

  const spotlightPosition = getSpotlightPosition();

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

      {/* Spotlight overlay */}
      {spotlightPosition && (
        <div
          className="fixed pointer-events-none z-[81]"
          style={{
            top: spotlightPosition.top - 8,
            left: spotlightPosition.left - 8,
            width: spotlightPosition.width + 16,
            height: spotlightPosition.height + 16,
          }}
        >
          <div className="absolute inset-0 border-4 border-[var(--powder-dark)] rounded-2xl animate-pulse" />
          <div className="absolute inset-0 bg-[var(--powder-light)]/20 rounded-2xl" />
        </div>
      )}

      {/* Tour Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="fixed z-[82] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-1rem)] max-w-sm px-4"
      >
        <div className="glass-strong rounded-3xl p-4 sm:p-6 shadow-float-lg">
          {/* Page Progress */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="text-[11px] font-medium text-[var(--text-3)] mb-2">
                {currentPage.name} • {t('tour.page', 'Page')} {currentPageIndex + 1} {t('tour.of', 'of')} {totalPages}
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      index <= currentPageIndex ? 'bg-[var(--powder-dark)]' : 'bg-[var(--border)]'
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

          {/* Step Progress */}
          <div className="flex items-center gap-2 mb-4">
            {currentPage.steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-colors ${
                  index <= currentStepIndex ? 'bg-[var(--powder-mid)]' : 'bg-[var(--border)]'
                }`}
                style={{ width: `${100 / currentPage.steps.length}%` }}
              />
            ))}
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
            {step.action && (
              <div className="mt-3 p-2 bg-[var(--powder-light)]/20 rounded-xl">
                <p className="text-xs sm:text-sm text-[var(--powder-dark)] font-medium">
                  💡 {step.action}
                </p>
              </div>
            )}
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

          {/* Step indicator */}
          <div className="text-center mt-4">
            <span className="text-[11px] text-[var(--text-3)] font-medium">
              {t('tour.step', 'Step')} {currentStepIndex + 1} {t('tour.of', 'of')} {totalSteps}
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
