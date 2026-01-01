"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import type { SportType } from "@/lib/acs/types";

type NewsListingFiltersProps = {
  currentSport?: SportType | "all";
  currentSort?: "newest" | "popular" | "trending";
  currentQuery?: string;
};

export function NewsListingFilters({
  currentSport = "all",
  currentSort = "newest",
  currentQuery = "",
}: NewsListingFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(currentQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(currentQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery !== currentQuery) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedQuery.trim()) {
        params.set("q", debouncedQuery.trim());
      } else {
        params.delete("q");
      }
      params.delete("page"); // Reset to page 1 on search
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [debouncedQuery, currentQuery, router, searchParams, pathname]);

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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center" dir="rtl">
      {/* Sport Selector */}
      <select
        value={currentSport}
        onChange={handleSportChange}
        className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
      >
        <option value="all">همه</option>
        <option value="futsal">فوتسال</option>
        <option value="beach">فوتبال ساحلی</option>
      </select>

      {/* Sort Selector */}
      <select
        value={currentSort}
        onChange={handleSortChange}
        className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
      >
        <option value="newest">جدیدترین</option>
        <option value="popular">پربازدید</option>
        <option value="trending">محبوب‌ترین</option>
      </select>

      {/* Search Input */}
      <div className="flex-1">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو..."
          className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>
    </div>
  );
}

