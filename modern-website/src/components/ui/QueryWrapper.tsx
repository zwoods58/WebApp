"use client";

import { QueryProvider } from "@/providers/QueryProvider";

interface QueryWrapperProps {
  children: React.ReactNode;
}

export default function QueryWrapper({ children }: QueryWrapperProps) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}
