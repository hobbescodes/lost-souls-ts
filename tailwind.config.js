module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        header: ['"Amatic SC"', "cursive"],
      },
      width: {
        "98%": "98vw",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
