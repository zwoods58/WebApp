"use client";

import React from 'react';
import { ArrowLeft, Check, User, Building, Phone, Globe, Briefcase, Target, Play } from 'lucide-react';
import { SignupData } from '@/types/signup';
import { getCountryConfig, formatCurrencyWithSymbol } from '@/utils/currency';
import { getIndustryById, getSectorById } from '@/data/industries';

interface AccountSummaryPreviewProps {
  formData: Partial<SignupData>;
  onComplete: () => void;
  onPrev: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function AccountSummaryPreview({ formData, onComplete, onPrev, isLoading = false, error = null }: AccountSummaryPreviewProps) {
  const getCompletionPercentage = () => {
    const fields = ['country', 'industry', 'industrySector', 'name', 'businessName', 'phoneNumber', 'dailyTarget'];
    const completedFields = fields.filter(field => formData[field as keyof SignupData]);
    return Math.round((completedFields.length / fields.length) * 100);
  };

  const getCountryDisplay = () => {
    if (!formData.country) return '';
    const config = getCountryConfig(formData.country);
    return `${config.flag} ${config.name}`;
  };

  const getIndustryDisplay = () => {
    if (!formData.industry) return '';
    const industry = getIndustryById(formData.industry);
    return `${industry?.icon} ${industry?.name}`;
  };

  const getSectorDisplay = () => {
    if (!formData.industry || !formData.industrySector) return '';
    const sector = getSectorById(formData.industry, formData.industrySector);
    return sector?.name || '';
  };

  const getDailyTargetDisplay = () => {
    if (!formData.dailyTarget || !formData.country) return '';
    return formatCurrencyWithSymbol(Number(formData.dailyTarget), formData.country);
  };

  const renderSummaryItem = (label: string, value: string, isCompleted: boolean) => (
    <div className="fade-in">
      <div className="flex-1 text-left">
        <div className="text-sm text-[var(--text-2)]">{label}</div>
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

  return (
    <>
      <div
        className="text-center mb-6 fade-in"
      >
        <div className="w-12 h-12 bg-[var(--powder-light)]/30 rounded-2xl flex items-center justify-center text-[var(--powder-dark)] mx-auto mb-3">
          <span className="text-lg font-bold">?</span>
        </div>
        <h2 className="text-xl font-bold text-[var(--text-1)] mb-2">
          Review Your Business Profile
        </h2>
        <p className="text-[var(--text-3)] text-xs">
          Here's a summary of your business information.
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="text-xs text-[var(--text-2)]">
            {getCompletionPercentage()}% Complete
          </div>
          <div className="w-16 h-1.5 bg-[var(--glass-bg)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--powder-dark)] transition-all duration-500 ease-out"
              style={{ width: `${getCompletionPercentage()}%` }}
            />
          </div>
        </div>
      </div>

      <div
        className="fade-in-up bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-5 max-h-80 overflow-y-auto"
        style={{ animationDelay: '0.1s' }}
      >

        <div className="space-y-3">
        {renderSummaryItem(
          'Country',
          getCountryDisplay(),
          !!formData.country
        )}

        {renderSummaryItem(
          'Industry',
          getIndustryDisplay(),
          !!formData.industry
        )}

        {renderSummaryItem(
          'Sector',
          getSectorDisplay(),
          !!formData.industrySector
        )}

        {renderSummaryItem(
          'Name',
          formData.name || '',
          !!formData.name
        )}

        {renderSummaryItem(
          'Business Name',
          formData.businessName || 'Optional',
          !!formData.businessName
        )}

        {renderSummaryItem(
          'Phone Number',
          formData.phoneNumber || '',
          !!formData.phoneNumber
        )}

        {renderSummaryItem(
          'Daily Target',
          getDailyTargetDisplay(),
          !!formData.dailyTarget
        )}
      </div>

      <div className="fade-in">
        <div className="flex items-center gap-2 text-system-blue">
          <span className="text-[var(--powder-dark)] font-bold">✓</span>
          <span className="text-sm font-medium">
            Your business profile is complete! You're all set to start managing your business with BeeZee.
          </span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="fade-in">
          <div className="flex items-center gap-2 text-red-400">
            <span className="text-sm font-medium">
              {error}
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onPrev}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-[var(--glass-bg)] text-black font-medium rounded-lg hover:bg-[var(--glass-bg)] transition-all disabled:opacity-50 text-sm"
          >
            Back
          </button>
          <button
            onClick={onComplete}
            disabled={isLoading || getCompletionPercentage() < 100}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white font-medium rounded-lg hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Start Business
                <Play size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
