/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
        fontFamily:{
            handjet: ['Handjet', 'sans-serif'],
            kablammo: ['Kablammo', 'cursive'],
            suse: ['SUSE', 'sans-serif'],
        },
        colors:{
            lightBg: "#F5F5F5 ",
            lightPrimary: "#333333 ",
            lightSecondary: "#6B6B6B",
            lightAccent:"#3A76A8",
            lightBorderColor: "#E0E0E0",
            darkBg: "#121212",
            darkPrimary: "#E0E0E0",
            darkSecondary: "#A0A0A0",
            darkAccent:"#80CBC4",
            darkBorderColor: "#333333",
        }
    },
  },
  plugins: [],
}
