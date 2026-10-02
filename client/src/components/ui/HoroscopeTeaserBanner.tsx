import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Compass, Heart, ShieldAlert, ArrowRight, Stars } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export function HoroscopeTeaserBanner() {
  const { language } = useLanguage();

  return (
    <section className="relative my-12 overflow-hidden rounded-3xl border border-amber-300/70 bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 p-6 sm:p-10 text-white shadow-2xl">
      {/* Radiant Background Stars & Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left info */}
        <div className="max-w-2xl text-center lg:text-left space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-100 border border-white/30 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-200" />
            <span>{language === "ml" ? "ജ്യോതിഷം & ജാതക വിശകലനം" : "Kerala Astrology & Horoscope"}</span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug tracking-tight text-white drop-shadow-sm">
            {language === "ml"
              ? "നിങ്ങളുടെ രാശിഫലവും വിവാഹ പൊരുത്തവും അറിയൂ"
              : "Discover Your Rashi Phalam & Marriage Compatibility"}
          </h3>

          <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed font-manrope font-medium">
            {language === "ml"
              ? "10 പൊരുത്തങ്ങൾ, ചൊവ്വാദോഷ പരിശോധന, ദശാകാലങ്ങൾ, പ്രതിദിന രാശിഫലം എന്നിവ സുതാര്യമായി അറിയാൻ ഇപ്പോൾ പരിശോധിക്കൂ."
              : "10 Poruthams matchmaking, Chovva Dosham verification, birth dasha, and daily planetary forecasts."}
          </p>

          {/* Quick pills */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm border border-white/20">
              <Compass className="h-3 w-3 text-amber-200" />
              {language === "ml" ? "രാശിഫലം (Daily Horoscope)" : "Daily Horoscope"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm border border-white/20">
              <Heart className="h-3 w-3 text-pink-200" />
              {language === "ml" ? "10 പൊരുത്തങ്ങൾ (10 Poruthams)" : "Marriage Compatibility"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm border border-white/20">
              <ShieldAlert className="h-3 w-3 text-yellow-200" />
              {language === "ml" ? "ചൊവ്വാദോഷം (Chovva Dosha)" : "Chovva Dosha"}
            </span>
          </div>
        </div>

        {/* Right Action Card */}
        <div className="w-full sm:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
          <Link
            to="/horoscope"
            className="group flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-amber-950 shadow-xl transition-all duration-300 hover:bg-amber-50 hover:scale-105 active:scale-95 font-manrope"
          >
            <Stars className="h-4 w-4 text-amber-600" />
            <span>{language === "ml" ? "ജാതകം പരിശോധിക്കുക" : "Check Horoscope Now"}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link
            to="/horoscope?tab=porutham"
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/10 backdrop-blur-md px-6 py-3.5 text-xs font-bold text-white hover:bg-white/20 transition active:scale-95 font-manrope"
          >
            <span>{language === "ml" ? "വിവാഹ പൊരുത്തം നോക്കുക" : "Check Marriage Porutham"}</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
