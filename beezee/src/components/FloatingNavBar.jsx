import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, PlusCircle, MessageCircle, Settings } from 'lucide-react';
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
    { path: '/dashboard/transactions/add', icon: PlusCircle, label: t('common.add', 'Add'), isCenter: true },
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
              <PlusCircle size={32} />
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
            <Icon size={24} strokeWidth={active ? 2.5 : 2} />
            <span className="floating-nav-label">{item.label}</span>
            {active && <span className="floating-nav-indicator" aria-hidden="true" />}
          </Link>
        );
      })}
    </nav>
  );
}

