'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import Chatbot from './Chatbot'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')
  const isProjectPage = pathname?.startsWith('/projects')
  const isDemoPage = pathname?.startsWith('/demo')

  // Don't render header, footer, or chatbot for admin, project, or demo pages
  if (isAdminPage || isProjectPage || isDemoPage) {
    return <>{children}</>
  }

  // Render header, footer, and chatbot for all other pages
  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Chatbot />
    </>
  )
}

