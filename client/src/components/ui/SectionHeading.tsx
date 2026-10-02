import { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  lang?: "ml" | "en";
  action?: ReactNode;
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  badge,
  title,
  subtitle,
  icon,
  lang,
  action,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-sky-100/80 pb-7">
      <div className="max-w-2xl">
        {(badge || eyebrow) && (
          <div className="mb-3 flex items-center gap-2.5 flex-wrap">
            {badge && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200/80 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-sky-700 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-sky-400 to-orange-400 animate-pulse" />
                {badge}
              </span>
            )}
            {eyebrow && (
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gradient-sky-orange">
                {eyebrow}
              </p>
            )}
          </div>
        )}
        <div className="flex items-center gap-3">
          {icon ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-orange-100 text-sky-700 shadow-xs border border-sky-200/50">
              {icon}
            </div>
          ) : (
            <span className="h-7 w-1.5 rounded-full bg-gradient-to-b from-sky-500 to-orange-500 shrink-0" />
          )}
          <h2
            lang={lang}
            className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${
              light ? "text-white" : "text-ink"
            }`}
          >
            {title}
          </h2>
        </div>
        {subtitle && (
          <p
            className={`mt-2 text-sm sm:text-base leading-relaxed font-manrope font-medium ${
              light ? "text-white/70" : "text-ink-soft/90"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
