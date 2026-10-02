import { useState } from "react";
import { Play } from "lucide-react";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  thumbnail?: string;
}

/**
 * Shows a static thumbnail with a play button and only mounts the actual
 * YouTube iframe once the user clicks — avoids loading dozens of embeds
 * (and their scripts) on pages with many videos.
 */
export function YouTubeEmbed({ videoId, title, thumbnail }: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const thumb = thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (playing) {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-ink rounded-xl">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden bg-ink"
      aria-label={`Play video: ${title}`}
    >
      <img
        src={thumb}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover transition duration-700 ease-editorial group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-ink/25 transition group-hover:bg-ink/40" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-paper/70 bg-ink/40 backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-gold/90 group-hover:border-gold">
          <Play className="ml-1 h-6 w-6 text-paper" fill="currentColor" />
        </span>
      </span>
    </button>
  );
}
