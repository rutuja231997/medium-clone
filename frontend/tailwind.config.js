import { nextui } from "@nextui-org/react";
/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlack: "rgba(0, 0, 0, 0.84)",
        yellowOrange: {
          100: "#fef678", // Light Yellow Orange
          200: "#fdff00", // Bright Yellow
          300: "#ffe833", // Yellow Orange
          400: "#ffc566", // Orange Yellow
          500: "#ffb640", // Deeper Orange
        },
      },
      fontSize: {
        "custom-size": "42px",
      },
      lineHeight: {
        "custom-line-height": "1.25",
      },
    },
    fontFamily: {
      Lora: ["Lora", "serif"],
      Georgia: ["Georgia", "serif"],
      Lucida: ["Lucida Sans Unicode", "serif"],
    },
    screens: {
      xs: "450px",
      sm: "640px",
      md: "768px", // Ensure this is correct
      lg: "1024px",
      xl: "1280px",
    },
  },

  plugins: [nextui()],
};
