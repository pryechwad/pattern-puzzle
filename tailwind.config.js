/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00f5ff',
          purple: '#bf00ff',
          pink: '#ff0080',
          green: '#00ff41',
          yellow: '#ffff00'
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 1s ease-in-out infinite',
        'flash-neon': 'flash-neon 0.5s ease-in-out',
        'bounce-in': 'bounce-in 0.6s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'toast-in': 'toast-in 0.3s ease-out',
        'toast-out': 'toast-out 0.3s ease-in'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.4)' }
        },
        'flash-neon': {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '50%': { boxShadow: '0 0 30px currentColor, 0 0 50px currentColor' },
          '100%': { boxShadow: '0 0 5px currentColor' }
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'glow': {
          '0%': { textShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '100%': { textShadow: '0 0 30px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)' }
        },
        'toast-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'toast-out': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(0,245,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.1) 1px, transparent 1px)'
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}