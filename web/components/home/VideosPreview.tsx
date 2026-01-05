"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { LeagueKey } from "@/lib/data";
import { leagueOptions } from "@/lib/data";
import { mockVideos } from "@/lib/data/videos";
import { VideoCard } from "@/components/videos/VideoCard";
import { cn } from "@/lib/cn";
import "swiper/css";
import "swiper/css/pagination";

type VideosPreviewProps = {
  container?: boolean;
  className?: string;
};

export function VideosPreview({ container = true, className }: VideosPreviewProps) {
  const [selectedSport, setSelectedSport] = useState<LeagueKey | "all">("all");

  const filteredVideos = useMemo(() => {
    if (selectedSport === "all") {
      return mockVideos;
    }
    return mockVideos.filter((video) => video.sport === selectedSport);
  }, [selectedSport]);

  return (
    <section className={cn(container && "container", "space-y-6 lg:space-y-4", className)} dir="rtl">
      <div className="card p-3 sm:p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="!text-slate-900 text-lg font-bold text-slate-900 lg:text-base">ویدیوهای جدید</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-900 sm:text-sm">
            <span>رشته:</span>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value as LeagueKey | "all")}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-brand focus:outline-none sm:px-3 sm:py-2 sm:text-sm"
            >
              <option value="all">همه</option>
              {leagueOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filteredVideos.length > 0 ? (
          <div className="relative">
            <Swiper
              modules={[Pagination]}
              slidesPerView={1}
              spaceBetween={16}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 16 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="videos-swiper [&_.swiper-pagination]:static [&_.swiper-pagination]:mt-4"
              dir="rtl"
            >
              {filteredVideos.map((video) => (
                <SwiperSlide key={video.id}>
                  <VideoCard video={video} compact={true} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-4 text-center text-sm text-slate-900">
            ویدیویی یافت نشد.
          </div>
        )}

        <div className="flex justify-end">
          <Link
            href={`/videos${selectedSport !== "all" ? `?sport=${selectedSport}` : ""}`}
            className="inline-flex text-sm font-semibold text-brand hover:text-brand lg:text-xs"
          >
            مشاهده همه ویدیوها
          </Link>
        </div>
      </div>
    </section>
  );
}

