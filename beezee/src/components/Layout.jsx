import { Outlet } from 'react-router-dom';

/**
 * Layout Component
 * Mobile-first layout wrapper - navigation is handled by FloatingNavBar in each page
 */
export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F8FB] to-white">
      {/* Main Content - Full width, no container constraints for mobile */}
      <main className="w-full min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

