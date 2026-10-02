import type { Config } from "tailwindcss";

/**
 * LIGHT MODE DESIGN SYSTEM — Pure white, professional editorial palette.
 * Primary accent: Deep Forest Green (#1B4332) — Kerala resonance
 * Secondary accent: Warm Amber Gold (#C77C2A) — cultural highlight
 * Base: Pure white + warm off-white sections
 * Text: Near-black charcoal for maximum readability
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0F172A",   // deep slate navy-black for sharp typography
          soft: "#334155",      // balanced slate
          muted: "#64748B",     // muted slate caption
        },
        paper: {
          DEFAULT: "#FFFFFF",   // pure pristine white
          warm: "#FAFAF9",      // subtle warm white
          ice: "#F0F9FF",       // soft light sky tint
          peach: "#FFF7ED",     // soft light orange/peach tint
          glass: "rgba(255, 255, 255, 0.85)",
        },
        // ── Radiant Light Blue & Cyan Accent Suite ──
        sky: {
          DEFAULT: "#0284C7",
          light: "#38BDF8",
          dark: "#0369A1",
          pale: "#F0F9FF",
          ice: "#E0F2FE",
        },
        // ── Radiant Sunset Light Orange & Amber Suite ──
        orange: {
          DEFAULT: "#EA580C",
          light: "#F97316",
          warm: "#FB923C",
          pale: "#FFF7ED",
          peach: "#FFEDD5",
        },
        // Preserved complementary tokens
        gold: {
          DEFAULT: "#D97706",
          light: "#F59E0B",
          muted: "#B45309",
          pale: "#FEF3C7",
        },
        moss: {
          DEFAULT: "#0284C7",   // updated to vibrant dynamic sky/azure for modern feel
          light: "#38BDF8",
          dark: "#0369A1",
          pale: "#F0F9FF",
        },
        slate: {
          DEFAULT: "#1E293B",
          light: "#334155",
          pale: "#F1F5F9",
        },
        mist: {
          DEFAULT: "#E2E8F0",   // crisp border
          light: "#F8FAFC",
          sky: "rgba(56, 189, 248, 0.2)",
          orange: "rgba(249, 115, 22, 0.2)",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Noto Serif Malayalam", "serif"],
        serifml: ["Noto Serif Malayalam", "serif"],
        sans: ["Inter", "Noto Sans Malayalam", "sans-serif"],
        sansml: ["Noto Sans Malayalam", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        wider2: "0.15em",
        wider3: "0.25em",
      },
      backgroundImage: {
        grain: "url('/grain.svg')",
        "gradient-sky-orange": "linear-gradient(135deg, #0284C7 0%, #38BDF8 40%, #FB923C 80%, #EA580C 100%)",
        "gradient-mesh": "linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 50%, #FFF7ED 100%)",
        "gradient-card-glass": "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.6) 50%, rgba(255, 247, 237, 0.6) 100%)",
        "gradient-sunset-badge": "linear-gradient(90deg, #38BDF8 0%, #FB923C 100%)",
      },
      maxWidth: {
        prose: "68ch",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "2xs": "0 1px rgba(0, 0, 0, 0.05)",
        card: "0 2px 8px -2px rgba(15, 23, 42, 0.05), 0 1px 4px -1px rgba(15, 23, 42, 0.03)",
        "card-hover": "0 20px 40px -12px rgba(2, 132, 199, 0.15), 0 8px 24px -6px rgba(234, 88, 12, 0.12)",
        "glow-sky": "0 0 25px -4px rgba(56, 189, 248, 0.35)",
        "glow-orange": "0 0 25px -4px rgba(249, 115, 22, 0.35)",
        "glow-dual": "0 12px 35px -8px rgba(56, 189, 248, 0.25), 0 6px 20px -4px rgba(249, 115, 22, 0.2)",
        nav: "0 1px 0 0 rgba(226, 232, 240, 0.8)",
        "nav-scroll": "0 8px 30px -6px rgba(15, 23, 42, 0.08), 0 2px 10px -2px rgba(56, 189, 248, 0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
