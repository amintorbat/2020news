"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/admin/Badge";
import { Toast } from "@/components/admin/Toast";
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

      let matchesContentType = true;
      if (contentTypeFilter === "notes") {
        matchesContentType = item.blocks?.some((block) => block.type === "note") || false;
      } else if (contentTypeFilter === "reports") {
        matchesContentType = item.blocks?.some((block) => block.type === "report") || false;
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesContentType;
    });
  }, [news, search, statusFilter, categoryFilter, contentTypeFilter]);

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

      {/* Toolbar: Filters and Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو..."
          className="h-8 flex-1 min-w-[150px] rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
        />
        <select
          value={contentTypeFilter}
          onChange={(e) => setContentTypeFilter(e.target.value as "all" | "notes" | "reports")}
          className="h-8 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
        >
          <option value="all">همه محتوا</option>
          <option value="notes">یادداشت‌ها</option>
          <option value="reports">گزارش‌ها</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as NewsStatus | "")}
          className="h-8 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
        >
          <option value="">همه وضعیت‌ها</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-8 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
        >
          <option value="">همه دسته‌ها</option>
          {mockNewsCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <Link
          href="/admin/news/new"
          className="h-8 shrink-0 rounded-md bg-brand px-3.5 py-1.5 text-xs font-medium text-white transition-all hover:bg-brand/90 active:scale-[0.98] whitespace-nowrap"
        >
          + خبر جدید
        </Link>
      </div>

      {/* News List */}
      {filteredNews.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-16 text-center">
          <h3 className="mb-2 text-lg font-semibold text-slate-900">خبری یافت نشد</h3>
          <p className="mb-6 text-sm text-slate-600">
            {search || statusFilter || categoryFilter || contentTypeFilter !== "all"
              ? "هیچ خبری با فیلترهای انتخابی یافت نشد"
              : "هنوز خبری ایجاد نشده است"}
          </p>
          {!search && !statusFilter && !categoryFilter && contentTypeFilter === "all" && (
            <Link
              href="/admin/news/new"
              className="inline-block rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90"
            >
              ایجاد خبر جدید
            </Link>
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
                  {/* Header: Badges and Title */}
                  <div className="mb-4">
                    <div className="mb-3 flex items-center gap-2 flex-wrap">
                      <Badge variant={statusColors[item.status]} className="text-xs">
                        {statusLabels[item.status]}
                      </Badge>
                      {category && (
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
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

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t border-slate-100 pt-4">
                    <Link
                      href={`/admin/news/${item.id}/edit`}
                      className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white transition-all hover:bg-brand/90 active:scale-[0.98] whitespace-nowrap"
                    >
                      ویرایش
                    </Link>
                    <Link
                      href={`/admin/news/${item.id}/view`}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98] whitespace-nowrap"
                    >
                      مشاهده
                    </Link>
                    {item.status !== "published" && (
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item.id, e.target.value as NewsStatus)
                        }
                        className="h-9 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-700 transition-all hover:bg-red-100 active:scale-[0.98] whitespace-nowrap"
                    >
                      حذف
                    </button>
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
