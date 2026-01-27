"use client";

import Link from "next/link";
import { mockNews } from "@/lib/admin/mock";
import { Badge } from "@/components/admin/Badge";

export default function RecentNews() {
  const recentNews = mockNews.slice(0, 5);

  return (
    <section className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">آخرین اخبار</h3>
        <Link 
          href="/admin/news"
          className="text-xs sm:text-sm font-medium text-brand hover:text-brand/80 transition-colors"
        >
          مشاهده همه →
        </Link>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {recentNews.length > 0 ? (
          recentNews.map((news) => (
            <Link
              key={news.id}
              href={`/admin/news/${news.id}`}
              className="block group"
            >
              <div className="flex items-start justify-between gap-3 p-3 rounded-lg border border-transparent hover:border-[var(--border)] hover:bg-slate-50 transition-all">
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium !text-slate-900 group-hover:!text-brand transition-colors line-clamp-2" style={{ color: '#0f172a' }}>
                    {news.title}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500">{news.publishedAt}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{news.author}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{news.views.toLocaleString("fa-IR")} بازدید</span>
                  </div>
                </div>
                <Badge 
                  variant={news.status === "published" ? "success" : "warning"}
                  className="flex-shrink-0"
                >
                  {news.status === "published" ? "منتشر شده" : "پیش‌نویس"}
                </Badge>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500 text-sm">
            خبری یافت نشد
          </div>
        )}
      </div>
    </section>
  );
}