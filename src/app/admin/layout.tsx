import './admin.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Admin Dashboard - AtarWeb</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased admin-body min-h-screen">
        {children}
      </body>
    </html>
  )
}
