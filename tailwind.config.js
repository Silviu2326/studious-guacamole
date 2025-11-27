import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '3rem',
      },
      screens: {
        lg: '1024px',
        xl: '1200px',
        '2xl': '1360px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Space Grotesk', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          DEFAULT: '#6B4CFF',
          light: '#8F74FF',
          dark: '#4B31CC',
        },
        surface: {
          DEFAULT: '#10142A',
          light: '#151B32',
          card: '#1B2241',
          accent: '#262F57',
        },
        success: '#36C896',
        warning: '#FFB347',
        danger: '#FF5E7E',
      },
      screens: {
        xs: '480px',
        '3xl': '1600px',
      },
      boxShadow: {
        card: '0 18px 40px -24px rgba(15,23,42,0.65)',
        'card-strong': '0 30px 60px -35px rgba(15,23,42,0.85)',
      },
      backgroundImage: {
        'gradient-leads': 'linear-gradient(135deg,#171C3A 0%,#0C0F23 100%)',
        'gradient-brand': 'linear-gradient(135deg,#6B4CFF 0%,#36C896 100%)',
      },
    },
  },
  plugins: [],
};
