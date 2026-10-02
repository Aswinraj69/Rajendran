import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Upload,
  Music,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  Play,
  Pause,
} from "lucide-react";
import { createAudioTrack, getAudio, updateAudioTrack, uploadAudioFile } from "../../api/audio";
import { uploadThumbnail } from "../../api/upload";
import { AudioCategory } from "../../types";
import { resolveMediaUrl } from "../../utils/media";

const categories: AudioCategory[] = [
  "voice",
  "music",
  "poetry",
  "audio-stories",
  "podcasts",
  "background-music",
  "other",
];

const emptyForm = {
  titleMalayalam: "",
  titleEnglish: "",
  descriptionMalayalam: "",
  descriptionEnglish: "",
  audioUrl: "",
  coverImage: "",
  category: "voice" as AudioCategory,
  narrator: "Rajendran Kaippallil",
  duration: 0,
  featured: false,
};

export default function AudioEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  // Audio upload state
  const [audioUploading, setAudioUploading] = useState(false);
  const [audioFileName, setAudioFileName] = useState("");
  const [audioPreviewUrl, setAudioPreviewUrl] = useState("");
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cover image upload state
  const [coverUploading, setCoverUploading] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getAudio(id!)
      .then(({ data }) => {
        setForm({
          titleMalayalam: data.titleMalayalam || "",
          titleEnglish: data.titleEnglish || "",
          descriptionMalayalam: data.descriptionMalayalam || "",
          descriptionEnglish: data.descriptionEnglish || "",
          audioUrl: data.audioUrl || "",
          coverImage: data.coverImage || "",
          category: data.category,
          narrator: data.narrator || "Rajendran Kaippallil",
          duration: data.duration || 0,
          featured: data.featured,
        });
        setAudioFileName(data.audioUrl ? data.audioUrl.split("/").pop() || "" : "");
        setAudioPreviewUrl(data.audioUrl || "");
      })
      .catch(() => toast.error("Failed to load audio track"))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  /* ── Audio file upload ── */
  async function handleAudioFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/aac", "audio/m4a", "audio/x-m4a"];
    if (!allowedTypes.some((t) => file.type.startsWith("audio/"))) {
      toast.error("Please select an audio file (MP3, WAV, OGG, AAC, M4A)");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Audio file must be under 100MB");
      return;
    }

    // Local preview while uploading
    const localUrl = URL.createObjectURL(file);
    setAudioPreviewUrl(localUrl);
    setAudioFileName(file.name);

    setAudioUploading(true);
    try {
      const res = await uploadAudioFile(file);
      setForm((f) => ({ ...f, audioUrl: res.url }));
      setAudioPreviewUrl(res.url);
      toast.success("Audio uploaded successfully!");

      // Get duration from audio element
      const tempAudio = new Audio(localUrl);
      tempAudio.addEventListener("loadedmetadata", () => {
        if (!isNaN(tempAudio.duration)) {
          setForm((f) => ({ ...f, duration: Math.round(tempAudio.duration) }));
        }
      });
    } catch {
      toast.error("Failed to upload audio file");
      setAudioPreviewUrl("");
      setAudioFileName("");
    } finally {
      setAudioUploading(false);
    }
  }

  /* ── Cover image upload ── */
  async function handleCoverImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setCoverUploading(true);
    try {
      const res = await uploadThumbnail(file);
      setForm((f) => ({ ...f, coverImage: res.url }));
      toast.success("Cover image uploaded!");
    } catch {
      toast.error("Failed to upload cover image");
    } finally {
      setCoverUploading(false);
    }
  }

  /* ── Audio preview toggle ── */
  function togglePreview() {
    if (!audioPreviewUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioPreviewUrl);
      audioRef.current.addEventListener("ended", () => setIsPreviewPlaying(false));
    }
    if (isPreviewPlaying) {
      audioRef.current.pause();
      setIsPreviewPlaying(false);
    } else {
      audioRef.current.src = audioPreviewUrl;
      audioRef.current.play().then(() => setIsPreviewPlaying(true)).catch(() => {});
    }
  }

  /* ── Save ── */
  async function handleSave() {
    if (!form.titleEnglish.trim() && !form.titleMalayalam.trim()) {
      return toast.error("At least one title (English or Malayalam) is required");
    }
    if (!form.audioUrl.trim()) {
      return toast.error("Please upload an audio file");
    }

    setSaving(true);
    try {
      if (isNew) {
        await createAudioTrack(form);
        toast.success("Audio track added!");
      } else {
        await updateAudioTrack(id!, form);
        toast.success("Audio track updated!");
      }
      navigate("/admin/audio");
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
        onClick={() => navigate("/admin/audio")}
        className="inline-flex items-center gap-2 text-sm text-ink/50 hover:text-moss"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Audio
      </button>

      <h1 className="mt-4 font-display text-3xl text-ink">
        {isNew ? "Add Audio Track" : "Edit Audio Track"}
      </h1>
      <p className="mt-1 text-xs text-ink/40">
        Upload MP3 voice recordings, songs, poetry, or stories that visitors can play on the website.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">

        {/* ── Left: Main fields ── */}
        <div className="space-y-6">

          {/* Audio File Upload */}
          <div className="rounded-lg border-2 border-dashed border-mist bg-paper-warm p-6">
            <p className="mb-3 text-sm font-semibold text-ink">
              Audio File <span className="text-rust">*</span>
            </p>

            {/* Upload area */}
            <label
              htmlFor="audio-file-input"
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border border-mist bg-white p-8 text-center transition hover:border-moss/50 hover:bg-paper-warm ${
                audioUploading ? "pointer-events-none opacity-60" : ""
              }`}
            >
              {audioUploading ? (
                <>
                  <Loader2 className="h-10 w-10 animate-spin text-moss" />
                  <p className="mt-3 text-sm font-semibold text-moss">Uploading audio…</p>
                  <p className="text-xs text-ink/40">Please wait</p>
                </>
              ) : form.audioUrl ? (
                <>
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  <p className="mt-3 text-sm font-semibold text-emerald-600">Audio Uploaded!</p>
                  <p className="max-w-[200px] truncate text-xs text-ink/60">{audioFileName}</p>
                  <p className="mt-1 text-xs text-ink/40">Click to replace</p>
                </>
              ) : (
                <>
                  <Music className="h-10 w-10 text-mist" />
                  <p className="mt-3 text-sm font-semibold text-ink">
                    Click to upload MP3 / audio file
                  </p>
                  <p className="mt-1 text-xs text-ink/40">
                    MP3, WAV, OGG, AAC, M4A · Max 100 MB
                  </p>
                </>
              )}
            </label>
            <input
              id="audio-file-input"
              type="file"
              accept="audio/*,.mp3,.wav,.ogg,.aac,.m4a"
              onChange={handleAudioFileChange}
              className="hidden"
            />

            {/* Audio preview player */}
            {audioPreviewUrl && (
              <div className="mt-4 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                <button
                  type="button"
                  onClick={togglePreview}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow hover:bg-emerald-600 transition"
                >
                  {isPreviewPlaying ? (
                    <Pause className="h-4 w-4 fill-current" />
                  ) : (
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                  )}
                </button>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-emerald-700">Preview Audio</p>
                  <p className="truncate text-[11px] text-emerald-600/70">{audioFileName}</p>
                </div>
                {form.duration > 0 && (
                  <span className="ml-auto text-xs font-mono text-emerald-600">
                    {Math.floor(form.duration / 60)}:{String(form.duration % 60).padStart(2, "0")}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bilingual Titles */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-ink/70">
                Title (English)
              </label>
              <input
                value={form.titleEnglish}
                onChange={(e) => setForm({ ...form, titleEnglish: e.target.value })}
                placeholder="e.g. Voice of the River"
                className="w-full border border-mist bg-white px-3 py-2 text-sm focus-visible:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink/70">
                Title (Malayalam)
              </label>
              <input
                value={form.titleMalayalam}
                onChange={(e) => setForm({ ...form, titleMalayalam: e.target.value })}
                placeholder="e.g. നദിയുടെ ശബ്ദം"
                className="w-full border border-mist bg-white px-3 py-2 text-sm focus-visible:border-gold"
              />
            </div>
          </div>

          {/* Bilingual Descriptions */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-ink/70">
                Description (English)
              </label>
              <textarea
                rows={3}
                value={form.descriptionEnglish}
                onChange={(e) => setForm({ ...form, descriptionEnglish: e.target.value })}
                placeholder="Brief description of this audio…"
                className="w-full border border-mist bg-white px-3 py-2 text-sm focus-visible:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink/70">
                Description (Malayalam)
              </label>
              <textarea
                rows={3}
                value={form.descriptionMalayalam}
                onChange={(e) => setForm({ ...form, descriptionMalayalam: e.target.value })}
                placeholder="ഈ ഓഡിയോയെക്കുറിച്ച് ഒരു വിവരണം…"
                className="w-full border border-mist bg-white px-3 py-2 text-sm focus-visible:border-gold"
              />
            </div>
          </div>

          {/* Narrator */}
          <div>
            <label className="mb-1 block text-sm text-ink/70">Narrator / Artist</label>
            <input
              value={form.narrator}
              onChange={(e) => setForm({ ...form, narrator: e.target.value })}
              placeholder="Rajendran Kaippallil"
              className="w-full border border-mist bg-white px-3 py-2 text-sm focus-visible:border-gold"
            />
          </div>
        </div>

        {/* ── Right: Sidebar ── */}
        <div className="space-y-6">

          {/* Cover Image */}
          <div className="border border-mist bg-white p-4">
            <p className="mb-3 text-sm font-semibold text-ink">Cover Image</p>

            <label
              htmlFor="cover-image-input"
              className="group block cursor-pointer overflow-hidden rounded-lg border border-dashed border-mist bg-paper-warm transition hover:border-moss/50"
            >
              {coverUploading ? (
                <div className="flex aspect-square items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-moss" />
                </div>
              ) : form.coverImage ? (
                <div className="relative">
                  <img
                    src={resolveMediaUrl(form.coverImage)}
                    alt="Cover"
                    className="aspect-square w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                </div>
              ) : (
                <div className="flex aspect-square flex-col items-center justify-center gap-2 text-center p-4">
                  <ImageIcon className="h-8 w-8 text-mist" />
                  <p className="text-xs text-ink/40">Click to upload cover art</p>
                </div>
              )}
            </label>
            <input
              id="cover-image-input"
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="hidden"
            />
            <p className="mt-2 text-[10px] text-ink/30">
              Recommended: 500×500px square image
            </p>
          </div>

          {/* Category */}
          <div className="border border-mist bg-white p-4">
            <label className="mb-2 block text-sm font-semibold text-ink">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as AudioCategory })}
              className="w-full border border-mist bg-white px-3 py-2 text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Featured toggle */}
          <div className="border border-mist bg-white p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="sr-only"
                />
                <div
                  className={`h-6 w-11 rounded-full transition-colors ${
                    form.featured ? "bg-moss" : "bg-mist"
                  }`}
                />
                <div
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    form.featured ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Featured</p>
                <p className="text-[11px] text-ink/40">Show prominently on the website</p>
              </div>
            </label>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving || audioUploading}
            className="w-full bg-ink px-4 py-3 text-sm font-semibold text-paper hover:bg-moss disabled:opacity-50 transition"
          >
            {saving ? (
              <span className="inline-flex items-center gap-2 justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </span>
            ) : isNew ? (
              "Add Audio Track"
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
