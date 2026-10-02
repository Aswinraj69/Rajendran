import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, AlertCircle, CheckCircle2, X } from "lucide-react";
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
  const [errors, setErrors] = useState<{ youtubeUrl?: string; title?: string; general?: string }>({});

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

  const validateForm = (): boolean => {
    const newErrors: { youtubeUrl?: string; title?: string; general?: string } = {};

    if (!form.youtubeUrl.trim()) {
      newErrors.youtubeUrl = "YouTube URL is required.";
    } else if (!previewId) {
      newErrors.youtubeUrl = "Invalid YouTube URL format. (Example: https://www.youtube.com/watch?v=...)";
    }

    if (!form.title.trim()) {
      newErrors.title = "Video title is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return false;
    }

    return true;
  };

  async function handleSave() {
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (isNew) {
        await createVideo(form);
        toast.success("Video added successfully!");
      } else {
        await updateVideo(id!, form);
        toast.success("Video updated successfully!");
      }
      navigate("/admin/videos");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save video";
      setErrors((prev) => ({ ...prev, general: msg }));
      toast.error(msg);
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

      {/* Global Validation Error */}
      {errors.general && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Validation Required</p>
            <p className="mt-0.5">{errors.general}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrors((prev) => ({ ...prev, general: undefined }))}
            className="text-red-400 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">
              YouTube URL <span className="text-red-500">*</span>
            </label>
            <input
              value={form.youtubeUrl}
              onChange={(e) => {
                setForm({ ...form, youtubeUrl: e.target.value });
                if (errors.youtubeUrl) setErrors((prev) => ({ ...prev, youtubeUrl: undefined }));
              }}
              placeholder="https://www.youtube.com/watch?v=… or a Shorts link"
              className={`w-full border bg-white px-3 py-2 text-sm focus-visible:outline-none transition ${
                errors.youtubeUrl
                  ? "border-red-400 bg-red-50/20 focus-visible:border-red-500"
                  : "border-mist focus-visible:border-gold"
              }`}
            />
            {errors.youtubeUrl ? (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600 font-medium">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.youtubeUrl}
              </p>
            ) : (
              <p className="mt-1 text-xs text-ink/40">
                Paste any YouTube link — watch, youtu.be, Shorts or embed — the video ID is
                extracted automatically.
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g. In Conversation with Rajendran Kaipallil"
              className={`w-full border bg-white px-3 py-2 text-sm focus-visible:outline-none transition ${
                errors.title
                  ? "border-red-400 bg-red-50/20 focus-visible:border-red-500"
                  : "border-mist focus-visible:border-gold"
              }`}
            />
            {errors.title && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600 font-medium">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Add optional notes or description…"
              className="w-full border border-mist bg-white px-3 py-2 text-sm focus-visible:border-gold"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-mist bg-white p-4">
            <p className="mb-2 text-sm font-semibold text-ink">Thumbnail preview</p>
            {previewId ? (
              <div className="space-y-1.5">
                <img
                  src={`https://img.youtube.com/vi/${previewId}/hqdefault.jpg`}
                  alt=""
                  className="aspect-video w-full rounded bg-ink/10 object-cover border border-mist"
                />
                <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="h-3 w-3" /> Valid YouTube Video ID: {previewId}
                </p>
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded bg-ink/5 text-xs text-ink/30 border border-dashed border-mist">
                Paste a valid YouTube URL to preview
              </div>
            )}
          </div>

          <div className="border border-mist bg-white p-4">
            <label className="mb-1 block text-sm font-semibold text-ink">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as VideoCategory })}
              className="w-full border border-mist bg-white px-3 py-2 text-sm capitalize"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c.replace("-", " ")}</option>
              ))}
            </select>

            <label className="mt-4 flex items-center gap-2 text-sm text-ink/70 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-4 w-4 rounded border-mist text-gold focus:ring-gold"
              />
              Feature on Homepage
            </label>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-moss disabled:opacity-50 transition"
          >
            {saving ? "Saving..." : isNew ? "Add Video" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
