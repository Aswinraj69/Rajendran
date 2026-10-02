import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Film, Mic2, Pen, Headphones, Play, Pause, Music } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useSiteContent } from "../context/SiteContentContext";
import { useAudioPlayer } from "../context/AudioPlayerContext";
import { listStories } from "../api/stories";
import { listVideos } from "../api/videos";
import { listAudio } from "../api/audio";
import { Story, Video, AudioTrack } from "../types";
import { StoryCard } from "../components/ui/StoryCard";
import { VideoCard } from "../components/ui/VideoCard";
import { SectionHeading } from "../components/ui/SectionHeading";
import { CardSkeletonGrid, EmptyState } from "../components/ui/Skeletons";
import { YouTubeMarquee } from "../components/ui/YouTubeMarquee";
import { AnimatedText } from "../components/ui/AnimatedText";
import { CascadingText } from "../components/ui/CascadingText";
import { resolveMediaUrl } from "../utils/media";
import PortfolioHero from "../components/ui/portfolio-hero";
import { MarketTickerBar } from "../components/ui/MarketTickerBar";
import { HoroscopeTeaserBanner } from "../components/ui/HoroscopeTeaserBanner";

/* ── animation helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

const creatorRoles = [
  { icon: Pen, label: "Writer" },
  { icon: Film, label: "Scriptwriter" },
  { icon: BookOpen, label: "Storyteller" },
  { icon: Mic2, label: "Creator" },
];

export default function Home() {
  const { t, language, pick } = useLanguage();
  const { c, raw } = useSiteContent();
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudioPlayer();
  const [stories, setStories] = useState<Story[] | null>(null);
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [audios, setAudios] = useState<AudioTrack[] | null>(null);

  useEffect(() => {
    listStories({ page: 1 })
      .then((res) => setStories(res.data.slice(0, 3)))
      .catch(() => setStories([]));
    listVideos({ page: 1 })
      .then((res) => setVideos(res.data.slice(0, 3)))
      .catch(() => setVideos([]));
    listAudio({ limit: 6 })
      .then((res) => setAudios(res.data))
      .catch(() => setAudios([]));
  }, []);

  return (
    <div className="overflow-x-hidden bg-paper">

      {/* ══════════════════════════════════════════
          HERO — Portfolio Hero Component with BlurText & Capsule Portrait
          ══════════════════════════════════════════ */}
      <PortfolioHero
        firstName="RAJENDRAN"
        lastName="KAIPPALLIL"
        tagline={
          language === "ml"
            ? "വാക്കുകൾകൊണ്ടും ദൃശ്യങ്ങൾകൊണ്ടും സാംസ്കാരിക ലോകം തീർക്കുന്ന സർഗ്ഗാത്മക ജീവിതം."
            : "Crafting narratives that move between the page, screen, and human emotions."
        }
        avatarUrl="/rajendran-hero.jpg"
        signature="RK"
      />

      {/* ══════════════════════════════════════════
          LIVE BULLION & MARKET TICKER BAR
          ══════════════════════════════════════════ */}
      <MarketTickerBar />

      {/* ═════════════════════════════════════════════════════════════════
          ABOUT THE CREATOR — Clean Editorial Glass Section
          ═════════════════════════════════════════════════════════════════ */}
      <section className="relative border-t border-sky-100/60 bg-gradient-to-b from-paper via-paper-ice/30 to-paper py-20 lg:py-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 -left-32 h-[450px] w-[450px] rounded-full bg-sky-200/25 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-[400px] w-[400px] rounded-full bg-orange-200/25 blur-3xl" />
        </div>

        <div className="container-editorial relative z-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">

            {/* Left: Portrait Emblem Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <div className="group relative overflow-hidden rounded-3xl border border-sky-200/80 bg-white/90 backdrop-blur-md p-6 shadow-2xl transition-all duration-500 hover:border-orange-300 hover:shadow-glow-dual">
                {/* Glow behind portrait */}
                <div className="absolute -inset-10 rounded-full bg-gradient-to-tr from-sky-400/20 via-orange-400/20 to-transparent blur-2xl opacity-70 group-hover:opacity-100 transition duration-700 -z-10" />

                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-t from-sky-100/60 via-paper-ice to-white flex items-center justify-center border border-sky-100 shadow-inner">
                  <img
                    src="/rajendran-about.jpg"
                    alt="Rajendran Kaippallil"
                    className="h-full w-full object-cover object-[center_20%] drop-shadow-md transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-md px-3 py-1.5 shadow-md border border-sky-100">
                    <span className="h-2 w-2 rounded-full bg-gradient-to-r from-sky-400 to-orange-400 animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink font-manrope">
                      Official Author
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <h3 className="font-roneva text-2xl md:text-3xl text-ink font-bold">
                    {raw("about.card_name", "Rajendran Kaippallil")}
                  </h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gradient-sky-orange font-manrope">
                    {c(
                      "home.sticky_role",
                      language === "ml"
                        ? "എഴുത്തുകാരൻ · കഥാകാരൻ · തിരക്കഥാകൃത്ത്"
                        : "Writer · Storyteller · Screenwriter"
                    )}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-sky-100 pt-5 text-center font-manrope">
                  <div className="p-1">
                    <p className="font-roneva text-xl font-bold text-sky-600">17.1K</p>
                    <p className="text-[10px] uppercase font-semibold tracking-wider text-ink-muted">Subscribers</p>
                  </div>
                  <div className="p-1 border-x border-sky-100">
                    <p className="font-roneva text-xl font-bold text-orange-500">520+</p>
                    <p className="text-[10px] uppercase font-semibold tracking-wider text-ink-muted">Videos</p>
                  </div>
                  <div className="p-1">
                    <p className="font-roneva text-xl font-bold text-sky-600">970K+</p>
                    <p className="text-[10px] uppercase font-semibold tracking-wider text-ink-muted">Views</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Narrative Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full bg-sky-50/80 border border-sky-200/60 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-sky-700 font-manrope shadow-sm"
              >
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-sky-400 to-orange-400 animate-pulse" />
                {language === "ml" ? "രാജേന്ദ്രൻ കൈപ്പള്ളിൽ ആര്?" : "Who is Rajendran Kaippallil?"}
              </motion.div>

              <div className="space-y-3">
                <CascadingText
                  text={
                    language === "ml"
                      ? "വാക്കുകൾകൊണ്ടും ദൃശ്യങ്ങൾകൊണ്ടും സാംസ്കാരിക ലോകം തീർക്കുന്ന എഴുത്തുകാരൻ"
                      : "Crafting narratives that move between the page, screen, and human emotions."
                  }
                  fontFamily="dandy"
                  mode="words"
                  staggerDelay={0.06}
                  initialDelay={0.1}
                  className="text-2xl sm:text-3xl md:text-[34px] lg:text-[38px] text-ink leading-snug md:leading-tight font-bold tracking-tight"
                />

                <motion.div
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="h-1 w-14 rounded-full bg-gradient-to-r from-sky-500 via-sky-400 to-orange-400"
                />
              </div>

              <div className="pt-1">
                <CascadingText
                  text={c(
                    "home.sticky_intro_p1",
                    language === "ml"
                      ? "നാട്ടിൻപുറങ്ങളുടെ ഗ്രാമീണ തനിമയും മനുഷ്യബന്ധങ്ങളിലെ ആഴമേറിയ വൈകാരിക തലങ്ങളും വാക്കുകളിലേക്കും ദൃശ്യങ്ങളിലേക്കും ആവാഹിക്കുകയാണ് രാജേന്ദ്രൻ കൈപ്പള്ളിലിന്റെ സർഗ്ഗാത്മക ജീവിതം."
                      : "Rooted in the cultural essence and countryside memories of Kerala, Rajendran Kaippallil brings alive stories of human relationships, folklore, and quiet reflections."
                  )}
                  fontFamily="manrope"
                  mode="words"
                  staggerDelay={0.025}
                  initialDelay={0.25}
                  className="text-base sm:text-lg leading-relaxed text-ink-soft/90 font-medium tracking-normal"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="card-glass p-5 transition">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 mb-3">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-ink text-base font-roneva">
                    {language === "ml" ? "സാഹിത്യം & കഥകൾ" : "Fiction & Short Stories"}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted font-manrope">
                    {language === "ml"
                      ? "മനുഷ്യബന്ധങ്ങളുടെ വൈകാരിക സങ്കീർണ്ണതകൾ പകർത്തുന്ന കഥകളും രചനകളും."
                      : "Evocative short stories and narratives capturing subtle human emotions."}
                  </p>
                </div>

                <div className="card-glass p-5 transition">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 mb-3">
                    <Film className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-ink text-base font-roneva">
                    {language === "ml" ? "തിരക്കഥ & സിനിമ" : "Screenwriting & Cinema"}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted font-manrope">
                    {language === "ml"
                      ? "ഹ്രസ്വചിത്രങ്ങൾക്കും ദൃശ്യമാധ്യമങ്ങൾക്കുമുള്ള തിരക്കഥ നിർമ്മിതി."
                      : "Screenplays, short films, and visual storytelling for digital media."}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Link
                  to="/about"
                  data-cursor="Read"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-7 py-3.5 text-sm font-bold text-white shadow-glow-sky hover:from-sky-600 hover:to-orange-500 hover:scale-[1.02] active:scale-[0.98] transition duration-200 font-manrope"
                >
                  <span>{language === "ml" ? "വിശദമായ വിവരങ്ങൾ" : "Read Full Biography"}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          YOUTUBE MARQUEE TICKER & VIDEOS
          ══════════════════════════════ */}
      <YouTubeMarquee videos={videos || undefined} />

      {/* ══════════════════════════════
          STORIES & PROSE — Radiant Grid Section
          ══════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-paper via-amber-50/20 to-paper py-24 md:py-28 border-t border-sky-100/60 overflow-hidden">
        {/* Subtle background ambient warm glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 right-10 h-96 w-96 rounded-full bg-orange-200/20 blur-[110px]" />
          <div className="absolute bottom-0 -left-20 h-80 w-80 rounded-full bg-sky-200/20 blur-[100px]" />
        </div>

        <div className="container-editorial relative z-10">
          <motion.div {...fadeUp(0)}>
            <SectionHeading
              badge={language === "ml" ? "സാഹിത്യ സൃഷ്ടികൾ" : "Literary Works & Fiction"}
              title={language === "ml" ? "കഥകളും സാഹിത്യവും" : "Stories & Tales"}
              subtitle={
                language === "ml"
                  ? "മനുഷ്യബന്ധങ്ങളിലെ വൈകാരിക നിമിഷങ്ങളും ഗ്രാമീണ സ്മൃതികളും പകർത്തുന്ന ചെറുകഥകൾ."
                  : "Immersive short stories, quiet reflections, and human relationship chronicles."
              }
              icon={<BookOpen className="h-5 w-5 text-sky-600" />}
              action={
                <Link
                  to="/stories"
                  className="group inline-flex items-center gap-2 rounded-xl bg-white/90 border border-sky-200/70 px-5 py-2.5 text-xs font-bold text-sky-700 shadow-xs hover:border-orange-300 hover:text-orange-600 hover:shadow-card transition duration-200"
                >
                  <span>{language === "ml" ? "എല്ലാ കഥകളും വായിക്കുക" : "Explore All Stories"}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              }
            />
          </motion.div>

          {stories === null && <CardSkeletonGrid count={3} />}
          {stories?.length === 0 && <EmptyState message={t.common.empty} />}
          {stories && stories.length > 0 && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((s, i) => <StoryCard key={s._id} story={s} index={i} />)}
            </div>
          )}

          {/* ══════════════════════════════════════════
              HOROSCOPE & ASTROLOGY TEASER BANNER
              ══════════════════════════════════════════ */}
          <HoroscopeTeaserBanner />
        </div>
      </section>

      {/* ══════════════════════════════
          VOICES & AUDIO — Spotify-inspired Section
          ══════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-paper via-sky-50/30 to-paper py-24 md:py-28 border-t border-sky-100/60 overflow-hidden">
        {/* Subtle background ambient sky glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-20 h-96 w-96 rounded-full bg-sky-200/25 blur-[120px]" />
          <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-orange-200/20 blur-[100px]" />
        </div>

        <div className="container-editorial relative z-10">
          <motion.div {...fadeUp(0)}>
            <SectionHeading
              badge={language === "ml" ? "ശബ്ദ സാന്നിധ്യം & പോഡ്കാസ്റ്റ്" : "Voice, Audio & Music"}
              title={language === "ml" ? "ശബ്ദവിസ്മയങ്ങളും സംഗീതവും" : "Voices & Audio"}
              subtitle={
                language === "ml"
                  ? "രാജേന്ദ്രൻ കൈപ്പള്ളിലിന്റെ ശബ്ദത്തിലുള്ള കഥാവായനകളും ഗാനങ്ങളും കേൾക്കൂ."
                  : "Listen to spoken word story narrations, soulful audio reflections, songs, and background music."
              }
              icon={<Headphones className="h-5 w-5 text-orange-500" />}
              action={
                <Link
                  to="/audio"
                  className="group inline-flex items-center gap-2 rounded-xl bg-white/90 border border-sky-200/70 px-5 py-2.5 text-xs font-bold text-sky-700 shadow-xs hover:border-orange-300 hover:text-orange-600 hover:shadow-card transition duration-200"
                >
                  <span>{language === "ml" ? "എല്ലാ ശബ്ദങ്ങളും കേൾക്കുക" : "Explore All Voices"}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              }
            />
          </motion.div>

          {audios === null && <CardSkeletonGrid count={3} />}
          {audios?.length === 0 && (
            <div className="rounded-3xl border border-sky-100 bg-paper-ice/60 p-12 text-center">
              <Headphones className="mx-auto h-10 w-10 text-sky-400 mb-3" />
              <p className="text-sm text-ink-muted font-semibold">
                {language === "ml" ? "ഓഡിയോ ട്രാക്കുകൾ ഉടൻ ലഭ്യമാകും" : "Audio tracks coming soon"}
              </p>
            </div>
          )}
          {audios && audios.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 items-stretch">
              {audios.map((audio, i) => {
                const isThisActive = currentTrack?._id === audio._id;
                const title = pick(audio.titleMalayalam, audio.titleEnglish) || "Untitled";
                const desc = pick(audio.descriptionMalayalam, audio.descriptionEnglish);
                return (
                  <motion.div
                    key={audio._id}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => {
                      if (isThisActive) {
                        togglePlay();
                      } else {
                        playTrack(audio, audios);
                      }
                    }}
                    className={`group relative flex cursor-pointer flex-col justify-between h-full overflow-hidden rounded-3xl border p-5 sm:p-6 transition-all duration-300 ${isThisActive
                      ? "border-sky-400 bg-gradient-to-b from-sky-50/90 via-white to-orange-50/50 shadow-glow-dual ring-2 ring-sky-400/50 -translate-y-1.5"
                      : "border-sky-100/90 bg-white/95 backdrop-blur-md shadow-card hover:border-orange-300 hover:shadow-card-hover hover:-translate-y-1.5"
                      }`}
                  >
                    <div>
                      {/* Top Header Row: Category Pill & Duration */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-800 font-manrope shadow-2xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-sky-400 to-orange-400 animate-pulse" />
                          {audio.category}
                        </span>

                        {audio.duration ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-paper-ice px-2.5 py-1 text-xs font-semibold text-sky-700 font-manrope border border-sky-100/60">
                            <Headphones className="h-3 w-3 text-sky-500" />
                            {Math.floor(audio.duration / 60)}:
                            {String(Math.floor(audio.duration % 60)).padStart(2, "0")}
                          </span>
                        ) : null}
                      </div>

                      {/* Artwork & Play Trigger */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-paper-ice mb-5 border border-sky-100/70 shadow-xs">
                        <img
                          src={resolveMediaUrl(audio.coverImage || "/logo.jpg")}
                          alt={title}
                          className={`h-full w-full object-cover transition-transform duration-700 ${isThisActive && isPlaying ? "scale-105" : "group-hover:scale-105"
                            }`}
                        />

                        {/* Equalizer animation wave overlay when playing */}
                        {isThisActive && isPlaying && (
                          <div className="absolute top-3 left-3 flex items-end gap-1 rounded-full bg-slate-950/85 backdrop-blur-md px-3 py-1.5 z-10 shadow-md border border-white/20">
                            <span className="h-3.5 w-1 rounded-full bg-orange-400 animate-pulse" />
                            <span className="h-5 w-1 rounded-full bg-sky-400 animate-bounce" />
                            <span className="h-2.5 w-1 rounded-full bg-orange-300 animate-pulse" />
                            <span className="h-4.5 w-1 rounded-full bg-sky-300 animate-bounce" />
                            <span className="text-[10px] font-bold text-white ml-1 font-manrope">Playing</span>
                          </div>
                        )}

                        {/* Play button overlay */}
                        <div
                          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isThisActive
                            ? "bg-black/30 opacity-100"
                            : "bg-black/20 opacity-0 group-hover:opacity-100"
                            }`}
                        >
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-orange-500 text-white shadow-xl transition transform group-hover:scale-110">
                            {isThisActive && isPlaying ? (
                              <Pause className="h-6 w-6 fill-current" />
                            ) : (
                              <Play className="h-6 w-6 fill-current ml-0.5" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Title: Generous multi-line font */}
                      <h3
                        className={`font-display text-lg sm:text-xl font-bold leading-snug transition-colors ${isThisActive ? "text-sky-700" : "text-ink group-hover:text-sky-600"
                          }`}
                      >
                        {title}
                      </h3>

                      {/* Narrator */}
                      <p className="mt-2 text-xs sm:text-sm font-semibold text-ink-muted flex items-center gap-1.5 font-manrope">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                        {audio.narrator || "Rajendran Kaippallil"}
                      </p>

                      {/* Description: full reading readability */}
                      {desc && (
                        <p className="mt-3 text-xs sm:text-sm text-ink-soft/90 line-clamp-3 leading-relaxed font-manrope font-medium">
                          {desc}
                        </p>
                      )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="mt-6 pt-4 border-t border-sky-100/80 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 rounded-xl bg-sky-50 group-hover:bg-sky-100/80 px-4 py-2 text-xs font-bold text-sky-700 group-hover:text-orange-600 transition-all font-manrope shadow-2xs">
                        {isThisActive && isPlaying ? (
                          <>
                            <Pause className="h-3.5 w-3.5 fill-current text-orange-500" />
                            <span>Pause Audio</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5 fill-current text-sky-600 group-hover:text-orange-500" />
                            <span>Listen Now</span>
                          </>
                        )}
                      </span>
                      <Music className="h-4 w-4 text-sky-400 group-hover:text-orange-400 transition-colors" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════
          CTA — Nocturnal Sky & Sunset Glow Band
          ══════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 py-28 text-paper">
        {/* Radiant glow orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-sky-500/10 to-transparent" />
          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-orange-500/15 blur-[120px]" />
          <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-sky-400/10 blur-[100px]" />
        </div>
        <div className="container-editorial relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-5 inline-block rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] uppercase text-sky-300">
              Get in touch
            </span>
            <h2 className="font-display text-4xl text-white md:text-5xl font-bold">
              {t.home.connectTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-sm text-base text-white/70">
              For collaborations, screenings, readings, or a simple hello.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                id="home-contact-cta"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-sky-500 to-orange-500 px-8 py-4 text-sm font-bold text-slate-950 shadow-glow-dual transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                {t.nav.contact}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/works"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:border-sky-400/60 hover:bg-white/10"
              >
                View Works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
