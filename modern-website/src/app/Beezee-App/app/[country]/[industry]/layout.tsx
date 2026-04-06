'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import UpdateManager from '@/components/UpdateManager';
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
            <UpdateManager>
                {children}
            </UpdateManager>
        </ProtectedRoute>
    );
}
