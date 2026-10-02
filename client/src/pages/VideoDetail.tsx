import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Youtube } from "lucide-react";
import { getVideoById } from "../api/videos";
import { Video } from "../types";
import { YouTubeEmbed } from "../components/ui/YouTubeEmbed";
import { useLanguage } from "../context/LanguageContext";

export default function VideoDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [video, setVideo] = useState<Video | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    getVideoById(id)
      .then((v) => {
        setVideo(v);
        document.title = `${v.title} — Rajendran Kaipallil`;
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-24 text-center">
        <div className="container-editorial">
          <p className="text-ink/60">Video not found.</p>
          <Link to="/videos" className="mt-4 inline-block text-sm font-semibold text-moss hover:underline">
            &larr; Back to Videos
          </Link>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-24">
        <div className="container-editorial animate-pulse space-y-4">
          <div className="h-4 w-24 rounded bg-mist"></div>
          <div className="aspect-video w-full rounded-2xl bg-mist"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-24 md:pt-36">
      <div className="container-editorial">
        <Link
          to="/videos"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50 hover:text-moss transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {t.common.back}
        </Link>

        {/* Video Player */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-mist bg-ink shadow-card">
          <YouTubeEmbed videoId={video.youtubeVideoId} title={video.title} thumbnail={video.thumbnail} />
        </div>

        {/* Metadata & Description */}
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-mist pb-6">
            <div>
              <span className="badge-moss">{video.category}</span>
              <h1 className="mt-3 font-display text-3xl text-ink md:text-4xl">
                {video.title}
              </h1>
            </div>

            <a
              href={`https://www.youtube.com/watch?v=${video.youtubeVideoId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-red-700 shadow-sm"
            >
              <Youtube className="h-4 w-4" />
              Watch on YouTube
            </a>
          </div>

          {video.description && (
            <div className="mt-8 max-w-3xl leading-relaxed text-ink/80">
              <p className="whitespace-pre-line text-base">{video.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
