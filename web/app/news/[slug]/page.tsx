import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/common/PageHero";
import { Footer } from "@/components/layout/Footer";
import { getArticleBySlug, newsArticles } from "@/data/content";

type NewsPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export default function NewsDetailsPage({ params }: NewsPageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <PageHero
        eyebrow={article.category}
        title={article.title}
        subtitle="گزارش کامل به همراه تحلیل فنی و گفت‌وگو با مربیان"
        actions={
          <Link
            href="/news"
            className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white/80"
          >
            بازگشت به اخبار
          </Link>
        }
      />

      <article className="container space-y-6" dir="rtl">
        <div className="relative h-72 w-full overflow-hidden rounded-3xl border border-white/10">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 1024px, 100vw"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
          <span>نویسنده: {article.author}</span>
          <span className="h-1 w-1 rounded-full bg-white/30" aria-hidden="true" />
          <span>منتشر شده: {article.publishDate}</span>
          <span className="h-1 w-1 rounded-full bg-white/30" aria-hidden="true" />
          <span>{article.timeAgo}</span>
        </div>

        <div className="space-y-4 text-base leading-8 text-white/80">
          <p>
            با برنامه‌ای که کادر فنی چیده است تیم ملی در فاز پرس تیم مقابل را تحت فشار قرار داده و از بازیسازهای سر ضرب جلوگیری می‌کند. حضور
            دروازه‌بان دوم در نقش پاورپلی هم باعث شده سرعت چرخش توپ بیش‌تر شود و خط حمله با سه بازیکن تکنیکی شکل بگیرد.
          </p>
          <p>
            به گفته کارشناسان، استفاده از بازیکنان دونده در قسمت راست باعث شد فضای خالی پشت مدافعان ژاپن ایجاد شود و همین موضوع موقعیت‌های متعددی برای ایران ساخت. حالا تیم ملی با تمرکز روی ریکاوری آماده دیدار
            فینال می‌شود و قرار است امروز یک جلسه مرور ویدئویی برگزار کند.
          </p>
          <p>
            ۲۰۲۰نیوز لحظه به لحظه با خبرنگاران اعزامی خود حاشیه‌ها و گفتگوها را پوشش می‌دهد. شما نیز می‌توانید از طریق شبکه‌های اجتماعی با ما همراه شوید و تحلیل‌های فنی خود را به اشتراک بگذارید.
          </p>
        </div>
      </article>

      <Footer />
    </div>
  );
}
