"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  CheckCircle, 
  ArrowRight,
  Home,
  DollarSign,
  Package,
  Users,
  FileText,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import { useLanguage } from '@/hooks/LanguageContext';

export default function TourPage() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const { t } = useLanguage();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const tourSteps = [
    {
      id: '1',
      title: t('tour.welcome_title', 'Welcome to BeeZee!'),
      description: t('tour.welcome_description', 'Let\'s explore your business management dashboard'),
      icon: Home,
      target: '/dashboard',
      action: 'navigate'
    },
    {
      id: '2',
      title: t('tour.transactions_title', 'Track Your Money'),
      description: t('tour.transactions_description', 'Monitor your income and expenses in real-time'),
      icon: DollarSign,
      target: '/cash',
      action: 'navigate'
    },
    {
      id: '3',
      title: t('tour.inventory_title', 'Manage Your Inventory'),
      description: t('tour.inventory_description', 'Keep track of your stock and products'),
      icon: Package,
      target: '/services',
      action: 'navigate'
    },
    {
      id: '4',
      title: t('tour.customers_title', 'Customer Management'),
      description: t('tour.customers_description', 'Manage credit and track customer payments'),
      icon: Users,
      target: '/credit',
      action: 'navigate'
    },
    {
      id: '5',
      title: t('tour.reports_title', 'Business Reports'),
      description: t('tour.reports_description', 'Get insights into your business performance'),
      icon: FileText,
      target: '/reports',
      action: 'navigate'
    },
    {
      id: '6',
      title: t('tour.settings_title', 'Settings'),
      description: t('tour.settings_description', 'Customize your app preferences'),
      icon: Settings,
      target: '/settings',
      action: 'navigate'
    }
  ];

  useEffect(() => {
    // Auto-play tour when page loads
    const timer = setTimeout(() => {
      setIsPlaying(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        handleNext();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps([...completedSteps, tourSteps[currentStep].id]);
    } else {
      setIsPlaying(false);
      setCompletedSteps([...completedSteps, tourSteps[currentStep].id]);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkip = () => {
    setIsPlaying(false);
    setCompletedSteps(tourSteps.map(step => step.id));
  };

  const handleFinish = () => {
    // Mark all steps as completed
    setCompletedSteps(tourSteps.map(step => step.id));
    setIsPlaying(false);
    
    // Navigate to dashboard
    window.location.href = `/Beezee-App/app/${country}/${industry}`;
  };

  const currentStepData = tourSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-20">
      <Header industry={industry} country={country} />

      <div className="p-4 max-w-md mx-auto">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-800">
              {t('tour.step', 'Step')} {currentStep + 1} {t('tour.of', 'of')} {tourSteps.length}
            </h2>
            <span className="text-sm text-gray-600">
              {Math.round(((completedSteps.length + (isPlaying ? 1 : 0)) / tourSteps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((completedSteps.length + (isPlaying ? 1 : 0)) / tourSteps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Tour Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                completedSteps.includes(currentStepData.id) 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {completedSteps.includes(currentStepData.id) ? (
                  <CheckCircle size={24} />
                ) : (
                  <currentStepData.icon size={24} />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {currentStepData.title}
                </h3>
                <p className="text-gray-600">
                  {currentStepData.description}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {currentStep + 1}/{tourSteps.length}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-3">
            <button
              onClick={() => handleStepComplete(currentStepData.id)}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {completedSteps.includes(currentStepData.id) ? (
                <>
                  <CheckCircle size={20} />
                  {t('tour.completed', 'Completed')}
                </>
              ) : (
                <>
                  <ArrowRight size={20} />
                  {t('tour.got_it', 'Got it!')}
                </>
              )}
            </button>
            {completedSteps.includes(currentStepData.id) && (
              <button
                onClick={handleNext}
                className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors"
              >
                {t('tour.next', 'Next')}
              </button>
            )}
          </div>
        </motion.div>

        {/* Navigation Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between items-center"
        >
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <ChevronLeft size={20} />
            {t('tour.previous', 'Previous')}
          </button>

          <div className="flex gap-2">
            <button
              onClick={handlePlayPause}
              className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? t('tour.pause', 'Pause') : t('tour.play', 'Play')}
            </button>
            <button
              onClick={handleSkip}
              className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              {t('tour.skip', 'Skip')}
            </button>
          </div>

          <button
            onClick={currentStep === tourSteps.length - 1 ? handleFinish : handleNext}
            disabled={!completedSteps.includes(currentStepData.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              !completedSteps.includes(currentStepData.id)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {currentStep === tourSteps.length - 1 ? (
              <>
                <CheckCircle size={20} />
                {t('tour.finish', 'Finish')}
              </>
            ) : (
              <>
                {t('tour.next', 'Next')}
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </motion.div>

        {/* Step Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-2"
        >
          {tourSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-blue-600'
                  : completedSteps.includes(step.id)
                  ? 'bg-green-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h3 className="text-center font-semibold text-gray-800 mb-4">
            {t('tour.quick_links', 'Quick Links')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/Beezee-App/app/${country}/${industry}`}
              className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow border border-gray-200"
            >
              <Home size={24} className="mx-auto text-blue-600 mb-2" />
              <div className="text-sm font-medium text-gray-700">
                {t('nav.home', 'Home')}
              </div>
            </Link>
            <Link
              href={`/Beezee-App/app/${country}/${industry}/cash`}
              className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow border border-gray-200"
            >
              <DollarSign size={24} className="mx-auto text-green-600 mb-2" />
              <div className="text-sm font-medium text-gray-700">
                {t('nav.transactions', 'Transactions')}
              </div>
            </Link>
            <Link
              href={`/Beezee-App/app/${country}/${industry}/services`}
              className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow border border-gray-200"
            >
              <Package size={24} className="mx-auto text-purple-600 mb-2" />
              <div className="text-sm font-medium text-gray-700">
                {t('nav.inventory', 'Inventory')}
              </div>
            </Link>
            <Link
              href={`/Beezee-App/app/${country}/${industry}/reports`}
              className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow border border-gray-200"
            >
              <FileText size={24} className="mx-auto text-orange-600 mb-2" />
              <div className="text-sm font-medium text-gray-700">
                {t('reports.title', 'Reports')}
              </div>
            </Link>
          </div>
        </motion.div>
      </div>

      <BottomNav industry={industry} country={country} />
    </div>
  );
}
