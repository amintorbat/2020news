"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { LeagueKey } from "@/lib/data";
import { leagueOptions } from "@/lib/data";
import { mockAlbums } from "@/lib/data/gallery";
import { AlbumCard } from "@/components/gallery/AlbumCard";
import { cn } from "@/lib/cn";

type GalleryPreviewProps = {
  container?: boolean;
  className?: string;
};

export function GalleryPreview({ container = true, className }: GalleryPreviewProps) {
  const [selectedSport, setSelectedSport] = useState<LeagueKey | "all">("all");

  const filteredAlbums = useMemo(() => {
    if (selectedSport === "all") {
      return mockAlbums.slice(0, 4);
    }
    return mockAlbums.filter((album) => album.sport === selectedSport).slice(0, 4);
  }, [selectedSport]);

  return (
    <section className={cn(container && "container", "space-y-6 lg:space-y-4", className)} dir="rtl">
      <div className="card p-3 sm:p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="!text-slate-900 text-lg font-bold text-slate-900 lg:text-base">گالری تصاویر</h2>
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

        {filteredAlbums.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            {filteredAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-4 text-center text-sm text-slate-900">
            آلبومی یافت نشد.
          </div>
        )}

        <div className="flex justify-end">
          <Link
            href={`/gallery${selectedSport !== "all" ? `?sport=${selectedSport}` : ""}`}
            className="inline-flex text-sm font-semibold text-brand hover:text-brand lg:text-xs"
          >
            مشاهده گالری کامل
          </Link>
        </div>
      </div>
    </section>
  );
}

