"use client";

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Calendar from '@/components/universal/Calendar';

// Industries that need calendar functionality
const CALENDAR_INDUSTRIES = ['salon', 'transport', 'tailor', 'freelance', 'repairs'];

export default function CalendarPage() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';

  // Redirect industries that don't need calendar
  useEffect(() => {
    if (!CALENDAR_INDUSTRIES.includes(industry)) {
      window.location.href = `/Beezee-App/app/${country}/${industry}`;
    }
  }, [industry, country]);

  // If industry doesn't support calendar, show loading while redirecting
  if (!CALENDAR_INDUSTRIES.includes(industry)) {
    return (
      <div className="min-h-screen bg-[var(--bg1)] flex items-center justify-center">
        <div className="text-[var(--text-3)])">Redirecting...</div>
      </div>
    );
  }

  return <Calendar industry={industry} country={country} />;
}
