import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/common/PageHero";
import { Footer } from "@/components/layout/Footer";
import { getArticleBySlug, latestNews } from "@/lib/data";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return latestNews.map((article) => ({ slug: article.slug }));
}

export default function NewsDetailsPage({ params }: PageProps) {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-12">
      <PageHero
        eyebrow={article.category}
        title={article.title}
        subtitle="گزارش کامل به همراه تحلیل فنی و گفت‌وگو با مربیان"
        action={
          <Link href="/news" className="rounded-full border border-[var(--border)] px-5 py-2 text-sm text-[var(--muted)] hover:text-brand">
            بازگشت به اخبار
          </Link>
        }
      />

      <article className="container space-y-6" dir="rtl">
        <div className="relative h-80 w-full overflow-hidden rounded-3xl border border-[var(--border)]">
          <Image src={article.image} alt={article.title} fill sizes="(min-width: 768px) 1024px, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]">
          <span>نویسنده: {article.author}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--border)]" aria-hidden="true" />
          <span>منتشر شده: {article.publishDate}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--border)]" aria-hidden="true" />
          <span>{article.timeAgo}</span>
        </div>
        <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-white p-6 text-base leading-8 text-[var(--muted)]">
          <p>
            با برنامه‌ای که کادر فنی چیده است تیم ملی در فاز پرس تیم مقابل را تحت فشار قرار داده و از بازیسازهای سر ضرب جلوگیری می‌کند. حضور دروازه‌بان دوم در نقش پاورپلی هم باعث شده سرعت چرخش توپ بیش‌تر شود.
          </p>
          <p>
            به گفته کارشناسان، استفاده از بازیکنان دونده در قسمت راست باعث شد فضای خالی پشت مدافعان ژاپن ایجاد شود و همین موضوع موقعیت‌های متعددی برای ایران ساخت. تمرکز بر ریکاوری و آنالیز ویدئویی در برنامه امروز است.
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
