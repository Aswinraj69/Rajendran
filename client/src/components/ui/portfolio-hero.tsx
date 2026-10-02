import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, BookOpen, Film, Music } from "lucide-react";
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

// BlurText animation component
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
  delay = 50,
  animateBy = "words",
  direction = "top",
  className = "",
  style,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
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
            filter: inView ? "blur(0px)" : "blur(10px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : `translateY(${direction === "top" ? "-20px" : "20px"})`,
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
  signature = "RK",
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

  return (
    <div className="relative min-h-[92vh] w-full overflow-hidden bg-gradient-to-b from-paper via-paper-ice/30 to-paper text-ink transition-colors flex flex-col justify-between pt-16 sm:pt-20">
      {/* Radiant Background Blur Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[650px] rounded-full bg-gradient-to-tr from-sky-300/20 via-orange-300/15 to-transparent blur-[140px] animate-pulse-glow" />
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-orange-200/25 blur-3xl" />
      </div>

      {/* Top author tag */}


      {/* Main Centered Stage */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center py-8">
        {/* Centered Main Name & Capsule Portrait */}
        <div className="w-full px-4 text-center">
          <div className="relative inline-block max-w-full">
            {/* Top Name Word */}
            <div className="overflow-hidden">
              <BlurText
                text={firstName}
                delay={75}
                animateBy="letters"
                direction="top"
                className="font-dandy font-bold text-[40px] min-[380px]:text-[52px] sm:text-[90px] md:text-[130px] lg:text-[165px] xl:text-[200px] leading-[0.82] tracking-tighter uppercase justify-center whitespace-nowrap text-gradient-sky-orange select-none"
              />
            </div>

            {/* Bottom Name Word */}
            <div className="overflow-hidden mt-1 sm:mt-2">
              <BlurText
                text={lastName}
                delay={75}
                animateBy="letters"
                direction="bottom"
                className="font-dandy font-bold text-[40px] min-[380px]:text-[52px] sm:text-[90px] md:text-[130px] lg:text-[165px] xl:text-[200px] leading-[0.82] tracking-tighter uppercase justify-center whitespace-nowrap text-ink select-none"
              />
            </div>

            {/* Profile Capsule Picture Overlap in Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
              <div className="group relative w-[56px] h-[95px] min-[380px]:w-[70px] min-[380px]:h-[120px] sm:w-[100px] sm:h-[165px] md:w-[130px] md:h-[220px] lg:w-[155px] lg:h-[260px] rounded-[28px] min-[380px]:rounded-[34px] sm:rounded-[48px] overflow-hidden border-2 sm:border-4 border-white shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-1 hover:shadow-glow-dual bg-gradient-to-b from-sky-200 via-paper-ice to-orange-100 flex items-end justify-center cursor-pointer">
                {/* Glow ring */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50 group-hover:opacity-10 transition" />
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
            text={
              language === "ml"
                ? "വാക്കുകൾകൊണ്ടും ദൃശ്യങ്ങൾകൊണ്ടും സാംസ്കാരിക ലോകം തീർക്കുന്ന സർഗ്ഗാത്മക ജീവിതം."
                : tagline
            }
            delay={30}
            animateBy="words"
            direction="top"
            className="font-manrope text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-relaxed text-ink-soft justify-center text-center"
          />
        </div>

        {/* Quick Role Badges */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 px-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/70 bg-white/90 backdrop-blur-sm px-3.5 py-1 text-[11px] font-bold text-sky-800 shadow-2xs font-manrope">
            <BookOpen className="h-3 w-3 text-sky-500" />
            Writer
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/70 bg-white/90 backdrop-blur-sm px-3.5 py-1 text-[11px] font-bold text-orange-800 shadow-2xs font-manrope">
            <Film className="h-3 w-3 text-orange-500" />
            Scriptwriter
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/70 bg-white/90 backdrop-blur-sm px-3.5 py-1 text-[11px] font-bold text-sky-800 shadow-2xs font-manrope">
            <Music className="h-3 w-3 text-sky-500" />
            Voice & Music
          </span>
        </div>
      </main>

      {/* Scroll Indicator */}
      <div className="relative z-10 pb-6 text-center">
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
