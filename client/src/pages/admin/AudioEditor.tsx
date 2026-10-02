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
  AlertCircle,
  X,
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
  duration: 0,
  featured: false,
  narrator: "Rajendran Kaippallil",
};

export default function AudioEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [audioUploading, setAudioUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState("");
  const [audioFileName, setAudioFileName] = useState("");
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; audio?: string; cover?: string; general?: string }>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  /* ── Load existing track for editing ── */
  useEffect(() => {
    if (isNew) return;
    getAudio(id!)
      .then((res) => {
        const data = res.data;
        setForm({
          titleMalayalam: data.titleMalayalam || "",
          titleEnglish: data.titleEnglish || "",
          descriptionMalayalam: data.descriptionMalayalam || "",
          descriptionEnglish: data.descriptionEnglish || "",
          audioUrl: data.audioUrl || "",
          coverImage: data.coverImage || "",
          category: data.category || "voice",
          duration: data.duration || 0,
          featured: data.featured || false,
          narrator: data.narrator || "Rajendran Kaippallil",
        });
        if (data.audioUrl) {
          setAudioPreviewUrl(resolveMediaUrl(data.audioUrl));
          setAudioFileName(data.originalName || data.audioUrl.split("/").pop() || "Audio File");
        }
      })
      .catch(() => toast.error("Failed to load audio track"))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  /* ── Audio file upload with validation ── */
  async function handleAudioFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check type
    const isAudio =
      file.type.startsWith("audio/") ||
      /\.(mp3|wav|ogg|aac|m4a|flac)$/i.test(file.name);

    if (!isAudio) {
      const msg = `Unsupported audio format "${file.name.split(".").pop() || "unknown"}". Allowed: MP3, WAV, OGG, AAC, M4A, FLAC.`;
      setErrors((prev) => ({ ...prev, audio: msg }));
      toast.error(msg);
      return;
    }

    // Check size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      const actualSize = formatFileSize(file.size);
      const msg = `Audio file too large (${actualSize}). Maximum allowed size is 100MB.`;
      setErrors((prev) => ({ ...prev, audio: msg }));
      toast.error(msg);
      return;
    }

    setErrors((prev) => ({ ...prev, audio: undefined }));

    // Local preview while uploading
    const localUrl = URL.createObjectURL(file);
    setAudioPreviewUrl(localUrl);
    setAudioFileName(file.name);

    setAudioUploading(true);
    try {
      const res = await uploadAudioFile(file);
      setForm((f) => ({ ...f, audioUrl: res.url }));
      setAudioPreviewUrl(resolveMediaUrl(res.url));
      toast.success("Audio file uploaded successfully!");

      // Get duration from audio element
      const tempAudio = new Audio(localUrl);
      tempAudio.addEventListener("loadedmetadata", () => {
        if (!isNaN(tempAudio.duration)) {
          setForm((f) => ({ ...f, duration: Math.round(tempAudio.duration) }));
        }
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload audio file";
      setErrors((prev) => ({ ...prev, audio: msg }));
      toast.error(msg);
      setAudioPreviewUrl("");
      setAudioFileName("");
    } finally {
      setAudioUploading(false);
    }
  }

  /* ── Cover image upload with validation ── */
  async function handleCoverImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage =
      file.type.startsWith("image/") ||
      /\.(jpe?g|png|webp|gif|avif)$/i.test(file.name);

    if (!isImage) {
      const msg = `Unsupported image format "${file.name.split(".").pop() || "unknown"}". Allowed: JPG, PNG, WEBP, GIF.`;
      setErrors((prev) => ({ ...prev, cover: msg }));
      toast.error(msg);
      return;
    }

    // Check size (25MB max)
    if (file.size > 25 * 1024 * 1024) {
      const actualSize = formatFileSize(file.size);
      const msg = `Cover image is too large (${actualSize}). Maximum allowed is 25MB.`;
      setErrors((prev) => ({ ...prev, cover: msg }));
      toast.error(msg);
      return;
    }

    setErrors((prev) => ({ ...prev, cover: undefined }));
    setCoverUploading(true);

    try {
      const res = await uploadThumbnail(file);
      setForm((f) => ({ ...f, coverImage: res.url }));
      toast.success("Cover image uploaded successfully!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload cover image";
      setErrors((prev) => ({ ...prev, cover: msg }));
      toast.error(msg);
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

  const validateForm = (): boolean => {
    const newErrors: { title?: string; audio?: string; general?: string } = {};

    if (!form.titleEnglish.trim() && !form.titleMalayalam.trim()) {
      newErrors.title = "Please provide an English or Malayalam title.";
    }

    if (!form.audioUrl.trim()) {
      newErrors.audio = "Please upload an audio file or enter an audio track URL.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return false;
    }

    return true;
  };

  /* ── Save ── */
  async function handleSave() {
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (isNew) {
        await createAudioTrack(form);
        toast.success("Audio track created successfully!");
      } else {
        await updateAudioTrack(id!, form);
        toast.success("Audio track updated successfully!");
      }
      navigate("/admin/audio");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save audio track";
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
        onClick={() => navigate("/admin/audio")}
        className="inline-flex items-center gap-2 text-sm text-ink/50 hover:text-moss"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Audio
      </button>

      <h1 className="mt-4 font-display text-3xl text-ink">
        {isNew ? "Add Audio Track" : "Edit Audio Track"}
      </h1>
      <p className="mt-1 text-xs text-ink/40">
        Upload MP3 voice recordings, songs, poetry, or stories that visitors can stream on the website.
      </p>

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

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">

        {/* ── Left: Main fields ── */}
        <div className="space-y-6">

          {/* Audio File Upload */}
          <div className={`rounded-xl border-2 border-dashed p-6 transition ${
            errors.audio ? "border-red-400 bg-red-50/20" : "border-mist bg-paper-warm"
          }`}>
            <p className="mb-2 text-sm font-semibold text-ink">
              Audio File <span className="text-rust">*</span>
            </p>

            {errors.audio && (
              <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-red-600">
                <AlertCircle className="h-4 w-4" />
                {errors.audio}
              </p>
            )}

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
              accept="audio/*,.mp3,.wav,.ogg,.aac,.m4a,.flac"
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
              <label className="mb-1 block text-sm font-medium text-ink/70">
                Title (English) {!form.titleMalayalam && <span className="text-red-500">*</span>}
              </label>
              <input
                value={form.titleEnglish}
                onChange={(e) => {
                  setForm({ ...form, titleEnglish: e.target.value });
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="e.g. Voice of the River"
                className={`w-full border bg-white px-3 py-2 text-sm focus-visible:outline-none transition ${
                  errors.title ? "border-red-400 bg-red-50/20 focus-visible:border-red-500" : "border-mist focus-visible:border-gold"
                }`}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/70">
                Title (Malayalam) {!form.titleEnglish && <span className="text-red-500">*</span>}
              </label>
              <input
                value={form.titleMalayalam}
                onChange={(e) => {
                  setForm({ ...form, titleMalayalam: e.target.value });
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="e.g. നദിയുടെ ശബ്ദം"
                className={`w-full border bg-white px-3 py-2 text-sm focus-visible:outline-none transition ${
                  errors.title ? "border-red-400 bg-red-50/20 focus-visible:border-red-500" : "border-mist focus-visible:border-gold"
                }`}
              />
            </div>
          </div>

          {errors.title && (
            <p className="text-xs text-red-600 -mt-4 flex items-center gap-1 font-medium">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.title}
            </p>
          )}

          {/* Bilingual Descriptions */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/70">
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
              <label className="mb-1 block text-sm font-medium text-ink/70">
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
            <label className="mb-1 block text-sm font-medium text-ink/70">Narrator / Artist</label>
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
            <p className="mb-3 text-sm font-semibold text-ink">Cover Image (Optional)</p>

            {errors.cover && (
              <p className="mb-2 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.cover}
              </p>
            )}

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
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={handleCoverImageChange}
              className="hidden"
            />
            <p className="mt-2 text-[10px] text-ink/40">
              JPG, PNG, WEBP up to 25MB · Recommended 500×500px
            </p>
          </div>

          {/* Category */}
          <div className="border border-mist bg-white p-4">
            <label className="mb-2 block text-sm font-semibold text-ink">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as AudioCategory })}
              className="w-full border border-mist bg-white px-3 py-2 text-sm capitalize"
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
