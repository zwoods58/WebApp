import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { getStoredTheme, setStoredTheme } from '../utils/darkMode';

/**
 * Dark Mode Toggle Component
 * Allows users to switch between light and dark themes
 */
export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const stored = getStoredTheme();
    return stored === 'dark';
  });

  useEffect(() => {
    // Apply theme on mount
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    setStoredTheme(theme);
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    const theme = newTheme ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    setStoredTheme(theme);
  };

  return (
    <div className="settings-row" onClick={toggleTheme}>
      {isDark ? (
        <Sun size={24} className="settings-row-icon" />
      ) : (
        <Moon size={24} className="settings-row-icon" />
      )}
      <span className="settings-row-label">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
    </div>
  );
}

