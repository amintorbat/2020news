import type { Metadata } from "next";
import { SearchResults } from "@/components/search/SearchResults";
import { Footer } from "@/components/layout/Footer";

type SearchPageProps = {
  searchParams?: { q?: string; category?: string; dateRange?: string; sort?: string; type?: string };
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams?.q || "";
  
  if (!query.trim()) {
    return {
      title: "جستجو | 2020news",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `نتایج جستجو برای "${query}" | 2020news`,
    description: `نتایج جستجو برای "${query}" در 2020news`,
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q || "";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container space-y-8 py-8" dir="rtl">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {query ? `نتایج جستجو برای "${query}"` : "جستجو"}
          </h1>
          {!query && (
            <p className="text-sm text-slate-600">
              برای شروع جستجو، کلمه یا عبارت مورد نظر خود را وارد کنید.
            </p>
          )}
        </div>

        {query ? (
          <SearchResults
            query={query}
            category={searchParams?.category}
            dateRange={searchParams?.dateRange as "today" | "this-week" | "this-month" | "all" | undefined}
            sort={searchParams?.sort as "relevance" | "newest" | undefined}
            type={searchParams?.type as "news" | "match" | "table" | "player" | undefined}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="mt-4 text-sm text-slate-600">
              برای شروع جستجو، از منوی بالای صفحه استفاده کنید یا کلیدهای Cmd+K (Mac) یا Ctrl+K (Windows) را بزنید.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

