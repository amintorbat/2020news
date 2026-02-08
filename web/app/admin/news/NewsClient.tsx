"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/admin/Badge";
import { Toast } from "@/components/admin/Toast";
import { Can } from "@/components/admin/Can";
import { FilterBar, FilterSearch, FilterSelect } from "@/components/admin/FilterBar";
import { mockNews, mockNewsCategories } from "@/lib/admin/newsData";
import type { News, NewsStatus } from "@/types/news";

const statusLabels: Record<NewsStatus, string> = {
  draft: "پیش‌نویس",
  review: "در انتظار بررسی",
  scheduled: "زمان‌بندی شده",
  published: "منتشر شده",
  archived: "آرشیو شده",
};

const statusColors: Record<NewsStatus, "default" | "info" | "warning" | "success" | "danger"> = {
  draft: "default",
  review: "warning",
  scheduled: "info",
  published: "success",
  archived: "danger",
};

export default function NewsClient() {
  const router = useRouter();
  const [news, setNews] = useState<News[]>(mockNews);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<NewsStatus | "">("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [contentTypeFilter, setContentTypeFilter] = useState<"all" | "notes" | "reports">("all");
  const [sportFilter, setSportFilter] = useState<"" | "futsal" | "beach-soccer">("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchesSearch =
        search === "" ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.summary.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === "" || item.status === statusFilter;
      const matchesCategory = categoryFilter === "" || item.categoryId === categoryFilter;

      const matchesSport =
        sportFilter === "" ||
        (sportFilter === "futsal" && item.tags.some((t) => t.includes("فوتسال"))) ||
        (sportFilter === "beach-soccer" && item.tags.some((t) => t.includes("فوتبال ساحلی") || t.includes("ساحلی")));

      let matchesContentType = true;
      if (contentTypeFilter === "notes") {
        matchesContentType = item.blocks?.some((block) => block.type === "note") || false;
      } else if (contentTypeFilter === "reports") {
        matchesContentType = item.blocks?.some((block) => block.type === "report") || false;
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesContentType && matchesSport;
    });
  }, [news, search, statusFilter, categoryFilter, contentTypeFilter, sportFilter]);

  const handleDelete = (id: string) => {
    if (confirm("آیا از حذف این خبر اطمینان دارید؟")) {
      setNews((prev) => prev.filter((n) => n.id !== id));
      setToast({ message: "خبر با موفقیت حذف شد", type: "success" });
    }
  };

  const handleStatusChange = (id: string, newStatus: NewsStatus) => {
    setNews((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : n
      )
    );
    setToast({ message: `وضعیت به "${statusLabels[newStatus]}" تغییر یافت`, type: "success" });
  };

  return (
    <div className="space-y-5" dir="rtl">
      <PageHeader
        title="مدیریت اخبار"
        subtitle="ایجاد، ویرایش و مدیریت اخبار و گزارش‌های مسابقات"
      />

      {/* فیلترها و جستجو */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700 px-1">فیلترها و جستجو</h2>
        <FilterBar>
          <FilterSearch value={search} onChange={setSearch} placeholder="جستجو در اخبار..." className="min-w-[180px] sm:min-w-[220px]" />
          <FilterSelect
            label="رشته ورزشی"
            value={sportFilter}
            options={[
              { value: "futsal", label: "فوتسال" },
              { value: "beach-soccer", label: "فوتبال ساحلی" },
            ]}
            onChange={(v) => setSportFilter(v)}
            placeholder="همه رشته‌ها"
          />
          <FilterSelect
            label="نوع محتوا"
            value={contentTypeFilter}
            options={[
              { value: "all", label: "همه محتوا" },
              { value: "notes", label: "یادداشت‌ها" },
              { value: "reports", label: "گزارش‌ها" },
            ]}
            onChange={(v) => setContentTypeFilter(v)}
            placeholder="همه محتوا"
          />
          <FilterSelect
            label="وضعیت انتشار"
            value={statusFilter}
            options={Object.entries(statusLabels).map(([value, label]) => ({ value: value as NewsStatus, label }))}
            onChange={(v) => setStatusFilter(v)}
            placeholder="همه وضعیت‌ها"
            className="min-w-[160px]"
          />
          <FilterSelect
            label="دسته‌بندی"
            value={categoryFilter}
            options={mockNewsCategories.map((c) => ({ value: c.id, label: c.name }))}
            onChange={setCategoryFilter}
            placeholder="همه دسته‌ها"
          />
          <Can module="news" action="create">
            <Link
              href="/admin/news/new"
              className="shrink-0 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand/90 active:scale-[0.98] whitespace-nowrap"
            >
              + خبر جدید
            </Link>
          </Can>
        </FilterBar>
      </div>

      {/* News List */}
      {filteredNews.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-16 text-center">
          <h3 className="mb-2 text-lg font-semibold text-slate-900">خبری یافت نشد</h3>
          <p className="mb-6 text-sm text-slate-600">
            {search || statusFilter || categoryFilter || contentTypeFilter !== "all" || sportFilter
              ? "هیچ خبری با فیلترهای انتخابی یافت نشد"
              : "هنوز خبری ایجاد نشده است"}
          </p>
          {!search && !statusFilter && !categoryFilter && contentTypeFilter === "all" && !sportFilter && (
            <Can module="news" action="create">
              <Link
                href="/admin/news/new"
                className="inline-block rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90"
              >
                ایجاد خبر جدید
              </Link>
            </Can>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredNews.map((item) => {
            const category = mockNewsCategories.find((c) => c.id === item.categoryId);
            return (
              <article
                key={item.id}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-md"
              >
                <div className="p-5">
                  {/* برچسب وضعیت و دسته — فقط نمایش، فیلتر از نوار بالای صفحه */}
                  <div className="mb-4 min-w-0 overflow-hidden">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge variant={statusColors[item.status]} className="text-xs shrink-0">
                        {statusLabels[item.status]}
                      </Badge>
                      {category && (
                        <span className="inline-flex min-w-0 max-w-full shrink items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 overflow-hidden text-ellipsis whitespace-nowrap">
                          {category.name}
                        </span>
                      )}
                    </div>
                    <h2 className="mb-2 text-lg font-bold leading-tight text-slate-900 line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-slate-600 line-clamp-2">
                      {item.summary}
                    </p>
                  </div>

                  {/* Meta: Reading time, Views, Date */}
                  <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="text-slate-400">⏱</span>
                      <span>{item.readingTime} دقیقه مطالعه</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-slate-400">👁</span>
                      <span>{item.viewCount.toLocaleString("fa-IR")} بازدید</span>
                    </span>
                    {item.publishAt && (
                      <span className="flex items-center gap-1.5">
                        <span className="text-slate-400">📅</span>
                        <span>{new Date(item.publishAt).toLocaleDateString("fa-IR")}</span>
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {item.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                        >
                          #{tag}
                        </span>
                      ))}
                      {item.tags.length > 5 && (
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          +{item.tags.length - 5} تگ دیگر
                        </span>
                      )}
                    </div>
                  )}

                  {/* نوار عملیات و تغییر وضعیت */}
                  <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-50/70 rounded-xl p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/admin/news/${item.id}/edit`}
                          className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand/90 transition-colors whitespace-nowrap"
                        >
                          ویرایش
                        </Link>
                        <Link
                          href={`/admin/news/${item.id}/view`}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
                        >
                          مشاهده
                        </Link>
                        <Can module="news" action="delete">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors whitespace-nowrap"
                          >
                            حذف
                          </button>
                        </Can>
                      </div>
                      <div className="flex items-center gap-2 border-s border-slate-200 ps-3">
                        <label className="text-xs font-medium text-slate-500 shrink-0" htmlFor={`status-${item.id}`}>تغییر وضعیت</label>
                        <select
                          id={`status-${item.id}`}
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as NewsStatus)}
                          className="h-9 min-w-[140px] max-w-[160px] rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 cursor-pointer appearance-none bg-no-repeat bg-[length:1rem_1rem] bg-[right_0.5rem_center] pr-8 box-border"
                          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")" }}
                        >
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
      </div>
  );
}
