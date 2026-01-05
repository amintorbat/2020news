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
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-full bg-white/90 text-brand shadow-lg">
            <svg className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-1 left-1 sm:bottom-1.5 sm:left-1.5 md:bottom-2 md:left-2 rounded bg-black/70 px-1.5 py-0.5 sm:px-1.5 sm:py-0.5 md:px-2 md:py-1 text-[9px] sm:text-[10px] md:text-xs font-semibold text-white">
          {video.duration}
        </div>
      </div>
      <div className="p-2 sm:p-2.5 md:p-3">
        <h3 className={`font-semibold text-slate-900 line-clamp-2 leading-4 sm:leading-5 md:leading-6 ${compact ? "text-[10px] sm:text-xs md:text-sm" : "text-xs sm:text-sm md:text-base"}`} style={{ color: '#0f172a' }}>
          {video.title}
        </h3>
        <p className={`mt-0.5 sm:mt-1 text-slate-600 ${compact ? "text-[9px] sm:text-[10px] md:text-xs" : "text-[10px] sm:text-xs md:text-sm"}`}>{video.publishedAt}</p>
      </div>
    </Link>
  );
}

