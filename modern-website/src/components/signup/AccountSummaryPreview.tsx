"use client";

import React from 'react';
import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
        isCompleted ? 'border-[var(--powder-dark)] bg-[var(--powder-light)]/20' : 'border-[var(--border)] bg-white/5'
      }`}
    >
      <div className="flex-1 text-left">
        <div className="text-sm text-[var(--text-2)] mb-1">{label}</div>
        <div className={`text-base font-medium ${
          isCompleted ? 'text-[var(--text-1)]' : 'text-[var(--text-2)]'
        }`}>
          {value || <span className="italic">Not set</span>}
        </div>
      </div>
      {isCompleted && (
        <span className="text-[var(--powder-dark)] font-bold">✓</span>
      )}
    </motion.div>
  );

  return (
    <div className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-[var(--powder-light)]/30 rounded-3xl flex items-center justify-center text-[var(--powder-dark)] mx-auto mb-6">
          <span className="text-2xl font-bold">✓</span>
        </div>
        <h2 className="text-3xl font-bold text-[var(--text-1)] mb-4 tracking-[-0.02em]">
          Review Your Business Profile
        </h2>
        <p className="text-[var(--text-2)] max-w-md mx-auto mb-4">
          Here's a summary of your business information. Make sure everything looks correct before you get started.
        </p>
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="text-sm text-[var(--text-2)]">
            {getCompletionPercentage()}% Complete
          </div>
          <div className="w-24 h-2 bg-[var(--bg2)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--powder-dark)]"
              initial={{ width: 0 }}
              animate={{ width: `${getCompletionPercentage()}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      <div className="space-y-4 mb-8 max-w-2xl mx-auto">
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4 bg-system-blue/10 border border-glass-border rounded-xl max-w-2xl mx-auto mb-8"
      >
        <div className="flex items-center gap-2 text-system-blue">
          <span className="text-[var(--powder-dark)] font-bold">✓</span>
          <span className="text-sm font-medium">
            Your business profile is complete! You're all set to start managing your business with BeeZee.
          </span>
        </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl max-w-2xl mx-auto mb-8"
        >
          <div className="flex items-center gap-2 text-red-400">
            <span className="text-sm font-medium">
              {error}
            </span>
          </div>
        </motion.div>
      )}

      <div className="flex gap-4 max-w-xs mx-auto">
        <button
          onClick={onPrev}
          className="flex-1 px-6 py-3 bg-[var(--glass-bg)] text-black font-medium rounded-xl hover:bg-[var(--glass-bg)] transition-all"
        >
          Back
        </button>
        <button
          onClick={onComplete}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-[var(--powder-dark)] text-white font-bold rounded-xl hover:bg-[var(--powder-mid)] transition-all active:scale-[0.98] shadow-lg shadow-[var(--powder-dark)]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              Creating Business...
            </>
          ) : (
            <>
              START USING BEEZEE
            </>
          )}
        </button>
      </div>
    </div>
  );
}
