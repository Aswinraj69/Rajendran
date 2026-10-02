import { Outlet } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CustomCursor } from "../ui/CustomCursor";
import { SpotifyAudioPlayer } from "../ui/SpotifyAudioPlayer";
import { WhatsAppChatbot } from "../ui/WhatsAppChatbot";

export function PublicLayout() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="relative flex min-h-screen flex-col bg-paper overflow-x-hidden selection:bg-orange-100 selection:text-orange-950">
      {/* ── Scroll Progress Indicator ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-sky-400 via-sky-500 to-orange-500 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
        style={{ scaleX }}
      />

      {/* ── Ambient Background Mesh Glows ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-60">
        <div className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-sky-200/40 via-sky-100/20 to-transparent blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[700px] w-[700px] rounded-full bg-gradient-to-bl from-orange-200/35 via-amber-100/20 to-transparent blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-sky-100/30 via-orange-100/20 to-transparent blur-[120px]" />
      </div>

      <CustomCursor />
      <SpotifyAudioPlayer />
      <WhatsAppChatbot />

      {/* Navbar sits on top */}
      <Navbar />

      <main className="relative z-10 flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

