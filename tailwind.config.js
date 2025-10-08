/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./public/**/*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // TV Display Theme - Dark blues and grays
        tv: {
          bg: {
            primary: '#0f172a',    // Deep navy
            secondary: '#1e293b',  // Slate gray
            tertiary: '#334155',   // Light slate
          },
          text: {
            primary: '#f1f5f9',    // Off white
            secondary: '#cbd5e1',  // Light gray
            muted: '#94a3b8',      // Muted gray
          },
          accent: {
            primary: '#3b82f6',    // Blue
            secondary: '#60a5fa',  // Light blue
            success: '#10b981',    // Green
            warning: '#f59e0b',    // Amber
            error: '#ef4444',      // Red
          },
        },
        // Projector Display Theme - High contrast
        projector: {
          bg: {
            primary: '#000000',    // Pure black
            secondary: '#1a1a1a',  // Near black
            tertiary: '#2d2d2d',   // Dark gray
          },
          text: {
            primary: '#ffffff',    // Pure white
            secondary: '#e5e5e5',  // Off white
            muted: '#a3a3a3',      // Gray
          },
          accent: {
            primary: '#0ea5e9',    // Bright cyan
            secondary: '#06b6d4',  // Cyan
            success: '#22c55e',    // Bright green
            warning: '#fbbf24',    // Bright yellow
            error: '#f87171',      // Bright red
          },
        },
      },
      fontSize: {
        // Optimized for large displays (TV/Projector)
        'display-xs': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        'display-sm': ['2rem', { lineHeight: '2.5rem' }],      // 32px
        'display-md': ['2.5rem', { lineHeight: '3rem' }],      // 40px
        'display-lg': ['3rem', { lineHeight: '3.5rem' }],      // 48px
        'display-xl': ['3.5rem', { lineHeight: '4rem' }],      // 56px
        'display-2xl': ['4rem', { lineHeight: '4.5rem' }],     // 64px
        'display-3xl': ['5rem', { lineHeight: '5.5rem' }],     // 80px
        'display-4xl': ['6rem', { lineHeight: '6.5rem' }],     // 96px
      },
      spacing: {
        // Extended spacing for comfortable TV viewing
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
        '38': '9.5rem',   // 152px
        '42': '10.5rem',  // 168px
        '46': '11.5rem',  // 184px
        '50': '12.5rem',  // 200px
      },
      letterSpacing: {
        'display': '0.025em',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
