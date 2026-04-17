import { metadata } from './metadata';
import BeezeeLayoutClient from './layout-client';
import { QueryProvider } from '@/providers/QueryProvider';

export default function BeezeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <BeezeeLayoutClient>{children}</BeezeeLayoutClient>
    </QueryProvider>
  );
}

export { metadata };

