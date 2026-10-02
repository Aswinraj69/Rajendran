import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { RichTextEditor } from "../../components/editor/RichTextEditor";
import { createStory, getAdminStory, updateStory } from "../../api/stories";
import { Story, StoryCategory } from "../../types";
import { ThumbnailUploader } from "../../components/ui/ThumbnailUploader";

const categories: StoryCategory[] = ["story", "poem", "essay", "script-note", "article", "other"];

const emptyForm = {
  titleMalayalam: "",
  titleEnglish: "",
  excerptMalayalam: "",
  excerptEnglish: "",
  contentMalayalam: "",
  contentEnglish: "",
  coverImage: "",
  category: "story" as StoryCategory,
  tags: "",
  featured: false,
  status: "draft" as "draft" | "published",
};

export default function StoryEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [activeLang, setActiveLang] = useState<"en" | "ml">("en");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [errors, setErrors] = useState<{ title?: string; general?: string }>({});

  useEffect(() => {
    if (isNew) return;
    getAdminStory(id!)
      .then((story: Story) => {
        setForm({
          titleMalayalam: story.titleMalayalam ?? "",
          titleEnglish: story.titleEnglish ?? "",
          excerptMalayalam: story.excerptMalayalam ?? "",
          excerptEnglish: story.excerptEnglish ?? "",
          contentMalayalam: story.contentMalayalam ?? "",
          contentEnglish: story.contentEnglish ?? "",
          coverImage: story.coverImage ?? "",
          category: story.category,
          tags: story.tags.join(", "),
          featured: story.featured,
          status: story.status,
        });
      })
      .catch(() => toast.error("Failed to load story"))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const validateForm = (targetStatus: "draft" | "published"): boolean => {
    const newErrors: { title?: string; general?: string } = {};

    // Validate title (at least one language required)
    if (!form.titleEnglish.trim() && !form.titleMalayalam.trim()) {
      newErrors.title = "Please provide a title in at least one language (English or Malayalam).";
    }

    if (targetStatus === "published") {
      const hasContent =
        form.contentEnglish.replace(/<[^>]*>/g, "").trim().length > 0 ||
        form.contentMalayalam.replace(/<[^>]*>/g, "").trim().length > 0 ||
        form.excerptEnglish.trim().length > 0 ||
        form.excerptMalayalam.trim().length > 0;

      if (!hasContent) {
        newErrors.general = "Cannot publish an empty story. Please add story content or excerpt.";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return false;
    }

    return true;
  };

  async function handleSave(status: "draft" | "published") {
    if (!validateForm(status)) return;

    setSaving(true);
    const payload = {
      ...form,
      status,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (isNew) {
        const created = await createStory(payload);
        toast.success(status === "published" ? "Story Published successfully!" : "Draft saved successfully!");
        navigate(`/admin/stories/${created._id}`);
      } else {
        await updateStory(id!, payload);
        toast.success(status === "published" ? "Story Published successfully!" : "Draft updated successfully!");
      }
      setErrors({});
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save story";
      setErrors({ general: errorMsg });
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-ink/40">Loading…</p>;

  return (
    <div>
      <button
        onClick={() => navigate("/admin/stories")}
        className="inline-flex items-center gap-2 text-sm text-ink/50 hover:text-moss"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Stories
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">{isNew ? "New Story" : "Edit Story"}</h1>
          <p className="mt-1 text-xs text-ink/50">
            Fill in the details below. Title in either English or Malayalam is required.
          </p>
        </div>
        {form.status === "published" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" /> Published
          </span>
        )}
      </div>

      {/* Global Validation Warning */}
      {errors.general && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="font-semibold">Validation Required</p>
            <p className="mt-0.5">{errors.general}</p>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/70">
                Title (English) {!form.titleMalayalam && <span className="text-red-500">*</span>}
              </label>
              <input
                value={form.titleEnglish}
                onChange={(e) => {
                  setForm({ ...form, titleEnglish: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: undefined });
                }}
                placeholder="e.g. The River Sings at Midnight"
                className={`w-full border bg-white px-3 py-2 text-sm text-ink transition focus-visible:outline-none ${
                  errors.title ? "border-red-400 bg-red-50/20 focus-visible:border-red-500" : "border-mist focus-visible:border-gold"
                }`}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/70">
                Title (Malayalam) {!form.titleEnglish && <span className="text-red-500">*</span>}
              </label>
              <input
                lang="ml"
                value={form.titleMalayalam}
                onChange={(e) => {
                  setForm({ ...form, titleMalayalam: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: undefined });
                }}
                placeholder="ഉദാ: പുഴ പാടിയ രാത്രി"
                className={`w-full border bg-white px-3 py-2 font-sansml text-sm text-ink transition focus-visible:outline-none ${
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

          <ThumbnailUploader
            value={form.coverImage}
            onChange={(url) => setForm({ ...form, coverImage: url })}
            label="Story Thumbnail / Cover Image (Optional)"
            maxSizeMB={25}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/70">Excerpt (English)</label>
              <textarea
                rows={2}
                value={form.excerptEnglish}
                onChange={(e) => setForm({ ...form, excerptEnglish: e.target.value })}
                placeholder="Brief summary or hook in English…"
                className="w-full border border-mist bg-white px-3 py-2 text-sm text-ink focus-visible:border-gold focus-visible:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/70">Excerpt (Malayalam)</label>
              <textarea
                lang="ml"
                rows={2}
                value={form.excerptMalayalam}
                onChange={(e) => setForm({ ...form, excerptMalayalam: e.target.value })}
                placeholder="ലഘു വിവരണം മലയാളത്തിൽ…"
                className="w-full border border-mist bg-white px-3 py-2 font-sansml text-sm text-ink focus-visible:border-gold focus-visible:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveLang("en")}
                className={`px-3 py-1.5 text-sm font-medium transition ${
                  activeLang === "en" ? "bg-ink text-paper" : "bg-white border border-mist text-ink/60 hover:text-ink"
                }`}
              >
                English content {form.contentEnglish ? "✓" : ""}
              </button>
              <button
                type="button"
                onClick={() => setActiveLang("ml")}
                className={`px-3 py-1.5 text-sm font-medium transition ${
                  activeLang === "ml" ? "bg-ink text-paper" : "bg-white border border-mist text-ink/60 hover:text-ink"
                }`}
              >
                Malayalam content {form.contentMalayalam ? "✓" : ""}
              </button>
            </div>
            {activeLang === "en" ? (
              <RichTextEditor
                lang="en"
                content={form.contentEnglish}
                onChange={(html) => setForm({ ...form, contentEnglish: html })}
                placeholder="Write the English version of the story…"
              />
            ) : (
              <RichTextEditor
                lang="ml"
                content={form.contentMalayalam}
                onChange={(html) => setForm({ ...form, contentMalayalam: html })}
                placeholder="മലയാളത്തിൽ എഴുതുക…"
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-mist bg-white p-4">
            <label className="mb-1 block text-sm font-medium text-ink/70">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as StoryCategory })}
              className="w-full border border-mist bg-white px-3 py-2 text-sm text-ink capitalize"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.replace("-", " ")}
                </option>
              ))}
            </select>

            <label className="mb-1 mt-4 block text-sm font-medium text-ink/70">Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="fiction, drama, memory"
              className="w-full border border-mist bg-white px-3 py-2 text-sm text-ink"
            />

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

          <div className="space-y-2">
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="w-full border border-ink px-4 py-2 text-sm font-medium text-ink hover:border-moss hover:text-moss transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="w-full bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-moss transition disabled:opacity-50"
            >
              {saving ? "Publishing..." : "Publish Story"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
