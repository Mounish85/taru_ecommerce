/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        taru: {
          base: "#E4E2DD",
          primary: "#1E1E1E",
          accent: "#DB4A2B",
          secondary: "#F8A348",
          pink: "#FF89A9",
          campaign: "#D9D6D0",
          muted: "#6B6A67",
          border: "#1E1E1E",
          card: "#ECEAE5",
        }
      },
      fontFamily: {
        clash: ['"Clash Display"', 'sans-serif'],
        satoshi: ['"Satoshi"', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
        widest: '0.15em',
      },
      lineHeight: {
        tightest: '0.75',
      },
      aspectRatio: {
        '3/4': '3 / 4',
      },
      transitionTimingFunction: {
        'brutalist': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
}

