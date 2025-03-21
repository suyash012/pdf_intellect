/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#1a1a2e',
          100: '#16213e',
          200: '#0f3460',
          300: '#0a1931',
          400: '#070b14',
          500: '#050810',
          600: '#020305',
        },
        primary: {
          DEFAULT: '#6366f1',
          dark: '#4338ca',
          light: '#818cf8',
        },
        secondary: {
          DEFAULT: '#8b5cf6',
          light: '#a78bfa',
        },
        accent: {
          DEFAULT: '#ec4899',
          light: '#f472b6',
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
          },
        },
        dark: {
          css: {
            color: '#f3f4f6',
            a: {
              color: '#818cf8',
              '&:hover': {
                color: '#a78bfa',
              },
            },
            h1: {
              color: '#f3f4f6',
            },
            h2: {
              color: '#f3f4f6',
            },
            h3: {
              color: '#f3f4f6',
            },
            h4: {
              color: '#f3f4f6',
            },
            strong: {
              color: '#f3f4f6',
            },
            code: {
              color: '#f3f4f6',
            },
            blockquote: {
              color: '#d1d5db',
            },
          },
        },
      },
    },
  },
  plugins: [],
} 