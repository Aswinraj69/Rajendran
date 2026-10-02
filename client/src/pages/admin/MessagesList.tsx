import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Trash2,
  Mail,
  MailOpen,
  Search,
  ExternalLink,
  Phone,
  Clock,
  CheckCircle,
  Eye,
  X,
  RefreshCw,
} from "lucide-react";
import {
  listContactMessages,
  toggleContactMessageRead,
  deleteContactMessage,
} from "../../api/contact";
import { ContactMessage } from "../../types";

export default function MessagesList() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await listContactMessages({
        page,
        limit: 50,
        read: filter === "all" ? undefined : filter === "read",
      });
      setMessages(res.data);
      if (res.meta) {
        setTotalPages(res.meta.totalPages);
        setTotalCount(res.meta.total);
        setUnreadCount(res.meta.unreadCount ?? 0);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, filter]);

  async function handleToggleRead(msg: ContactMessage) {
    try {
      const updated = await toggleContactMessageRead(msg._id, !msg.read);
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, read: updated.data.read } : m))
      );
      if (selectedMessage && selectedMessage._id === msg._id) {
        setSelectedMessage({ ...selectedMessage, read: updated.data.read });
      }
      setUnreadCount((prev) => (msg.read ? prev + 1 : Math.max(0, prev - 1)));
      toast.success(updated.data.read ? "Marked as read" : "Marked as unread");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteContactMessage(id);
      toast.success("Message deleted successfully");
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete message");
    }
  }

  function handleOpenMessage(msg: ContactMessage) {
    setSelectedMessage(msg);
    if (!msg.read) {
      handleToggleRead(msg);
    }
  }

  const filteredMessages = messages.filter((m) => {
    if (!q) return true;
    const query = q.toLowerCase();
    return (
      (m.name || "").toLowerCase().includes(query) ||
      (m.email || "").toLowerCase().includes(query) ||
      (m.phone || "").toLowerCase().includes(query) ||
      (m.subject || "").toLowerCase().includes(query) ||
      (m.message || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Contact Messages & Inquiries</h1>
          <p className="mt-1 text-xs text-ink/60">
            View, review, and reply to messages sent by visitors and readers from the Contact page.
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-white px-3.5 py-2 text-xs font-semibold text-sky-700 shadow-xs hover:bg-sky-50 transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-sky-100 bg-white p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/50">Total Inquiries</p>
          <p className="mt-2 text-2xl font-bold text-ink">{totalCount}</p>
        </div>
        <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-700">Unread Messages</p>
          <p className="mt-2 text-2xl font-bold text-orange-600">{unreadCount}</p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Read / Resolved</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{Math.max(0, totalCount - unreadCount)}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-paper-ice p-1 rounded-xl border border-sky-100">
          <button
            onClick={() => { setFilter("all"); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              filter === "all" ? "bg-white text-sky-700 shadow-xs" : "text-ink/60 hover:text-ink"
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => { setFilter("unread"); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              filter === "unread" ? "bg-white text-orange-600 shadow-xs" : "text-ink/60 hover:text-ink"
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => { setFilter("read"); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              filter === "read" ? "bg-white text-emerald-700 shadow-xs" : "text-ink/60 hover:text-ink"
            }`}
          >
            Read
          </button>
        </div>

        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, phone, subject..."
            className="w-full rounded-xl border border-sky-100 bg-white py-2 pl-9 pr-3 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="divide-y divide-sky-100 border border-sky-100 bg-white rounded-xl overflow-hidden shadow-xs">
        {loading && <p className="p-8 text-center text-sm text-ink/40">Loading messages...</p>}
        {!loading && filteredMessages.length === 0 && (
          <div className="p-12 text-center">
            <Mail className="mx-auto h-10 w-10 text-ink/30" />
            <p className="mt-3 text-sm font-semibold text-ink/70">No contact inquiries found.</p>
            <p className="mt-1 text-xs text-ink/40">Inquiries submitted via the public contact form will appear here.</p>
          </div>
        )}
        {filteredMessages.map((msg) => {
          const formattedDate = msg.createdAt
            ? new Date(msg.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Recently";

          return (
            <div
              key={msg._id}
              className={`p-5 transition hover:bg-sky-50/40 flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                !msg.read ? "bg-sky-50/20 font-medium" : ""
              }`}
            >
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {!msg.read ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                      New / Unread
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      <CheckCircle className="h-3 w-3" />
                      Read
                    </span>
                  )}
                  <span className="font-bold text-sm text-ink">{msg.name}</span>
                  <span className="text-xs text-ink/40">•</span>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs font-semibold text-sky-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Mail className="h-3 w-3" />
                    {msg.email}
                  </a>
                  {msg.phone && (
                    <>
                      <span className="text-xs text-ink/40">•</span>
                      <a
                        href={`tel:${msg.phone}`}
                        className="text-xs font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        {msg.phone}
                      </a>
                    </>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-ink">
                    {msg.subject || "(No Subject)"}
                  </h4>
                  <p className="mt-1 text-xs text-ink/70 line-clamp-2 leading-relaxed font-manrope">
                    {msg.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-ink/40">
                  <Clock className="h-3 w-3" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                <button
                  onClick={() => handleOpenMessage(msg)}
                  className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50/50 px-3 py-1.5 text-xs font-bold text-sky-700 hover:bg-sky-100 transition"
                  title="View full inquiry"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
                <button
                  onClick={() => handleToggleRead(msg)}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                    msg.read
                      ? "border-mist text-ink/60 hover:bg-mist/30"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                  title={msg.read ? "Mark as unread" : "Mark as read"}
                >
                  {msg.read ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                  {msg.read ? "Unread" : "Read"}
                </button>
                <a
                  href={`mailto:${msg.email}?subject=${encodeURIComponent("Re: " + msg.subject)}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-orange-200 bg-orange-50/50 px-2.5 py-1.5 text-xs font-semibold text-orange-700 hover:bg-orange-100 transition"
                  title="Reply by email"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Reply
                </a>
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="inline-flex items-center justify-center rounded-lg p-1.5 text-red-500 hover:bg-red-50 transition"
                  title="Delete message"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-ink/60">
          <span>
            Page {page} of {totalPages} ({totalCount} items)
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded border border-mist bg-white px-3 py-1 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border border-mist bg-white px-3 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-2xl rounded-2xl border border-sky-100 bg-white p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-ink/50 hover:bg-paper-ice hover:text-ink transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-700">
                    Contact Message
                  </span>
                  {selectedMessage.createdAt && (
                    <span className="text-xs text-ink/40">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-2xl font-bold text-ink">
                  {selectedMessage.subject || "(No Subject)"}
                </h3>
              </div>

              {/* Sender Info Card */}
              <div className="rounded-xl border border-sky-100 bg-paper-ice p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-bold text-ink/50 uppercase tracking-wider">Sender Name</span>
                  <p className="mt-0.5 font-bold text-sm text-ink">{selectedMessage.name}</p>
                </div>
                <div>
                  <span className="font-bold text-ink/50 uppercase tracking-wider">Email Address</span>
                  <p className="mt-0.5 font-semibold text-sky-600">
                    <a href={`mailto:${selectedMessage.email}`} className="hover:underline">
                      {selectedMessage.email}
                    </a>
                  </p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <span className="font-bold text-ink/50 uppercase tracking-wider">Phone Number</span>
                    <p className="mt-0.5 font-semibold text-emerald-600">
                      <a href={`tel:${selectedMessage.phone}`} className="hover:underline">
                        {selectedMessage.phone}
                      </a>
                    </p>
                  </div>
                )}
                <div>
                  <span className="font-bold text-ink/50 uppercase tracking-wider">Status</span>
                  <p className="mt-0.5 font-semibold text-ink">
                    {selectedMessage.read ? "Read" : "Unread"}
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50 mb-2">
                  Message Body
                </h4>
                <div className="rounded-xl border border-sky-100 bg-white p-5 text-sm text-ink leading-relaxed font-manrope whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-sky-100">
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent("Re: " + selectedMessage.subject)}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-5 py-2.5 text-xs font-bold text-white shadow-glow-sky hover:from-sky-600 hover:to-orange-500 transition"
                  >
                    <Mail className="h-4 w-4" />
                    Reply via Email
                  </a>
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-xs font-bold text-sky-700 hover:bg-sky-50 transition"
                  >
                    {selectedMessage.read ? "Mark Unread" : "Mark Read"}
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
