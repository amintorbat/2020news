import { newsArticles } from "@/data/content";
import { NewsCard } from "./NewsCard";

export function LatestNewsSection() {
  return (
    <section className="container space-y-6" id="latest-news">
      <header className="space-y-2">
        <p className="section-subtitle">تازه‌ترین گزارش‌ها و مصاحبه‌ها</p>
        <h2 className="section-title">آخرین اخبار</h2>
      </header>
      <div className="grid gap-6">
        {newsArticles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
