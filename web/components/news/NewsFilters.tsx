"use client";

import { useRouter } from "next/navigation";
import type { SportType } from "@/lib/acs/types";

type NewsFiltersProps = {
  currentCategory: SportType;
  currentQuery: string;
  currentSort: "newest" | "oldest";
};

export function NewsFilters({ currentCategory, currentQuery, currentSort }: NewsFiltersProps) {
  const router = useRouter();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams({
      category: currentCategory,
      sort: e.target.value,
    });
    if (currentQuery) {
      params.set("q", currentQuery);
    }
    router.push(`/news?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q") as string;

    const params = new URLSearchParams({
      category: currentCategory,
      sort: currentSort,
    });
    if (query?.trim()) {
      params.set("q", query.trim());
    }
    router.push(`/news?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <form onSubmit={handleSearch} className="flex-1" dir="rtl">
        <div className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={currentQuery}
            placeholder="جستجوی سریع..."
            className="flex-1 rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-brand/90"
          >
            جستجو
          </button>
        </div>
      </form>

      <select
        value={currentSort}
        onChange={handleSortChange}
        className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
      >
        <option value="newest">جدیدترین</option>
        <option value="oldest">قدیمی‌ترین</option>
      </select>
    </div>
  );
}

