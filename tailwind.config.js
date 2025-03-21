/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00ffcc',
        secondary: '#7000ff',
        accent: '#ff00c3',
        quaternary: '#00a3ff',
        quinary: '#ffcc00',
        'black-rich': '#050505',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'noise': "url('/noise.png')",
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 255, 204, 0.5), 0 0 20px rgba(0, 255, 204, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 255, 204, 0.8), 0 0 40px rgba(0, 255, 204, 0.5)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        pulse: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
      boxShadow: {
        'glow-sm': '0 0 5px rgba(0, 255, 204, 0.5)',
        'glow-md': '0 0 15px rgba(0, 255, 204, 0.5), 0 0 30px rgba(0, 255, 204, 0.3)',
        'glow-lg': '0 0 25px rgba(0, 255, 204, 0.5), 0 0 50px rgba(0, 255, 204, 0.3), 0 0 75px rgba(0, 255, 204, 0.1)',
        'glow-purple': '0 0 15px rgba(112, 0, 255, 0.5), 0 0 30px rgba(112, 0, 255, 0.3)',
        'glow-pink': '0 0 15px rgba(255, 0, 195, 0.5), 0 0 30px rgba(255, 0, 195, 0.3)',
      },
      textShadow: {
        'glow': '0 0 10px rgba(0, 255, 204, 0.5), 0 0 20px rgba(0, 255, 204, 0.3)',
        'glow-intense': '0 0 5px rgba(0, 255, 204, 0.5), 0 0 15px rgba(0, 255, 204, 0.5), 0 0 30px rgba(0, 255, 204, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-glow': {
          textShadow: '0 0 10px rgba(0, 255, 204, 0.5), 0 0 20px rgba(0, 255, 204, 0.3)',
        },
        '.text-shadow-glow-intense': {
          textShadow: '0 0 5px rgba(0, 255, 204, 0.5), 0 0 15px rgba(0, 255, 204, 0.5), 0 0 30px rgba(0, 255, 204, 0.3), 0 0 50px rgba(0, 255, 204, 0.1)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
} 