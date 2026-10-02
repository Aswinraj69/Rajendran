import { useEffect, useState } from "react";
import { listVideos } from "../api/videos";
import { Video } from "../types";
import { VideoCard } from "../components/ui/VideoCard";
import { CardSkeletonGrid, EmptyState } from "../components/ui/Skeletons";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "framer-motion";

const categories = [
  { id: "all", labelEn: "All Videos", labelMl: "എല്ലാം" },
  { id: "interviews", labelEn: "Interviews", labelMl: "അഭിമുഖങ്ങൾ" },
  { id: "stories", labelEn: "Narratives", labelMl: "കഥാഖ്യാനങ്ങൾ" },
  { id: "script", labelEn: "Behind the Script", labelMl: "തിരക്കഥ" },
  { id: "talks", labelEn: "Literary Talks", labelMl: "പ്രഭാഷണങ്ങൾ" },
  { id: "music", labelEn: "Music & Lyrics", labelMl: "സംഗീതം" },
  { id: "short-films", labelEn: "Short Films", labelMl: "ഹ്രസ്വചിത്രങ്ങൾ" },
  { id: "youtube", labelEn: "YouTube Originals", labelMl: "യൂട്യൂബ്" },
];

export default function Videos() {
  const { t, language } = useLanguage();
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    setVideos(null);
    listVideos({ category })
      .then((res) => setVideos(res.data))
      .catch(() => setVideos([]));
  }, [category]);

  return (
    <div className="min-h-screen bg-paper pt-28 pb-24 md:pt-36">
      <div className="container-editorial">
        {/* Header */}
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-700"
          >
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-orange-400 to-sky-400 animate-pulse" />
            {language === "ml" ? "വീഡിയോ ആർക്കൈവ്" : "Visual & Audio Works"}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-4xl text-ink md:text-5xl font-bold"
          >
            {t.nav.videos}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-base text-ink-muted leading-relaxed font-manrope font-medium"
          >
            {language === "ml"
              ? "ഡോക്യുമെന്ററികൾ, അഭിമുഖങ്ങൾ, കഥാവതരണങ്ങൾ — ദൃശ്യമാധ്യമത്തിലൂടെ."
              : "Discussions, short films, cultural dialogues, and spoken narratives."}
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
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-glow-orange scale-105"
                    : "bg-paper-ice text-ink-soft hover:bg-orange-100/70 hover:text-orange-700"
                }`}
              >
                {language === "ml" ? c.labelMl : c.labelEn}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-12">
          {videos === null && <CardSkeletonGrid />}
          {videos?.length === 0 && <EmptyState message={t.common.empty} />}
          {videos && videos.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {videos.map((video, i) => (
                <VideoCard key={video._id} video={video} index={i} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
