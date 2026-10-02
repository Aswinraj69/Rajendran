import React, { useEffect, useState } from "react";
import { Heart, Share2, MessageSquare, Send, User, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  likeStory,
  shareStory,
  getStoryComments,
  addStoryComment,
} from "../../api/engagement";
import { Comment, Story } from "../../types";
import { useLanguage } from "../../context/LanguageContext";

interface StoryEngagementProps {
  story: Story;
  onStoryUpdate?: (updatedStory: Partial<Story>) => void;
}

export function StoryEngagement({ story, onStoryUpdate }: StoryEngagementProps) {
  const { language } = useLanguage();
  const [likesCount, setLikesCount] = useState(story.likesCount || 0);
  const [sharesCount, setSharesCount] = useState(story.sharesCount || 0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

  // User liked state from localStorage
  const storageKey = `rk_liked_${story._id || story.slug}`;
  const [isLiked, setIsLiked] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === "true";
    } catch {
      return false;
    }
  });
  const [likePending, setLikePending] = useState(false);

  // Comment form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync state if story prop changes
  useEffect(() => {
    setLikesCount(story.likesCount || 0);
    setSharesCount(story.sharesCount || 0);
  }, [story._id, story.likesCount, story.sharesCount]);

  // Load comments
  useEffect(() => {
    let isMounted = true;
    setLoadingComments(true);
    getStoryComments(story._id || story.slug)
      .then((res) => {
        if (isMounted) setComments(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load comments:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingComments(false);
      });

    return () => {
      isMounted = false;
    };
  }, [story._id, story.slug]);

  // Handle Like click
  const handleLike = async () => {
    if (likePending) return;
    setLikePending(true);

    const action = isLiked ? "unlike" : "like";
    // Optimistic update
    const newLiked = !isLiked;
    const optimisticCount = Math.max(0, likesCount + (newLiked ? 1 : -1));
    setIsLiked(newLiked);
    setLikesCount(optimisticCount);

    try {
      localStorage.setItem(storageKey, newLiked ? "true" : "false");
      const res = await likeStory(story._id || story.slug, action);
      setLikesCount(res.likesCount);
      if (onStoryUpdate) onStoryUpdate({ likesCount: res.likesCount });
      if (newLiked) {
        toast.success(language === "ml" ? "ഇഷ്ടപ്പെട്ടു!" : "Story liked!");
      }
    } catch {
      // Revert on error
      setIsLiked(!newLiked);
      setLikesCount(likesCount);
      localStorage.setItem(storageKey, (!newLiked).toString());
      toast.error("Failed to update like status");
    } finally {
      setLikePending(false);
    }
  };

  // Handle Share click
  const handleShare = async () => {
    const currentUrl = window.location.href;
    const shareTitle = story.titleEnglish || story.titleMalayalam || "Rajendran Kaipallil Story";

    // Call API to record share in background
    shareStory(story._id || story.slug)
      .then((res) => {
        setSharesCount(res.sharesCount);
        if (onStoryUpdate) onStoryUpdate({ sharesCount: res.sharesCount });
      })
      .catch(() => {});

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Read "${shareTitle}" by Rajendran Kaipallil`,
          url: currentUrl,
        });
        toast.success(language === "ml" ? "പങ്കുവെച്ചു!" : "Shared successfully!");
        return;
      } catch (err: unknown) {
        // User cancelled share or unsupported
        if ((err as Error).name === "AbortError") return;
      }
    }

    // Fallback: Copy link to clipboard
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      toast.success(
        language === "ml"
          ? "ലിങ്ക് കോപ്പി ചെയ്തു! സുഹൃത്തുക്കളുമായി പങ്കിടാം."
          : "Link copied to clipboard! Ready to share."
      );
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      toast.error("Could not copy link");
    }
  };

  // Scroll to comments
  const scrollToComments = () => {
    const commentsEl = document.getElementById("story-comments-section");
    if (commentsEl) {
      commentsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle Comment submit
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(language === "ml" ? "ദയവായി നിങ്ങളുടെ പേര് നൽകുക" : "Please enter your name");
      return;
    }
    if (!commentText.trim()) {
      toast.error(language === "ml" ? "അഭിപ്രായം രേഖപ്പെടുത്തുക" : "Please enter your comment");
      return;
    }

    try {
      setSubmittingComment(true);
      const res = await addStoryComment(story._id || story.slug, {
        authorName: name.trim(),
        authorEmail: email.trim() || undefined,
        content: commentText.trim(),
      });

      setComments((prev) => [res.data, ...prev]);
      setCommentText("");
      toast.success(
        language === "ml"
          ? "അഭിപ്രായം വിജയകരമായി ചേർത്തു!"
          : "Thank you! Your comment has been posted."
      );
      if (onStoryUpdate) {
        onStoryUpdate({ commentsCount: (story.commentsCount || 0) + 1 });
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="mt-14 pt-8 border-t border-mist/80">
      {/* ═══════════════════════════════════════
          ENGAGEMENT ACTION BAR (Like, Share, Comments)
          ═══════════════════════════════════════ */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-paper-warm/70 p-4 sm:p-5 border border-mist shadow-xs">
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleLike}
            disabled={likePending}
            className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition duration-200 active:scale-95 ${
              isLiked
                ? "bg-red-50 text-red-600 ring-1 ring-red-200 shadow-xs"
                : "bg-white text-ink/70 hover:text-red-600 hover:bg-red-50/50 shadow-xs border border-mist/70"
            }`}
            title="Like this story"
          >
            <Heart
              className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
                isLiked ? "fill-red-600 text-red-600" : "text-ink/60 group-hover:text-red-600"
              }`}
            />
            <span>{likesCount}</span>
            <span className="hidden sm:inline font-normal text-xs text-ink/50">
              {likesCount === 1 ? "Like" : "Likes"}
            </span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/70 hover:text-moss hover:bg-moss/5 transition duration-200 active:scale-95 shadow-xs border border-mist/70"
            title="Share this story"
          >
            {copiedLink ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Share2 className="h-4 w-4 text-ink/60 group-hover:text-moss transition-transform duration-200 group-hover:rotate-12" />
            )}
            <span>{sharesCount}</span>
            <span className="hidden sm:inline font-normal text-xs text-ink/50">
              {sharesCount === 1 ? "Share" : "Shares"}
            </span>
          </button>

          {/* Comment Count / Scroll Button */}
          <button
            type="button"
            onClick={scrollToComments}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/70 hover:text-ink hover:bg-paper-sand transition duration-200 shadow-xs border border-mist/70"
            title="View comments"
          >
            <MessageSquare className="h-4 w-4 text-ink/60" />
            <span>{comments.length}</span>
            <span className="hidden sm:inline font-normal text-xs text-ink/50">
              {comments.length === 1 ? "Comment" : "Comments"}
            </span>
          </button>
        </div>

        <div className="text-xs text-ink/50 italic">
          {language === "ml"
            ? "നിങ്ങളുടെ ചിന്തകൾ പങ്കുവെക്കൂ"
            : "Engage & connect with the author"}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          COMMENTS SECTION
          ═══════════════════════════════════════ */}
      <section id="story-comments-section" className="mt-14 scroll-mt-28">
        <div className="flex items-center justify-between border-b border-mist pb-4">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-2xl text-ink">
              {language === "ml" ? "അഭിപ്രായങ്ങൾ" : "Thoughts & Comments"}
            </h3>
            <span className="rounded-full bg-moss/10 px-2.5 py-0.5 text-xs font-bold text-moss">
              {comments.length}
            </span>
          </div>
          <span className="text-xs text-ink/40">
            {language === "ml" ? "പരസ്യമായ പ്രതികരണങ്ങൾ" : "Public reader discussions"}
          </span>
        </div>

        {/* Comment Submission Form */}
        <form
          onSubmit={handleCommentSubmit}
          className="mt-8 rounded-2xl border border-mist bg-gradient-to-b from-white to-paper-warm/40 p-6 shadow-xs"
        >
          <h4 className="font-display text-lg text-ink font-medium mb-4">
            {language === "ml" ? "ഒരു അഭിപ്രായം രേഖപ്പെടുത്തുക" : "Leave a thought on this story"}
          </h4>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/60 mb-1.5">
                {language === "ml" ? "പേര്" : "Your Name"} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === "ml" ? "നിങ്ങളുടെ പേര്" : "e.g. Anandhu / Meera"}
                  className="w-full rounded-xl border border-mist bg-white pl-9 pr-3 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition"
                />
                <User className="absolute left-3 top-3 h-4 w-4 text-ink/40" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/60 mb-1.5">
                {language === "ml" ? "ഇമെയിൽ (ഓപ്ഷണൽ)" : "Email (Optional, not published)"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full rounded-xl border border-mist bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/60 mb-1.5">
              {language === "ml" ? "അഭിപ്രായം" : "Your Comment"} <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                language === "ml"
                  ? "ഈ രചനയെക്കുറിച്ചുള്ള നിങ്ങളുടെ ചിന്തകൾ എഴുതുക…"
                  : "Share your reflections, thoughts, or reflections on this piece…"
              }
              className="w-full rounded-xl border border-mist bg-white p-3 text-sm text-ink placeholder:text-ink/30 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition resize-y"
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-[11px] text-ink/40">
              {language === "ml"
                ? "അഭിപ്രായങ്ങൾ കൃത്യമായി രേഖപ്പെടുത്തപ്പെടും."
                : "Comments are moderated to maintain respectful literary discussions."}
            </p>
            <button
              type="submit"
              disabled={submittingComment}
              className="inline-flex items-center gap-2 rounded-xl bg-moss px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-moss-light transition active:scale-95 disabled:opacity-50"
            >
              {submittingComment ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Posting…</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>{language === "ml" ? "പ്രസിദ്ധീകരിക്കുക" : "Post Comment"}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Existing Comments List */}
        <div className="mt-8 space-y-4">
          {loadingComments ? (
            <div className="space-y-4 py-8">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border border-mist bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-mist" />
                    <div className="space-y-1">
                      <div className="h-3.5 w-28 rounded bg-mist" />
                      <div className="h-2.5 w-16 rounded bg-mist" />
                    </div>
                  </div>
                  <div className="mt-3 h-12 w-full rounded bg-mist/60" />
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-mist bg-paper-warm/40 p-8 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-ink/30" />
              <p className="mt-3 font-display text-base text-ink font-medium">
                {language === "ml"
                  ? "ഇതുവരെ അഭിപ്രായങ്ങൾ രേഖപ്പെടുത്തിയിട്ടില്ല."
                  : "No comments yet"}
              </p>
              <p className="mt-1 text-xs text-ink/50">
                {language === "ml"
                  ? "ഈ രചനയെക്കുറിച്ച് ആദ്യം പ്രതികരിക്കാൻ മുകളിലെ ഫോം ഉപയോഗിക്കുക."
                  : "Be the first reader to share your reflection on this work!"}
              </p>
            </div>
          ) : (
            comments.map((comment) => {
              const initials = comment.authorName
                ? comment.authorName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "R";

              const formattedDate = comment.createdAt
                ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Recently";

              return (
                <div
                  key={comment._id}
                  className="rounded-2xl border border-mist/80 bg-white p-5 shadow-xs transition hover:border-mist hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-moss/20 to-gold/20 font-display text-sm font-bold text-moss ring-1 ring-moss/20">
                        {initials}
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-ink">
                          {comment.authorName}
                        </h5>
                        <p className="text-[11px] text-ink/40">{formattedDate}</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink/80 whitespace-pre-line pl-13">
                    {comment.content}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
