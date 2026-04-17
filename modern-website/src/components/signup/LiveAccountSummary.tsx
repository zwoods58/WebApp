"use client";

import React from 'react';
import { Check, User, Building, Phone, Globe, Briefcase, Target } from 'lucide-react';
import { SignupData } from '@/types/signup';
import { getCountryConfig, formatCurrencyWithSymbol } from '@/utils/currency';
import { getIndustryById, getSectorById } from '@/data/industries';

interface LiveAccountSummaryProps {
  data: Partial<SignupData>;
  currentStep: number;
  isVisible: boolean;
}

export function LiveAccountSummary({ data, currentStep, isVisible }: LiveAccountSummaryProps) {
  if (!isVisible) return null;

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  const getCompletionPercentage = () => {
    const fields = ['country', 'industry', 'industrySector', 'name', 'businessName', 'phoneNumber', 'dailyTarget'];
    const completedFields = fields.filter(field => data[field as keyof SignupData]);
    return Math.round((completedFields.length / fields.length) * 100);
  };

  const renderSummaryItem = (label: string, value: string, isCompleted: boolean) => (
    <div className="animate-fade-in">
      <div className="flex-1 text-left">
        <div className="text-xs text-[var(--text-2)]">{label}</div>
        <div className={`text-sm font-medium ${
          isCompleted ? 'text-[var(--text-1)]' : 'text-[var(--text-2)]'
        }`}>
          {value || <span className="italic">Not set</span>}
        </div>
      </div>
      {isCompleted && (
        <span className="text-[var(--powder-dark)] font-bold">✓</span>
      )}
    </div>
  );

  const getCountryDisplay = () => {
    if (!data.country) return '';
    const config = getCountryConfig(data.country);
    return config.name;
  };

  const getIndustryDisplay = () => {
    if (!data.industry) return '';
    const industry = getIndustryById(data.industry);
    return industry?.name || '';
  };

  const getSectorDisplay = () => {
    if (!data.industry || !data.industrySector) return '';
    const sector = getSectorById(data.industry, data.industrySector);
    return sector?.name || '';
  };

  const getDailyTargetDisplay = () => {
    if (!data.dailyTarget || !data.country) return '';
    return formatCurrencyWithSymbol(data.dailyTarget, data.country);
  };

  if (!isVisible) return null;

  return (
    <div className="animate-fade-in">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-[var(--text-1)]">Business Profile</h3>
                <div className="text-xs text-[var(--text-2)]">
                  {getCompletionPercentage()}% Complete
                </div>
              </div>
              <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--powder-dark)] transition-all duration-500 ease-out"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
            </div>

            {/* Compact summary - only show completed items */}
            <div className="flex flex-wrap gap-3">
              {data.country && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--powder-light)]/20 rounded-full text-xs">
                  <span className="text-[var(--text-1)]">{getCountryDisplay()}</span>
                </div>
              )}
              
              {data.industry && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--powder-light)]/20 rounded-full text-xs">
                  <span className="text-[var(--text-1)]">{getIndustryDisplay()}</span>
                </div>
              )}
              
              {data.industrySector && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--powder-light)]/20 rounded-full text-xs">
                  <span className="text-[var(--text-1)]">{getSectorDisplay()}</span>
                </div>
              )}
              
              {data.name && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--powder-light)]/20 rounded-full text-xs">
                  <span className="text-[var(--text-1)]">{data.name}</span>
                </div>
              )}
              
              {data.businessName && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--powder-light)]/20 rounded-full text-xs">
                  <span className="text-[var(--text-1)]">{data.businessName}</span>
                </div>
              )}
              
              {data.phoneNumber && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--powder-light)]/20 rounded-full text-xs">
                  <span className="text-[var(--text-1)]">{data.phoneNumber}</span>
                </div>
              )}
              
              {data.dailyTarget && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--powder-light)]/20 rounded-full text-xs">
                  <span className="text-[var(--text-1)]">{getDailyTargetDisplay()}</span>
                </div>
              )}
            </div>

            {currentStep === 6 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 text-[var(--powder-dark)]">
                  <span className="text-[var(--powder-dark)] font-bold">✓</span>
                  <span className="text-xs font-medium">
                    Profile complete! Ready to start your business journey.
                  </span>
                </div>
              </div>
            )}
          </div>
    </div>
  );
}

