/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#E87A86',
          hover: '#D66874',
          secondary: '#FDE0E4',
        },
        bg: {
          primary: '#FFF5F8',
          secondary: '#5C3D46',
        },
        maitri: {
          dark: '#2C1A1D',
          mid: '#5C4A4D',
          muted: '#9E7A82',
          border: '#F0E1E4',
          'border-d': '#4A2F37',
        },
        accent: {
          yellow: '#FFF3CD',
          peach: '#FFDAB9',
          lavender: '#F0E6FF',
          sage: '#E6F4EA',
        },
        phase: {
          menstrual: { DEFAULT: '#E87A86', bg: '#FDE0E4' },
          follicular: { DEFAULT: '#68B984', bg: '#E6F4EA' },
          ovulatory: { DEFAULT: '#F4A261', bg: '#FFF0E6' },
          luteal: { DEFAULT: '#9C77C4', bg: '#F0E6FF' },
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Lora', 'Georgia', 'serif'],
        body: ['Inter', '"Helvetica Neue"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '24px',
        '2xl': '32px',
        '3xl': '40px',
      },
      boxShadow: {
        'sm-pink': '0 4px 6px -1px rgba(92,61,70,0.05), 0 2px 4px -1px rgba(92,61,70,0.03)',
        'md-pink': '0 10px 15px -3px rgba(92,61,70,0.08), 0 4px 6px -2px rgba(92,61,70,0.04)',
        'lg-pink': '0 20px 25px -5px rgba(92,61,70,0.12), 0 10px 10px -5px rgba(92,61,70,0.06)',
        'glow': '0 8px 20px rgba(232,122,134,0.35)',
      },
      animation: {
        'spin-fast': 'spin 0.7s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'slide-up': 'slideUp 0.3s ease',
        'fade-in': 'fadeIn 0.2s ease',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 0 0 rgba(232,122,134,0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(232,122,134,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(232,122,134,0)' },
        },
        slideUp: {
          from: { transform: 'translateY(30px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
