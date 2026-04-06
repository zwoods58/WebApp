"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Appointments from '@/components/universal/Appointments';

export default function AppointmentsPage() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';

  // Remove industry restrictions to allow offline access for all industries
  return <Appointments industry={industry} country={country} />;
}
