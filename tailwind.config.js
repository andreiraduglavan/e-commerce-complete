/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dashboard-main':'#6460f2',
      },
      fontFamily: {
        'oswald': ['Oswald', 'sans-serif'],
        'prompt': ['Prompt', 'sans-serif'],
        'epilogue': ['Epilogue', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'raleway': ['Raleway', 'sans-serif'],
        'montserrat': ['montserrat', 'sans-serif']      
      },
    },
  },
  plugins: [],
}
