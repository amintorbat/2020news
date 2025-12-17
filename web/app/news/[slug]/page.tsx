export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/common/PageHero";
import { Footer } from "@/components/layout/Footer";
import { getArticleDetail } from "@/lib/acs/articleDetail";
import { getFallbackHomePayload } from "@/lib/acs/fallback";
import { getHomeContent } from "@/lib/acs/home";
import { ArticleEngagement } from "@/components/news/ArticleEngagement";
import { NewsCard } from "@/components/home/NewsCard";

type PageProps = {
  params: { slug: string };
};

export default async function NewsDetailsPage({ params }: PageProps) {
  const liveFeed = await getHomeContent().catch(() => null);
  const fallbackArticle =
    liveFeed?.latestNews.find((article) => article.slug === params.slug) ??
    getFallbackHomePayload().latestNews.find((article) => article.slug === params.slug);
  const detail = await getArticleDetail(params.slug).catch(() => null);

  if (!detail && !fallbackArticle) {
    notFound();
  }

  const title = detail?.title ?? fallbackArticle?.title ?? "گزارش خبری";
  const category = detail?.category ?? fallbackArticle?.category ?? "اخبار";
  const publishedAt = detail?.publishedAt ?? fallbackArticle?.publishedAt ?? new Date().toLocaleDateString("fa-IR");
  const imageUrl = detail?.imageUrl ?? fallbackArticle?.imageUrl ?? "/images/placeholder-article.png";
  const paragraphs = detail?.paragraphs ?? [fallbackArticle?.excerpt ?? "متن این گزارش به‌زودی منتشر خواهد شد."];
  const related =
    liveFeed?.latestNews
      .filter((article) => article.slug !== params.slug && article.category === category)
      .slice(0, 3) ?? [];

  return (
    <div className="space-y-12">
      <PageHero
        eyebrow={category}
        title={title}
        subtitle="گزارش کامل به همراه تحلیل فنی و گفت‌وگو با مربیان"
        action={
          <Link href="/news" className="rounded-full border border-[var(--border)] px-5 py-2 text-sm text-[var(--muted)] hover:text-brand">
            بازگشت به اخبار
          </Link>
        }
      />

      <article className="container space-y-6" dir="rtl">
        <div className="relative h-80 w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-white">
          <Image src={imageUrl} alt={title} fill sizes="(min-width: 768px) 1024px, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]">
          <span>منتشر شده: {publishedAt}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--border)]" aria-hidden="true" />
          <span>منبع: 2020news.ir</span>
        </div>
        <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-white p-6 text-base leading-8 text-[var(--foreground)]">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-[var(--muted)]">
              {paragraph}
            </p>
          ))}
        </div>
        <ArticleEngagement slug={params.slug} />
        {related.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-base font-semibold text-[var(--foreground)]">اخبار مرتبط</h3>
            <div className="space-y-4">
              {related.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}
      </article>

      <Footer />
    </div>
  );
}
