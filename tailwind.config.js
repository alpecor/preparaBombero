/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        primaryColor: "var(--primary-color)",
        primaryColorHover: "var(--primary-hover-color)",
        formColor: "var(--form-color)",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
