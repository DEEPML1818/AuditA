/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0e0e10',
        neonBlue: '#00f0ff',
        neonPink: '#ff00c8',
        neonGreen: '#39ff14',
        neonPurple: '#a349a4',
        neonPink: '#ff00c8',
        neonRed:  '#ff0044',
        glass: 'rgba(255,255,255,0.05)',
        borderGlass: 'rgba(255,255,255,0.2)',
      },
      fontFamily: { orbitron: ['Orbitron','sans-serif'] },
      boxShadow: {
        neonBlue: '0 0 8px #00f0ff, 0 0 16px #00f0ff',
        neonPink: '0 0 8px #ff00c8, 0 0 16px #ff00c8',
      },
      keyframes: {
        pulsate: {
          '0%,100%': { opacity: '1', boxShadow: '0 0 8px rgba(0,255,255,0.7)' },
          '50%':    { opacity: '0.7', boxShadow: '0 0 16px rgba(0,255,255,1)' },
        },
        glitch: {
          '0%':   { clipPath: 'inset(0 0 0 0)' },
          '10%':  { clipPath: 'inset(10% 0 10% 0)' },
          '20%':  { clipPath: 'inset(0 0 20% 0)' },
          '30%':  { clipPath: 'inset(10% 0 30% 0)' },
          '40%':  { clipPath: 'inset(0 0 40% 0)' },
          '50%':  { clipPath: 'inset(10% 0 50% 0)' },
          '60%':  { clipPath: 'inset(0 0 60% 0)' },
          '70%':  { clipPath: 'inset(10% 0 70% 0)' },
          '80%':  { clipPath: 'inset(0 0 80% 0)' },
          '90%':  { clipPath: 'inset(10% 0 90% 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
      },
      animation: {
        pulsate: 'pulsate 1.5s ease-in-out infinite',
        glitch:   'glitch 2s linear infinite',
      },
    },
  },
  plugins: [],
}
