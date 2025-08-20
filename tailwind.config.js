/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#10B981',
        accent: '#F59E0B',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: '#1F2937',
        'text-secondary': '#6B7280',
        error: '#EF4444',
        success: '#10B981',
      },
      fontFamily: {
        'inter': ['Inter-Regular'],
        'inter-bold': ['Inter-Bold'],
      },
    },
  },
}