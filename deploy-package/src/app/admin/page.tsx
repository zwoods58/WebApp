import PremiumAdminDashboard from '@/components/PremiumAdminDashboard'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <PremiumAdminDashboard />
    </ProtectedRoute>
  )
}
