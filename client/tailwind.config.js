import tailwindcssRtl from 'tailwindcss-rtl';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0284c7', // آبی آسمانی
          dark: '#0369a1',
        },
        dark: {
          DEFAULT: '#0f172a', // سرمه‌ای تیره
          light: '#1e293b',
        },
      },
    },
  },
  plugins: [tailwindcssRtl],
};