import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const navLinks: { to: string; key: keyof ReturnType<typeof useLanguage>["t"]["nav"] }[] = [
  { to: "/",        key: "home" },
  { to: "/about",   key: "about" },
  { to: "/works",   key: "works" },
  { to: "/stories", key: "stories" },
  { to: "/videos",  key: "videos" },
  { to: "/audio",   key: "audio" },
  { to: "/contact", key: "contact" },
];

export function Navbar() {
  const { t, language, toggleLanguage } = useLanguage();
  const [open,    setOpen]    = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* ── Main header ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-nav-scroll border-b border-sky-100/60"
            : "bg-white/70 backdrop-blur-md border-b border-mist/40"
        }`}
      >
        <div className="container-editorial flex h-[68px] items-center justify-between">

          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="relative">
              <img
                src="/logo.jpg"
                alt="Rajendran Kaippallil Logo"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-sky-400/30 transition-all duration-300 group-hover:scale-105 group-hover:ring-orange-400/50"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <span className="font-display text-[17px] tracking-tight text-ink transition-colors duration-200 group-hover:text-sky-600">
              Rajendran <span className="font-light text-ink-soft">Kaippallil</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `group relative text-[13px] font-semibold tracking-wide transition-colors duration-200 ${
                    isActive
                      ? "text-sky-600"
                      : "text-ink-soft hover:text-orange-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {t.nav[item.key]}
                    <span
                      className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-sky-400 to-orange-500 rounded-full transition-all duration-300 ease-out ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}

            {/* ── Language Toggle Pill ── */}
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="relative flex items-center rounded-full border border-sky-200/60 bg-paper-ice p-[3px] hover:border-orange-300 transition-all duration-300 shadow-xs"
            >
              {/* Sliding indicator */}
              <motion.span
                className="absolute top-[3px] h-[calc(100%-6px)] rounded-full bg-gradient-to-r from-sky-500 to-orange-500 shadow-sm"
                style={{ width: "calc(50% - 3px)" }}
                animate={{ left: language === "en" ? "3px" : "calc(50%)" }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
              <span
                className={`relative z-10 w-10 py-1.5 text-center text-[11px] font-bold tracking-widest transition-colors duration-300 ${
                  language === "en" ? "text-white" : "text-ink-soft hover:text-sky-700"
                }`}
              >
                EN
              </span>
              <span
                className={`relative z-10 w-10 py-1.5 text-center text-[11px] font-bold tracking-widest transition-colors duration-300 ${
                  language === "ml" ? "text-white" : "text-ink-soft hover:text-orange-700"
                }`}
              >
                ML
              </span>
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-200/60 bg-paper-ice text-ink-soft transition hover:border-orange-400 hover:text-orange-600 md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
        </div>
      </header>

      {/* ── Mobile full-screen menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed inset-0 z-[60] flex flex-col bg-paper md:hidden overflow-y-auto"
          >
            {/* Mobile header */}
            <div className="flex h-[68px] flex-shrink-0 items-center justify-between border-b border-mist px-6">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5"
              >
                <img
                  src="/logo.jpg"
                  alt="Rajendran Kaippallil Logo"
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-moss/20"
                />
                <span className="font-display text-[17px] tracking-tight text-ink">
                  Rajendran <span className="font-light text-ink-soft">Kaippallil</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-mist text-ink-soft hover:text-moss"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Nav links */}
            <motion.nav
              className="flex flex-1 flex-col gap-1 px-6 pt-10"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            >
              {navLinks.map((item) => (
                <motion.div
                  key={item.to}
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ type: "spring", stiffness: 280, damping: 28 }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block py-3.5 font-display text-3xl tracking-tight border-b border-mist/60 transition-colors duration-200 ${
                        isActive ? "text-moss" : "text-ink/70 hover:text-ink"
                      }`
                    }
                  >
                    {t.nav[item.key]}
                  </NavLink>
                </motion.div>
              ))}

              {/* Mobile language toggle */}
              <motion.div
                className="pt-8"
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              >
                <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-ink-muted">
                  Language
                </p>
                <button
                  type="button"
                  onClick={() => { toggleLanguage(); setOpen(false); }}
                  className="relative flex w-fit items-center rounded-full border border-mist bg-paper-warm p-1 shadow-sm"
                >
                  <motion.span
                    className="absolute top-1 h-[calc(100%-8px)] rounded-full bg-moss"
                    style={{ width: "calc(50% - 4px)" }}
                    animate={{ left: language === "en" ? "4px" : "calc(50%)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                  <span className={`relative z-10 w-28 py-2.5 text-center text-sm font-semibold tracking-wide transition-colors ${language === "en" ? "text-paper" : "text-ink-soft"}`}>
                    English
                  </span>
                  <span className={`relative z-10 w-28 py-2.5 text-center text-sm font-semibold transition-colors ${language === "ml" ? "text-paper" : "text-ink-soft"}`}>
                    മലയാളം
                  </span>
                </button>
              </motion.div>
            </motion.nav>

            <div className="border-t border-mist px-6 py-6">
              <p className="text-xs text-ink-muted">© {new Date().getFullYear()} Rajendran Kaippallil</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
