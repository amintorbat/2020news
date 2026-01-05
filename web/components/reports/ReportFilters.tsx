"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

type ReportFiltersProps = {
  currentCategory?: "all" | "گزارش" | "یادداشت";
  currentSort?: "newest" | "popular" | "trending";
};

export function ReportFilters({
  currentCategory = "all",
  currentSort = "newest",
}: ReportFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const category = e.target.value;
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-2 gap-4" dir="rtl">
      {/* Category Selector */}
      <div className="flex flex-col gap-2">
        <label htmlFor="category-filter" className="text-xs font-semibold text-slate-700">
          دسته‌بندی
        </label>
        <select
          id="category-filter"
          value={currentCategory}
          onChange={handleCategoryChange}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="all">همه</option>
          <option value="گزارش">گزارش</option>
          <option value="یادداشت">یادداشت</option>
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

