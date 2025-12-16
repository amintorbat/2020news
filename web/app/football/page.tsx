import { PageHero } from "@/components/common/PageHero";
import { Footer } from "@/components/layout/Footer";
import { NewsCard } from "@/components/home/NewsCard";
import { latestNews } from "@/lib/data";

export default function FootballPage() {
  const footballNews = latestNews.filter((article) => article.category === "فوتبال");

  return (
    <div className="space-y-10">
      <PageHero eyebrow="فوتبال" title="مرکز خبر فوتبال" subtitle="اخبار لیگ برتر ایران و گزارش‌های ویژه از اردوهای ملی" />

      <section className="container space-y-4" aria-label="اخبار فوتبال">
        {footballNews.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </section>

      <Footer />
    </div>
  );
}
