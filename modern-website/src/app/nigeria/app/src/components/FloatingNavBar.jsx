import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, MessageCircle, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * Floating Navigation Bar Component
 * Bottom navigation with floating center button
 */
export default function FloatingNavBar() {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: t('nav.dashboard', 'Home') },
    { path: '/dashboard/reports', icon: FileText, label: t('nav.reports', 'Reports') },
    { path: '/dashboard/coach', icon: MessageCircle, label: t('nav.coach', 'Coach') },
    { path: '/dashboard/settings', icon: Settings, label: t('settings.title', 'Settings') },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="floating-nav-bar" role="navigation" aria-label="Main navigation">
      {navItems.map((item) => {
        const active = isActive(item.path);
        const Icon = item.icon;

        if (item.isCenter) {
          return (
            <Link
              key={item.path}
              to={item.path}
              className="floating-nav-center-button"
              aria-label={item.label}
            >
              <div className="center-button-inner">
                <PlusCircle size={28} strokeWidth={2.5} />
              </div>
            </Link>
          );
        }

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`floating-nav-tab ${active ? 'active' : ''}`}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
          >
            {active && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 bg-blue-100 rounded-2xl z-0"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex flex-col items-center">
              <Icon size={24} strokeWidth={active ? 2.5 : 2} className={active ? 'text-blue-600' : 'text-gray-400'} />
              <span className={`floating-nav-label ${active ? 'text-blue-600 font-bold' : 'text-gray-400 font-medium'}`}>{item.label}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

