export function CardSkeleton({ dark = false }: { dark?: boolean }) {
  const shimmer = dark ? "bg-white/10" : "bg-mist";
  return (
    <div className="animate-pulse rounded-2xl border border-mist bg-white p-4">
      <div className={`aspect-[16/10] ${shimmer} rounded-xl`} />
      <div className="mt-5 space-y-3">
        <div className={`h-3 w-20 rounded-full ${shimmer}`} />
        <div className={`h-5 w-3/4 rounded ${shimmer}`} />
        <div className={`h-4 w-full rounded ${shimmer}`} />
      </div>
    </div>
  );
}

export function CardSkeletonGrid({ count = 6, dark = false }: { count?: number; dark?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} dark={dark} />
      ))}
    </div>
  );
}

export function EmptyState({ message, dark = false }: { message: string; dark?: boolean }) {
  return (
    <div
      className={`rounded-2xl border border-dashed py-20 text-center text-sm tracking-wide ${
        dark ? "border-white/10 text-white/40" : "border-mist text-ink/50 bg-paper-warm/30"
      }`}
    >
      {message}
    </div>
  );
}
