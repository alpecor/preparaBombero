/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        colorNavBar: "#3C3C3C",
        colorButtonPrimary: "#DE9A17",
        colorForm: "#F6F6F6",
        colorPlaceholderForm: "#9CA3AF",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
