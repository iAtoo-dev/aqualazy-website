import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          deep: '#0A2540',
          mid: '#0D3060',
          light: '#1A4B7C',
        },
        aqua: {
          crystal: '#7ED6FF',
          bright: '#A5F1FF',
          pale: '#D4F6FF',
          glow: '#E8FAFF',
        },
        sand: {
          warm: '#F5E6C8',
          light: '#FAF0DC',
        },
      },
      fontFamily: {
        heading: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
        subheading: ['var(--font-neue-haas)', 'Helvetica Neue', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(135deg, #0A2540 0%, #0D3060 50%, #1A4B7C 100%)',
        'aqua-gradient': 'linear-gradient(135deg, #7ED6FF 0%, #A5F1FF 100%)',
        'hero-gradient': 'linear-gradient(180deg, rgba(10,37,64,0.85) 0%, rgba(10,37,64,0.3) 60%, rgba(10,37,64,0.7) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'ripple': 'ripple 1.5s ease-out forwards',
        'particle': 'particle 8s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(126,214,255,0.3)', opacity: '0.7' },
          '50%': { boxShadow: '0 0 60px rgba(126,214,255,0.8)', opacity: '1' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        particle: {
          '0%': { transform: 'translateY(0) translateX(0) scale(1)', opacity: '0.6' },
          '33%': { transform: 'translateY(-30px) translateX(15px) scale(1.2)', opacity: '1' },
          '66%': { transform: 'translateY(-10px) translateX(-10px) scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'translateY(0) translateX(0) scale(1)', opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'aqua-glow': '0 0 30px rgba(126,214,255,0.4), 0 0 60px rgba(126,214,255,0.2)',
        'aqua-glow-lg': '0 0 60px rgba(126,214,255,0.5), 0 0 120px rgba(126,214,255,0.25)',
        'glass': '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
        'card': '0 20px 60px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
