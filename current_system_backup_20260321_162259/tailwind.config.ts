import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      'zen-white': '#FFFFFF', // Legacy support
      'studio-white': '#FBFBFD', // Apple laboratory feel
      'system-blue': '#005DFF', // Primary action
      'obsidian': '#0A0A0B', // Primary text
      'glass-border': 'rgba(0,0,0,0.08)', // Subtle hairlines
      'ghost-gray': '#8E8E93', // IBM/Palantir precision
      'accent-glow': 'rgba(0,93,255,0.15)', // Soft Ghost shadows
      'mist-gray': '#F4F4F7',
      'shadow-gray': '#E5E5EA',
      'ghost-text': '#8E8E93',
      'elevated-gray': '#1C1C1E',
      'hairline-gray': '#E5E5EA',
      'pure-white': '#FFFFFF',
      primary: {
        DEFAULT: '#005DFF',
        dark: '#004FCC',
        light: '#337DFF',
      },
      action: '#007AFF',
      system: {
        success: '#32D74B',
        inactive: '#C7C7CC',
      }
    },
    fontFamily: {
      sans: ['var(--font-inter-tight)', 'sans-serif'],
      mono: ['var(--font-jetbrains-mono)', 'monospace'],
    },
    transitionTimingFunction: {
      'power-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      'ghost': 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
    backgroundImage: {
      'grid-pattern': "linear-gradient(to right, #F4F4F7 1px, transparent 1px), linear-gradient(to bottom, #F4F4F7 1px, transparent 1px)",
      'prism-gradient': "linear-gradient(135deg, #FFFFFF 0%, #F4F4F7 100%)",
    },
    boxShadow: {
      'diffusion': '0 30px 60px -12px rgba(0, 0, 0, 0.08)', // The "Unseen" shadow
      'flight': '0 10px 30px -5px rgba(0, 0, 0, 0.03)',
    },
    extend: {
      spacing: {
        '128': '32rem',
      }
    }
  },
  plugins: [],
}
export default config
