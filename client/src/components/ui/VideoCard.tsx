import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Video } from "../../types";

export function VideoCard({ video, index = 0 }: { video: Video; index?: number; dark?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link
        to={`/videos/${video._id}`}
        data-cursor="Play"
        className="card-glass block overflow-hidden p-3.5 transition-all duration-300"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-paper-ice border border-sky-100/60">
          {video.thumbnail && (
            <img
              src={video.thumbnail}
              alt={video.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          )}
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100">
            <motion.span
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-orange-500 shadow-xl text-white"
              whileHover={{ scale: 1.12 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </motion.span>
          </div>
          {/* Category badge */}
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-orange-700 shadow-xs border border-orange-100">
              {video.category}
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="mt-3.5 px-1.5 space-y-1 border-b border-sky-100/50 pb-3">
          <h3 className="font-display text-base font-bold leading-snug text-ink transition-colors duration-200 group-hover:text-sky-600 line-clamp-2">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-xs text-ink-muted line-clamp-1">{video.description}</p>
          )}
        </div>
        <div className="mt-2.5 px-1.5 pb-1 flex items-center justify-between text-[11px] text-sky-600 font-bold">
          <span className="group-hover:text-orange-600 transition-colors">Watch Video</span>
          <span className="text-ink-muted/50">HD</span>
        </div>
      </Link>
    </motion.article>
  );
}
