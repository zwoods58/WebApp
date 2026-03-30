import { metadata } from './metadata';
import BeezeeLayoutClient from './layout-client';

export default function BeezeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BeezeeLayoutClient>{children}</BeezeeLayoutClient>;
}

export { metadata };
