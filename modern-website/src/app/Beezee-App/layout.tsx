import { metadata } from './metadata';
import BeezeeLayoutClient from './layout-client';
import { QueryProvider } from '@/providers/QueryProvider';

export default function BeezeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical CSS is already included in globals.css */}
      </head>
      <body suppressHydrationWarning>
        <QueryProvider>
          <BeezeeLayoutClient>{children}</BeezeeLayoutClient>
        </QueryProvider>
      </body>
    </html>
  );
}

export { metadata };
