/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // BeeZee Design System Colors (Premium Mobile UI)
      colors: {
        // Primary Colors
        'powder-blue': '#A8D5E2',
        'powder-purple': '#C4B5D8',
        'deep-charcoal': '#2C2C2E',
        
        // Semantic Colors
        'success-green': '#67C4A7',
        'warning-coral': '#FF9B9B',
        'info-blue': '#6BA8D9',
        'warning-yellow': '#F59E0B',
        'warning-yellow-light': '#FFF4E6',
        'subtle-gray': '#F7F7F8',
        
        // Text Colors
        'text-primary': '#2C2C2E',
        'text-secondary': '#6C6C70',
        'text-tertiary': '#AEAEB2',
        'text-disabled': '#C7C7CC',
        
        // Legacy support (keeping for backward compatibility)
        primary: {
          50: '#F0F8FB',
          100: '#E0F1F7',
          200: '#C4E3EF',
          300: '#A8D5E2',
          400: '#8BC4D4',
          500: '#A8D5E2',
          600: '#8BC4D4',
          700: '#6BA3B8',
        },
        success: {
          50: '#F0FDF9',
          100: '#D1FAE5',
          200: '#A7F3D0',
          500: '#67C4A7',
          600: '#4FA88A',
          700: '#3D8A6F',
        },
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          500: '#FF9B9B',
          600: '#FF7A7A',
          700: '#FF5A5A',
        },
        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          500: '#6BA8D9',
          600: '#4A8FC4',
          700: '#3A7AA8',
        },
        neutral: {
          50: '#F7F7F8',
          100: '#E5E7EB',
          200: '#D1D5DB',
          300: '#9CA3AF',
          400: '#6B7280',
          500: '#6C6C70',
          600: '#4B5563',
          700: '#374151',
          800: '#2C2C2E',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Montserrat', 'Inter', '-apple-system', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Design system type scale (Premium Mobile UI)
        'display': ['48px', { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '700' }],
        'h1': ['32px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', letterSpacing: '-0.005em', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }],
        'body-large': ['18px', { lineHeight: '1.5', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-small': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.3', fontWeight: '500' }],
        'micro': ['10px', { lineHeight: '1.2', letterSpacing: '0.01em', fontWeight: '600', textTransform: 'uppercase' }],
        // Legacy support
        'hero': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        'small': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        // Touch-friendly spacing
        'touch': '48px', // Minimum touch target
        'btn': '56px',   // Button height
      },
      borderRadius: {
        'tight': '4px',
        'default': '12px',
        'card': '20px',
        'modal': '28px',
        'bubble': '32px',
        'pill': '999px',
        // Legacy support
        'button': '12px',
        'input': '12px',
      },
      boxShadow: {
        // Design system shadows
        'level-1': '0 2px 8px rgba(44, 44, 46, 0.04)',
        'level-2': '0 4px 16px rgba(44, 44, 46, 0.08)',
        'level-3': '0 8px 24px rgba(44, 44, 46, 0.12)',
        'level-4': '0 -4px 16px rgba(44, 44, 46, 0.08)',
        'glow': '0 4px 20px rgba(168, 213, 226, 0.3)',
        'glow-purple': '0 4px 20px rgba(196, 181, 216, 0.3)',
        // Legacy support
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'button': '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'scale-in': 'scaleIn 150ms ease-in-out',
        'fade-in': 'fadeIn 200ms ease-in-out',
        'slide-up': 'slideUp 300ms ease-in-out',
        'slideIn': 'slideIn 300ms ease-in-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      minHeight: {
        'touch': '48px',
        'btn': '56px',
      },
      minWidth: {
        'touch': '48px',
      },
    },
  },
  plugins: [
    // BeeZee Custom Components
    function({ addUtilities, addComponents }) {
      const newUtilities = {
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.hide-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      };

      const newComponents = {
        // Button System
        '.btn': {
          '@apply font-bold text-body rounded-button px-8 py-4 min-h-btn flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-button': {},
        },
        '.btn-primary': {
          '@apply bg-success-500 text-white hover:bg-success-600': {},
        },
        '.btn-secondary': {
          '@apply bg-transparent border-2 border-success-500 text-success-500 hover:bg-success-50': {},
        },
        '.btn-danger': {
          '@apply bg-danger-500 text-white hover:bg-danger-600': {},
        },
        '.btn-info': {
          '@apply bg-info-500 text-white hover:bg-info-600': {},
        },
        '.btn-sm': {
          '@apply px-4 py-2 min-h-touch text-small': {},
        },
        '.btn-icon': {
          '@apply w-btn h-btn rounded-full p-0 flex items-center justify-center': {},
        },
        // Card System
        '.card': {
          '@apply bg-white rounded-card p-5 shadow-card border border-neutral-200': {},
        },
        '.card-hover': {
          '@apply hover:shadow-card-hover transition-shadow duration-200 cursor-pointer': {},
        },
        '.stat-card': {
          '@apply card border-l-4': {},
        },
        '.stat-card-income': {
          '@apply stat-card border-l-success-500': {},
        },
        '.stat-card-expense': {
          '@apply stat-card border-l-danger-500': {},
        },
        '.stat-card-info': {
          '@apply stat-card border-l-info-500': {},
        },
        // Input System
        '.input': {
          '@apply w-full h-btn text-body px-4 border-2 border-neutral-200 rounded-input focus:outline-none focus:border-info-500 transition-colors disabled:bg-neutral-100 disabled:cursor-not-allowed': {},
        },
        '.input-error': {
          '@apply border-danger-500 focus:border-danger-500': {},
        },
        '.input-success': {
          '@apply border-success-500 focus:border-success-500': {},
        },
        // Layout Components
        '.container-app': {
          '@apply max-w-md mx-auto px-4 py-6': {},
        },
        '.section-header': {
          '@apply text-h2 font-bold text-neutral-800 mb-4': {},
        },
        '.stat-label': {
          '@apply text-small text-neutral-600 mb-1': {},
        },
        '.stat-value': {
          '@apply text-hero font-bold': {},
        },
        '.stat-value-income': {
          '@apply stat-value text-success-600': {},
        },
        '.stat-value-expense': {
          '@apply stat-value text-danger-600': {},
        },
        // Loading Components
        '.spinner': {
          '@apply animate-spin rounded-full border-4 border-neutral-200 border-t-primary-500 w-8 h-8': {},
        },
        '.skeleton': {
          '@apply animate-pulse bg-neutral-200 rounded': {},
        },
        // Badge Components
        '.badge': {
          '@apply inline-flex items-center px-3 py-1 rounded-full text-small font-medium': {},
        },
        '.badge-success': {
          '@apply bg-success-100 text-success-700': {},
        },
        '.badge-danger': {
          '@apply bg-danger-100 text-danger-700': {},
        },
        '.badge-info': {
          '@apply bg-info-100 text-info-700': {},
        },
        '.badge-neutral': {
          '@apply bg-neutral-100 text-neutral-700': {},
        },
      };

      addUtilities(newUtilities);
      addComponents(newComponents);
    },
  ],
}
