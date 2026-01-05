"use client";

import Link from "next/link";
import { useState } from "react";
import type { Article } from "@/lib/acs/types";

type NewsSidebarProps = {
  articles: Article[];
};

type TabType = "newest" | "popular" | "discussed";
type FilterType = "domestic" | "foreign" | "video";

export function NewsSidebar({ articles }: NewsSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>("newest");
  const [filters, setFilters] = useState<FilterType[]>([]);

  // First, sort articles based on active tab
  let sortedArticles = [...articles];

  if (activeTab === "newest") {
    // Sort by date (newest first)
    sortedArticles.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });
  } else if (activeTab === "popular") {
    // Sort by featured first, then by date
    sortedArticles.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });
  } else if (activeTab === "discussed") {
    // Sort by category that might have more discussion (reports, editorials)
    sortedArticles.sort((a, b) => {
      const aIsDiscussion = a.category.includes("یادداشت") || a.category.includes("تحلیل");
      const bIsDiscussion = b.category.includes("یادداشت") || b.category.includes("تحلیل");
      if (aIsDiscussion && !bIsDiscussion) return -1;
      if (!aIsDiscussion && bIsDiscussion) return 1;
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });
  }

  // Apply filters (OR logic - if any filter matches, show the article)
  let displayedArticles = sortedArticles;

  if (filters.length > 0) {
    displayedArticles = sortedArticles.filter((article) => {
      // If any filter matches, include the article
      const matchesDomestic = filters.includes("domestic") && article.sport === "futsal";
      const matchesForeign = filters.includes("foreign") && article.sport === "beach";
      const matchesVideo =
        filters.includes("video") &&
        (article.category.includes("ویدیو") || article.category.includes("گزارش"));

      return matchesDomestic || matchesForeign || matchesVideo;
    });
  }

  const toggleFilter = (filter: FilterType) => {
    setFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  return (
    <aside className="space-y-6" dir="rtl">
      {/* Latest Football News Box - Varzesh3 Style */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-center text-lg font-bold text-slate-900">آخرین اخبار</h2>

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
              checked={filters.includes("domestic")}
              onChange={() => toggleFilter("domestic")}
              className="h-3.5 w-3.5 cursor-pointer rounded border-slate-300 text-brand transition-colors focus:ring-1 focus:ring-brand"
            />
            <span className="select-none whitespace-nowrap">داخلی</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={filters.includes("foreign")}
              onChange={() => toggleFilter("foreign")}
              className="h-3.5 w-3.5 cursor-pointer rounded border-slate-300 text-brand transition-colors focus:ring-1 focus:ring-brand"
            />
            <span className="select-none whitespace-nowrap">خارجی</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={filters.includes("video")}
              onChange={() => toggleFilter("video")}
              className="h-3.5 w-3.5 cursor-pointer rounded border-slate-300 text-brand transition-colors focus:ring-1 focus:ring-brand"
            />
            <span className="select-none whitespace-nowrap">ویدیو</span>
          </label>
        </div>

        {/* News List */}
        <div className="space-y-0">
          {displayedArticles.length > 0 ? (
            displayedArticles.slice(0, 10).map((article, index) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group flex gap-3 border-b border-slate-100 py-3 first:pt-0 last:border-b-0 transition-colors hover:bg-slate-50"
              >
                {/* Icon */}
                <div className="flex h-5 w-5 flex-shrink-0 items-start justify-center pt-0.5">
                  {article.category.includes("ویدیو") || article.category.includes("گزارش") ? (
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
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  )}
                </div>

                {/* Title */}
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-xs font-medium leading-relaxed text-slate-800 transition-colors group-hover:text-brand">
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))
          ) : (
            <p className="py-6 text-center text-xs text-slate-500">خبری یافت نشد</p>
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
              href={`/news?q=${encodeURIComponent(tag)}`}
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
        <p className="mb-4 text-sm text-slate-600">آخرین اخبار را در ایمیل خود دریافت کنید</p>
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
  "لیگ",
  "ملی",
  "باشگاهی",
  "انتقالات",
  "مصاحبه",
  "گزارش",
  "یادداشت",
  "تحلیل",
];
