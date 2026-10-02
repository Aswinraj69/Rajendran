import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Search, Music, Play, Heart } from "lucide-react";
import { listAudio, deleteAudioTrack } from "../../api/audio";
import { AudioTrack } from "../../types";
import { resolveMediaUrl } from "../../utils/media";

export default function AudioList() {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await listAudio({ q, limit: 50 });
      setTracks(res.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load audio");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this audio track? This can't be undone.")) return;
    try {
      await deleteAudioTrack(id);
      toast.success("Audio track deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Audio & Voice</h1>
          <p className="text-xs text-ink/50 mt-1">
            Upload and manage audio tracks, voice recordings, and podcasts
          </p>
        </div>
        <Link
          to="/admin/audio/new"
          className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-xs font-semibold text-paper hover:bg-moss transition shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Audio
        </Link>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search audio tracks…"
          className="w-full border border-mist bg-white py-2 pl-9 pr-3 text-sm focus-visible:border-gold"
        />
      </div>

      <div className="mt-6 divide-y divide-mist border border-mist bg-white">
        {loading && <p className="p-4 text-sm text-ink/40">Loading…</p>}
        {!loading && tracks.length === 0 && (
          <p className="p-4 text-sm text-ink/40">
            No audio tracks yet — click "Add Audio" to upload one.
          </p>
        )}
        {tracks.map((track) => (
          <div
            key={track._id}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              {/* Cover image or music icon */}
              {track.coverImage ? (
                <img
                  src={resolveMediaUrl(track.coverImage)}
                  alt=""
                  className="h-10 w-10 rounded object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded bg-moss/10 text-moss">
                  <Music className="h-5 w-5" />
                </div>
              )}
              <div>
                <p className="text-sm text-ink">
                  {track.titleEnglish || track.titleMalayalam || "Untitled"}
                </p>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-ink/40">
                  <span className="uppercase tracking-wide">
                    {track.category}
                  </span>
                  {track.featured && (
                    <span className="text-gold font-semibold">★ Featured</span>
                  )}
                  {track.narrator && (
                    <span>by {track.narrator}</span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Play className="h-3 w-3" />
                    {track.playsCount || 0}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {track.likesCount || 0}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/admin/audio/${track._id}`}
                className="rounded p-2 text-ink/60 hover:bg-ink/5 hover:text-ink"
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleDelete(track._id)}
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
