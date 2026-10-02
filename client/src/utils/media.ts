/**
 * Resolves media URLs (images, audio files) to their full absolute URL.
 * If the URL is already a full URL (Cloudinary, external CDN, data/blob), it returns as is.
 * If it's a relative `/uploads/...` path from the backend, it prepends the backend base URL.
 */
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";

  // Already absolute or inline data
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  // Public static assets on the frontend client (e.g. /rajendran-hero.jpg, /logo.jpg)
  if (
    url.startsWith("/rajendran-") ||
    url.startsWith("/logo.") ||
    url.startsWith("/cover-") ||
    url.startsWith("/media_") ||
    url.startsWith("/favicon")
  ) {
    return url;
  }

  // Uploaded media from backend server (/uploads/...)
  if (url.startsWith("/uploads/")) {
    const apiBase = import.meta.env.VITE_API_URL || "/api";
    if (apiBase && apiBase.startsWith("http")) {
      const backendHost = apiBase.replace(/\/api\/?$/, "");
      return `${backendHost}${url}`;
    }
  }

  return url;
}
