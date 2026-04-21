import { metadata } from './metadata';
import { QueryProvider } from '@/providers/QueryProvider';

export default function BeezeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}

export { metadata };

