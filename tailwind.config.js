// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
//


/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'background-light': 'rgb(var(--background-light) / <alpha-value>)',
        'text-light': 'rgb(var(--text-light) / <alpha-value>)',
        'subtext-light': 'rgb(var(--subtext-light) / <alpha-value>)',

        'background-dark': 'rgb(var(--background-dark) / <alpha-value>)',
        'card-light': 'rgb(var(--card-light) / <alpha-value>)',
        'card-dark': 'rgb(var(--card-dark) / <alpha-value>)',
        'text-dark': 'rgb(var(--text-dark) / <alpha-value>)',
        'subtext-dark': 'rgb(var(--subtext-dark) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Helvetica Neue', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
      },
      boxShadow: {
        'glow-sm': '0 0 8px rgba(99,102,241,.2),0 0 16px rgba(168,85,247,.1)',
        'glow-md': '0 0 15px rgba(99,102,241,.3),0 0 30px rgba(168,85,247,.2)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/line-clamp'),
  ],
}
