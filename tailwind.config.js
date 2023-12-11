/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    //NOTE - we override on the default styles
    fontFamily: {
      sans: 'Roboto Mono, monospace',
    },

    //NOTE - we add our own styles with keeping the default ones
    extend: {
      fontSize: {
        huge: ['80rem', { lineHeight: '1'}]
      },
      height: {
        screen: '100dvh'
      }
    },
  },
  plugins: [],
}
