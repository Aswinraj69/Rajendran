import { useState } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Video,
  Music2,
  BookOpen,
  Clapperboard,
  Image,
  MessageSquare,
  Mail,
  Settings,
  Sliders,
  LogOut,
  Menu,
  X,
  Globe,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/site-content", label: "Site Content", icon: Sliders },
  { to: "/admin/messages", label: "Contact Inquiries", icon: Mail },
  { to: "/admin/stories", label: "Stories", icon: FileText },
  { to: "/admin/comments", label: "Comments", icon: MessageSquare },
  { to: "/admin/videos", label: "Videos", icon: Video },
  { to: "/admin/audio", label: "Audio", icon: Music2 },
  { to: "/admin/books", label: "Books", icon: BookOpen, disabled: true },
  { to: "/admin/projects", label: "Projects", icon: Clapperboard, disabled: true },
  { to: "/admin/media", label: "Media", icon: Image, disabled: true },
  { to: "/admin/settings", label: "Settings", icon: Settings, disabled: true },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login?logged_out=true");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-paper text-ink">
      {/* Mobile Top Bar */}
      <div className="flex h-16 items-center justify-between border-b border-mist bg-ink px-4 text-paper md:hidden">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-paper/10 text-paper hover:bg-paper/20"
            aria-label="Open admin menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="font-display text-base font-bold leading-tight">Studio</p>
            <p className="text-[10px] text-paper/50 leading-tight">{user?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-lg bg-sky-500/20 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:bg-sky-500/30 transition"
          >
            <Globe className="h-3.5 w-3.5" />
            Website
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg bg-paper/10 px-3 py-1.5 text-xs text-paper/80 hover:bg-paper/20 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex w-72 max-w-[80vw] flex-col bg-ink text-paper p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-paper/10">
              <div>
                <p className="font-display text-lg font-bold">Studio</p>
                <p className="text-xs text-paper/50">{user?.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-paper/10 text-paper/70 hover:bg-paper/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="pt-3 pb-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-lg bg-sky-500/20 border border-sky-400/30 px-3 py-2 text-xs font-bold text-sky-300 hover:bg-sky-500/30 transition"
              >
                <ArrowLeft className="h-4 w-4 text-sky-400" />
                Return to Public Website
              </Link>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto py-2">
              {links.map(({ to, label, icon: Icon, disabled }) => (
                <NavLink
                  key={to}
                  to={disabled ? "#" : to}
                  onClick={(e) => {
                    if (disabled) {
                      e.preventDefault();
                    } else {
                      setMobileMenuOpen(false);
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      disabled
                        ? "cursor-not-allowed text-paper/30"
                        : isActive
                        ? "bg-paper/15 text-sky-400 font-semibold"
                        : "text-paper/80 hover:bg-paper/5"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {disabled && <span className="ml-auto text-[10px] text-paper/30">soon</span>}
                </NavLink>
              ))}
            </nav>

            <div className="pt-4 border-t border-paper/10 space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-paper/80 hover:bg-paper/5 transition"
              >
                <Globe className="h-4 w-4 text-sky-400" />
                Visit Website
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-red-500/10 transition"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-mist bg-ink text-paper md:flex shrink-0 min-h-screen">
        <div className="px-6 py-6 border-b border-paper/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-bold">Studio</p>
              <p className="text-xs text-paper/50">{user?.name}</p>
            </div>
            <Link
              to="/"
              title="Return to Public Website"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-paper/10 text-paper/70 hover:bg-paper/20 hover:text-sky-300 transition"
            >
              <Globe className="h-4 w-4" />
            </Link>
          </div>

          <Link
            to="/"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-sky-500/15 border border-sky-400/30 px-3 py-2 text-xs font-bold text-sky-300 hover:bg-sky-500/25 transition shadow-2xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to Website
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {links.map(({ to, label, icon: Icon, disabled }) => (
            <NavLink
              key={to}
              to={disabled ? "#" : to}
              onClick={(e) => disabled && e.preventDefault()}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  disabled
                    ? "cursor-not-allowed text-paper/30"
                    : isActive
                    ? "bg-paper/15 text-sky-400 font-semibold"
                    : "text-paper/80 hover:bg-paper/5"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
              {disabled && <span className="ml-auto text-[10px] text-paper/30">soon</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-paper/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-paper/70 hover:bg-paper/5 hover:text-sky-300 transition"
          >
            <Globe className="h-4 w-4" />
            View Public Website
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-300/80 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-6 md:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
