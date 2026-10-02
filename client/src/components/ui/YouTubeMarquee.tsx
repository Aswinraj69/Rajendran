import { useEffect, useState } from "react";
import { Play, Youtube, ExternalLink, X, Pause } from "lucide-react";
import { Video } from "../../types";
import { listVideos } from "../../api/videos";
import { useLanguage } from "../../context/LanguageContext";

const defaultSampleVideos: Video[] = [
  {
    _id: "sample-1",
    title: "സാഹിത്യവും വർത്തമാനവും | Literary Dialogue with Rajendran Kaipallil",
    description: "An in-depth conversation exploring modern Malayalam literature and cultural transitions.",
    youtubeUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    youtubeVideoId: "kJQP7kiw5Fk",
    category: "interviews",
    featured: true,
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "sample-2",
    title: "കഥയുടെ വഴികൾ | Storytelling & The Creative Writing Process",
    description: "Reflections on how life experiences transform into short stories and narratives.",
    youtubeUrl: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    youtubeVideoId: "fJ9rUzIMcZQ",
    category: "stories",
    featured: true,
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "sample-3",
    title: "തിരക്കഥാ രചനയുടെ രസതന്ത്രം | Behind the Screenplay",
    description: "Crafting characters, conflicts, and visuals for cinema and screen media.",
    youtubeUrl: "https://www.youtube.com/watch?v=L_LUpnjgPso",
    youtubeVideoId: "L_LUpnjgPso",
    category: "script",
    featured: true,
    publishedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "sample-4",
    title: "ഗ്രാമഭംഗിയും ഓർമ്മകളും | Nostalgia & Rural Kerala in Literature",
    description: "A deep dive into how memories of monsoon, village paths, and community shape prose.",
    youtubeUrl: "https://www.youtube.com/watch?v=ZbZSe6N_BXs",
    youtubeVideoId: "ZbZSe6N_BXs",
    category: "talks",
    featured: false,
    publishedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

import { YouTubeCommunityFeed } from "./YouTubeCommunityFeed";

interface YouTubeMarqueeProps {
  videos?: Video[];
  channelUrl?: string;
  channelName?: string;
}

export function YouTubeMarquee({
  videos: propVideos,
  channelUrl = "https://www.youtube.com/@rajendran131",
  channelName = "@rajendran131",
}: YouTubeMarqueeProps) {
  const { language } = useLanguage();
  const [videos, setVideos] = useState<Video[]>(propVideos || []);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<"normal" | "slow">("normal");
  const [activeTab, setActiveTab] = useState<"marquee" | "community">("marquee");

  useEffect(() => {
    if (propVideos && propVideos.length > 0) {
      setVideos(propVideos);
      return;
    }
    listVideos({ limit: 20 })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setVideos(res.data);
        } else {
          setVideos(defaultSampleVideos);
        }
      })
      .catch(() => {
        setVideos(defaultSampleVideos);
      });
  }, [propVideos]);

  // If there are few videos, duplicate to make a rich infinite loop
  const rawList = videos.length > 0 ? videos : [];
  let displayList: Video[] = [];
  if (rawList.length > 0) {
    displayList = [...rawList];
    while (displayList.length < 8) {
      displayList = [...displayList, ...rawList];
    }
  }

  // Animation duration based on speed and card count
  const duration = speed === "slow" ? "50s" : "32s";

  return (
    <section className="relative overflow-hidden py-16 bg-white border-y border-mist">
      {/* Header bar */}
      <div className="container-editorial mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-sm border border-red-100">
              <Youtube className="h-6 w-6 fill-red-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                  Official YouTube Channel
                </span>
                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                  17.1K Subscribers
                </span>
                <span className="hidden md:inline-flex items-center rounded-full bg-paper-warm px-2 py-0.5 text-[10px] font-medium text-ink/70 border border-mist">
                  522+ Videos
                </span>
              </div>
              <h3 className="mt-0.5 font-display text-2xl text-ink font-normal">
                {language === "ml" ? "രാജേന്ദ്രൻ കൈപ്പള്ളിൽ യൂട്യൂബ്" : "YouTube Feed & Community"}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Switcher: Videos Reel vs Community Posts */}
            <div className="flex items-center rounded-full border border-mist bg-paper-warm p-0.5">
              <button
                onClick={() => setActiveTab("marquee")}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  activeTab === "marquee"
                    ? "bg-white text-ink shadow-sm"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                Videos Reel
              </button>
              <button
                onClick={() => setActiveTab("community")}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  activeTab === "community"
                    ? "bg-white text-ink shadow-sm"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                Community Posts
              </button>
            </div>

            {/* Visit Channel Button */}
            <a
              href={channelUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition"
            >
              <Youtube className="h-3.5 w-3.5 fill-white" />
              <span>{channelName}</span>
              <ExternalLink className="h-3 w-3 opacity-80" />
            </a>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "community" ? (
        <div className="container-editorial pt-2">
          <YouTubeCommunityFeed />
        </div>
      ) : (
        <>
          {/* Marquee Track with side fade mask */}
          <div className="relative w-full overflow-hidden marquee-mask">
            {displayList.length === 0 ? (
              <div className="py-8 text-center text-xs text-ink/40">Loading YouTube feed…</div>
            ) : (
              <div
                className={`animate-marquee ${isPaused ? "animate-marquee-paused" : ""}`}
                style={{ animationDuration: duration }}
              >
                {/* First sequence */}
                <div className="flex shrink-0 gap-6 pr-6">
                  {displayList.map((video, idx) => (
                    <MarqueeCard
                      key={`first-${video._id || idx}-${idx}`}
                      video={video}
                      onSelect={() => setActiveVideo(video)}
                    />
                  ))}
                </div>
                {/* Duplicated sequence for seamless infinite scroll */}
                <div className="flex shrink-0 gap-6 pr-6" aria-hidden="true">
                  {displayList.map((video, idx) => (
                    <MarqueeCard
                      key={`second-${video._id || idx}-${idx}`}
                      video={video}
                      onSelect={() => setActiveVideo(video)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Switch Hint */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setActiveTab("community")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-moss hover:underline"
            >
              <span>View YouTube Community discussions & written posts</span> &rarr;
            </button>
          </div>
        </>
      )}

      {/* Video Modal Player */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </section>
  );
}

function MarqueeCard({ video, onSelect }: { video: Video; onSelect: () => void }) {
  const thumb =
    video.thumbnail ||
    (video.youtubeVideoId
      ? `https://img.youtube.com/vi/${video.youtubeVideoId}/mqdefault.jpg`
      : "");

  return (
    <div
      onClick={onSelect}
      className="group relative flex w-72 sm:w-80 cursor-pointer flex-col overflow-hidden rounded-2xl border border-mist bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-moss/40 hover:shadow-card-hover"
    >
      {/* 16:9 Thumbnail frame */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {thumb ? (
          <img
            src={thumb}
            alt={video.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-paper-warm text-ink/30">
            <Youtube className="h-10 w-10 opacity-30" />
          </div>
        )}

        {/* Dark vignette gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 transition-opacity group-hover:from-black/70" />

        {/* YouTube Red Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-115">
            <Play className="h-5 w-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Category Pill */}
        {video.category && (
          <span className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            {video.category}
          </span>
        )}

        {/* YouTube pill top-right */}
        <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-red-600">
          <Youtube className="h-3 w-3 fill-red-600" />
          YouTube
        </span>
      </div>

      {/* Info content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h4 className="font-display text-base text-ink line-clamp-2 leading-snug group-hover:text-moss transition-colors">
            {video.title}
          </h4>
          {video.description && (
            <p className="mt-1 text-xs text-ink/60 line-clamp-1">
              {video.description}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-mist/60 pt-2.5 text-[11px] text-ink/50">
          <span>{video.publishedAt ? new Date(video.publishedAt).toLocaleDateString() : "Watch on YouTube"}</span>
          <span className="font-semibold text-moss group-hover:underline inline-flex items-center gap-1">
            Play Video &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-md animate-fade-up"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-mist/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar with visible Close button */}
        <div className="flex items-center justify-between border-b border-mist px-4 py-3 sm:px-6 bg-paper-warm/70">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Youtube className="h-4 w-4 fill-red-600" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-moss">
              {video.category || "YouTube"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white hover:bg-mist text-ink transition shadow-sm border border-mist hover:scale-105"
            title="Close (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 16:9 Embed with height constraint */}
        <div className="relative aspect-video w-full max-h-[48vh] bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeVideoId}?autoplay=1&rel=0&enablejsapi=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="h-full w-full"
          />
        </div>

        {/* Footer info & buttons */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <h3 className="font-display text-lg sm:text-xl text-ink leading-snug line-clamp-2">
            {video.title}
          </h3>
          {video.description && (
            <p className="mt-1.5 text-xs sm:text-sm text-ink/70 max-h-16 overflow-y-auto leading-relaxed">
              {video.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-mist">
            <span className="text-xs text-ink/50">
              {video.publishedAt && new Date(video.publishedAt).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-mist bg-paper-cool px-3.5 py-1.5 text-xs font-medium text-ink-soft hover:bg-paper-warm transition"
              >
                Close
              </button>
              <a
                href={`https://www.youtube.com/watch?v=${video.youtubeVideoId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition shadow-sm"
              >
                <Youtube className="h-3.5 w-3.5 fill-white" />
                Watch on YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
