import { PageHero } from "@/components/common/PageHero";
import { Footer } from "@/components/layout/Footer";
import { NewsCard } from "@/components/home/NewsCard";
import { latestNews } from "@/data/mock/news";

export default function FutsalPage() {
  const futsalNews = latestNews.filter((article) => article.category === "فوتسال");

  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="فوتسال"
        title="اخبار و تحلیل فوتسال"
        subtitle="پوشش لحظه‌ای تیم ملی، لیگ برتر، نقل‌وانتقالات و تاکتیک‌های روز فوتسال ایران"
      />

      <section className="container space-y-4" aria-label="اخبار فوتسال">
        {futsalNews.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </section>

      <Footer />
    </div>
  );
}
