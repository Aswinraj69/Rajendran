import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Music,
  Headphones,
  Mic2,
  BookOpen,
  Radio,
  Search,
  Heart,
  Clock,
  Filter,
} from "lucide-react";
import { listAudio } from "../api/audio";
import { AudioTrack, AudioCategory } from "../types";
import { useAudioPlayer } from "../context/AudioPlayerContext";
import { useLanguage } from "../context/LanguageContext";
import { AnimatedText } from "../components/ui/AnimatedText";
import { resolveMediaUrl } from "../utils/media";

/* ── helpers ── */
function formatDuration(secs: number) {
  if (!secs) return "";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const categoryIcons: Record<string, React.ReactNode> = {
  voice: <Mic2 className="h-4 w-4" />,
  music: <Music className="h-4 w-4" />,
  poetry: <BookOpen className="h-4 w-4" />,
  "audio-stories": <Headphones className="h-4 w-4" />,
  podcasts: <Radio className="h-4 w-4" />,
  "background-music": <Music className="h-4 w-4" />,
  other: <Music className="h-4 w-4" />,
};

const categoryLabels: Record<string, string> = {
  all: "All",
  voice: "Voice",
  music: "Music",
  poetry: "Poetry",
  "audio-stories": "Audio Stories",
  podcasts: "Podcasts",
  "background-music": "Background Music",
  other: "Other",
};

const CATEGORIES = ["all", "voice", "music", "poetry", "audio-stories", "podcasts", "other"] as const;

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
});

