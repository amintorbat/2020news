import { PageHero } from "@/components/common/PageHero";
import { Footer } from "@/components/layout/Footer";
import { NewsCard } from "@/components/news/NewsCard";
import { newsArticles } from "@/data/content";

export default function NewsIndexPage() {
  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="اخبار"
        title="آرشیو اختصاصی ۲۰۲۰نیوز"
        subtitle="تمام تحلیل‌ها و گزارش‌های فوتسال و فوتبال ساحلی در یک صفحه"
      />

      <section className="container space-y-4">
        {newsArticles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </section>

      <Footer />
    </div>
  );
}
