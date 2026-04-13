'use client';

import { usePathname } from 'next/navigation';
import InstantSplash from '@/components/InstantSplash';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Show instant splash only on root path
  const shouldShowSplash = pathname === '/' || pathname === '';
  
  return (
    <>
      {shouldShowSplash && <InstantSplash />}
      {children}
    </>
  );
}
