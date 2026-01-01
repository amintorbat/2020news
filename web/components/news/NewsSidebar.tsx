import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/acs/types";

type NewsSidebarProps = {
  popularArticles?: Article[];
};

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

export function NewsSidebar({ popularArticles = [] }: NewsSidebarProps) {
  return (
    <aside className="space-y-6" dir="rtl">
      {/* Popular Articles */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-4">
        <h3 className="mb-4 text-lg font-bold text-slate-900">پربازدیدترین</h3>
        <div className="space-y-3">
          {popularArticles.length > 0 ? (
            popularArticles.slice(0, 5).map((article, index) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group flex gap-3"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition group-hover:text-brand">
                    {article.title}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">{article.category}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-slate-500">در حال حاضر خبری موجود نیست.</p>
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

      {/* Newsletter (Placeholder) */}
      <div className="rounded-xl border border-[var(--border)] bg-gradient-to-br from-brand/5 to-brand/10 p-6 text-center">
        <h3 className="mb-2 text-lg font-bold text-slate-900">خبرنامه</h3>
        <p className="mb-4 text-sm text-slate-600">
          آخرین اخبار را در ایمیل خود دریافت کنید
        </p>
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

