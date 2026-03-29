"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Calendar from '@/components/universal/Calendar';

export default function CalendarPage() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';

  // Remove industry restrictions to allow offline access for all industries
  return <Calendar industry={industry} country={country} />;
}
