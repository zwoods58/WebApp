import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useOfflineStore } from './store/offlineStore';
import { supabase } from './utils/supabase';
import { setupOnlineListener, syncWithServer } from './utils/offlineSync';
import { setupViewportHeight } from './utils/keyboardHandler';
import { getStoredTheme, initTheme } from './utils/darkMode';
import { usePreferredLanguage } from './utils/usePreferredLanguage';

// Layout Components
import Layout from './components/Layout';
import OfflineBadge from './components/OfflineBadge';

// Auth Pages
import GetStarted from './pages/auth/GetStarted';
import Login from './pages/auth/Login';
import LoginScreen from './pages/auth/LoginScreen';
import OnboardingFlow from './pages/auth/OnboardingFlow';
import Signup from './pages/auth/Signup';
import VerifyOTP from './pages/auth/VerifyOTP';

// Main Pages
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Reports from './pages/Reports';
import Coach from './pages/Coach';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import NotificationSettings from './pages/NotificationSettings';
import Notifications from './pages/Notifications';
import Subscription from './pages/Subscription';
import Bookings from './pages/Bookings';
import Inventory from './pages/Inventory';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const { user, setUser, setLoading } = useAuthStore();
  const { isOnline, setOnline, syncPending, setSyncPending } = useOfflineStore();
  const [initializing, setInitializing] = useState(true);
  usePreferredLanguage();

  useEffect(() => {
    // Initialize dark mode
    initTheme();
    
    // Setup mobile viewport height handler
    const cleanupViewport = setupViewportHeight();

    // Check initial auth state (custom OTP system)
    const userId = localStorage.getItem('beezee_user_id');
    const whatsappNumber = localStorage.getItem('beezee_whatsapp');

    if (userId && whatsappNumber) {
      // User is logged in via custom system
      setUser({
        id: userId,
        phone: whatsappNumber,
        user_metadata: {
          whatsapp_number: whatsappNumber,
        },
      });
    } else {
      setUser(null);
    }

    setLoading(false);
    setInitializing(false);

    return cleanupViewport;
  }, [setUser, setLoading]);

  useEffect(() => {
    // Set initial online status
    setOnline(navigator.onLine);

    // Setup online/offline listeners
    const cleanup = setupOnlineListener(
      async () => {
        console.log('Back online - syncing...');
        setOnline(true);
        
        if (user) {
          setSyncPending(true);
          try {
            const result = await syncWithServer(supabase);
            console.log('Sync result:', result);
            
            // Mark sync as completed to trigger page refreshes
            if (result.success && result.synced > 0) {
              markSyncCompleted();
              
              // Show toast notification
              const { default: toast } = await import('react-hot-toast');
              toast.success(`${result.synced} item${result.synced !== 1 ? 's' : ''} synced successfully!`);
            }
          } catch (error) {
            console.error('Sync failed:', error);
          } finally {
            setSyncPending(false);
          }
        }
      },
      () => {
        console.log('Gone offline');
        setOnline(false);
      }
    );

    return cleanup;
  }, [user, setOnline, setSyncPending]);

  // Listen for service worker messages
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', async (event) => {
        if (event.data && event.data.type === 'SYNC_TRANSACTIONS') {
          console.log('Service worker triggered sync');
          if (user && isOnline) {
            setSyncPending(true);
            try {
              await syncWithServer(supabase);
            } catch (error) {
              console.error('Service worker sync failed:', error);
            } finally {
              setSyncPending(false);
            }
          }
        }
      });
    }
  }, [user, isOnline, setSyncPending]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading BeeZee...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <GetStarted />} />
        <Route path="/get-started" element={user ? <Navigate to="/dashboard" replace /> : <GetStarted />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginScreen />} />
        <Route path="/onboarding" element={<OnboardingFlow />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="transactions/add" element={<AddTransaction />} />
          <Route path="reports" element={<Reports />} />
          <Route path="coach" element={<Coach />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/notifications" element={<NotificationSettings />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Components */}
      <OfflineBadge />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#F59E0B',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;

