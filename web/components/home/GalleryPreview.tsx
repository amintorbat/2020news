"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { LeagueKey } from "@/lib/data";
import { leagueOptions } from "@/lib/data";
import { getAllPublicAlbums } from "@/lib/admin/mediaData";
import { AlbumCard } from "@/components/gallery/AlbumCard";
import { cn } from "@/lib/cn";
import "swiper/css";
import "swiper/css/pagination";

type GalleryPreviewProps = {
  container?: boolean;
  className?: string;
};

export function GalleryPreview({ container = true, className }: GalleryPreviewProps) {
  const [selectedSport, setSelectedSport] = useState<LeagueKey | "all">("all");

  const filteredAlbums = useMemo(() => {
    const albums = getAllPublicAlbums();
    if (selectedSport === "all") return albums;
    return albums.filter((album) => album.sport === selectedSport);
  }, [selectedSport]);

  return (
    <section className={cn(container && "container", "space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-4", className)} dir="rtl">
      <div className="w-full rounded-xl sm:rounded-2xl md:rounded-3xl border border-[var(--border)] bg-white shadow-card p-2.5 sm:p-3 md:p-4 space-y-2.5 sm:space-y-3 md:space-y-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 lg:text-base" style={{ color: '#0f172a' }}>گالری تصاویر</h2>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:gap-2.5 md:gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] md:text-xs font-semibold text-slate-900">
            <span>رشته:</span>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value as LeagueKey | "all")}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-1.5 py-1 text-[10px] sm:text-[11px] md:text-xs text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:px-2 sm:py-1.5 md:px-2.5 md:py-1.5 lg:px-3 lg:py-2 lg:text-sm"
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

        {filteredAlbums.length > 0 ? (
          <div className="relative -mx-2.5 sm:-mx-3 md:-mx-4 lg:mx-0 px-2.5 sm:px-3 md:px-4 lg:px-0">
            <Swiper
              modules={[Pagination]}
              slidesPerView={1.3}
              spaceBetween={8}
              pagination={{ clickable: true }}
              breakpoints={{
                320: { slidesPerView: 1.4, spaceBetween: 8 },
                375: { slidesPerView: 1.6, spaceBetween: 10 },
                480: { slidesPerView: 1.8, spaceBetween: 12 },
                640: { slidesPerView: 2, spaceBetween: 14 },
                768: { slidesPerView: 2, spaceBetween: 16 },
                1024: { slidesPerView: 3, spaceBetween: 18 },
                1280: { slidesPerView: 4, spaceBetween: 20 },
              }}
              className="gallery-swiper [&_.swiper-pagination]:static [&_.swiper-pagination]:mt-2 [&_.swiper-pagination-bullet]:w-1 [&_.swiper-pagination-bullet]:h-1 sm:[&_.swiper-pagination]:mt-3 sm:[&_.swiper-pagination-bullet]:w-1.5 sm:[&_.swiper-pagination-bullet]:h-1.5 md:[&_.swiper-pagination]:mt-4"
              dir="rtl"
            >
              {filteredAlbums.map((album) => (
                <SwiperSlide key={album.id}>
                  <AlbumCard album={album} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="rounded-lg sm:rounded-xl border border-dashed border-[var(--border)] bg-white p-2.5 sm:p-3 md:p-4 text-center text-[10px] sm:text-xs md:text-sm text-slate-900">
            آلبومی یافت نشد.
          </div>
        )}

        <div className="flex justify-end pt-0.5 sm:pt-1">
          <Link
            href={`/gallery${selectedSport !== "all" ? `?sport=${selectedSport}` : ""}`}
            className="inline-flex text-[10px] sm:text-xs md:text-sm font-semibold text-brand hover:text-brand lg:text-xs"
          >
            مشاهده گالری کامل
          </Link>
        </div>
      </div>
    </section>
  );
}

