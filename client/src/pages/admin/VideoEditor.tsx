import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { createVideo, getVideoById, updateVideo } from "../../api/videos";
import { VideoCategory } from "../../types";

const categories: VideoCategory[] = [
  "interviews",
  "stories",
  "script",
  "talks",
  "music",
  "short-films",
  "youtube",
  "other",
];

// Mirrors server/src/utils/youtube.ts so the admin gets an instant preview
// before saving — the server re-derives and validates the ID either way.
function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

const emptyForm = {
  title: "",
  youtubeUrl: "",
  description: "",
  category: "youtube" as VideoCategory,
  featured: false,
};

export default function VideoEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew) return;
    getVideoById(id!)
      .then((video) => {
        setForm({
          title: video.title,
          youtubeUrl: video.youtubeUrl,
          description: video.description ?? "",
          category: video.category,
          featured: video.featured,
        });
      })
      .catch(() => toast.error("Failed to load video"))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const previewId = extractYouTubeVideoId(form.youtubeUrl);

  async function handleSave() {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!previewId) return toast.error("That doesn't look like a valid YouTube URL");

    setSaving(true);
    try {
      if (isNew) {
        await createVideo(form);
        toast.success("Video added");
      } else {
        await updateVideo(id!, form);
        toast.success("Video updated");
      }
      navigate("/admin/videos");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-ink/40">Loading…</p>;

  return (
    <div>
      <button
        onClick={() => navigate("/admin/videos")}
        className="inline-flex items-center gap-2 text-sm text-ink/50 hover:text-moss"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Videos
      </button>

      <h1 className="mt-4 font-display text-3xl text-ink">{isNew ? "Add Video" : "Edit Video"}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div>
            <label className="mb-1 block text-sm text-ink/70">YouTube URL</label>
            <input
              value={form.youtubeUrl}
              onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=… or a Shorts link"
              className="w-full border border-mist bg-white px-3 py-2 focus-visible:border-gold"
            />
            <p className="mt-1 text-xs text-ink/40">
              Paste any YouTube link — watch, youtu.be, Shorts or embed — the video ID is
              extracted automatically.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm text-ink/70">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-mist bg-white px-3 py-2 focus-visible:border-gold"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-ink/70">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-mist bg-white px-3 py-2 focus-visible:border-gold"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-mist bg-white p-4">
            <p className="mb-2 text-sm text-ink/70">Thumbnail preview</p>
            {previewId ? (
              <img
                src={`https://img.youtube.com/vi/${previewId}/hqdefault.jpg`}
                alt=""
                className="aspect-video w-full bg-ink/10 object-cover"
              />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center bg-ink/5 text-xs text-ink/30">
                Paste a URL to preview
              </div>
            )}
          </div>

          <div className="border border-mist bg-white p-4">
            <label className="mb-1 block text-sm text-ink/70">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as VideoCategory })}
              className="w-full border border-mist bg-white px-3 py-2"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c.replace("-", " ")}</option>
              ))}
            </select>

            <label className="mt-4 flex items-center gap-2 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured
            </label>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-ink px-4 py-2 text-sm text-paper hover:bg-moss disabled:opacity-50"
          >
            {isNew ? "Add Video" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
