import Link from "next/link";
import Image from "next/image";
import type { VideoItem } from "@/lib/data/videos";

type VideoCardProps = {
  video: VideoItem;
  compact?: boolean;
};

export function VideoCard({ video, compact = false }: VideoCardProps) {
  return (
    <Link
      href={`/videos/${video.id}`}
      className="group relative block overflow-hidden rounded-xl border border-[var(--border)] bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-brand shadow-lg">
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">
          {video.duration}
        </div>
      </div>
      <div className="p-3">
        <h3 className={`font-semibold text-slate-900 line-clamp-2 ${compact ? "text-sm" : "text-base"}`} style={{ color: '#0f172a' }}>
          {video.title}
        </h3>
        <p className={`mt-1 text-slate-600 ${compact ? "text-xs" : "text-sm"}`}>{video.publishedAt}</p>
      </div>
    </Link>
  );
}

