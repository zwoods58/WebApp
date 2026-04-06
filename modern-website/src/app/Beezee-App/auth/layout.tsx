"use client";

import { ReactNode } from 'react';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="auth-layout">
      {children}
      {/* Note: NO update modal in auth layout - updates only in authenticated app */}
    </div>
  );
}
