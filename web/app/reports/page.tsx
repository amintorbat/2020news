export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { allReportsAndEditorials } from "@/lib/data/reports";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ReportListingCard } from "@/components/reports/ReportListingCard";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { ReportsSidebar } from "@/components/reports/ReportsSidebar";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "گزارش‌ها و یادداشت‌ها | 2020news",
    description: "تمام گزارش‌ها و یادداشت‌های فوتسال و فوتبال ساحلی در یک صفحه",
  };
}

type ReportsPageProps = {
  searchParams?: {
    category?: string;
    sort?: "newest" | "popular" | "trending";
    page?: string;
  };
};

const ITEMS_PER_PAGE = 12;

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const category = searchParams?.category as "all" | "گزارش" | "یادداشت" | undefined;
  const sort = searchParams?.sort || "newest";
  const currentPage = parseInt(searchParams?.page || "1", 10);

  // Filter by category
  let filtered = [...allReportsAndEditorials];
  if (category && category !== "all") {
    filtered = filtered.filter((item) => item.category === category);
  }

  // Sort
  if (sort === "newest") {
    // Sort by publishedAt (simple string comparison for mock data)
    filtered = filtered.sort((a, b) => {
      // Extract hour number from "X ساعت پیش" or "X دقیقه پیش"
      const getTimeValue = (timeStr: string): number => {
        if (timeStr.includes("دقیقه")) {
          const minutes = parseInt(timeStr.match(/\d+/)?.[0] || "0", 10);
          return minutes;
        }
        if (timeStr.includes("ساعت")) {
          const hours = parseInt(timeStr.match(/\d+/)?.[0] || "0", 10);
          return hours * 60;
        }
        return 9999; // Unknown format, put at end
      };
      return getTimeValue(a.publishedAt) - getTimeValue(b.publishedAt);
    });
  } else if (sort === "popular" || sort === "trending") {
    // For mock data, just keep current order (could be enhanced with view counts)
    filtered = filtered;
  }

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Latest reports and editorials for sidebar
  const sidebarItems = allReportsAndEditorials.slice(0, 15);

  const breadcrumbItems = [
    { label: "خانه", href: "/" },
    { label: "گزارش‌ها و یادداشت‌ها" },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[var(--background)]">
      <div className="space-y-8">
        {/* Header */}
        <section className="container pt-8" dir="rtl">
          <div className="space-y-4">
            <Breadcrumb items={breadcrumbItems} />
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">گزارش‌ها و یادداشت‌ها</h1>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                تمام گزارش‌ها و یادداشت‌های فوتسال و فوتبال ساحلی در یک صفحه
              </p>
            </div>

            {/* Filters */}
            <ReportFilters
              currentCategory={category || "all"}
              currentSort={sort}
            />
          </div>
        </section>

        {/* Main Content + Sidebar */}
        <section className="container" dir="rtl">
          <div className="grid gap-8 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px]">
            {/* Main List */}
            <div className="space-y-6">
              {paginatedItems.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">
                      {category && category !== "all" ? category : "همه گزارش‌ها و یادداشت‌ها"}
                    </h2>
                    <div className="text-sm text-slate-600">
                      {filtered.length} مورد
                      {totalPages > 1 && ` • صفحه ${currentPage} از ${totalPages}`}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {paginatedItems.map((item) => (
                      <ReportListingCard key={item.id} item={item} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                      {currentPage > 1 && (
                        <Link
                          href={buildPaginationUrl(currentPage - 1, category, sort)}
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
                                    href={buildPaginationUrl(page, category, sort)}
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
                          href={buildPaginationUrl(currentPage + 1, category, sort)}
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
                  <p className="text-sm text-slate-600">برای این فیلتر موردی یافت نشد.</p>
                  <Link
                    href="/reports"
                    className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
                  >
                    مشاهده همه گزارش‌ها و یادداشت‌ها
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="hidden md:block">
              <ReportsSidebar items={sidebarItems} />
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
  category?: "all" | "گزارش" | "یادداشت",
  sort?: string
): string {
  const params = new URLSearchParams();
  if (category && category !== "all") {
    params.set("category", category);
  }
  if (sort && sort !== "newest") {
    params.set("sort", sort);
  }
  if (page > 1) {
    params.set("page", String(page));
  }
  const queryString = params.toString();
  return `/reports${queryString ? `?${queryString}` : ""}`;
}

