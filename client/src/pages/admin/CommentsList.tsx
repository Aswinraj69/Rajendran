import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, MessageSquare, Search, ExternalLink } from "lucide-react";
import { listAllComments, deleteComment } from "../../api/engagement";
import { Comment } from "../../types";

export default function CommentsList() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  async function load() {
    setLoading(true);
    try {
      const res = await listAllComments(page, 50);
      setComments(res.data);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages);
        setTotalCount(res.pagination.total);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page]);

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteComment(id);
      toast.success("Comment deleted successfully");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete comment");
    }
  }

  const filteredComments = comments.filter((c) => {
    if (!q) return true;
    const query = q.toLowerCase();
    const author = (c.authorName || "").toLowerCase();
    const content = (c.content || "").toLowerCase();
    const storyTitle = typeof c.storyId === "object" && c.storyId !== null
      ? ((c.storyId.titleEnglish || "") + " " + (c.storyId.titleMalayalam || "")).toLowerCase()
      : "";
    return author.includes(query) || content.includes(query) || storyTitle.includes(query);
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Reader Comments</h1>
          <p className="mt-1 text-xs text-ink/60">
            Moderate and manage public reader comments across all published stories ({totalCount} total).
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by author, content, or story..."
            className="w-full border border-mist bg-white py-2 pl-9 pr-3 text-sm focus-visible:border-gold"
          />
        </div>
      </div>

      <div className="mt-6 divide-y divide-mist border border-mist bg-white rounded-lg overflow-hidden shadow-xs">
        {loading && <p className="p-6 text-sm text-ink/40">Loading comments...</p>}
        {!loading && filteredComments.length === 0 && (
          <div className="p-8 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-ink/30" />
            <p className="mt-2 text-sm text-ink/60">No comments found.</p>
          </div>
        )}
        {filteredComments.map((comment) => {
          const storyObj = typeof comment.storyId === "object" && comment.storyId !== null ? comment.storyId : null;
          const storyTitle = storyObj
            ? storyObj.titleEnglish || storyObj.titleMalayalam || "Untitled Story"
            : "Story";
          const storySlug = storyObj?.slug;

          return (
            <div key={comment._id} className="p-5 flex items-start justify-between gap-4 hover:bg-paper-warm/30 transition">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-sm text-ink">{comment.authorName}</span>
                  {comment.authorEmail && (
                    <span className="text-xs text-ink/40">({comment.authorEmail})</span>
                  )}
                  <span className="text-[11px] text-ink/40">
                    · {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}
                  </span>
                </div>

                <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-line bg-paper-sand/40 p-3 rounded border border-mist/50">
                  {comment.content}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-ink/50">On story:</span>
                  <span className="text-xs font-medium text-moss">{storyTitle}</span>
                  {storySlug && (
                    <a
                      href={`/stories/${storySlug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-ink/40 hover:text-moss inline-flex items-center gap-0.5"
                    >
                      <ExternalLink className="h-3 w-3" /> view
                    </a>
                  )}
                </div>
              </div>

              <div className="shrink-0 pt-1">
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="rounded p-2 text-ink/40 hover:bg-rust/10 hover:text-rust transition"
                  title="Delete Comment"
                >
                  <Trash2 className="h-4.5 w-4.5 text-rust" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border border-mist text-xs font-semibold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-ink/60">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border border-mist text-xs font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
