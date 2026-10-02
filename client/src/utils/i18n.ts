import { Language } from "../types";

/**
 * Picks the localized field for the active language, falling back to
 * whichever language actually has content. This is the single place that
 * knows about the titleMalayalam/titleEnglish naming convention used
 * throughout the Story/Book/Project models, so components never hardcode
 * Malayalam or English text themselves.
 */
export function pickLocalized(
  language: Language,
  ml?: string,
  en?: string
): string {
  if (language === "ml") return ml || en || "";
  return en || ml || "";
}

export function estimateReadingMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}
