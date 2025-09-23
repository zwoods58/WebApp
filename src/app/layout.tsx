import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import ConditionalLayout from '@/components/ConditionalLayout'
import Chatbot from '@/components/Chatbot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AtarWeb - Professional Web Development Services',
  description: 'Transform your business with custom web applications. Professional development services including React, Next.js, and full-stack solutions.',
  keywords: 'web development, custom web applications, React, Next.js, full-stack development, business solutions',
  authors: [{ name: 'AtarWeb' }],
  openGraph: {
    title: 'AtarWeb - Professional Web Development Services',
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
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <Chatbot />
        </AuthProvider>
      </body>
    </html>
  )
}
