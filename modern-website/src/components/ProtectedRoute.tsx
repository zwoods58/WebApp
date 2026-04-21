"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredCountry?: string;
    requiredIndustry?: string;
}

export function ProtectedRoute({ children, requiredCountry, requiredIndustry }: ProtectedRouteProps) {
    const { business, loading, isAuthenticated } = useSupabaseAuth();
    const router = useRouter();
    const [isStabilizing, setIsStabilizing] = useState(true);
    const [isOnline, setIsOnline] = useState(true);

    // NEW: detect fresh signup so we don't redirect too early
    const [isNewSignup, setIsNewSignup] = useState(false);

    useEffect(() => {
        const freshSignup = sessionStorage.getItem('beezee_fresh_signup');
        if (freshSignup) {
            setIsNewSignup(true);
            sessionStorage.removeItem('beezee_fresh_signup');
        }
    }, []);

    useEffect(() => {
        const updateOnlineStatus = () => setIsOnline(navigator.onLine);
        updateOnlineStatus();
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, []);

    useEffect(() => {
        console.log('🛡️ ProtectedRoute check:', { 
            loading, 
            isAuthenticated, 
            isNewSignup,
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
        if (loading) {
            console.log('⏳ Still loading auth/business data, waiting...');
            return; 
        }

        // NEW: if business is still loading in after fresh signup, wait up to 5s
        if (isNewSignup && !business) {
            console.log('⏳ Fresh signup detected, waiting for business context to load...');
            const timeout = setTimeout(() => {
                console.log('⏳ Fresh signup grace period expired');
                setIsNewSignup(false); // give up waiting, let normal logic proceed
            }, 5000);
            return () => clearTimeout(timeout);
        }

        // Auth is loaded, now check authentication status
        if (!isAuthenticated || !business) {
            if (!isOnline) {
                console.log('🔌 Offline - skipping login redirect, allowing cached content');
                setIsStabilizing(false);
                return;
            }
            console.log('🚪 Not authenticated, redirecting to login');
            router.push('/Beezee-App/auth/login');
            return;
        }

        // Validate business matches route
        if (requiredCountry && business.country.toLowerCase() !== requiredCountry.toLowerCase()) {
            if (!isOnline) {
                console.log('🔌 Offline - skipping country redirect');
                setIsStabilizing(false);
                return;
            }
            console.log('🌍 Country mismatch, redirecting to correct route');
            router.push(`/Beezee-App/app/${business.country}/${business.industry}`);
            return;
        }

        if (requiredIndustry && business.industry.toLowerCase() !== requiredIndustry.toLowerCase()) {
            if (!isOnline) {
                console.log('🔌 Offline - skipping industry redirect');
                setIsStabilizing(false);
                return;
            }
            console.log('🏭 Industry mismatch, redirecting to correct route');
            router.push(`/Beezee-App/app/${business.country}/${business.industry}`);
            return;
        }

        console.log('✅ Authentication and route validation passed');
        setIsStabilizing(false);
    }, [business, loading, isAuthenticated, isNewSignup, requiredCountry, requiredIndustry, router, isOnline]);

    // treat fresh signup as stabilizing so spinner shows instead of redirecting
    if (loading || isStabilizing || (isNewSignup && !business)) {
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

