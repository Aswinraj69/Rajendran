import { useState } from "react";
import { useNavigate, Navigate, Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Globe, CheckCircle2, Lock, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const { login, user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const isLoggedOut = searchParams.get("logged_out") === "true";
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/admin/dashboard" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back to Studio!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 sm:px-6 py-12 text-paper overflow-hidden">
      {/* Radiant Background Blur Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-sky-500/15 blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 h-[400px] w-[400px] rounded-full bg-orange-500/10 blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Top Back to Website Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs font-bold text-paper/80 hover:bg-white/10 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4 text-sky-400" />
            Back to Website
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition"
          >
            <Globe className="h-3.5 w-3.5" />
            Public Home
          </Link>
        </div>

        {/* Card Container */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header with Logo */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="h-11 w-11 rounded-full object-cover ring-2 ring-sky-400/40"
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-400 font-manrope">
                Rajendran Kaippallil Studio
              </p>
              <h1 className="font-display text-2xl font-bold text-white">
                Admin Portal
              </h1>
            </div>
          </div>

          {/* Logged Out Notice & Return to Website Button */}
          {isLoggedOut && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <p className="text-xs font-bold font-manrope">
                  You have been securely logged out.
                </p>
              </div>
              <p className="text-xs text-paper/70 leading-relaxed font-manrope">
                Thank you for your session. You can now return to the public website or sign back in below.
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-3 text-xs font-bold text-white shadow-glow-sky hover:from-sky-600 hover:to-orange-500 transition active:scale-[0.98]"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Website
              </Link>
            </div>
          )}

          {/* Login Form */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-4 w-4 text-orange-400" />
              <h2 className="text-sm font-bold text-paper/90 font-manrope">
                Sign in to manage stories, videos, and inquiries
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-paper/70 font-manrope">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rajendrankaipallil.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-paper placeholder:text-paper/30 transition focus:border-sky-400 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-paper/70 font-manrope">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-paper placeholder:text-paper/30 transition focus:border-sky-400 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-orange-500 px-5 py-3.5 text-sm font-bold text-white shadow-glow-dual hover:scale-[1.01] active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Authenticating..." : "Sign in to Studio"}
              </button>
            </form>
          </div>

          {/* Footer Back to Site Action */}
          {!isLoggedOut && (
            <div className="pt-3 border-t border-white/10 text-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-paper/80 hover:bg-white/10 hover:text-white transition"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-sky-400" />
                Return to Website
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
