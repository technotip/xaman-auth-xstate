import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "xaman-blue": "#3051FC",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
