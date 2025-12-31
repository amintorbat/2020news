export const dynamic = "force-dynamic";

import Link from "next/link";
import { PageHero } from "@/components/common/PageHero";
import { Footer } from "@/components/layout/Footer";
import { NewsCard } from "@/components/home/NewsCard";
import { getHomeContent } from "@/lib/acs/home";
import type { SportType } from "@/lib/acs/types";
import { cn } from "@/lib/cn";

const tabs: { id: SportType; label: string; href: string }[] = [
  { id: "futsal", label: "فوتسال", href: "/news?category=futsal" },
  { id: "beach", label: "فوتبال ساحلی", href: "/news?category=beach" },
];

type NewsPageProps = {
  searchParams?: { category?: string; q?: string };
};

export default async function NewsIndexPage({ searchParams }: NewsPageProps) {
  const { latestNews } = await getHomeContent();
  const category = tabs.some((tab) => tab.id === searchParams?.category) ? (searchParams?.category as SportType) : "futsal";
  const query = searchParams?.q?.trim();
  const highlighted = latestNews.slice(0, 5);
  const filtered = latestNews.filter((article) => article.sport === category && (!query || article.title.includes(query) || article.excerpt.includes(query)));

  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="اخبار"
        title="آرشیو اختصاصی ۲۰۲۰نیوز"
        subtitle="تمام تحلیل‌ها و گزارش‌های فوتسال و فوتبال ساحلی در یک صفحه"
        action={
          <form className="flex gap-2" dir="rtl">
            <input type="hidden" name="category" value={category} />
            <label className="sr-only" htmlFor="news-search">
              جستجوی اخبار
            </label>
            <input
              id="news-search"
              type="search"
              name="q"
              defaultValue={query ?? ""}
              placeholder="جستجوی سریع..."
              className="w-48 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none"
            />
            <button type="submit" className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-900">
              جستجو
            </button>
          </form>
        }
      />

      <section className="container space-y-4" dir="rtl">
        <h2 className="text-lg font-bold text-slate-900">خبرهای مهم امروز</h2>
        <div className="space-y-4">
          {highlighted.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <section className="container space-y-5" dir="rtl">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/news?category=${tab.id}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold",
                category === tab.id ? "bg-brand text-white shadow" : "bg-[#f5f6f8] text-slate-700 hover:text-brand"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        {filtered.length ? (
          <div className="space-y-4">
            {filtered.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-[var(--border)] bg-white p-6 text-center text-sm text-slate-600">
            برای این دسته خبری مطابق جستجو پیدا نشد.
          </p>
        )}
      </section>

      <Footer />
    </div>
  );
}
