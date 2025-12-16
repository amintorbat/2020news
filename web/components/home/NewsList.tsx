import { latestNews } from "@/data/mock/news";
import { NewsCard } from "./NewsCard";

export function NewsList() {
  return (
    <section className="container space-y-6" id="news">
      <header className="space-y-1">
        <p className="section-subtitle">پوشش اختصاصی</p>
        <h2 className="section-title">آخرین اخبار</h2>
      </header>
      <div className="grid gap-6">
        {latestNews.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
