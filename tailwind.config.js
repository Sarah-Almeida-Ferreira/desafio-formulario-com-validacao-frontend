/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,jsx}",
    "./src/**/**/*.{html,jsx}",
    "./src/*.{html,jsx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        primary: {
          default: "#25AFA7",
          hover: "#1E8D87",
        },
        light: {
          background: { default: "#f0f0f0", soft: "#f8f8f8", mute: "#f2f2f2" },
          text: "#190F0F",
        },
        dark: {
          background: { default: "#181818", soft: "#222222", mute: "#282828" },
          text: "#E5E6E8",
        },
      },
    },
  },
  plugins: [],
};
