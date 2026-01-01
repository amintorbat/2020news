export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { getHomeContent } from "@/lib/acs/home";
import { getFallbackHomePayload } from "@/lib/acs/fallback";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { FeaturedNewsSection } from "@/components/news/FeaturedNewsSection";
import { NewsListingCard } from "@/components/news/NewsListingCard";
import { NewsListingFilters } from "@/components/news/NewsListingFilters";
import { NewsSidebar } from "@/components/news/NewsSidebar";
import { CategoryChips } from "@/components/news/CategoryChips";
import type { Article } from "@/lib/acs/types";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "اخبار فوتبال ساحلی | 2020news",
    description: "آخرین اخبار، گزارش‌ها و تحلیل‌های فوتبال ساحلی ایران و جهان",
  };
}

type NewsBeachPageProps = {
  searchParams?: {
    q?: string;
    sort?: "newest" | "popular" | "trending";
    category?: string;
    page?: string;
  };
};

const ARTICLES_PER_PAGE = 12;

export default async function NewsBeachPage({ searchParams }: NewsBeachPageProps) {
  let latestNews: Article[];
  
  try {
    const content = await getHomeContent();
    latestNews = content.latestNews;
  } catch {
    const fallback = getFallbackHomePayload();
    latestNews = fallback.latestNews;
  }

  const query = searchParams?.q?.trim().toLowerCase() || "";
  const sort = searchParams?.sort || "newest";
  const category = searchParams?.category;
  const currentPage = parseInt(searchParams?.page || "1", 10);

  // Filter by beach soccer
  let filtered = latestNews.filter((article) => article.sport === "beach");

  // Filter by search query
  if (query) {
    filtered = filtered.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
    );
  }

  // Filter by category
  if (category && category !== "all") {
    filtered = filtered.filter(
      (article) =>
        article.title.includes(category) ||
        article.excerpt.includes(category) ||
        article.category.includes(category)
    );
  }

  // Sort
  if (sort === "newest") {
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });
  } else if (sort === "popular" || sort === "trending") {
    filtered = filtered.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });
  }

  // Pagination
  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = filtered.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  // Featured articles
  const featured = filtered
    .filter((article) => article.isFeatured)
    .slice(0, 5);

  // Popular articles for sidebar
  const popularArticles = filtered.slice(0, 5);

  const breadcrumbItems = [
    { label: "خانه", href: "/" },
    { label: "اخبار", href: "/news" },
    { label: "فوتبال ساحلی" },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[var(--background)]">
      <div className="space-y-8">
        {/* Header */}
        <section className="container pt-8" dir="rtl">
          <div className="space-y-4">
            <Breadcrumb items={breadcrumbItems} />
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">اخبار فوتبال ساحلی</h1>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                آخرین اخبار، گزارش‌ها و تحلیل‌های فوتبال ساحلی ایران و جهان
              </p>
            </div>

            {/* Filters */}
            <NewsListingFilters
              currentSport="beach"
              currentSort={sort}
              currentQuery={query}
            />

            {/* Category Chips */}
            <CategoryChips
              currentCategory={category}
              currentQuery={query}
              currentSort={sort}
            />
          </div>
        </section>

        {/* Featured Section */}
        {featured.length > 0 && currentPage === 1 && !query && (
          <section className="container" dir="rtl">
            <FeaturedNewsSection articles={featured} />
          </section>
        )}

        {/* Main Content + Sidebar */}
        <section className="container" dir="rtl">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Main List */}
            <div className="space-y-6">
              {paginatedArticles.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">
                      {query ? `نتایج جستجو برای "${query}"` : "همه اخبار فوتبال ساحلی"}
                    </h2>
                    <div className="text-sm text-slate-600">
                      {filtered.length} مقاله
                      {totalPages > 1 && ` • صفحه ${currentPage} از ${totalPages}`}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {paginatedArticles.map((article) => (
                      <NewsListingCard key={article.id} article={article} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                      {currentPage > 1 && (
                        <Link
                          href={buildPaginationUrl(currentPage - 1, query, sort, category)}
                          className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-brand"
                        >
                          قبلی
                        </Link>
                      )}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((page) => {
                            return (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            );
                          })
                          .map((page, index, array) => {
                            const prevPage = array[index - 1];
                            const showEllipsis = prevPage && page - prevPage > 1;

                            return (
                              <div key={page} className="flex items-center gap-1">
                                {showEllipsis && (
                                  <span className="px-2 text-slate-400">...</span>
                                )}
                                {page === currentPage ? (
                                  <span className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">
                                    {page}
                                  </span>
                                ) : (
                                  <Link
                                    href={buildPaginationUrl(page, query, sort, category)}
                                    className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-brand"
                                  >
                                    {page}
                                  </Link>
                                )}
                              </div>
                            );
                          })}
                      </div>
                      {currentPage < totalPages && (
                        <Link
                          href={buildPaginationUrl(currentPage + 1, query, sort, category)}
                          className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-brand"
                        >
                          بعدی
                        </Link>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-12 text-center">
                  <p className="text-sm text-slate-600">برای این جستجو خبری یافت نشد.</p>
                  {query && (
                    <Link
                      href="/news/beach-soccer"
                      className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
                    >
                      مشاهده همه اخبار فوتبال ساحلی
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <NewsSidebar popularArticles={popularArticles} />
            </aside>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

function buildPaginationUrl(
  page: number,
  query?: string,
  sort?: string,
  category?: string
): string {
  const params = new URLSearchParams();
  if (query) {
    params.set("q", query);
  }
  if (sort && sort !== "newest") {
    params.set("sort", sort);
  }
  if (category && category !== "all") {
    params.set("category", category);
  }
  if (page > 1) {
    params.set("page", String(page));
  }
  const queryString = params.toString();
  return `/news/beach-soccer${queryString ? `?${queryString}` : ""}`;
}
