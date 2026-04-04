import { metadata } from './metadata';
import BeezeeLayoutClient from './layout-client';

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
        <BeezeeLayoutClient>{children}</BeezeeLayoutClient>
      </body>
    </html>
  );
}

export { metadata };
