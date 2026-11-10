/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // NHS.UK design system palette (service-manual.nhs.uk/design-system/styles/colour)
        nhs: {
          blue: '#005eb8', darkblue: '#003087', brightblue: '#0072ce',
          text: '#212b32', secondary: '#4c6272',
          grey3: '#aeb7bd', grey4: '#d8dde0', grey5: '#f0f4f5',
          green: '#007f3b', hovergreen: '#00662f', darkgreen: '#00401e',
          red: '#d5281b', warmyellow: '#ffb81c', yellow: '#ffeb3b', ambertext: '#6b4300',
          bluetint: '#e8f1f8', greentint: '#e6f4ea', redtint: '#fdecea', yellowtint: '#fff9c4',
        },
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        accent: {
          50: '#eef2ff',
          500: '#6366f1',
          600: '#4f46e5',
        }
      },
      fontFamily: {
        dyslexic: ['OpenDyslexic', 'Comic Sans MS', 'sans-serif'],
        sans: ['"Frutiger W01"', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
