"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { search } from "@/lib/search";
import type { SearchResult, SearchFilters } from "@/lib/search/types";
import { truncateWithHighlight } from "@/lib/search/highlight";

type SearchResultsProps = {
  query: string;
  category?: string;
  dateRange?: "today" | "this-week" | "this-month" | "all";
  sort?: "relevance" | "newest";
  type?: "news" | "match" | "table" | "player";
};

const RESULTS_PER_PAGE = 20;

export function SearchResults({
  query,
  category,
  dateRange = "all",
  sort = "relevance",
  type,
}: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const router = useRouter();

  const filters: SearchFilters = {
    category,
    dateRange,
    sort,
    type,
  };

  useEffect(() => {
    setIsLoading(true);
    const searchResults = search(query, filters, RESULTS_PER_PAGE * page);
    setResults(searchResults);
    setIsLoading(false);
  }, [query, category, dateRange, sort, type, page]);

  const hasMore = results.length >= RESULTS_PER_PAGE * page;
  const displayedResults = results.slice(0, RESULTS_PER_PAGE * page);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams({
      q: query,
      ...(category && { category }),
      ...(dateRange && { dateRange }),
      ...(sort && { sort }),
      ...(type && { type }),
      [key]: value,
    });

    // Remove filter if value is "all" or empty
    if (value === "all" || !value) {
      params.delete(key);
    }

    router.push(`/search?${params.toString()}`);
  };

  const groupedResults = displayedResults.reduce(
    (acc, result) => {
      const type = result.document.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={category || "all"}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="all">همه دسته‌بندی‌ها</option>
          <option value="فوتسال">فوتسال</option>
          <option value="فوتبال ساحلی">فوتبال ساحلی</option>
        </select>

        <select
          value={dateRange}
          onChange={(e) => handleFilterChange("dateRange", e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="all">همه زمان‌ها</option>
          <option value="today">امروز</option>
          <option value="this-week">این هفته</option>
          <option value="this-month">این ماه</option>
        </select>

        <select
          value={sort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="relevance">مرتبط‌ترین</option>
          <option value="newest">جدیدترین</option>
        </select>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-sm text-slate-500">در حال جستجو...</div>
        </div>
      ) : displayedResults.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-12 text-center">
          <p className="text-sm text-slate-600">نتیجه‌ای یافت نشد</p>
          <p className="mt-2 text-xs text-slate-500">
            سعی کنید کلمات کلیدی دیگری را جستجو کنید یا فیلترها را تغییر دهید.
          </p>
        </div>
      ) : (
        <>
          <div className="text-sm text-slate-600">
            {results.length} نتیجه یافت شد
          </div>

          {/* Grouped Results */}
          <div className="space-y-8">
            {Object.entries(groupedResults).map(([type, typeResults]) => (
              <div key={type} className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900">
                  {type === "news" && "اخبار"}
                  {type === "match" && "بازی‌ها"}
                  {type === "table" && "جداول"}
                  {type === "player" && "بازیکنان"}
                </h2>
                <div className="space-y-3">
                  {typeResults.map((result) => (
                    <Link
                      key={result.document.id}
                      href={result.document.href}
                      className="block rounded-xl border border-[var(--border)] bg-white p-4 transition hover:border-brand hover:shadow-md"
                    >
                      <div className="flex gap-4">
                        {result.document.imageUrl && (
                          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden">
                            <Image
                              src={result.document.imageUrl}
                              alt={result.document.title}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3
                            className="mb-2 text-base font-semibold text-slate-900"
                            dangerouslySetInnerHTML={{
                              __html: result.highlights?.title || result.document.title,
                            }}
                          />
                          <p
                            className="mb-2 text-sm text-slate-600"
                            dangerouslySetInnerHTML={{
                              __html: truncateWithHighlight(
                                result.highlights?.excerpt || result.document.excerpt,
                                200
                              ),
                            }}
                          />
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            {result.document.category && (
                              <span className="rounded-full bg-slate-100 px-2 py-1">
                                {result.document.category}
                              </span>
                            )}
                            {result.document.dateISO && (
                              <span>
                                {new Date(result.document.dateISO).toLocaleDateString("fa-IR")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-[var(--border)] bg-white px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-brand"
              >
                نمایش بیشتر
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

