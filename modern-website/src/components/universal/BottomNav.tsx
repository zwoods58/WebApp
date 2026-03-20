"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, DollarSign, Package, FileText, MoreHorizontal, Calendar, MapPin } from 'lucide-react';
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

  // Debug logging (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('BottomNav Debug:', { industry, country, pathname, basePath });
  }

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

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 z-50 min-h-[64px]">
      <div className="flex justify-around items-center max-w-md mx-auto h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.nameKey}
              href={`${basePath}${item.path}`}
              className={`flex flex-col items-center justify-center w-full h-full gap-1.5 no-select button-touch transition-all duration-200 ${
                active 
                  ? 'text-[var(--powder-dark)]' 
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
              </div>
              <span className={`text-[10px] font-medium tracking-wide ${active ? 'font-bold' : ''}`}>
                {t(item.nameKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
