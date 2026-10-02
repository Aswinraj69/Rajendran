import { useState, useEffect } from "react";
import {
  Youtube,
  ThumbsUp,
  MessageSquare,
  Share2,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  Play,
  Pin,
  X,
} from "lucide-react";
import { YouTubePost } from "../../types";
import { listYouTubePosts, syncYouTubeChannel } from "../../api/youtube";
import { useLanguage } from "../../context/LanguageContext";
import toast from "react-hot-toast";

interface CommunityFeedProps {
  initialPosts?: YouTubePost[];
  limit?: number;
  showSyncButton?: boolean;
}

export function YouTubeCommunityFeed({
  initialPosts,
  limit = 8,
  showSyncButton = true,
}: CommunityFeedProps) {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<YouTubePost[]>(initialPosts || []);
  const [loading, setLoading] = useState(!initialPosts);
  const [syncing, setSyncing] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeVideoId) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveVideoId(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideoId]);

  useEffect(() => {
    if (!initialPosts) {
      loadPosts();
    }
  }, [initialPosts]);

  async function loadPosts() {
    try {
      setLoading(true);
      const res = await listYouTubePosts({ limit });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    try {
      setSyncing(true);
      const res = await syncYouTubeChannel();
      toast.success(res.message || "Synced latest from YouTube!");
      await loadPosts();
    } catch (err) {
      toast.error("Failed to sync with YouTube");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Top Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-mist pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-sm font-display text-sm font-bold">
            RK
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-semibold text-ink text-sm">RAJENDRAN KAIPPALLIL</h4>
              <CheckCircle className="h-3.5 w-3.5 text-gray-500 fill-gray-500 text-white" />
            </div>
            <p className="text-xs text-ink/50">@rajendran131 · Community Posts & Updates</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showSyncButton && (
            <button
              onClick={handleSync}
              disabled={syncing}
              title="Sync latest posts from YouTube"
              className="inline-flex items-center gap-1.5 rounded-full border border-mist bg-white px-3 py-1.5 text-xs font-medium text-ink/70 hover:border-moss/40 hover:text-moss transition shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin text-moss" : ""}`} />
              {syncing ? "Syncing..." : "Sync YouTube"}
            </button>
          )}
          <a
            href="https://www.youtube.com/@rajendran131/community"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold hover:bg-red-100 transition border border-red-200"
          >
            <Youtube className="h-3.5 w-3.5 fill-red-600" />
            <span>YouTube Community</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-2xl border border-mist bg-white p-6 animate-pulse space-y-3">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-mist" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-mist rounded" />
                  <div className="h-3 w-20 bg-mist rounded" />
                </div>
              </div>
              <div className="h-16 bg-mist rounded-xl" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-mist p-12 text-center">
          <Youtube className="mx-auto h-12 w-12 text-red-500/30" />
          <p className="mt-3 text-sm text-ink/60">No YouTube posts loaded yet.</p>
          <button
            onClick={handleSync}
            className="mt-4 rounded-lg bg-moss px-4 py-2 text-xs font-medium text-white hover:bg-moss-light"
          >
            Sync from YouTube Channel
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPlayVideo={(videoId) => setActiveVideoId(videoId)}
            />
          ))}
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideoId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-md animate-fade-up"
          onClick={() => setActiveVideoId(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-mist/80"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar with Close button */}
            <div className="flex items-center justify-between border-b border-mist px-4 py-3 sm:px-6 bg-paper-warm/70">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <Youtube className="h-4 w-4 fill-red-600" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-moss">
                  YouTube Video
                </span>
              </div>
              <button
                onClick={() => setActiveVideoId(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white hover:bg-mist text-ink transition shadow-sm border border-mist hover:scale-105"
                title="Close (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 16:9 Embed with height constraint */}
            <div className="relative aspect-video w-full max-h-[52vh] bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&enablejsapi=1`}
                title="YouTube Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="h-full w-full"
              />
            </div>

            {/* Bottom action bar */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 bg-paper-warm/40 border-t border-mist">
              <button
                type="button"
                onClick={() => setActiveVideoId(null)}
                className="rounded-lg border border-mist bg-white px-3.5 py-1.5 text-xs font-medium text-ink-soft hover:bg-paper-warm transition"
              >
                Close
              </button>
              <a
                href={`https://www.youtube.com/watch?v=${activeVideoId}`}
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
      )}
    </div>
  );
}

