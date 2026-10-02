import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import { Film, Headphones, Feather, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Works() {
  const { t, language } = useLanguage();

  const sections = [
    {
      titleEn: "Stories & Literature",
      titleMl: "കഥകളും സാഹിത്യവും",
      descEn: "Published short stories, essays, and literary commentary.",
      descMl: "ചെറുകഥകൾ, ഉപന്യാസങ്ങൾ, സാംസ്കാരിക നിരീക്ഷണങ്ങൾ.",
      link: "/stories",
      icon: Feather,
      color: "from-sky-500 to-sky-600",
      bg: "bg-sky-50 text-sky-600 border-sky-100",
    },
    {
      titleEn: "Videos & Documentaries",
      titleMl: "വീഡിയോകളും ദൃശ്യങ്ങളും",
      descEn: "Interviews, talks, cultural series, and YouTube presentations.",
      descMl: "അഭിമുഖങ്ങൾ, ചർച്ചകൾ, യൂട്യൂബ് അവതരണങ്ങൾ.",
      link: "/videos",
      icon: Film,
      color: "from-orange-500 to-orange-600",
      bg: "bg-orange-50 text-orange-600 border-orange-100",
    },
    {
      titleEn: "Voice & Audio Stories",
      titleMl: "ശബ്ദകഥകളും ഗാനങ്ങളും",
      descEn: "Voice readings, spoken stories, and background musical compositions.",
      descMl: "ശബ്ദ ആഖ്യാനങ്ങൾ, കഥാവായനകൾ, ഗാനസൃഷ്ടികൾ.",
      link: "/audio",
      icon: Headphones,
      color: "from-sky-400 to-orange-400",
      bg: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  return (
    <div className="min-h-screen bg-paper pt-28 pb-24 md:pt-36">
      <div className="container-editorial">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-700"
          >
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-sky-400 to-orange-400 animate-pulse" />
            {language === "ml" ? "സൃഷ്ടികളുടെ സമാഹാരം" : "Creative Archive"}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-4xl text-ink md:text-5xl font-bold"
          >
            {t.nav.works}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-base text-ink-muted leading-relaxed font-manrope font-medium"
          >
            {language === "ml"
              ? "എഴുത്തിന്റെയും ദൃശ്യ മാധ്യമത്തിന്റെയും വ്യത്യസ്ത മേഖലകളിലൂടെയുള്ള ഒരു സമഗ്ര നോട്ടം."
              : "An overview of literature, screenplays, media projects, and creative dialogues."}
          </motion.p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link
                  to={s.link}
                  className="card-glass group block p-8 transition-all duration-300 hover:border-sky-300 hover:shadow-glow-dual hover:-translate-y-2"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${s.bg} transition-transform duration-300 group-hover:scale-110 shadow-xs`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold text-ink group-hover:text-sky-600 transition">
                    {language === "ml" ? s.titleMl : s.titleEn}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted font-medium font-manrope">
                    {language === "ml" ? s.descMl : s.descEn}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 group-hover:text-orange-600 transition">
                    Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
