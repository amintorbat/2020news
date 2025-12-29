import Link from "next/link";
import { latestNews } from "@/lib/mock/home";

export function LatestNews() {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-white shadow-card" dir="rtl">
      <div className="divide-y divide-[var(--border)]">
        {latestNews.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex flex-row-reverse items-center gap-4 p-4 transition hover:bg-slate-50 sm:gap-6"
          >
            <div className="min-w-0 flex-1 space-y-2 text-right">
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-500">{item.category}</span>
                <span>{item.publishedAt}</span>
              </div>
              <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-gray-900 sm:text-base">
                {item.title}
              </h3>
              <p className="line-clamp-2 text-xs text-gray-500 sm:text-sm">{item.excerpt}</p>
            </div>
            <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-24 sm:w-36">
              <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
