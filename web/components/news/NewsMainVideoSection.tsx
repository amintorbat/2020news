"use client";

import type { NewsVideo } from "@/lib/mock/articles";

type NewsMainVideoSectionProps = {
  video: NewsVideo;
};

export function NewsMainVideoSection({ video }: NewsMainVideoSectionProps) {
  return (
    <section className="space-y-4" dir="rtl">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-900">
        <video
          src={video.videoUrl}
          controls
          className="h-full w-full"
          poster={video.thumbnailUrl}
        >
          مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
        </video>
      </div>
    </section>
  );
}

