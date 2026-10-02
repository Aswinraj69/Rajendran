import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardSummary } from "../../api/dashboard";
import { DashboardSummary } from "../../types";
import { Plus, Sliders, Mail, MessageSquare, ArrowRight } from "lucide-react";

const cards: { key: keyof DashboardSummary["counts"]; label: string }[] = [
  { key: "messages", label: "Contact Inquiries" },
  { key: "stories", label: "Total Stories" },
  { key: "videos", label: "Total Videos" },
  { key: "audio", label: "Total Audio" },
  { key: "books", label: "Total Books" },
  { key: "comments", label: "Comments" },
];

export default function AdminDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    getDashboardSummary().then(setSummary).catch(() => setSummary(null));
  }, []);

  const unreadMessagesCount = summary?.counts?.unreadMessages ?? 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink font-bold">Dashboard</h1>
          <p className="mt-1 text-xs text-ink/60">Overview of site content, publications, audio, and reader messages.</p>
        </div>
        {unreadMessagesCount > 0 && (
          <Link
            to="/admin/messages"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 text-white px-4 py-2 text-xs font-bold shadow-glow-orange hover:bg-orange-600 transition animate-pulse"
          >
            <Mail className="h-4 w-4" />
            {unreadMessagesCount} New Contact {unreadMessagesCount === 1 ? "Inquiry" : "Inquiries"}
          </Link>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/admin/messages" className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-700 shadow-sm transition">
          <Mail className="h-4 w-4" /> View Messages
        </Link>
        <Link to="/admin/site-content" className="inline-flex items-center gap-2 rounded-lg bg-moss px-4 py-2 text-sm text-paper hover:bg-moss-light shadow-sm transition">
          <Sliders className="h-4 w-4" /> Edit Site Content
        </Link>
        <Link to="/admin/stories/new" className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm text-paper hover:bg-moss transition">
          <Plus className="h-4 w-4" /> Add Story
        </Link>
        <Link to="/admin/videos/new" className="inline-flex items-center gap-2 rounded-lg border border-ink px-4 py-2 text-sm text-ink hover:border-moss hover:text-moss transition">
          <Plus className="h-4 w-4" /> Add Video
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <div key={c.key} className="border border-mist bg-white rounded-xl p-5 shadow-xs">
            <p className="text-2xl font-display font-bold text-ink">{summary?.counts[c.key] ?? "—"}</p>
            <p className="mt-1 text-xs text-ink/50">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {/* Recent Contact Inquiries */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink">Recent Contact Inquiries</h2>
            <Link to="/admin/messages" className="text-xs font-semibold text-sky-600 hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-sky-100 border border-sky-100 bg-white rounded-xl overflow-hidden shadow-xs">
            {summary?.recentMessages?.length ? (
              summary.recentMessages.map((m) => (
                <li key={m._id} className="flex items-center justify-between px-4 py-3.5 text-sm hover:bg-sky-50/30 transition">
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      {!m.read && (
                        <span className="h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                      )}
                      <span className="font-semibold text-ink truncate">{m.name}</span>
                      <span className="text-xs text-ink/40 truncate">({m.email})</span>
                    </div>
                    <p className="text-xs text-ink/60 truncate mt-0.5">{m.subject || m.message}</p>
                  </div>
                  <span className="text-[11px] text-ink/40 shrink-0">
                    {m.createdAt ? new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                  </span>
                </li>
              ))
            ) : (
              <li className="px-4 py-6 text-center text-sm text-ink/40">No messages received yet</li>
            )}
          </ul>
        </div>

        {/* Recently updated stories */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink">Recently updated stories</h2>
            <Link to="/admin/stories" className="text-xs font-semibold text-sky-600 hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-mist border border-mist bg-white rounded-xl overflow-hidden shadow-xs">
            {summary?.recentStories?.length ? (
              summary.recentStories.map((s) => (
                <li key={s._id} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-paper-warm/30 transition">
                  <span className="truncate pr-2">{s.titleEnglish || s.titleMalayalam}</span>
                  <span className="text-xs uppercase text-ink/40 shrink-0">{s.status}</span>
                </li>
              ))
            ) : (
              <li className="px-4 py-6 text-center text-sm text-ink/40">Nothing yet</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
