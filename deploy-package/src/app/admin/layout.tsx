import { AuthProvider } from '@/contexts/AuthContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
