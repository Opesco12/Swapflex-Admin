/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#212832",
        secondary: "#ffb200",
        light: "#c0c0c0",
        lightBG: "#2b323c",
        silver: "silver",
        white: "#fff",
      },
    },
  },
  plugins: [],
};
