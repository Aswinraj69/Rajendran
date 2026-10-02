import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStoryBySlug } from "../api/stories";
import { Story } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { estimateReadingMinutes } from "../utils/i18n";
import { StoryCard } from "../components/ui/StoryCard";
import { StoryEngagement } from "../components/ui/StoryEngagement";
import { resolveMediaUrl } from "../utils/media";
import { ArrowLeft, Clock, Calendar, Share2 } from "lucide-react";

export default function StoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t, pick } = useLanguage();
  const [story, setStory] = useState<Story | null>(null);
  const [related, setRelated] = useState<Story[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setStory(null);
    getStoryBySlug(slug)
      .then((res) => {
        setStory(res.data);
        setRelated(res.related);
        document.title = `${pick(res.data.titleMalayalam, res.data.titleEnglish)} — Rajendran Kaipallil`;
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-24 text-center">
        <div className="container-editorial">
          <p className="text-ink/60">Story not found.</p>
          <Link to="/stories" className="mt-4 inline-block text-sm font-semibold text-moss hover:underline">
            &larr; Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-24">
        <div className="container-editorial animate-pulse space-y-4">
          <div className="h-4 w-24 rounded bg-mist"></div>
          <div className="h-10 w-3/4 rounded bg-mist"></div>
          <div className="h-4 w-48 rounded bg-mist"></div>
        </div>
      </div>
    );
  }

  const title = pick(story.titleMalayalam, story.titleEnglish);
  const content = language === "ml" ? story.contentMalayalam : story.contentEnglish;
  const minutes = estimateReadingMinutes(content || "");

  return (
    <article className="min-h-screen bg-white pt-28 pb-24 md:pt-36">
      {/* Top Header */}
      <div className="container-editorial">
        <Link
          to="/stories"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50 hover:text-moss transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {t.common.back}
        </Link>

        <div className="mt-8 max-w-3xl">
          <span className="badge-moss">{story.category}</span>
          <h1
            lang={language}
            className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl font-normal"
          >
            {title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-6 border-y border-mist py-3 text-xs text-ink/60">
            {story.publishedAt && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-moss" />
                {new Date(story.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-moss" />
              {minutes} {t.common.minRead}
            </span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {story.coverImage && (
        <div className="container-editorial mt-8">
          <div className="aspect-[16/7] w-full overflow-hidden rounded-2xl bg-paper-warm shadow-card">
            <img
              src={resolveMediaUrl(story.coverImage)}
              alt={title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/cover-about.jpg";
              }}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Story Content Reading Area */}
      <div className="container-editorial mt-12">
        <div
          lang={language}
          className="reading-area"
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />
        
        {/* Engagement: Likes, Share, Comments */}
        <StoryEngagement
          story={story}
          onStoryUpdate={(updated) => setStory((prev) => (prev ? { ...prev, ...updated } : prev))}
        />
      </div>

      {/* Related Stories */}
      {related.length > 0 && (
        <div className="mt-24 border-t border-mist bg-paper-warm/50 py-20">
          <div className="container-editorial">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-ink">
                {language === "ml" ? "കൂടുതൽ രചനകൾ" : "Related Works"}
              </h2>
              <Link to="/stories" className="text-xs font-semibold text-moss hover:underline">
                View All &rarr;
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s, i) => (
                <StoryCard key={s._id} story={s} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
