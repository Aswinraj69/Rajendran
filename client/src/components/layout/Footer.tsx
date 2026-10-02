import { Link } from "react-router-dom";
import { Youtube, Instagram, Facebook, Mail, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useSiteContent } from "../../context/SiteContentContext";

const footerLinks = [
  { to: "/stories", key: "stories" as const },
  { to: "/videos",  key: "videos"  as const },
  { to: "/works",   key: "works"   as const },
  { to: "/about",   key: "about"   as const },
  { to: "/contact", key: "contact" as const },
];

export function Footer() {
  const { t } = useLanguage();
  const { c, raw } = useSiteContent();
  const year = new Date().getFullYear();

  const socials = [
    { href: raw("contact.youtube_url", "https://www.youtube.com/@rajendran131"), label: "YouTube", icon: Youtube },
    { href: "#", label: "Instagram", icon: Instagram },
    { href: "#", label: "Facebook", icon: Facebook },
    { href: `mailto:${raw("contact.email", "contact@rajendrankaipallil.com")}`, label: "Email", icon: Mail },
  ];

  return (
    <footer className="bg-paper-warm border-t border-mist">
      {/* Main grid */}
      <div className="container-editorial grid gap-12 border-b border-mist py-16 md:grid-cols-[1.6fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Rajendran Kaippallil Logo"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-moss/20"
            />
            <p className="font-display text-xl tracking-tight text-ink">
              Rajendran <span className="font-light text-ink-soft">Kaippallil</span>
            </p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
            {c("footer.tagline", t.footer.tagline)}
          </p>
          {/* Social icons */}
          <div className="mt-8 flex gap-2.5">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-mist bg-paper text-ink-muted shadow-sm transition-all duration-200 hover:border-moss/40 hover:text-moss hover:shadow-md"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <p className="mb-5 text-[10px] font-semibold tracking-[0.22em] uppercase text-ink-muted">
            Navigate
          </p>
          <ul className="space-y-3">
            {footerLinks.map(({ to, key }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="group inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-moss"
                >
                  {t.nav[key]}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="mb-5 text-[10px] font-semibold tracking-[0.22em] uppercase text-ink-muted">
            Contact
          </p>
          <p className="text-sm text-ink-soft leading-relaxed">
            For collaborations, screenings, readings, or a simple hello.
          </p>
          <Link
            to="/contact"
            className="mt-5 inline-flex items-center gap-2 bg-moss px-5 py-2.5 text-xs font-semibold tracking-wide text-paper shadow-sm transition-all duration-200 hover:bg-moss-light hover:shadow-md"
          >
            Get in touch
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-editorial flex flex-wrap items-center justify-between gap-4 py-5">
        <p className="text-xs text-ink-muted">
          © {year} Rajendran Kaippallil. {t.footer.rights}
        </p>
        <div className="flex items-center gap-4">
          <p className="text-xs text-mist-DEFAULT hidden sm:block">
            Malayalam · English · Stories · Scripts · Sound
          </p>
          <Link to="/admin/login" className="text-[10px] text-mist-DEFAULT/60 hover:text-moss transition-colors duration-200">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
