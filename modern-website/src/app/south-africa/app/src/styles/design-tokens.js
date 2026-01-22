// BeeZee Design System - Design Tokens
// Central source of truth for colors, spacing, typography

export const colors = {
  // Primary: Green (Money In, Success, Positive)
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#10B981', // Main green
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  
  // Success (Money In)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },
  
  // Danger (Money Out, Warnings)
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    500: '#EF4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  
  // Info (Neutral Actions)
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    500: '#3B82F6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  
  // Neutral
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
  },
  
  fontSize: {
    hero: '36px',
    h1: '28px',
    h2: '24px',
    h3: '20px',
    body: '18px',
    small: '14px',
    caption: '12px',
  },
  
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

export const spacing = {
  // Touch-friendly minimum sizes
  touch: '48px',
  button: '56px',
  
  // Standard spacing scale
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
};

export const borderRadius = {
  card: '16px',
  button: '12px',
  input: '12px',
  full: '9999px',
};

export const shadows = {
  card: '0 2px 8px rgba(0, 0, 0, 0.08)',
  cardHover: '0 4px 16px rgba(0, 0, 0, 0.12)',
  button: '0 1px 3px rgba(0, 0, 0, 0.1)',
};

export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  easing: 'ease-in-out',
};

// Semantic color mappings
export const semanticColors = {
  moneyIn: colors.success[500],
  moneyOut: colors.danger[500],
  profit: colors.success[600],
  loss: colors.danger[600],
  neutral: colors.info[500],
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    disabled: colors.neutral[400],
  },
  background: {
    app: colors.neutral[50],
    card: '#FFFFFF',
    hover: colors.neutral[100],
  },
};

// Category icon mappings
export const categoryIcons = {
  // Income
  'Sales': 'ShoppingBag',
  'Services': 'Briefcase',
  'Other Income': 'PlusCircle',
  
  // Expenses
  'Stock/Inventory': 'Package',
  'Rent': 'Home',
  'Utilities': 'Zap',
  'Transport': 'Car',
  'Salaries': 'Users',
  'Marketing': 'Megaphone',
  'Supplies': 'ShoppingBag',
  'Maintenance': 'Tool',
  'Taxes': 'FileText',
  'Other Expenses': 'MinusCircle',
  
  // Defaults
  'Airtime': 'Smartphone',
  'Electricity': 'Zap',
  'Food': 'Coffee',
  'Fuel': 'Fuel',
};

// Accessibility
export const a11y = {
  minTouchTarget: '48px',
  minContrastRatio: 7.0, // WCAG AAA
  focusRingColor: colors.info[500],
  focusRingWidth: '3px',
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation,
  semanticColors,
  categoryIcons,
  a11y,
};


