import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Search, RefreshCw, Youtube } from "lucide-react";
import { listAdminVideos, deleteVideo } from "../../api/videos";
import { syncYouTubeChannel } from "../../api/youtube";
import { Video } from "../../types";
import { resolveMediaUrl } from "../../utils/media";

export default function VideosList() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await listAdminVideos({ q });
      setVideos(res.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load videos");
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await syncYouTubeChannel();
      toast.success(res.message || "Synced all videos from YouTube!");
      await load();
    } catch (err) {
      toast.error("Failed to sync with YouTube");
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this video? This can't be undone.")) return;
    try {
      await deleteVideo(id);
      toast.success("Video deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Videos & YouTube Content</h1>
          <p className="text-xs text-ink/50 mt-1">Manage videos or sync automatically from YouTube (@rajendran131)</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-md border border-mist bg-white px-3.5 py-2 text-xs font-semibold text-ink shadow-sm hover:border-red-500 hover:text-red-600 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin text-red-600" : ""}`} />
            {syncing ? "Syncing..." : "Sync from YouTube"}
          </button>
          <Link to="/admin/videos/new" className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-xs font-semibold text-paper hover:bg-moss transition shadow-sm">
            <Plus className="h-4 w-4" /> Add Video
          </Link>
        </div>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search videos…"
          className="w-full border border-mist bg-white py-2 pl-9 pr-3 text-sm focus-visible:border-gold"
        />
      </div>

      <div className="mt-6 divide-y divide-mist border border-mist bg-white">
        {loading && <p className="p-4 text-sm text-ink/40">Loading…</p>}
        {!loading && videos.length === 0 && (
          <p className="p-4 text-sm text-ink/40">No videos yet — paste a YouTube URL to add one.</p>
        )}
        {videos.map((video) => (
          <div key={video._id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3">
              {video.thumbnail && (
                <img src={resolveMediaUrl(video.thumbnail)} alt="" className="h-10 w-16 object-cover" />
              )}
              <div>
                <p className="text-sm text-ink">{video.title}</p>
                <p className="mt-0.5 text-xs uppercase tracking-wide text-ink/40">
                  {video.category}
                  {video.featured ? " · Featured" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/admin/videos/${video._id}`}
                className="rounded p-2 text-ink/60 hover:bg-ink/5 hover:text-ink"
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleDelete(video._id)}
                className="rounded p-2 text-ink/60 hover:bg-rust/10 hover:text-rust"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
