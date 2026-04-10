import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--ds-color-primary)",
          foreground: "var(--ds-color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--ds-color-secondary)",
          foreground: "var(--ds-color-secondary-foreground)",
        },
        background: "var(--ds-color-background)",
        foreground: "var(--ds-color-foreground)",
        muted: {
          DEFAULT: "var(--ds-color-muted)",
          foreground: "var(--ds-color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--ds-color-accent)",
          foreground: "var(--ds-color-accent-foreground)",
        },
        card: {
          DEFAULT: "var(--ds-color-card)",
          foreground: "var(--ds-color-card-foreground)",
        },
        border: "var(--ds-color-border)",
        input: "var(--ds-color-input)",
        ring: "var(--ds-color-ring)",
        destructive: {
          DEFAULT: "var(--ds-color-destructive)",
          foreground: "var(--ds-color-destructive-foreground)",
        },
      },
      fontFamily: {
        sans: ["var(--ds-font-family)", "PT Sans", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--ds-radius-lg)",
        md: "var(--ds-radius-md)",
        sm: "var(--ds-radius-sm)",
      },
    },
  },
  plugins: [],
};

export default config;