/* ── AudioCard ── */
function AudioCard({
  track,
  index,
  playlist,
}: {
  track: AudioTrack;
  index: number;
  playlist: AudioTrack[];
}) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudioPlayer();
  const { pick } = useLanguage();

  const isActive = currentTrack?._id === track._id;
  const title = pick(track.titleMalayalam, track.titleEnglish) || "Untitled";
  const desc = pick(track.descriptionMalayalam, track.descriptionEnglish);
  const cover = resolveMediaUrl(track.coverImage || "/logo.jpg");

  function handlePlay() {
    if (isActive) {
      togglePlay();
    } else {
      playTrack(track, playlist);
    }
  }

  return (
    <motion.div
      {...fadeUp(index)}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${
        isActive
          ? "border-sky-400/80 bg-gradient-to-b from-sky-50 to-orange-50/40 shadow-glow-dual ring-2 ring-sky-400/50 -translate-y-1"
          : "border-sky-100 bg-white/90 backdrop-blur-sm hover:border-orange-300 hover:shadow-card-hover hover:-translate-y-1.5"
      }`}
      onClick={handlePlay}
    >
      {/* Cover art */}
      <div className="relative aspect-square overflow-hidden bg-paper-ice border-b border-sky-100/60">
        <img
          src={cover}
          alt={title}
          className={`h-full w-full object-cover transition-transform duration-700 ${
            isActive && isPlaying ? "scale-105" : "scale-100 group-hover:scale-105"
          }`}
        />

        {/* Equalizer bars overlay when playing */}
        <AnimatePresence>
          {isActive && isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs"
            >
              <div className="flex items-end gap-1">
                {[3, 6, 4, 7, 5].map((h, i) => (
                  <motion.span
                    key={i}
                    className="w-1 rounded-full bg-gradient-to-t from-sky-400 to-orange-400"
                    animate={{ height: [`${h * 4}px`, `${h * 7}px`, `${h * 4}px`] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    style={{ height: `${h * 4}px` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play button overlay on hover */}
        {(!isActive || !isPlaying) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-orange-500 shadow-xl text-white">
              <Play className="h-6 w-6 fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Featured badge */}
        {track.featured && (
          <div className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md shadow">
            ★ Featured
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md border border-white/10">
          {categoryIcons[track.category]}
          <span>{categoryLabels[track.category] || track.category}</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3
          className={`font-display text-base font-bold leading-snug line-clamp-2 transition-colors ${
            isActive ? "text-sky-700" : "text-ink group-hover:text-sky-600"
          }`}
        >
          {title}
        </h3>

        <p className="mt-1 text-xs text-ink-muted font-semibold">
          {track.narrator || "Rajendran Kaippallil"}
        </p>

        {desc && (
          <p className="mt-2 text-xs leading-relaxed text-ink-muted line-clamp-2">{desc}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-sky-100/60">
          <div className="flex items-center gap-3 text-[11px] text-ink-muted font-semibold">
            {track.duration ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(track.duration)}
              </span>
            ) : null}
            {(track.playsCount || 0) > 0 && (
              <span className="inline-flex items-center gap-1">
                <Play className="h-3 w-3" />
                {track.playsCount}
              </span>
            )}
          </div>

          {(track.likesCount || 0) > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-orange-500 font-bold">
              <Heart className="h-3 w-3 fill-current" />
              {track.likesCount}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════ */
/*                   AUDIO PAGE                           */
/* ══════════════════════════════════════════════════════ */
export default function AudioPage() {
  const [tracks, setTracks] = useState<AudioTrack[] | null>(null);
  const [category, setCategory] = useState<string>("all");
  const [q, setQ] = useState("");
  const { playTrack, currentTrack, isPlaying, playlist } = useAudioPlayer();
  const { language } = useLanguage();

  useEffect(() => {
    setTracks(null);
    const timeout = setTimeout(() => {
      listAudio({
        limit: 50,
        category: category !== "all" ? (category as AudioCategory) : undefined,
        q: q || undefined,
      })
        .then((res) => setTracks(res.data))
        .catch(() => setTracks([]));
    }, 250);
    return () => clearTimeout(timeout);
  }, [category, q]);

  const featured = tracks?.filter((t) => t.featured) || [];
  const allTracks = tracks || [];

  function playAll() {
    if (allTracks.length === 0) return;
    playTrack(allTracks[0], allTracks);
  }

  return (
    <div className="min-h-screen bg-paper overflow-x-hidden">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 pt-28 pb-20 text-white">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 h-[400px] w-[400px] rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-emerald-400/5 blur-2xl" />
        </div>

        {/* Waveform decoration */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-center gap-0.5 opacity-20">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="w-1 rounded-t-full bg-emerald-400"
              style={{ height: `${Math.sin(i * 0.4) * 30 + 35}px` }}
            />
          ))}
        </div>

        <div className="container-editorial relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Audio & Voice
            </div>

            <AnimatedText
              text={
                language === "ml"
                  ? "ശബ്ദങ്ങൾ, കഥകൾ, സംഗീതം"
                  : "Voices, Stories & Sound"
              }
              fontFamily="dandy"
              type="words"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mx-auto mt-5 max-w-md text-base text-white/60 font-medium font-manrope"
            >
              {language === "ml"
                ? "രാജേന്ദ്രൻ കൈപ്പള്ളിലിന്റെ ശബ്ദകഥകളും, കവിതകളും, ഒരു Spotify-ൽ ആസ്വദിക്കൂ."
                : "Listen to voice readings, poetry, stories and musical pieces — right here."}
            </motion.p>

            {/* Play all button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={playAll}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-emerald-500 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-500/30 hover:bg-emerald-400 hover:scale-105 transition-all duration-200 active:scale-95"
            >
              {currentTrack && isPlaying && playlist.length > 0 ? (
                <>
                  <div className="flex items-end gap-0.5 h-4">
                    {[1, 2, 1.5].map((h, i) => (
                      <span
                        key={i}
                        className="w-0.5 bg-slate-950 rounded-full animate-bounce"
                        style={{ height: `${h * 8}px`, animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                  Now Playing
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-current" />
                  Play All
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── Filters & Search ── */}
      <section className="sticky top-16 z-30 border-b border-mist bg-white/95 backdrop-blur-lg shadow-sm">
        <div className="container-editorial py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <Filter className="h-3.5 w-3.5 shrink-0 text-ink/40" />
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    category === cat
                      ? "bg-moss text-white shadow-sm"
                      : "bg-paper-warm text-ink/70 hover:bg-mist hover:text-ink"
                  }`}
                >
                  {categoryIcons[cat]}
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search audio…"
                className="w-full rounded-full border border-mist bg-paper-warm py-2 pl-9 pr-3 text-xs focus:border-moss focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container-editorial py-16 space-y-16">

        {/* ── Featured Tracks ── */}
        {!q && category === "all" && featured.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="h-5 w-1 rounded-full bg-moss" />
              <h2 className="font-display text-2xl text-ink">
                {language === "ml" ? "ശ്രദ്ധേയ ട്രാക്കുകൾ" : "Featured Tracks"}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {featured.map((track, i) => (
                <AudioCard key={track._id} track={track} index={i} playlist={featured} />
              ))}
            </div>
          </section>
        )}

        {/* ── All Tracks ── */}
        <section>
          {!q && category === "all" && featured.length > 0 && (
            <div className="flex items-center gap-3 mb-8">
              <span className="h-5 w-1 rounded-full bg-gold" />
              <h2 className="font-display text-2xl text-ink">
                {language === "ml" ? "എല്ലാ ട്രാക്കുകളും" : "All Tracks"}
              </h2>
            </div>
          )}

          {/* Loading skeleton */}
          {tracks === null && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-mist bg-white overflow-hidden">
                  <div className="aspect-square bg-mist" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-mist rounded w-3/4" />
                    <div className="h-2.5 bg-mist rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {tracks !== null && tracks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-mist text-ink/30 mb-6">
                <Headphones className="h-10 w-10" />
              </div>
              <h3 className="font-display text-xl text-ink">No audio found</h3>
              <p className="mt-2 text-sm text-ink/50">
                {q ? `No results for "${q}"` : "No audio tracks in this category yet."}
              </p>
            </motion.div>
          )}

          {/* Grid */}
          {tracks !== null && tracks.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {allTracks.map((track, i) => (
                <AudioCard key={track._id} track={track} index={i} playlist={allTracks} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
