"use client";

import React from 'react';
import { ArrowLeft, ArrowRight, Check, Globe, Briefcase, Building } from 'lucide-react';
import { industries } from '@/data/industries';
import { getSectorsByIndustry, getIndustryById } from '@/data/industries';

interface CombinedSelectionsStepProps {
  selectedCountry: string;
  selectedIndustry: string;
  selectedSector: string;
  onCountrySelect: (country: string) => void;
  onIndustrySelect: (industry: string) => void;
  onSectorSelect: (sector: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

// Country data with enhanced configuration
const countries = [
  { code: 'KE', name: 'Kenya', flag: 'Côte d\'Ivoire flag: CI' },
  { code: 'ZA', name: 'South Africa', flag: 'Côte d\'Ivoire flag: ZA' },
  { code: 'NG', name: 'Nigeria', flag: 'Côte d\'Ivoire flag: NG' },
  { code: 'GH', name: 'Ghana', flag: 'Côte d\'Ivoire flag: GH' },
  { code: 'UG', name: 'Uganda', flag: 'Côte d\'Ivoire flag: UG' },
  { code: 'RW', name: 'Rwanda', flag: 'Côte d\'Ivoire flag: RW' },
  { code: 'TZ', name: 'Tanzania', flag: 'Côte d\'Ivoire flag: TZ' },
  { code: 'CI', name: "Cote d'Ivoire", flag: 'Côte d\'Ivoire flag: CI' }
];

export function CombinedSelectionsStep({ 
  selectedCountry,
  selectedIndustry,
  selectedSector,
  onCountrySelect,
  onIndustrySelect,
  onSectorSelect,
  onNext,
  onPrev 
}: CombinedSelectionsStepProps) {
  const selectedCountryData = countries.find(c => c.code === selectedCountry);
  const selectedIndustryData = getIndustryById(selectedIndustry);
  const sectors = getSectorsByIndustry(selectedIndustry);
  const selectedSectorData = sectors.find(s => s.id === selectedSector);

  const allSelected = selectedCountry && selectedIndustry && selectedSector;

  const handleCountryChange = (country: string) => {
    onCountrySelect(country);
    // Reset industry and sector when country changes
    onIndustrySelect('');
    onSectorSelect('');
  };

  const handleIndustryChange = (industry: string) => {
    onIndustrySelect(industry);
    // Reset sector when industry changes
    onSectorSelect('');
  };

  return (
    <div className="py-6 sm:py-8">
      <div className="animate-fade-in">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Globe size={32} className="sm:size-40 text-[var(--powder-dark)]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-1)] mb-3 sm:mb-4 text-center">
          Set Up Your Business
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-2)] text-center mb-6 sm:mb-8 max-w-md mx-auto">
          Choose your country, industry, and business sector to personalize your experience
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Country Dropdown */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)]">
            <Globe size={16} />
            Select Your Country
          </label>
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] appearance-none cursor-pointer"
            >
              <option value="">Select a country...</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
            
            {/* Custom dropdown arrow */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-[var(--text-2)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Industry Dropdown */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)]">
            <Briefcase size={16} />
            Choose Your Industry
          </label>
          <div className="relative">
            <select
              value={selectedIndustry}
              onChange={(e) => handleIndustryChange(e.target.value)}
              disabled={!selectedCountry}
              className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select an industry...</option>
              {industries.map((industry) => (
                <option key={industry.id} value={industry.id}>
                  {industry.icon} {industry.name}
                </option>
              ))}
            </select>
            
            {/* Custom dropdown arrow */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-[var(--text-2)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sector Dropdown */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)]">
            <Building size={16} />
            Business Sector
          </label>
          <div className="relative">
            <select
              value={selectedSector}
              onChange={(e) => onSectorSelect(e.target.value)}
              disabled={!selectedIndustry}
              className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a sector...</option>
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
            
            {/* Custom dropdown arrow */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-[var(--text-2)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Selection Summary */}
        {allSelected && (
          <div className="animate-fade-in">
            <div className="bg-[var(--powder-light)] rounded-xl border border-[var(--powder-dark)]/30 p-4">
              <div className="flex items-center justify-center gap-3 text-center">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedCountryData?.flag}</span>
                  <span className="font-medium text-[var(--text-1)]">{selectedCountryData?.name}</span>
                </div>
                <span className="text-[var(--text-3)]">·</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedIndustryData?.icon}</span>
                  <span className="font-medium text-[var(--text-1)]">{selectedIndustryData?.name}</span>
                </div>
                <span className="text-[var(--text-3)]">·</span>
                <span className="font-medium text-[var(--text-1)]">{selectedSectorData?.name}</span>
              </div>
              <div className="flex items-center justify-center mt-2">
                <Check size={16} className="text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">All selections complete</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 max-w-md mx-auto mt-8">
        <button
          onClick={onPrev}
          className="flex-1 px-6 py-3 bg-[var(--glass-bg)] text-black font-medium rounded-xl hover:bg-[var(--glass-bg)] transition-all active:scale-[0.98]"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!allSelected}
          className="flex-1 px-6 py-3 bg-[var(--powder-dark)] text-white font-medium rounded-xl hover:bg-[var(--powder-mid)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          Next
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
