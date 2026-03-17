"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBusiness } from '@/contexts/BusinessContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredCountry?: string;
    requiredIndustry?: string;
}

export function ProtectedRoute({ children, requiredCountry, requiredIndustry }: ProtectedRouteProps) {
    const { business, loading, isAuthenticated } = useBusiness();
    const router = useRouter();
    const [isStabilizing, setIsStabilizing] = useState(true);

    useEffect(() => {
        console.log('🛡️ ProtectedRoute check:', { 
            loading, 
            isAuthenticated, 
            business: business ? { 
                id: business.id, 
                country: business.country, 
                industry: business.industry 
            } : null,
            requiredCountry,
            requiredIndustry,
            pathname: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
        });

        // CRITICAL: Only make routing decisions when everything is loaded
        // This prevents the glitch where we redirect to login during auth restoration
        if (loading) {
            console.log('⏳ Still loading auth/business data, waiting...');
            return; // Don't make ANY routing decisions while loading
        }

        // Auth is loaded, now check authentication status
        if (!isAuthenticated || !business) {
            console.log('🚪 Not authenticated, redirecting to login');
            router.push('/Beezee-App/auth/login');
            return;
        }

        // Validate business matches route
        if (requiredCountry && business.country.toLowerCase() !== requiredCountry.toLowerCase()) {
            console.log('🌍 Country mismatch, redirecting to correct route');
            router.push(`/Beezee-App/app/${business.country}/${business.industry}`);
            return;
        }

        if (requiredIndustry && business.industry.toLowerCase() !== requiredIndustry.toLowerCase()) {
            console.log('🏭 Industry mismatch, redirecting to correct route');
            router.push(`/Beezee-App/app/${business.country}/${business.industry}`);
            return;
        }

        console.log('✅ Authentication and route validation passed');
        setIsStabilizing(false);
    }, [business, loading, isAuthenticated, requiredCountry, requiredIndustry, router]);

    if (loading || isStabilizing) {
        return (
            <div className="relative min-h-screen">
                {/* Show content with reduced opacity */}
                <div className="opacity-60 pointer-events-none">
                    {children}
                </div>
                {/* Subtle loading overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                        <span className="text-sm font-medium text-gray-700">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !business) {
        return null;
    }

    // Final validation
    if ((requiredCountry && business.country.toLowerCase() !== requiredCountry.toLowerCase()) ||
        (requiredIndustry && business.industry.toLowerCase() !== requiredIndustry.toLowerCase())) {
        return null;
    }

    return <>{children}</>;
}
