/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts}"
  ],
  theme: {
    extend: {
      // Design System Color Palette
      colors: {
        // Primary Colors
        'brand-blue': '#2C7CEC',
        'success-green': '#4CAF50',
        'warning-amber': '#FFD23F',
        'error-red': '#D32F2F',

        // Secondary Colors
        'deep-purple': '#6A1B9A',
        'ocean-teal': '#3E92CC',
        'forest-green': '#4A7C59',

        // Theme-aware colors (using CSS variables)
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
        },
        border: 'var(--color-border)',
      },

      // Typography Scale (Major Second 1.125 ratio)
      fontSize: {
        'display': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],      // 48px
        'h1': ['2.715rem', { lineHeight: '1.2', fontWeight: '700' }],       // 43px
        'h2': ['2.413rem', { lineHeight: '1.25', fontWeight: '600' }],      // 39px
        'h3': ['2.145rem', { lineHeight: '1.3', fontWeight: '600' }],       // 34px
        'h4': ['1.907rem', { lineHeight: '1.3', fontWeight: '500' }],       // 31px
        'h5': ['1.696rem', { lineHeight: '1.4', fontWeight: '500' }],       // 27px
        'h6': ['1.507rem', { lineHeight: '1.4', fontWeight: '500' }],       // 24px
        'body-large': ['1.125rem', { lineHeight: '1.5', fontWeight: '400' }], // 18px
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],         // 16px
        'body-small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }], // 14px
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],   // 12px
      },

      // Spacing Scale (8pt Grid System)
      spacing: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '64': '64px',
      },

      // Border Radius System
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        'full': '9999px',
      },

      // Shadow/Elevation System (Material Design 3)
      boxShadow: {
        // Level 1 (2dp) - Cards Resting
        'elevation-1': '0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12)',
        // Level 2 (4dp) - App Bars
        'elevation-2': '0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2)',
        // Level 3 (8dp) - Cards Hover/Menu
        'elevation-3': '0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)',
        // Level 4 (16dp) - Navigation Drawer
        'elevation-4': '0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -5px rgba(0,0,0,0.2)',
        // Level 5 (24dp) - Modals/Dialogs
        'elevation-5': '0 9px 46px 8px rgba(0,0,0,0.14), 0 11px 15px -7px rgba(0,0,0,0.12), 0 24px 38px 3px rgba(0,0,0,0.2)',
      },

      // Animation Durations
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
        'slower': '800ms',
      },

      // Animation Easings
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'elastic': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
