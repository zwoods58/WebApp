"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Target, TrendingUp, Users, Package, FileText, DollarSign } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';

interface WelcomeTourProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
  industry?: string;
  country?: string;
}

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  target?: string; // CSS selector for highlighting
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const getTourSteps = (t: any): TourStep[] => [
  {
    id: 'welcome',
    title: t('tour.modal_title', 'Welcome to Beezee!'),
    description: t('tour.welcome_description', 'Your complete business management solution. Let\'s take a quick tour of the dashboard features.'),
    icon: Target,
    position: 'center'
  },
  {
    id: 'daily-target',
    title: t('tour.daily_target', 'Daily Target'),
    description: t('tour.target_description', 'Set and track your daily sales goals right here. The progress bar shows how close you are to hitting your target!'),
    icon: Target,
    target: '.daily-target-section',
    position: 'bottom'
  },
  {
    id: 'buzz',
    title: t('tour.buzz_insights', 'Buzz Insights'),
    description: t('tour.buzz_description', 'Get smart insights about your business - low stock alerts, overdue payments, and quick summaries of cash, inventory, and credit.'),
    icon: TrendingUp,
    target: '.buzz-section',
    position: 'bottom'
  },
  {
    id: 'money-buttons',
    title: t('tour.money_buttons', 'Money In & Out'),
    description: t('tour.money_description', 'Quickly record sales (Money In) and expenses (Money Out) with these convenient buttons.'),
    icon: DollarSign,
    target: '.money-in-button',
    position: 'top'
  },
  {
    id: 'credit-preview',
    title: t('tour.credit_preview', 'Credit Overview'),
    description: t('tour.credit_preview_description', 'See customers who owe you money at a glance. Tap to view full details and manage payments.'),
    icon: Users,
    target: '.credit-list-section',
    position: 'top'
  },
  {
    id: 'inventory-preview',
    title: t('tour.inventory_preview', 'Inventory Preview'),
    description: t('tour.inventory_preview_description', 'Quick view of your stock levels. Get alerts when items are running low.'),
    icon: Package,
    target: '.inventory-list-section',
    position: 'top'
  },
  {
    id: 'navigation',
    title: t('tour.navigation_guide', 'Navigation Guide'),
    description: t('tour.navigation_description', 'The bottom bar gives you access to all features:\n\n📊 Cash - Full transaction history\n📦 Stock - Complete inventory management\n💳 Credit - Customer credit tracking\n📈 Reports - Business analytics\n🐝 Beehive - Feature requests & community\n⚙️ More - Settings and additional tools'),
    icon: FileText,
    target: '.bottom-nav',
    position: 'top'
  },
  {
    id: 'complete',
    title: t('tour.ready_to_start', 'You\'re All Set!'),
    description: t('tour.complete_description', 'You\'re ready to manage your business with Beezee. Start by adding your first transaction or explore the features at your own pace.'),
    icon: Target,
    position: 'center'
  }
];

export default function WelcomeTour({ isOpen, onComplete, onSkip, industry = 'retail', country = 'ke' }: WelcomeTourProps) {
  const { t } = useLanguage();
  const tourSteps = getTourSteps(t);
  const [currentStep, setCurrentStep] = useState(0);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    if (isOpen && step.target) {
      // Highlight target element
      const targetElement = document.querySelector(step.target);
      if (targetElement) {
        setIsHighlighted(true);
        // Scroll element into view
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setIsHighlighted(false);
    }
  }, [currentStep, isOpen, step.target]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

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

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
        onClick={handleSkip}
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
        className="fixed z-[82] max-w-sm mx-auto"
        style={{
          bottom: step.position === 'top' ? 'auto' : '80px',
          top: step.position === 'top' ? '80px' : 'auto',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="glass-strong rounded-3xl p-6 shadow-float-lg mx-4">
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {tourSteps.map((_: TourStep, index: number) => (
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
              onClick={handleSkip}
              className="ml-4 p-2 rounded-xl hover:bg-[var(--powder)]/10 transition-colors"
            >
              <X size={20} className="text-[var(--text-3)]" />
            </button>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[var(--powder)]/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <step.icon size={32} className="text-[var(--powder-dark)]" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-1)] mb-2">
              {step.title}
            </h3>
            <p className="text-[var(--text-2)] leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {!isFirstStep && (
              <button
                onClick={handlePrevious}
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--bg2)] transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="font-medium">{t('common.previous', 'Previous')}</span>
              </button>
            )}
            
            <button
              onClick={handleNext}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-[var(--powder-dark)] text-white hover:bg-[var(--powder-darker)] transition-colors ${
                isFirstStep ? 'col-span-2' : ''
              }`}
            >
              <span className="font-medium">
                {isLastStep ? t('tour.get_started', 'Get Started') : t('common.next', 'Next')}
              </span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Step indicator */}
          <div className="text-center mt-4">
            <span className="text-[11px] text-[var(--text-3)] font-medium">
              {t('tour.step', 'Step')} {currentStep + 1} {t('tour.of', 'of')} {tourSteps.length}
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// Hook for managing tour state
export function useWelcomeTour() {
  const [isTourOpen, setIsTourOpen] = useState(false);

  const startTour = () => setIsTourOpen(true);
  const completeTour = () => setIsTourOpen(false);
  const skipTour = () => setIsTourOpen(false);

  return {
    isTourOpen,
    startTour,
    completeTour,
    skipTour
  };
}
