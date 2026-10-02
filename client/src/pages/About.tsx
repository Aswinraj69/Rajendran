import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useSiteContent } from "../context/SiteContentContext";
import { BookOpen, Film, Award, Heart, Sparkles, Feather } from "lucide-react";
import { Link } from "react-router-dom";
import { CascadingText } from "../components/ui/CascadingText";

export default function About() {
  const { t, language } = useLanguage();
  const { c, raw } = useSiteContent();

  const disciplines = [
    {
      icon: Feather,
      title: language === "ml" ? "മലയാള സാഹിത്യം" : "Malayalam Literature",
      desc:
        language === "ml"
          ? "മനുഷ്യബന്ധങ്ങളുടെയും ജീവിതയാഥാർത്ഥ്യങ്ങളുടെയും ഉൾത്തുടിപ്പുകൾ പകർത്തുന്ന ചെറുകഥകളും ചിന്തകളും."
          : "Fiction, short stories, and philosophical essays rooted in human relationships and cultural textures.",
      color: "from-sky-500 to-sky-600",
      bg: "bg-sky-50 text-sky-600 border-sky-100",
    },
    {
      icon: Film,
      title: language === "ml" ? "തിരക്കഥ & മാധ്യമം" : "Screenwriting & Media",
      desc:
        language === "ml"
          ? "ദൃശ്യമാധ്യമങ്ങൾക്കായുള്ള രചനകൾ, ഡോക്യുമെന്ററി ആഖ്യാനങ്ങൾ, സ്ക്രിപ്റ്റ് നിർമ്മാണം."
          : "Cinematic narratives, documentary narratives, and screen craft for visual media.",
      color: "from-orange-500 to-orange-600",
      bg: "bg-orange-50 text-orange-600 border-orange-100",
    },
    {
      icon: Sparkles,
      title: language === "ml" ? "സാംസ്കാരിക അവതരണം" : "Cultural Storytelling",
      desc:
        language === "ml"
          ? "പഴമയുടെ സാംസ്കാരിക തനിമയും വർത്തമാനകാല ചിന്തകളും ഡിജിറ്റൽ ലോകത്തേക്ക് എത്തിക്കുന്ന ഉദ്യമങ്ങൾ."
          : "Bringing folklore, Kerala traditions, and contemporary dialogue to YouTube and digital spaces.",
      color: "from-sky-400 to-orange-400",
      bg: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  return (
    <div className="min-h-screen bg-paper overflow-x-hidden">

      {/* ═══════════════════════════════════════
          COVER BANNER — Cinematic hero photo
          ══════════════════════════════ */}
      <section className="relative h-[55vh] min-h-[360px] max-h-[540px] w-full overflow-hidden">
        {/* Background image */}
        <img
          src="/cover-about.jpg"
          alt="Rajendran Kaippallil"
          className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/50 via-transparent to-orange-950/30" />

        {/* Content over the banner */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-0 right-0 p-8 md:p-12"
        >
          <div className="container-editorial">
            <div className="flex items-end gap-5">
              {/* Logo */}
              <div className="relative hidden sm:block">
                <img
                  src="/logo.jpg"
                  alt="RK Logo"
                  className="h-16 w-16 rounded-full object-cover ring-4 ring-sky-300/40 shadow-xl"
                />
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-sky-400/40 to-orange-400/40 blur-sm -z-10" />
              </div>
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-sky-200 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                  {t.nav.about}
                </span>
                <h1 className="font-display text-4xl text-white md:text-5xl lg:text-6xl font-bold drop-shadow-lg">
                  {raw("about.banner_title", "Rajendran Kaippallil")}
                </h1>
                <p className="mt-1 font-display text-lg text-orange-200/90 italic drop-shadow-sm md:text-xl font-medium">
                  {c(
                    "about.banner_subtitle",
                    language === "ml"
                      ? "എഴുത്തുകാരൻ · കഥാകാരൻ · സാംസ്കാരിക പ്രവർത്തകൻ"
                      : "Writer · Storyteller · Screenwriter · Cultural Voice"
                  )}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top-right subtle logo watermark */}
        <div className="absolute top-6 right-6 opacity-20">
          <img src="/logo.jpg" alt="" className="h-12 w-12 rounded-full object-cover" />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CONTENT — Below the cover
          ═══════════════════════════════════════ */}
      <div className="container-editorial pt-14 pb-24">

        {/* Hero Split Layout */}
        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Portrait / Emblem Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="card-glass relative overflow-hidden p-8 text-center shadow-glow-dual">
              {/* Portrait Emblem */}
              <div className="mx-auto relative flex justify-center">
                <div className="relative h-52 w-52 rounded-3xl bg-gradient-to-tr from-sky-100 via-paper-ice to-orange-100 p-2 shadow-xl ring-4 ring-sky-200/80 overflow-hidden border border-white">
                  <img
                    src="/rajendran-about.jpg"
                    alt="Rajendran Kaippallil"
                    className="h-full w-full object-cover object-[center_20%] rounded-2xl drop-shadow-md transform hover:scale-105 transition duration-500"
                  />
                </div>
              </div>
              <h2 className="mt-6 font-display text-2xl font-bold text-ink">
                {raw("about.card_name", "Rajendran Kaippallil")}
              </h2>
              <p className="text-xs font-semibold text-gradient-sky-orange uppercase tracking-wider mt-1">
                {c("contact.location", language === "ml" ? "കൈപ്പള്ളി, കേരളം" : "Kaipallil, Kerala, India")}
              </p>

              <div className="mt-6 flex justify-center gap-6 border-t border-sky-100 pt-6 text-center font-manrope">
                <div>
                  <p className="font-roneva text-2xl font-bold text-sky-600">
                    {raw("about.stats_subscribers_num", "17.1K")}
                  </p>
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-ink-muted">
                    {language === "ml" ? "സബ്‌സ്‌ക്രൈബേഴ്‌സ്" : "Subscribers"}
                  </p>
                </div>
                <div className="border-r border-sky-100" />
                <div>
                  <p className="font-roneva text-2xl font-bold text-orange-500">
                    {raw("about.stats_videos_num", "520+")}
                  </p>
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-ink-muted">
                    {language === "ml" ? "വീഡിയോകൾ" : "Videos"}
                  </p>
                </div>
                <div className="border-r border-sky-100" />
                <div>
                  <p className="font-roneva text-2xl font-bold text-sky-600">
                    {raw("about.stats_views_num", "970K+")}
                  </p>
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-ink-muted">
                    {language === "ml" ? "കാഴ്ചക്കാർ" : "Total Views"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/contact"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-3.5 text-sm font-bold text-white transition hover:from-sky-600 hover:to-orange-500 shadow-glow-sky hover:scale-[1.02] active:scale-[0.98]"
                >
                  {language === "ml" ? "ബന്ധപ്പെടുക" : "Get in Touch"}
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Narrative Content */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-7"
          >
            <div className="reading-area max-w-none ml-0">
              <div className="text-xl sm:text-2xl leading-relaxed text-ink font-semibold mb-6">
                <CascadingText
                  text={c(
                    "about.bio_lead",
                    language === "ml"
                      ? "വാക്കുകളിലൂടെ മനുഷ്യഹൃദയങ്ങളിലേക്കുള്ള പാത തെളിക്കുകയാണ് രാജേന്ദ്രൻ കൈപ്പള്ളിലിന്റെ എഴുത്തുജീവിതം."
                      : "Through the craft of Malayalam prose and visual media, Rajendran Kaipallil bridges timeless literary heritage with contemporary human stories."
                  )}
                  fontFamily="roneva"
                  mode="words"
                  staggerDelay={0.035}
                  initialDelay={0.15}
                  className="text-xl sm:text-2xl leading-relaxed text-ink font-bold"
                />
              </div>
              <p>
                {c(
                  "about.bio_p1",
                  language === "ml"
                    ? "നാട്ടിൻപുറങ്ങളുടെ ഗ്രാമീണഭംഗിയും മനുഷ്യബന്ധങ്ങളിലെ സൂക്ഷ്മമായ വൈകാരിക സങ്കീർണ്ണതകളും തനിമയോടെ പകർത്തുന്ന ശൈലിയാണ് അദ്ദേഹത്തിന്റെ രചനകളുടെ മുഖമുദ്ര. ചെറുകഥകളിലൂടെയും ചിന്തോദ്ദീപകമായ ലേഖനങ്ങളിലൂടെയും മലയാള വായനാലോകത്ത് തനതായ ഒരിടം കണ്ടെത്തുവാൻ അദ്ദേഹത്തിന് സാധിച്ചിട്ടുണ്ട്."
                    : "Rooted in the soil and cultural cadence of Kerala, his writing reflects an observant eye for subtle human emotions, community memories, and the quiet beauty of everyday life. Over decades of creative pursuit, his work has encompassed short stories, insightful cultural essays, screenplays, and dialogues."
                )}
              </p>
              <p>
                {c(
                  "about.bio_p2",
                  language === "ml"
                    ? "അക്ഷരങ്ങൾക്കൊപ്പം ദൃശ്യമാധ്യമത്തിന്റെ കരുത്തും തിരിച്ചറിഞ്ഞ്, യൂട്യൂബിലൂടെയും ഡിജിറ്റൽ പ്ലാറ്റ്‌ഫോമുകളിലൂടെയും സാംസ്കാരിക സംഭാഷണങ്ങളും കഥാവതരണങ്ങളും അവതരിപ്പിച്ചുവരുന്നു."
                    : "Embracing new media, he regularly shares stories, reflections, and literary discussions through YouTube and digital formats, connecting generations of Malayalam readers across the world."
                )}
              </p>
            </div>

            {/* Creative Pillars */}
            <div className="mt-12">
              <h3 className="font-display text-2xl font-bold text-ink mb-6 flex items-center gap-3">
                <span className="h-5 w-1 rounded-full bg-gradient-to-b from-sky-500 to-orange-500" />
                {c("about.disciplines_heading", language === "ml" ? "പ്രവർത്തന മേഖലകൾ" : "Creative Disciplines")}
              </h3>
              <div className="space-y-4">
                {disciplines.map((d, i) => {
                  const Icon = d.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="card-glass flex gap-4 p-5 transition hover:border-sky-300"
                    >
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${d.bg}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-ink text-base">
                          {d.title}
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-ink-muted font-medium font-manrope">
                          {d.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
