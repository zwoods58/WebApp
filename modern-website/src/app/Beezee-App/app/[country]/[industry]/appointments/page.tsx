"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import AppointmentsNew from '@/components/appointments/AppointmentsNew';

export default function AppointmentsPage() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';

  // Remove industry restrictions to allow offline access for all industries
  return <AppointmentsNew industry={industry} country={country} />;
}
