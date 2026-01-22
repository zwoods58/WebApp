import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Layout Component
 * Mobile-first layout wrapper - navigation is handled by FloatingNavBar in each page
 */
export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F8FB] to-white">
      {/* Main Content - Full width, no container constraints for mobile */}
      <main className="w-full min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

