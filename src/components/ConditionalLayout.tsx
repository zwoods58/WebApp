'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')
  const isProjectPage = pathname?.startsWith('/projects')
  const isDemoPage = pathname?.startsWith('/demo')

  // Don't render header and footer for admin, project, or demo pages
  if (isAdminPage || isProjectPage || isDemoPage) {
    return <>{children}</>
  }

  // Render header and footer for all other pages
  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}
