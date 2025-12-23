export const dynamic = "force-dynamic";

// This page renders the full news article content with safe HTML and metadata.
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/common/PageHero";
import { Footer } from "@/components/layout/Footer";
import { getFallbackHomePayload } from "@/lib/acs/fallback";
import { getHomeContent } from "@/lib/acs/home";
import { ArticleEngagement } from "@/components/news/ArticleEngagement";
import { NewsCard } from "@/components/home/NewsCard";
import { getNewsDetail } from "@/lib/acs/news";

type PageProps = {
  params: { slug: string };
};

export default async function NewsDetailsPage({ params }: PageProps) {
  const [liveFeed, detail] = await Promise.all([
    getHomeContent().catch(() => null),
    getNewsDetail(params.slug).catch(() => null),
  ]);
  const fallbackArticle =
    liveFeed?.latestNews.find((article) => article.slug === params.slug) ??
    getFallbackHomePayload().latestNews.find((article) => article.slug === params.slug);

  if (!detail && !fallbackArticle) {
    notFound();
  }

  const title = detail?.title ?? fallbackArticle?.title ?? "گزارش خبری";
  const category = detail?.category ?? fallbackArticle?.category ?? "اخبار";
  const publishedAt = detail?.publishedAt ?? fallbackArticle?.publishedAt ?? new Date().toLocaleDateString("fa-IR");
  const imageUrl = detail ? detail.imageUrl : fallbackArticle?.imageUrl ?? "";
  const lead = detail?.lead ?? fallbackArticle?.excerpt ?? "";
  const bodyHtml =
    detail?.bodyHtml ??
    (fallbackArticle?.excerpt ? toParagraphHtml(fallbackArticle.excerpt) : "<p>متن کامل در دسترس نیست.</p>");
  const tags = detail?.tags ?? [];
  const teams = detail?.teams ?? [];
  const related =
    liveFeed?.latestNews
      .filter((article) => article.slug !== params.slug && article.category === category)
      .slice(0, 3) ?? [];

  return (
    <div className="space-y-12">
      <PageHero
        eyebrow={category}
        title={title}
        subtitle={lead}
        action={
          <Link href="/news" className="rounded-full border border-[var(--border)] px-5 py-2 text-sm text-[var(--muted)] hover:text-brand">
            بازگشت به اخبار
          </Link>
        }
      />

      <article className="container space-y-8" dir="rtl" itemScope itemType="https://schema.org/NewsArticle">
        <meta itemProp="headline" content={title} />
        <meta itemProp="datePublished" content={publishedAt} />
        {imageUrl ? <meta itemProp="image" content={imageUrl} /> : null}

        <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-white p-6">
          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]">
            <span>منتشر شده: {publishedAt}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--border)]" aria-hidden="true" />
            <span>منبع: 2020news.ir</span>
          </div>
          {lead ? <p className="text-sm leading-7 text-[var(--foreground)]">{lead}</p> : null}
        </div>

        {imageUrl ? (
          <div className="relative h-80 w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-white">
            <Image src={imageUrl} alt={title} fill sizes="(min-width: 768px) 1024px, 100vw" className="object-cover" />
          </div>
        ) : null}

        <div
          className="space-y-6 rounded-3xl border border-[var(--border)] bg-white p-6 text-base leading-8 text-[var(--foreground)]"
          itemProp="articleBody"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        {(tags.length > 0 || teams.length > 0) && (
          <section className="grid gap-6 rounded-3xl border border-[var(--border)] bg-white p-6 md:grid-cols-2">
            {tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">برچسب‌ها</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {teams.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">تیم‌های مرتبط</h3>
                <div className="flex flex-wrap gap-2">
                  {teams.map((team) => (
                    <span key={team} className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
                      {team}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <section className="rounded-3xl border border-[var(--border)] bg-white p-6" aria-label="تعاملات">
          <ArticleEngagement slug={params.slug} />
        </section>
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

function toParagraphHtml(value: string) {
  return `<p class="text-[var(--muted)] leading-8">${escapeHtml(value)}</p>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
