import SimplifiedAdminDashboard from '@/components/SimplifiedAdminDashboard'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <SimplifiedAdminDashboard />
    </ProtectedRoute>
  )
}
