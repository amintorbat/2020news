import { PageHero } from "@/components/common/PageHero";
import { Footer } from "@/components/layout/Footer";
import { NewsCard } from "@/components/news/NewsCard";
import { newsArticles } from "@/data/content";

export default function BeachFootballPage() {
  const beachNews = newsArticles.filter((article) => article.category === "فوتبال ساحلی");

  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="فوتبال ساحلی"
        title="آخرین اخبار فوتبال ساحلی"
        subtitle="از تمرینات تیم ملی تا لیگ برتر ساحلی و استعدادهای نوظهور بنادر جنوبی"
      />

      <section className="container space-y-4" aria-label="اخبار فوتبال ساحلی">
        {beachNews.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </section>

      <Footer />
    </div>
  );
}
