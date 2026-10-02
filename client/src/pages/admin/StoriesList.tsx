import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Search, BookOpen } from "lucide-react";
import { listAdminStories, deleteStory } from "../../api/stories";
import { Story } from "../../types";
import { resolveMediaUrl } from "../../utils/media";

export default function StoriesList() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  async function load() {
    setLoading(true);
    try {
      const res = await listAdminStories({ q, status });
      setStories(res.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load stories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status]);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this story? This can't be undone.")) return;
    try {
      await deleteStory(id);
      toast.success("Story deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ink">Stories</h1>
        <Link to="/admin/stories/new" className="inline-flex items-center gap-2 bg-ink px-4 py-2 text-sm text-paper hover:bg-moss">
          <Plus className="h-4 w-4" /> Add Story
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search stories…"
            className="w-full border border-mist bg-white py-2 pl-9 pr-3 text-sm focus-visible:border-gold"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-mist bg-white px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="mt-6 divide-y divide-mist border border-mist bg-white">
        {loading && <p className="p-4 text-sm text-ink/40">Loading…</p>}
        {!loading && stories.length === 0 && (
          <p className="p-4 text-sm text-ink/40">No stories yet — create your first one.</p>
        )}
        {stories.map((story) => (
          <div key={story._id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3">
              {story.coverImage ? (
                <img
                  src={resolveMediaUrl(story.coverImage)}
                  alt=""
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/cover-about.jpg";
                  }}
                  className="h-12 w-12 rounded object-cover border border-mist"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded bg-sand/30 border border-mist text-ink/40">
                  <BookOpen className="h-5 w-5" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-ink">{story.titleEnglish || story.titleMalayalam}</p>
                <p className="mt-0.5 text-xs uppercase tracking-wide text-ink/40">
                  {story.category} · {story.status}
                  {story.featured ? " · Featured" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/admin/stories/${story._id}`}
                className="rounded p-2 text-ink/60 hover:bg-ink/5 hover:text-ink"
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleDelete(story._id)}
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
