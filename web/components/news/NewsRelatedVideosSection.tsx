"use client";

import Link from "next/link";
import Image from "next/image";
import type { NewsVideo } from "@/lib/mock/articles";

type NewsRelatedVideosSectionProps = {
  videos: NewsVideo[];
};

export function NewsRelatedVideosSection({ videos }: NewsRelatedVideosSectionProps) {
  return (
    <section className="space-y-4" dir="rtl">
      <h2 className="text-xl font-bold text-slate-900">ویدیوهای مرتبط</h2>
      <div className="overflow-x-auto sm:overflow-visible">
        <div className="flex gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:flex-none">
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/videos/${video.id}`}
              className="group relative aspect-video w-[280px] flex-shrink-0 overflow-hidden rounded-lg bg-slate-900 transition hover:opacity-90 sm:w-full"
            >
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-900">
                  <svg className="h-6 w-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                {video.duration}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-white">{video.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

