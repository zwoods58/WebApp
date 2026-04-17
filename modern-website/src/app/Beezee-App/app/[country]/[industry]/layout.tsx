'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import React from 'react';

export default function CountryIndustryLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ country: string; industry: string }>;
}) {
    const { country, industry } = React.use(params);
    
    return (
        <ProtectedRoute 
            requiredCountry={country} 
            requiredIndustry={industry}
        >
            {children}
        </ProtectedRoute>
    );
}
