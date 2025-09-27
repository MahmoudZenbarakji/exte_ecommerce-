import twAnimate from "tw-animate-css";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ covers all React files
  ],
  theme: {
    extend: {},
  },
  plugins: [
    twAnimate, // ✅ enables tw-animate-css plugin
  ],
}
