"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Briefcase } from 'lucide-react';
import { getSectorsByIndustry, getIndustryById } from '@/data/industries';

interface IndustrySectorStepProps {
  industry: string;
  selectedSector: string;
  onSelect: (sector: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function IndustrySectorStep({ 
  industry, 
  selectedSector, 
  onSelect, 
  onNext, 
  onPrev 
}: IndustrySectorStepProps) {
  const sectors = getSectorsByIndustry(industry);
  const industryData = getIndustryById(industry);
  const industryName = industryData?.name || industry;

  const handleSectorSelect = (sectorId: string) => {
    onSelect(sectorId);
  };

  return (
    <div className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-[var(--powder-light)]/30 rounded-3xl flex items-center justify-center text-[var(--powder-dark)] mx-auto mb-6">
          <span className="text-3xl">{industryData?.icon || '🏢'}</span>
        </div>
        <h2 className="text-3xl font-bold text-[var(--text-1)] mb-4 tracking-[-0.02em]">
          What type of {industryName.toLowerCase()} business?
        </h2>
        <p className="text-[var(--text-2)] max-w-md mx-auto">
          Choose your specific sector to personalize your experience
        </p>
      </motion.div>

      <div className="grid gap-6 mb-8">
        {sectors.length > 0 ? (
          sectors.map((sector, index) => (
            <motion.button
              key={sector.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSectorSelect(sector.id)}
              className={`p-6 rounded-xl border-2 transition-all flex items-center gap-4 ${
                selectedSector === sector.id
                  ? 'border-[var(--powder-dark)] bg-[var(--powder-light)]/20 shadow-lg'
                  : 'border-[var(--border)] hover:border-[var(--powder-mid)] hover:shadow-md'
              }`}
            >
              <div className="w-14 h-14 bg-[var(--glass-bg)] rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏢</span>
              </div>
              <div className="flex-1 text-left">
                <div className="text-xl font-bold text-[var(--text-1)]">{sector.name}</div>
                {sector.description && (
                  <div className="text-sm text-[var(--text-2)] mt-1">{sector.description}</div>
                )}
              </div>
              {selectedSector === sector.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <span className="text-[var(--powder-dark)] font-bold text-xl">✓</span>
                </motion.div>
              )}
            </motion.button>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-[var(--text-2)]">No specific sectors available for this industry.</div>
            <div className="text-sm text-[var(--text-3)] mt-2">You can proceed with the general industry selection.</div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onPrev}
          className="flex-1 px-6 py-3 bg-[var(--glass-bg)] text-black font-medium rounded-xl hover:bg-[var(--glass-bg)] transition-all active:scale-[0.98]"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedSector}
          className="flex-1 px-6 py-3 bg-[var(--powder-dark)] text-white font-medium rounded-xl hover:bg-[var(--powder-mid)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          Next
        </button>
      </div>
    </div>
  );
}
