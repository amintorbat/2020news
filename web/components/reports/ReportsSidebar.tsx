"use client";

import Link from "next/link";
import { useState } from "react";
import type { SectionItem } from "@/components/home/ContentSection";

type ReportsSidebarProps = {
  items: SectionItem[];
};

type TabType = "newest" | "popular" | "discussed";
type FilterType = "گزارش" | "یادداشت";

export function ReportsSidebar({ items }: ReportsSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>("newest");
  const [filters, setFilters] = useState<FilterType[]>([]);

  // First, sort items based on active tab
  let sortedItems = [...items];

  if (activeTab === "newest") {
    // Sort by publishedAt (simple string comparison for mock data)
    sortedItems.sort((a, b) => {
      const getTimeValue = (timeStr: string): number => {
        if (timeStr.includes("دقیقه")) {
          const minutes = parseInt(timeStr.match(/\d+/)?.[0] || "0", 10);
          return minutes;
        }
        if (timeStr.includes("ساعت")) {
          const hours = parseInt(timeStr.match(/\d+/)?.[0] || "0", 10);
          return hours * 60;
        }
        return 9999;
      };
      return getTimeValue(a.publishedAt) - getTimeValue(b.publishedAt);
    });
  } else if (activeTab === "popular") {
    // For mock data, keep current order
    sortedItems = sortedItems;
  } else if (activeTab === "discussed") {
    // Sort by category - یادداشت first (usually more discussion)
    sortedItems.sort((a, b) => {
      if (a.category === "یادداشت" && b.category !== "یادداشت") return -1;
      if (a.category !== "یادداشت" && b.category === "یادداشت") return 1;
      const getTimeValue = (timeStr: string): number => {
        if (timeStr.includes("دقیقه")) {
          const minutes = parseInt(timeStr.match(/\d+/)?.[0] || "0", 10);
          return minutes;
        }
        if (timeStr.includes("ساعت")) {
          const hours = parseInt(timeStr.match(/\d+/)?.[0] || "0", 10);
          return hours * 60;
        }
        return 9999;
      };
      return getTimeValue(a.publishedAt) - getTimeValue(b.publishedAt);
    });
  }

  // Apply filters (OR logic - if any filter matches, show the item)
  let displayedItems = sortedItems;

  if (filters.length > 0) {
    displayedItems = sortedItems.filter((item) => {
      return filters.includes(item.category as FilterType);
    });
  }

  const toggleFilter = (filter: FilterType) => {
    setFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  return (
    <aside className="space-y-6" dir="rtl">
      {/* Latest Reports & Editorials Box - Varzesh3 Style */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-center text-lg font-bold text-slate-900">آخرین گزارش‌ها و یادداشت‌ها</h2>

        {/* Tabs */}
        <div className="mb-4 flex gap-1 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("newest")}
            className={`px-3 pb-3 text-xs font-semibold transition-colors ${
              activeTab === "newest"
                ? "border-b-2 border-brand text-brand"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            جدیدترین‌ها
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("popular")}
            className={`px-3 pb-3 text-xs font-semibold transition-colors ${
              activeTab === "popular"
                ? "border-b-2 border-brand text-brand"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            پربازدیدترین‌ها
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("discussed")}
            className={`px-3 pb-3 text-xs font-semibold transition-colors ${
              activeTab === "discussed"
                ? "border-b-2 border-brand text-brand"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            پربحث‌ترین‌ها
          </button>
        </div>

        {/* Filter Checkboxes */}
        <div className="mb-4 flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={filters.includes("گزارش")}
              onChange={() => toggleFilter("گزارش")}
              className="h-3.5 w-3.5 cursor-pointer rounded border-slate-300 text-brand transition-colors focus:ring-1 focus:ring-brand"
            />
            <span className="select-none whitespace-nowrap">گزارش</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={filters.includes("یادداشت")}
              onChange={() => toggleFilter("یادداشت")}
              className="h-3.5 w-3.5 cursor-pointer rounded border-slate-300 text-brand transition-colors focus:ring-1 focus:ring-brand"
            />
            <span className="select-none whitespace-nowrap">یادداشت</span>
          </label>
        </div>

        {/* Items List */}
        <div className="space-y-0">
          {displayedItems.length > 0 ? (
            displayedItems.slice(0, 10).map((item, index) => (
              <Link
                key={item.id}
                href={item.href}
                className="group flex gap-3 border-b border-slate-100 py-3 first:pt-0 last:border-b-0 transition-colors hover:bg-slate-50"
              >
                {/* Icon */}
                <div className="flex h-5 w-5 flex-shrink-0 items-start justify-center pt-0.5">
                  {item.category === "گزارش" ? (
                    <svg
                      className="h-4 w-4 text-slate-400 group-hover:text-brand"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4 text-slate-400 group-hover:text-brand"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  )}
                </div>

                {/* Title */}
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-xs font-medium leading-relaxed text-slate-800 transition-colors group-hover:text-brand">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))
          ) : (
            <p className="py-6 text-center text-xs text-slate-500">موردی یافت نشد</p>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-4">
        <h3 className="mb-4 text-lg font-bold text-slate-900">برچسب‌ها</h3>
        <div className="flex flex-wrap gap-2">
          {mockTags.map((tag) => (
            <Link
              key={tag}
              href={`/reports?category=${encodeURIComponent(tag)}`}
              className="rounded-full border border-[var(--border)] bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-brand hover:bg-brand/5 hover:text-brand"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="rounded-xl border border-[var(--border)] bg-gradient-to-br from-brand/5 to-brand/10 p-6 text-center">
        <h3 className="mb-2 text-lg font-bold text-slate-900">خبرنامه</h3>
        <p className="mb-4 text-sm text-slate-600">آخرین گزارش‌ها و یادداشت‌ها را در ایمیل خود دریافت کنید</p>
        <button
          type="button"
          className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-brand/90"
        >
          عضویت در خبرنامه
        </button>
      </div>
    </aside>
  );
}

const mockTags = [
  "گزارش",
  "یادداشت",
  "تحلیل",
  "فوتسال",
  "فوتبال ساحلی",
  "تیم ملی",
  "لیگ",
  "مسابقات",
];

