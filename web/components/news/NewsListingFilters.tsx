"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { SportType } from "@/lib/acs/types";

type NewsListingFiltersProps = {
  currentSport?: SportType | "all";
  currentSort?: "newest" | "popular" | "trending";
};

export function NewsListingFilters({
  currentSport = "all",
  currentSort = "newest",
}: NewsListingFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sport = e.target.value;
    if (sport === "all") {
      router.push("/news");
    } else if (sport === "futsal") {
      router.push("/news/futsal");
    } else if (sport === "beach") {
      router.push("/news/beach-soccer");
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-2 gap-4" dir="rtl">
      {/* Sport Selector */}
      <div className="flex flex-col gap-2">
        <label htmlFor="sport-filter" className="text-xs font-semibold text-slate-700">
          رشته
        </label>
        <select
          id="sport-filter"
          value={currentSport}
          onChange={handleSportChange}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="all">همه</option>
          <option value="futsal">فوتسال</option>
          <option value="beach">فوتبال ساحلی</option>
        </select>
      </div>

      {/* Sort Selector */}
      <div className="flex flex-col gap-2">
        <label htmlFor="sort-filter" className="text-xs font-semibold text-slate-700">
          مرتب‌سازی
        </label>
        <select
          id="sort-filter"
          value={currentSort}
          onChange={handleSortChange}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="newest">جدیدترین</option>
          <option value="popular">پربازدید</option>
          <option value="trending">محبوب‌ترین</option>
        </select>
      </div>
    </div>
  );
}

