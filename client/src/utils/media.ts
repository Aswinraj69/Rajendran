/**
 * Resolves media URLs (images, audio files) to their full absolute URL.
 * If the URL is already a full URL (Cloudinary, external CDN, data/blob), it returns as is.
 * If it's a relative `/uploads/...` path from the backend, it prepends the backend base URL.
 */
export function resolveMediaUrl(url?: string | null, fallback = ""): string {
  if (!url || typeof url !== "string" || !url.trim()) return fallback;

  const trimmed = url.trim();

  // Already absolute or inline data
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  // Public static assets on the frontend client (e.g. /rajendran-hero.jpg, /logo.jpg, /cover-about.jpg)
  if (
    trimmed.startsWith("/rajendran-") ||
    trimmed.startsWith("/logo.") ||
    trimmed.startsWith("/cover-") ||
    trimmed.startsWith("/media_") ||
    trimmed.startsWith("/favicon") ||
    trimmed.startsWith("/grain.svg")
  ) {
    return trimmed;
  }

  // Uploaded media from backend server (/uploads/...)
  if (trimmed.startsWith("/uploads/")) {
    const apiBase = import.meta.env.VITE_API_URL || "/api";
    if (apiBase && apiBase.startsWith("http")) {
      const backendHost = apiBase.replace(/\/api\/?$/, "");
      return `${backendHost}${trimmed}`;
    }
  }

  return trimmed;
}
