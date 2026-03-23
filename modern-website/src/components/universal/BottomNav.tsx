"use client";

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, DollarSign, Package, FileText, MoreHorizontal, Calendar, MapPin, WifiOff } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';

interface BottomNavProps {
  industry: string;
  country: string;
}

// Industries that have calendar functionality
const CALENDAR_INDUSTRIES = ['salon', 'tailor', 'freelance', 'repairs'];

export default function BottomNav({ industry, country }: BottomNavProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const basePath = `/Beezee-App/app/${country}/${industry}`;
  const [navigationError, setNavigationError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  // Debug logging (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('BottomNav Debug:', { industry, country, pathname, basePath });
  }

  // Handle navigation errors gracefully
  const handleNavigationError = (error: Error) => {
    console.error('Navigation error:', error);
    setNavigationError('Navigation temporarily unavailable');
    setTimeout(() => setNavigationError(null), 3000);
  };

  // Memoize navigation items to prevent recreation on every render
  const navItems = useMemo(() => {
    // Retail and food use stock page instead of services
    const inventoryPath = (industry === 'retail' || industry === 'food') ? '/stock' : '/services';
    
    // Base navigation items for all industries
    const baseNavItems = [
      { nameKey: 'nav.home', icon: Home, path: '' },
      { nameKey: 'nav.transactions', icon: DollarSign, path: '/cash' },
      { nameKey: 'nav.inventory', icon: Package, path: inventoryPath },
      { nameKey: 'nav.customers', icon: FileText, path: '/credit' },
    ];

    // Add location and update inventory label for transport
    const transportNavItems = [
      { nameKey: 'nav.home', icon: Home, path: '' },
      { nameKey: 'nav.transactions', icon: DollarSign, path: '/cash' },
      { nameKey: 'nav.services', icon: Package, path: '/services' }, // Services instead of inventory
      { nameKey: 'nav.customers', icon: FileText, path: '/credit' }, // Credit instead of location
      { nameKey: 'nav.more', icon: MoreHorizontal, path: '/more' }
    ];

    // Add calendar for specific industries, or use transport nav for transport
    return industry === 'transport'
      ? transportNavItems
      : CALENDAR_INDUSTRIES.includes(industry)
        ? [
            ...baseNavItems.slice(0, 2), // home, cash
            { nameKey: 'nav.calendar', icon: Calendar, path: '/calendar' }, // calendar
            ...baseNavItems.slice(2), // inventory, customers
            { nameKey: 'nav.more', icon: MoreHorizontal, path: '/more' }
          ]
        : [
            ...baseNavItems,
            { nameKey: 'nav.more', icon: MoreHorizontal, path: '/more' }
          ];
  }, [industry]);

  // Memoize isActive function to prevent recreation on every render
  const isActive = useMemo(() => {
    return (itemPath: string) => {
      if (itemPath === '') {
        return pathname === basePath;
      }
      return pathname.includes(`${basePath}${itemPath}`);
    };
  }, [pathname, basePath]);

  // Update offline status on client side only to prevent hydration mismatch
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };
    
    // Set initial status
    updateOnlineStatus();
    
    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return (
    <>
      {/* Navigation Error Toast */}
      {navigationError && (
        <div className="fixed bottom-20 left-0 right-0 z-[60] flex justify-center px-4">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <WifiOff size={16} />
            <span className="text-sm">{navigationError}</span>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 z-50 min-h-[64px]">
        <div className="flex justify-around items-center max-w-md mx-auto h-16 px-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            const href = `${basePath}${item.path}`;
            
            return (
              <Link
                key={item.nameKey}
                href={href}
                onClick={(e) => {
                  // Handle navigation errors gracefully
                  try {
                    // If offline and not home page, show warning but still allow navigation
                    if (isOffline && item.path !== '') {
                      console.log('📴 Navigating offline to:', href);
                    }
                  } catch (error) {
                    e.preventDefault();
                    handleNavigationError(error as Error);
                  }
                }}
                className={`flex flex-col items-center justify-center w-full h-full gap-1.5 no-select button-touch transition-all duration-200 ${
                  active 
                    ? 'text-[var(--powder-dark)]' 
                    : isOffline
                      ? 'text-gray-400' // Muted color when offline
                      : 'text-[var(--text-3)] hover:text-[var(--powder-mid)]'
                }`}
              >
                <div className={`relative transition-all duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
                  <Icon 
                    size={24} 
                    strokeWidth={active ? 2.5 : 2} 
                  />
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--powder-dark)] rounded-full"></div>
                  )}
                  {isOffline && !active && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"></div>
                  )}
                </div>
                <span className={`text-[10px] font-medium tracking-wide ${active ? 'font-bold' : ''} ${isOffline && !active ? 'text-gray-400' : ''}`}>
                  {t(item.nameKey)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
