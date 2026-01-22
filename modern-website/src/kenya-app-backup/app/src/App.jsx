import { useEffect, useState } from 'react';
import './i18n'; // Initialize react-i18next
import './index.css';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useCountryStore } from './store/countryStore.js';
import { useOfflineStore } from './store/offlineStore';
import { supabase } from './utils/supabase';
import { setupOnlineListener, syncWithServer } from './utils/offlineSync';
import { setupViewportHeight } from './utils/keyboardHandler';
import { getStoredTheme, initTheme } from './utils/darkMode';
import { usePreferredLanguage } from './utils/usePreferredLanguage';

// Layout Components
import Layout from './components/Layout';
import OfflineBadge from './components/OfflineBadge';
import PlatformRedirect from './components/PlatformRedirect';

// Auth Pages
import GetStarted from './pages/auth/GetStarted';
import Login from './pages/auth/Login';
import LoginScreen from './pages/auth/LoginScreen';
import OnboardingFlow from './pages/auth/OnboardingFlow';
import Signup from './pages/auth/Signup';
import VerifyOTP from './pages/auth/VerifyOTP';
import ActiveSessions from './pages/auth/ActiveSessions';

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

export default function App() {
  const { user, setUser, setLoading } = useAuthStore();
  const { userCountry, lockCountry, detectCountryFromPhone } = useCountryStore();
  const { isOnline, setOnline, syncPending, setSyncPending, markSyncCompleted } = useOfflineStore();
  const [initializing, setInitializing] = useState(true);
  usePreferredLanguage();

  useEffect(() => {
    // Initialize dark mode
    initTheme();

    // Setup mobile viewport height handler
    const cleanupViewport = setupViewportHeight();

    // Initialize app without auto-login
    // Users must go through proper authentication flow
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
        console.log('[App] Back online - starting sync...');
        setOnline(true);

        if (user) {
          setSyncPending(true);
          try {
            console.log('[App] Calling syncWithServer...');
            const result = await syncWithServer(supabase);
            console.log('[App] Sync result:', result);

            // Always mark sync as completed to trigger page refreshes
            // This ensures UI updates even if no items were synced (data might have changed on server)
            if (result.success) {
              console.log('[App] Marking sync as completed, counter will increment...');
              markSyncCompleted();
              console.log('[App] Sync marked as completed');

              // Show toast notification only if items were synced
              if (result.synced > 0) {
                const { default: toast } = await import('react-hot-toast');
                toast.success(`${result.synced} item${result.synced !== 1 ? 's' : ''} synced successfully!`);
              } else {
                // Still show a subtle notification that sync completed
                const { default: toast } = await import('react-hot-toast');
                toast.success('Synced with server', { duration: 2000 });
              }
            } else {
              console.warn('[App] Sync was not successful:', result);
            }
          } catch (error) {
            console.error('[App] Sync failed:', error);
            // Even on error, mark sync as completed to refresh UI
            markSyncCompleted();
          } finally {
            setSyncPending(false);
            console.log('[App] Sync process completed');
          }
        } else {
          console.log('[App] No user, skipping sync');
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
              const result = await syncWithServer(supabase);
              // Mark sync as completed to trigger page refreshes
              if (result.success) {
                markSyncCompleted();
              }
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #F0F8FB, #FFFFFF)' }}>
        <div className="text-center">
          <div
            className="mx-auto mb-4"
            style={{
              width: '48px',
              height: '48px',
              border: '4px solid #E5E7EB',
              borderTop: '4px solid #3B82F6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          ></div>
          <p className="text-gray-600" style={{ color: '#6B7280' }}>Loading BeeZee...</p>
        </div>
      </div>
    );
  }

  return (
    <PlatformRedirect>
      <BrowserRouter basename="/kenya/app">
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
            <Route path="settings/sessions" element={<ActiveSessions />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Country-specific routes - Keep within PWA context */}
          <Route path="/kenya" element={<Navigate to="/dashboard" replace />} />
          <Route path="/kenya/app" element={<Navigate to="/dashboard" replace />} />
          <Route path="/south-africa" element={<Navigate to="/dashboard" replace />} />
          <Route path="/south-africa/app" element={<Navigate to="/dashboard" replace />} />
          <Route path="/nigeria" element={<Navigate to="/dashboard" replace />} />
          <Route path="/nigeria/app" element={<Navigate to="/dashboard" replace />} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
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
            background: '#10b981',
            color: '#fff',
          },
          error: {
            background: '#ef4444',
            color: '#fff',
          },
        }}
      />
    </PlatformRedirect>
  );
}
