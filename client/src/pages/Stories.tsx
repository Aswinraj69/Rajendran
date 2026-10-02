import { useEffect, useState } from "react";
import { listStories } from "../api/stories";
import { Story } from "../types";
import { StoryCard } from "../components/ui/StoryCard";
import { CardSkeletonGrid, EmptyState } from "../components/ui/Skeletons";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "framer-motion";

const categories = [
  { id: "all", labelEn: "All Stories", labelMl: "എല്ലാം" },
  { id: "story", labelEn: "Short Stories", labelMl: "ചെറുകഥകൾ" },
  { id: "poem", labelEn: "Poems", labelMl: "കവിതകൾ" },
  { id: "essay", labelEn: "Essays", labelMl: "ലേഖനങ്ങൾ" },
  { id: "script-note", labelEn: "Screenplays & Notes", labelMl: "തിരക്കഥാ കുറിപ്പുകൾ" },
  { id: "article", labelEn: "Articles", labelMl: "ചിന്തകൾ" },
];

export default function Stories() {
  const { t, language } = useLanguage();
  const [stories, setStories] = useState<Story[] | null>(null);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    setStories(null);
    listStories({ category })
      .then((res) => setStories(res.data))
      .catch(() => setStories([]));
  }, [category]);

  return (
    <div className="min-h-screen bg-paper pt-28 pb-24 md:pt-36">
      <div className="container-editorial">
        {/* Header */}
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-700"
          >
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-sky-400 to-orange-400 animate-pulse" />
            {language === "ml" ? "സാഹിത്യ സൃഷ്ടികൾ" : "Literary Works"}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-4xl text-ink md:text-5xl font-bold"
          >
            {t.nav.stories}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-base text-ink-muted leading-relaxed font-manrope font-medium"
          >
            {language === "ml"
              ? "കഥകളും കവിതകളും ചിന്തകളും — അക്ഷരങ്ങളിലൂടെയുള്ള ആഴത്തിലുള്ള യാത്ര."
              : "Short stories, poetic reflections, and essays exploring human intimacy and the world we observe."}
          </motion.p>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-sky-100 pb-6">
          {categories.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-glow-sky scale-105"
                    : "bg-paper-ice text-ink-soft hover:bg-sky-100/70 hover:text-sky-700"
                }`}
              >
                {language === "ml" ? c.labelMl : c.labelEn}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-12">
          {stories === null && <CardSkeletonGrid />}
          {stories?.length === 0 && <EmptyState message={t.common.empty} />}
          {stories && stories.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {stories.map((story, i) => (
                <StoryCard key={story._id} story={story} index={i} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
