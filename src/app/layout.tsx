import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WebApp Solutions - Professional Web Development Services',
  description: 'Transform your business with custom web applications. Professional development services including React, Next.js, and full-stack solutions.',
  keywords: 'web development, custom web applications, React, Next.js, full-stack development, business solutions',
  authors: [{ name: 'WebApp Solutions' }],
  openGraph: {
    title: 'WebApp Solutions - Professional Web Development Services',
    description: 'Transform your business with custom web applications. Professional development services including React, Next.js, and full-stack solutions.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AuthProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
