import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
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

  async function handleSave(status: "draft" | "published") {
    setSaving(true);
    const payload = {
      ...form,
      status,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (isNew) {
        const created = await createStory(payload);
        toast.success(status === "published" ? "Published" : "Draft saved");
        navigate(`/admin/stories/${created._id}`);
      } else {
        await updateStory(id!, payload);
        toast.success(status === "published" ? "Published" : "Draft saved");
      }
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
        onClick={() => navigate("/admin/stories")}
        className="inline-flex items-center gap-2 text-sm text-ink/50 hover:text-moss"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Stories
      </button>

      <h1 className="mt-4 font-display text-3xl text-ink">{isNew ? "New Story" : "Edit Story"}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-ink/70">Title (English)</label>
              <input
                value={form.titleEnglish}
                onChange={(e) => setForm({ ...form, titleEnglish: e.target.value })}
                className="w-full border border-mist bg-white px-3 py-2 focus-visible:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink/70">Title (Malayalam)</label>
              <input
                lang="ml"
                value={form.titleMalayalam}
                onChange={(e) => setForm({ ...form, titleMalayalam: e.target.value })}
                className="w-full border border-mist bg-white px-3 py-2 font-sansml focus-visible:border-gold"
              />
            </div>
          </div>

          <ThumbnailUploader
            value={form.coverImage}
            onChange={(url) => setForm({ ...form, coverImage: url })}
            label="Story Thumbnail / Cover Image"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-ink/70">Excerpt (English)</label>
              <textarea
                rows={2}
                value={form.excerptEnglish}
                onChange={(e) => setForm({ ...form, excerptEnglish: e.target.value })}
                className="w-full border border-mist bg-white px-3 py-2 focus-visible:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink/70">Excerpt (Malayalam)</label>
              <textarea
                lang="ml"
                rows={2}
                value={form.excerptMalayalam}
                onChange={(e) => setForm({ ...form, excerptMalayalam: e.target.value })}
                className="w-full border border-mist bg-white px-3 py-2 font-sansml focus-visible:border-gold"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveLang("en")}
                className={`px-3 py-1.5 text-sm ${activeLang === "en" ? "bg-ink text-paper" : "bg-white border border-mist text-ink/60"}`}
              >
                English content
              </button>
              <button
                type="button"
                onClick={() => setActiveLang("ml")}
                className={`px-3 py-1.5 text-sm ${activeLang === "ml" ? "bg-ink text-paper" : "bg-white border border-mist text-ink/60"}`}
              >
                Malayalam content
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
            <label className="mb-1 block text-sm text-ink/70">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as StoryCategory })}
              className="w-full border border-mist bg-white px-3 py-2"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <label className="mb-1 mt-4 block text-sm text-ink/70">Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full border border-mist bg-white px-3 py-2"
            />

            <label className="mt-4 flex items-center gap-2 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured
            </label>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="w-full border border-ink px-4 py-2 text-sm text-ink hover:border-moss hover:text-moss disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="w-full bg-ink px-4 py-2 text-sm text-paper hover:bg-moss disabled:opacity-50"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
