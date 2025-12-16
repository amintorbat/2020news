import { latestNews } from "@/lib/data";
import { SectionHeader } from "@/components/common/SectionHeader";
import { NewsCard } from "./NewsCard";

export function NewsList() {
  return (
    <section className="container space-y-6" id="news">
      <SectionHeader title="آخرین اخبار" />
      <div className="grid gap-6">
        {latestNews.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
