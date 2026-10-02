import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  X,
  ChevronUp,
  ChevronDown,
  Music,
  Disc,
  ListMusic,
  Gauge,
} from "lucide-react";
import { useAudioPlayer } from "../../context/AudioPlayerContext";
import { useLanguage } from "../../context/LanguageContext";
import { resolveMediaUrl } from "../../utils/media";
import { likeAudioTrack } from "../../api/audio";
import toast from "react-hot-toast";

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function SpotifyAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    playlist,
    isExpanded,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setSpeed,
    toggleExpand,
    setIsExpanded,
    nextTrack,
    prevTrack,
    closePlayer,
  } = useAudioPlayer();

  const { pick, language } = useLanguage();
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    if (currentTrack) {
      setLikesCount(currentTrack.likesCount || 0);
      const storageKey = `rk_audio_liked_${currentTrack._id}`;
      setIsLiked(localStorage.getItem(storageKey) === "true");
    }
  }, [currentTrack]);

  if (!currentTrack) return null;

  const title = pick(currentTrack.titleMalayalam, currentTrack.titleEnglish) || "Audio Track";
  const description = pick(currentTrack.descriptionMalayalam, currentTrack.descriptionEnglish);
  const cover = resolveMediaUrl(currentTrack.coverImage || "/logo.jpg");
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleLike = async () => {
    if (!currentTrack) return;
    const action = isLiked ? "unlike" : "like";
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount((prev) => Math.max(0, prev + (newLiked ? 1 : -1)));

    try {
      localStorage.setItem(`rk_audio_liked_${currentTrack._id}`, newLiked ? "true" : "false");
      const res = await likeAudioTrack(currentTrack._id, action);
      setLikesCount(res.likesCount);
      toast.success(newLiked ? "Added to liked audio!" : "Removed from liked audio");
    } catch {
      toast.error("Failed to update like status");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `Listen to "${title}" by Rajendran Kaippallil`, url });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          1. SPOTIFY MINI FLOATING BOTTOM PLAYER BAR
          ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.aside
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed bottom-4 left-3 right-3 sm:left-6 sm:right-6 md:left-auto md:right-8 md:w-[460px] z-[90]"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950/90 p-3 sm:p-3.5 shadow-glow-dual border border-sky-400/40 backdrop-blur-xl text-white">
              {/* Progress Line on top edge */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 via-sky-500 to-orange-500 transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                {/* Album Cover with Rotating Disc */}
                <div
                  onClick={toggleExpand}
                  className="group relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-black shadow-md border border-white/10"
                >
                  <img
                    src={cover}
                    alt={title}
                    className={`h-full w-full object-cover transition-transform duration-700 ${
                      isPlaying ? "scale-105" : ""
                    }`}
                  />
                  {/* Vinyl Disc Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                    <ChevronUp className="h-5 w-5 text-sky-400" />
                  </div>
                </div>

                {/* Track Info */}
                <div
                  onClick={toggleExpand}
                  className="flex-1 min-w-0 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-sm font-bold truncate text-white hover:text-sky-400 transition">
                      {title}
                    </h4>
                    {/* Equalizer Bars */}
                    {isPlaying && (
                      <div className="flex items-end gap-0.5 h-3 shrink-0">
                        <span className="w-0.5 bg-sky-400 animate-bounce h-2" />
                        <span className="w-0.5 bg-sky-400 animate-bounce h-3 delay-75" />
                        <span className="w-0.5 bg-orange-400 animate-bounce h-1.5 delay-150" />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-sky-200/70 truncate font-medium">
                    {currentTrack.narrator || "Rajendran Kaippallil"}
                  </p>
                </div>

                {/* Quick Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={togglePlay}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-orange-500 text-white hover:scale-105 transition active:scale-95 shadow-glow-sky"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 fill-current" />
                    ) : (
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={toggleExpand}
                    className="p-1.5 text-white/70 hover:text-white transition rounded-full hover:bg-white/10"
                    title="Expand Full Spotify Player"
                  >
                    <ChevronUp className="h-5 w-5" />
                  </button>

                  <button
                    onClick={closePlayer}
                    className="p-1.5 text-white/50 hover:text-red-400 transition rounded-full hover:bg-white/10"
                    title="Close Player"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════
          2. EXPANDED SPOTIFY PLAYER FULL POPUP MODAL
          ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 50 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 sm:p-6 backdrop-blur-2xl text-white overflow-y-auto"
          >
            {/* Background Ambient Glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-sky-500/20 blur-[130px]" />
              <div className="absolute top-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-orange-500/20 blur-[120px]" />
            </div>

            <div className="relative w-full max-w-lg rounded-3xl border border-sky-400/30 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 sm:p-8 shadow-2xl overflow-hidden">
              {/* Top Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                  title="Minimize"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>

                <div className="text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
                    PLAYING FROM AUDIO & VOICE
                  </span>
                  <p className="text-xs text-white/60 font-medium">Rajendran Kaippallil Studio</p>
                </div>

                <button
                  onClick={closePlayer}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition"
                  title="Close Player"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Album Art with Vinyl Spinning Effect */}
              <div className="relative my-8 mx-auto flex items-center justify-center">
                <div className="relative aspect-square w-56 sm:w-64 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-emerald-500/30 group">
                  <img
                    src={cover}
                    alt={title}
                    className={`h-full w-full object-cover transition-transform duration-700 ${
                      isPlaying ? "scale-105" : ""
                    }`}
                  />

                  {/* Rotating Record Vinyl Badge */}
                  <div
                    className={`absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-emerald-400 backdrop-blur-md shadow-lg ${
                      isPlaying ? "animate-spin-slow" : ""
                    }`}
                  >
                    <Disc className="h-6 w-6" />
                  </div>
                </div>
              </div>

              {/* Track Title & Author Info */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white line-clamp-2 leading-tight">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-emerald-300/80 font-medium">
                    {currentTrack.narrator || "Rajendran Kaippallil"}
                  </p>
                  {description && (
                    <p className="mt-1.5 text-xs text-white/60 line-clamp-2 leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>

                {/* Like Button */}
                <button
                  type="button"
                  onClick={handleLike}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition ${
                    isLiked
                      ? "bg-red-500/20 text-red-500 ring-1 ring-red-500/40"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-current text-red-500" : ""}`} />
                </button>
              </div>

              {/* Progress Seek Bar */}
              <div className="mt-6 space-y-2">
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newPercent = clickX / rect.width;
                    seek(newPercent * duration);
                  }}
                  className="group relative h-2 w-full cursor-pointer rounded-full bg-white/15"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-orange-500 transition-all duration-150 relative"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-glow-sky opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </div>

                <div className="flex justify-between text-xs text-white/50 font-mono font-medium">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Spotify Playback Controls */}
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => seek(Math.max(0, currentTime - 10))}
                  className="p-2 text-white/70 hover:text-white transition"
                  title="Rewind 10s"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>

                <button
                  onClick={prevTrack}
                  className="p-2 text-white/70 hover:text-white transition"
                  title="Previous Track"
                >
                  <SkipBack className="h-6 w-6" />
                </button>

                <button
                  onClick={togglePlay}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-orange-500 text-white hover:scale-105 transition shadow-glow-sky active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8 fill-current" />
                  ) : (
                    <Play className="h-8 w-8 fill-current ml-1" />
                  )}
                </button>

                <button
                  onClick={nextTrack}
                  className="p-2 text-white/70 hover:text-white transition"
                  title="Next Track"
                >
                  <SkipForward className="h-6 w-6" />
                </button>

                <button
                  onClick={() => seek(Math.min(duration, currentTime + 10))}
                  className="p-2 text-white/70 hover:text-white transition"
                  title="Forward 10s"
                >
                  <RotateCw className="h-5 w-5" />
                </button>
              </div>

              {/* Extra Spotify Options Bar (Volume, Speed, Share) */}
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-white/70">
                {/* Volume Controls */}
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="hover:text-white transition">
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4 text-red-400" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-sky-400" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="h-1 w-20 accent-sky-500 cursor-pointer"
                  />
                </div>

                {/* Speed Toggle */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu((prev) => !prev)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition font-semibold"
                  >
                    <Gauge className="h-3.5 w-3.5 text-sky-400" />
                    <span>{playbackRate}x</span>
                  </button>
                  {showSpeedMenu && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded-xl bg-slate-900 border border-white/10 shadow-xl p-1 flex flex-col gap-1 z-20">
                      {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => {
                            setSpeed(rate);
                            setShowSpeedMenu(false);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            playbackRate === rate
                              ? "bg-gradient-to-r from-sky-500 to-orange-500 text-white"
                              : "hover:bg-white/10"
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 text-white/70 hover:text-white transition"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
