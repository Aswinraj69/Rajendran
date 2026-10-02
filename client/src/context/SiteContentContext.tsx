import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from "react";
import { fetchSiteContent } from "../api/siteContent";
import { useLanguage } from "./LanguageContext";

interface SiteContentContextValue {
  content: Record<string, string>;
  loading: boolean;
  /**
   * Retrieves content with language awareness.
   * Looks up `${key}_${language}` -> `${key}_en` -> `${key}` -> fallback.
   */
  c: (key: string, fallback?: string) => string;
  /**
   * Retrieves exact key without adding language suffix.
   */
  raw: (key: string, fallback?: string) => string;
  refreshContent: () => Promise<void>;
  updateLocalContent: (newContent: Record<string, string>) => void;
}

const SiteContentContext = createContext<SiteContentContextValue | undefined>(undefined);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const refreshContent = useCallback(async () => {
    try {
      const res = await fetchSiteContent();
      if (res && res.data) {
        setContent(res.data);
      }
    } catch (err) {
      console.warn("Could not load dynamic site content, falling back to defaults:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  const updateLocalContent = useCallback((newContent: Record<string, string>) => {
    setContent((prev) => ({ ...prev, ...newContent }));
  }, []);

  const c = useCallback(
    (key: string, fallback?: string): string => {
      // 1. Try key_ml or key_en according to active language
      const langKey = `${key}_${language}`;
      if (content[langKey] !== undefined && content[langKey] !== "") {
        return content[langKey];
      }

      // 2. Try default language (_en)
      const enKey = `${key}_en`;
      if (content[enKey] !== undefined && content[enKey] !== "") {
        return content[enKey];
      }

      // 3. Try exact key without suffix
      if (content[key] !== undefined && content[key] !== "") {
        return content[key];
      }

      // 4. Return provided fallback or empty string
      return fallback !== undefined ? fallback : "";
    },
    [content, language]
  );

  const raw = useCallback(
    (key: string, fallback?: string): string => {
      if (content[key] !== undefined && content[key] !== "") {
        return content[key];
      }
      return fallback !== undefined ? fallback : "";
    },
    [content]
  );

  const value = useMemo<SiteContentContextValue>(
    () => ({
      content,
      loading,
      c,
      raw,
      refreshContent,
      updateLocalContent,
    }),
    [content, loading, c, raw, refreshContent, updateLocalContent]
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error("useSiteContent must be used within a SiteContentProvider");
  }
  return ctx;
}
