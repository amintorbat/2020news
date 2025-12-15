import Link from "next/link";
import { newsArticles } from "@/data/content";
import { NewsCard } from "./NewsCard";

export function LatestNews() {
  return (
    <section className="container space-y-6" aria-labelledby="latest-news">
      <header className="flex flex-wrap items-center justify-between gap-3" id="latest-news">
        <div>
          <p className="text-xs text-white/60">پوشش اختصاصی تحریریه</p>
          <h2 className="mt-1 text-2xl font-black text-white">تازه‌ترین اخبار</h2>
        </div>
        <Link
          href="/news"
          className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white/80 hover:text-white"
        >
          آرشیو کامل اخبار
        </Link>
      </header>

      <div className="grid gap-4">
        {newsArticles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
