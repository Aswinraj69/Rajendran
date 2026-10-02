import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Story } from "../../types";
import { useLanguage } from "../../context/LanguageContext";
import { resolveMediaUrl } from "../../utils/media";
import { ArrowRight } from "lucide-react";

export function StoryCard({ story, index = 0 }: { story: Story; index?: number }) {
  const { pick, language, t } = useLanguage();
  const title   = pick(story.titleMalayalam,  story.titleEnglish);
  const excerpt = pick(story.excerptMalayalam, story.excerptEnglish);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link
        to={`/stories/${story.slug}`}
        data-cursor="Read"
        className="card-glass block overflow-hidden p-3.5 transition-all duration-300"
      >
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-paper-ice border border-sky-100/60">
          {story.coverImage ? (
            <img
              src={resolveMediaUrl(story.coverImage)}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-100/50 via-white to-orange-100/40">
              <span className="font-display text-6xl font-light text-sky-400/30 select-none">
                {title?.charAt(0) || "A"}
              </span>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-sky-700 shadow-xs border border-sky-100">
              {story.category}
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="mt-4 px-1.5 space-y-2 border-b border-sky-100/50 pb-4">
          <h3
            lang={language}
            className="font-display text-lg font-bold leading-snug text-ink transition-colors duration-200 group-hover:text-sky-600 line-clamp-2"
          >
            {title}
          </h3>
          {excerpt && (
            <p className="text-xs leading-relaxed text-ink-muted line-clamp-2">{excerpt}</p>
          )}
        </div>
        <div className="mt-3 px-1.5 pb-1 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 transition-colors duration-200 group-hover:text-orange-600">
            {t.common.readMore}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <span className="text-[10px] font-medium text-ink-muted/60">Story</span>
        </div>
      </Link>
    </motion.article>
  );
}
