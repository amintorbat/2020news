import Link from "next/link";
import { latestNews } from "@/lib/mock/home";

export function LatestNews() {
  return (
    <section
      className="rounded-3xl border border-[var(--border)] bg-white shadow-card"
      dir="rtl"
    >
      <div className="divide-y divide-[var(--border)]">
        {latestNews.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex flex-row-reverse items-center gap-4 p-4 text-gray-900 transition hover:bg-slate-50 sm:gap-6"
          >
            <div className="min-w-0 flex-1 space-y-2 text-right">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-slate-600">
                  {item.category}
                </span>
                <span>{item.publishedAt}</span>
              </div>
              <h3 className="news-title text-base leading-7">
                {item.title}
              </h3>
              <p className="news-excerpt text-sm leading-6">{item.excerpt}</p>
            </div>
            <div className="h-20 w-28 flex-shrink-0 overflow-hidden bg-slate-100 sm:h-24 sm:w-36">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </Link>
        ))}
      </div>
      <div className="border-t border-[var(--border)] p-4">
        <Link
          href="/news"
          className="flex items-center justify-center rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand hover:bg-brand/5 hover:text-brand"
        >
          مشاهده همه اخبار
        </Link>
      </div>
    </section>
  );
}
