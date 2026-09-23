/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        resort: {
          dark:    '#0b1514',
          navy:    '#102522',
          slate:   '#18352f',
          card:    '#142b27',
          border:  '#2a4a42',
          text:    '#f5f0e8',
          muted:   '#a8b9af',
          accent:  '#d7a84c',
          gold:    '#d7a84c',
          cream:   '#fff3df',
          emerald: '#10b981',
          ruby:    '#ef4444',
          sapphire:'#2dd4bf',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d7a84c 0%, #fff3df 48%, #b97832 100%)',
        'dark-gradient': 'linear-gradient(135deg, #07110f 0%, #102522 48%, #18352f 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(20,43,39,0.96) 0%, rgba(24,53,47,0.92) 100%)',
      },
      boxShadow: {
        'gold': '0 10px 28px rgba(215, 168, 76, 0.24)',
        'card': '0 18px 44px rgba(2,12,10,0.32)',
        'luxury': '0 24px 70px rgba(2,12,10,0.52)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
