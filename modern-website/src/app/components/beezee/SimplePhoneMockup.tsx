"use client";

import React from 'react';
import PhoneFrame from './PhoneFrame';

interface SimplePhoneMockupProps {
  children: React.ReactNode;
  className?: string;
}

export default function SimplePhoneMockup({ children, className = "" }: SimplePhoneMockupProps) {
  return (
    <div className={`max-w-sm mx-auto ${className}`}>
      <PhoneFrame>
        {children}
      </PhoneFrame>
    </div>
  );
}
