'use client';

import { useEffect, useState } from 'react';

interface BodyWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function BodyWrapper({ children, className = '' }: BodyWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <body 
      className={`${className} ${isClient ? 'hydrated' : ''}`}
      suppressHydrationWarning
    >
      {children}
    </body>
  );
}