function PostCard({
  post,
  onPlayVideo,
}: {
  post: YouTubePost;
  onPlayVideo: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likesCount || 12);

  function toggleLike() {
    if (liked) {
      setLikes((l) => Math.max(0, l - 1));
      setLiked(false);
    } else {
      setLikes((l) => l + 1);
      setLiked(true);
    }
  }

  function handleShare() {
    if (navigator.share && post.youtubeUrl) {
      navigator.share({
        title: post.videoTitle || "Post by Rajendran Kaippallil",
        url: post.youtubeUrl,
      });
    } else if (post.youtubeUrl) {
      navigator.clipboard.writeText(post.youtubeUrl);
      toast.success("Link copied to clipboard!");
    }
  }

  // Format hashtags
  const content = post.content || "";
  const isLong = content.length > 280;
  const displayContent = expanded || !isLong ? content : content.slice(0, 280) + "…";

  return (
    <article className="rounded-2xl border border-mist bg-white p-5 shadow-card transition duration-200 hover:border-moss/30 hover:shadow-card-hover">
      {/* Post Author Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white font-display text-sm font-bold shadow-sm">
            RK
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-ink text-sm">RAJENDRAN KAIPPALLIL</span>
              <CheckCircle className="h-3.5 w-3.5 text-gray-500 fill-gray-500 text-white" />
              {post.pinned && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold-pale px-2 py-0.5 text-[10px] font-semibold text-gold-muted">
                  <Pin className="h-2.5 w-2.5" /> Pinned
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-ink/50">
              <span>@rajendran131</span>
              <span>·</span>
              <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}</span>
            </div>
          </div>
        </div>

        <a
          href={post.youtubeUrl || `https://www.youtube.com/@rajendran131`}
          target="_blank"
          rel="noreferrer"
          className="text-ink/40 hover:text-red-600 transition p-1"
          title="Open on YouTube"
        >
          <Youtube className="h-5 w-5" />
        </a>
      </div>

      {/* Post Text Body */}
      <div className="mt-3.5 text-sm text-ink/85 leading-relaxed whitespace-pre-line font-sans">
        {displayContent.split(/(\s+)/).map((word, i) => {
          if (word.startsWith("#")) {
            return (
              <span key={i} className="text-blue-600 font-medium hover:underline cursor-pointer">
                {word}
              </span>
            );
          }
          return word;
        })}
      </div>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1.5 text-xs font-semibold text-moss hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {/* Attached Media Video Card */}
      {post.youtubeVideoId && (
        <div
          onClick={() => onPlayVideo(post.youtubeVideoId!)}
          className="group mt-4 overflow-hidden rounded-xl border border-mist bg-paper-cool cursor-pointer transition hover:border-moss/40"
        >
          <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
            <img
              src={`https://img.youtube.com/vi/${post.youtubeVideoId}/hqdefault.jpg`}
              alt={post.videoTitle || "Video"}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg group-hover:scale-110 transition">
                <Play className="h-5 w-5 fill-white ml-0.5" />
              </div>
            </div>
            <span className="absolute top-2.5 right-2.5 rounded-full bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
              Watch on YouTube
            </span>
          </div>

          {post.videoTitle && (
            <div className="p-3 bg-white border-t border-mist flex items-center justify-between">
              <p className="font-medium text-xs text-ink line-clamp-1 group-hover:text-moss transition">
                {post.videoTitle}
              </p>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ink/40 ml-2" />
            </div>
          )}
        </div>
      )}

      {/* YouTube Action Row (Like, Comment, Share) */}
      <div className="mt-4 flex items-center gap-6 border-t border-mist/60 pt-3 text-xs text-ink/60">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 transition ${
            liked ? "text-red-600 font-semibold" : "hover:text-ink"
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${liked ? "fill-red-600" : ""}`} />
          <span>{likes}</span>
        </button>

        <a
          href={post.youtubeUrl || "https://www.youtube.com/@rajendran131/community"}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 hover:text-ink transition"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Comment on YouTube</span>
        </a>

        <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-ink transition ml-auto">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
}
