import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, BookOpen, Film, Music, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

// Inline Button component
export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// BlurText animation component with guaranteed mobile visibility
export interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  className?: string;
  style?: React.CSSProperties;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 40,
  animateBy = "words",
  direction = "top",
  className = "",
  style,
}) => {
  // Initialize to true so text is ALWAYS visible by default and never gets stuck invisible
  const [inView, setInView] = useState(true);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Quick mount trigger to run smooth reveal
    setInView(true);
  }, []);

  const segments = useMemo(() => {
    return animateBy === "words" ? text.split(" ") : text.split("");
  }, [text, animateBy]);

  return (
    <p ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {segments.map((segment, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            filter: inView ? "blur(0px)" : "blur(8px)",
            opacity: inView ? 1 : 0.8,
            transform: inView ? "translateY(0)" : `translateY(${direction === "top" ? "-10px" : "10px"})`,
            transition: `all 0.5s ease-out ${i * delay}ms`,
          }}
        >
          {segment}
          {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
};

export interface PortfolioHeroProps {
  firstName?: string;
  lastName?: string;
  tagline?: string;
  avatarUrl?: string;
  signature?: string;
  onScrollClick?: () => void;
}

export default function PortfolioHero({
  firstName = "RAJENDRAN",
  lastName = "KAIPPALLIL",
  tagline = "Crafting narratives that move between the page, screen, and human emotions.",
  avatarUrl = "/rajendran-hero.jpg",
  onScrollClick,
}: PortfolioHeroProps) {
  const { language } = useLanguage ? (() => {
    try {
      return useLanguage();
    } catch {
      return { language: "en" };
    }
  })() : { language: "en" };

  const handleScrollDown = () => {
    if (onScrollClick) {
      onScrollClick();
    } else {
      window.scrollTo({
        top: window.innerHeight * 0.85,
        behavior: "smooth",
      });
    }
  };

  const currentTagline =
    language === "ml"
      ? "വാക്കുകൾകൊണ്ടും ദൃശ്യങ്ങൾകൊണ്ടും സാംസ്കാരിക ലോകം തീർക്കുന്ന സർഗ്ഗാത്മക ജീവിതം."
      : tagline;

  return (
    <div className="relative min-h-[90vh] sm:min-h-[92vh] w-full overflow-hidden bg-gradient-to-b from-paper via-paper-ice/40 to-paper text-ink transition-colors flex flex-col justify-between pt-20 sm:pt-24 pb-8">
      {/* Radiant Background Blur Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[400px] sm:h-[500px] w-[90vw] sm:w-[650px] rounded-full bg-gradient-to-tr from-sky-300/25 via-orange-300/20 to-transparent blur-[100px] sm:blur-[140px] animate-pulse-glow" />
        <div className="absolute -left-16 top-16 h-60 w-60 sm:h-72 sm:w-72 rounded-full bg-sky-200/35 blur-3xl" />
        <div className="absolute -right-16 bottom-16 h-60 w-60 sm:h-72 sm:w-72 rounded-full bg-orange-200/30 blur-3xl" />
      </div>

      {/* Main Centered Stage */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-4 sm:py-8 max-w-6xl mx-auto w-full">
        
        {/* ── MOBILE-ONLY HERO LAYOUT (< sm breakpoint) ── */}
        <div className="flex sm:hidden flex-col items-center text-center w-full space-y-5">
          {/* Author Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-sky-200/80 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-800 shadow-2xs font-manrope">
            <Sparkles className="h-3 w-3 text-orange-500" />
            <span>Official Author & Screenwriter</span>
          </div>

          {/* Prominent Large Mobile Portrait */}
          <div className="relative group my-2">
            {/* Glow Aura */}
            <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-tr from-sky-400/40 to-orange-400/40 blur-xl opacity-80" />
            
            <div className="relative w-44 h-56 min-[380px]:w-48 min-[380px]:h-60 rounded-[28px] overflow-hidden border-3 border-white shadow-2xl bg-gradient-to-b from-sky-100 via-paper-ice to-orange-100">
              <img
                src={avatarUrl}
                alt="Rajendran Kaippallil"
                className="w-full h-full object-cover object-[center_20%] drop-shadow-md"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-center rounded-full bg-white/95 backdrop-blur-md py-1 px-2 border border-sky-100 shadow-xs">
                <span className="text-[10px] font-bold tracking-wider uppercase text-ink font-manrope">
                  Rajendran Kaippallil
                </span>
              </div>
            </div>
          </div>

          {/* Big Bold Mobile Title Names */}
          <div className="w-full space-y-1">
            <h1 className="font-dandy font-bold text-4xl min-[380px]:text-5xl text-gradient-sky-orange tracking-tight uppercase leading-[0.95] drop-shadow-xs">
              {firstName}
            </h1>
            <h2 className="font-dandy font-bold text-4xl min-[380px]:text-5xl text-ink tracking-tight uppercase leading-[0.95]">
              {lastName}
            </h2>
          </div>

          {/* Mobile Tagline */}
          <p className="font-manrope text-sm min-[380px]:text-base font-semibold leading-relaxed text-ink-soft max-w-sm px-2">
            {currentTagline}
          </p>

          {/* Mobile Role Badges */}
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/80 bg-white/95 px-3 py-1 text-[11px] font-bold text-sky-800 shadow-2xs font-manrope">
              <BookOpen className="h-3 w-3 text-sky-500" />
              Writer
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/80 bg-white/95 px-3 py-1 text-[11px] font-bold text-orange-800 shadow-2xs font-manrope">
              <Film className="h-3 w-3 text-orange-500" />
              Scriptwriter
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/80 bg-white/95 px-3 py-1 text-[11px] font-bold text-sky-800 shadow-2xs font-manrope">
              <Music className="h-3 w-3 text-sky-500" />
              Voice & Audio
            </span>
          </div>

          {/* Mobile Quick Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              to="/stories"
              className="rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-5 py-2.5 text-xs font-bold text-white shadow-glow-sky active:scale-95 transition font-manrope"
            >
              Read Stories
            </Link>
            <Link
              to="/audio"
              className="rounded-xl bg-white border border-sky-200 px-5 py-2.5 text-xs font-bold text-sky-800 shadow-xs active:scale-95 transition font-manrope hover:bg-sky-50"
            >
              Listen Audio
            </Link>
          </div>
        </div>


        {/* ── DESKTOP / TABLET HERO LAYOUT (>= sm breakpoint) ── */}
        <div className="hidden sm:flex flex-col items-center text-center w-full">
          {/* Centered Main Name & Signature Capsule Portrait */}
          <div className="w-full px-4 text-center">
            <div className="relative inline-block max-w-full">
              {/* Top Name Word */}
              <div className="overflow-hidden">
                <BlurText
                  text={firstName}
                  delay={60}
                  animateBy="letters"
                  direction="top"
                  className="font-dandy font-bold sm:text-[80px] md:text-[120px] lg:text-[160px] xl:text-[195px] leading-[0.82] tracking-tighter uppercase justify-center whitespace-nowrap text-gradient-sky-orange select-none"
                />
              </div>

              {/* Bottom Name Word */}
              <div className="overflow-hidden mt-2">
                <BlurText
                  text={lastName}
                  delay={60}
                  animateBy="letters"
                  direction="bottom"
                  className="font-dandy font-bold sm:text-[80px] md:text-[120px] lg:text-[160px] xl:text-[195px] leading-[0.82] tracking-tighter uppercase justify-center whitespace-nowrap text-ink select-none"
                />
              </div>

              {/* Profile Capsule Picture Overlap in Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
                <div className="group relative sm:w-[105px] sm:h-[170px] md:w-[135px] md:h-[225px] lg:w-[160px] lg:h-[270px] rounded-[48px] overflow-hidden border-4 border-white shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-1 hover:shadow-glow-dual bg-gradient-to-b from-sky-200 via-paper-ice to-orange-100 flex items-end justify-center cursor-pointer">
                  {/* Glow ring */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition" />
                  <img
                    src={avatarUrl}
                    alt="Rajendran Kaippallil"
                    className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tagline Below Hero */}
          <div className="mt-8 sm:mt-12 max-w-2xl px-6 text-center">
            <BlurText
              text={currentTagline}
              delay={25}
              animateBy="words"
              direction="top"
              className="font-manrope text-base md:text-lg lg:text-xl font-semibold leading-relaxed text-ink-soft justify-center text-center"
            />
          </div>

          {/* Quick Role Badges */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 px-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/80 bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-sky-800 shadow-2xs font-manrope hover:border-sky-400 transition">
              <BookOpen className="h-3.5 w-3.5 text-sky-500" />
              Writer
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/80 bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-orange-800 shadow-2xs font-manrope hover:border-orange-400 transition">
              <Film className="h-3.5 w-3.5 text-orange-500" />
              Scriptwriter
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/80 bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-sky-800 shadow-2xs font-manrope hover:border-sky-400 transition">
              <Music className="h-3.5 w-3.5 text-sky-500" />
              Voice & Audio
            </span>
          </div>
        </div>

      </main>

      {/* Scroll Indicator */}
      <div className="relative z-10 pt-4 pb-2 text-center">
        <button
          type="button"
          onClick={handleScrollDown}
          className="group inline-flex flex-col items-center gap-1 text-ink-muted hover:text-sky-600 transition-colors duration-300"
          aria-label="Scroll down to content"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest font-manrope opacity-75 group-hover:opacity-100">
            Scroll to explore
          </span>
          <ChevronDown className="w-5 h-5 text-sky-500 animate-bounce transition-transform duration-300 group-hover:translate-y-1" />
        </button>
      </div>
    </div>
  );
}
