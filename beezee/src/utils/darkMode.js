/**
 * Dark Mode Utilities
 * Theme detection, switching, and token management
 */

/**
 * Theme modes
 */
export const ThemeMode = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
};

/**
 * Get stored theme preference
 * @returns {string}
 */
export function getStoredTheme() {
  return localStorage.getItem('beezee_theme') || ThemeMode.LIGHT;
}

/**
 * Set theme preference
 * @param {string} theme - Theme mode
 */
export function setStoredTheme(theme) {
  if (Object.values(ThemeMode).includes(theme)) {
    localStorage.setItem('beezee_theme', theme);
    applyTheme(theme);
  }
}

/**
 * Get effective theme (resolves AUTO to system preference)
 * @returns {string}
 */
export function getEffectiveTheme() {
  const stored = getStoredTheme();
  
  if (stored === ThemeMode.AUTO) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? ThemeMode.DARK
      : ThemeMode.LIGHT;
  }
  
  return stored;
}

/**
 * Apply theme to document
 * @param {string} theme - Theme mode
 */
export function applyTheme(theme) {
  const effectiveTheme = theme === ThemeMode.AUTO
    ? getEffectiveTheme()
    : theme;
  
  document.documentElement.setAttribute('data-theme', effectiveTheme);
  document.documentElement.classList.toggle('dark-mode', effectiveTheme === ThemeMode.DARK);
}

/**
 * Initialize theme on page load
 */
export function initTheme() {
  const storedTheme = getStoredTheme();
  applyTheme(storedTheme);
  
  // Listen for system theme changes
  if (storedTheme === ThemeMode.AUTO) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      applyTheme(ThemeMode.AUTO);
    });
  }
}

/**
 * Toggle between light and dark
 */
export function toggleTheme() {
  const current = getStoredTheme();
  const newTheme = current === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK;
  setStoredTheme(newTheme);
  return newTheme;
}

/**
 * Dark mode color adjustments
 */
export const darkModeColors = {
  // Adjusted primary colors
  white: '#1C1C1E',
  deepCharcoal: '#F2F2F7',
  
  // Adjusted gradients
  gradientSoftBlueStart: '#1A2529',
  gradientGentlePurpleStart: '#1F1A25',
  gradientMorningMistStart: '#1A2529',
  gradientMorningMistMiddle: '#1F1A25',
  
  // Adjusted text colors
  textPrimary: '#F2F2F7',
  textSecondary: '#AEAEB2',
  textTertiary: '#8E8E93',
  
  // Adjusted backgrounds
  subtleGray: '#2C2C2E',
  
  // Adjusted shadows (darker)
  shadowLevel1: '0 2px 8px rgba(0, 0, 0, 0.3)',
  shadowLevel2: '0 4px 16px rgba(0, 0, 0, 0.4)',
  shadowLevel3: '0 8px 24px rgba(0, 0, 0, 0.5)',
};

/**
 * Get CSS variable value for current theme
 * @param {string} varName - CSS variable name
 * @param {string} fallback - Fallback value
 * @returns {string}
 */
export function getThemeVariable(varName, fallback = '') {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  
  return value || fallback;
}

/**
 * Update CSS variable dynamically
 * @param {string} varName - CSS variable name
 * @param {string} value - New value
 */
export function setThemeVariable(varName, value) {
  document.documentElement.style.setProperty(varName, value);
}

/**
 * Watch for theme changes
 * @param {Function} callback - Callback function
 * @returns {Function} Cleanup function
 */
export function watchTheme(callback) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = () => {
    const effectiveTheme = getEffectiveTheme();
    callback(effectiveTheme);
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  // Initial call
  handleChange();
  
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}

