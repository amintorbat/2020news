export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { ArticleEngagement } from "@/components/news/ArticleEngagement";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ArticleShareSidebar } from "@/components/news/ArticleShareSidebar";
import { RelatedArticlesSidebar } from "@/components/news/RelatedArticlesSidebar";
import { ArticleTagsSidebar } from "@/components/news/ArticleTagsSidebar";
import { TableOfContents } from "@/components/news/TableOfContents";
import { MobileTOC } from "@/components/news/MobileTOC";
import { ArticleNavigation } from "@/components/news/ArticleNavigation";
import { calculateReadingTime, addHeadingIds } from "@/lib/utils/article";
import { formatDateTimeCombined } from "@/lib/utils/date";
import { generateNewsCode } from "@/lib/utils/newsCode";
import { NewsCode } from "@/components/news/NewsCode";
import { RelatedArticlesGrid } from "@/components/news/RelatedArticlesGrid";
import { NewsletterBox } from "@/components/news/NewsletterBox";
import { getMockNewsDetail, getMockAllArticles } from "@/lib/mock/newsService";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const detail = await getMockNewsDetail(params.slug);
    return {
      title: `${detail.title} | 2020news`,
      description: detail.lead,
      openGraph: {
        title: detail.title,
        description: detail.lead,
        images: detail.imageUrl ? [detail.imageUrl] : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: detail.title,
        description: detail.lead,
        images: detail.imageUrl ? [detail.imageUrl] : [],
      },
    };
  } catch {
    return {
      title: "مقاله پیدا نشد | 2020news",
    };
  }
}

export default async function NewsDetailsPage({ params }: PageProps) {
  let detail;
  try {
    detail = await getMockNewsDetail(params.slug);
  } catch {
    notFound();
  }

  const title = detail.title;
  const category = detail.category;
  const publishedAt = detail.publishedAt;
  const imageUrl = detail.imageUrl;
  const lead = detail.lead;
  const bodyHtmlRaw = detail.bodyHtml;
  const bodyHtml = addHeadingIds(bodyHtmlRaw);
  const tags = detail.tags;
  const teams = detail.teams;
  const readingTime = calculateReadingTime(bodyHtml);
  const formattedDateTime = formatDateTimeCombined(publishedAt);
  const newsCode = generateNewsCode(publishedAt, params.slug, params.slug);
  
  // Mock: Check if user is authenticated (for now, always false - UI only)
  const isAuthenticated = false;

  const sportType = detail.sport;
  const sportLabel = sportType === "beach" ? "فوتبال ساحلی" : "فوتسال";

  // Get related articles
  const allArticles = getMockAllArticles();
  const related = allArticles
    .filter((article) => article.slug !== params.slug && (article.sport === sportType || article.category === category))
    .slice(0, 3);

  // Get previous/next articles (mock - just get adjacent articles from same sport)
  const sportArticles = allArticles.filter((article) => article.sport === sportType);
  const currentIndex = sportArticles.findIndex((article) => article.slug === params.slug);
  const prevArticle = currentIndex > 0 ? { slug: sportArticles[currentIndex - 1].slug, title: sportArticles[currentIndex - 1].title } : null;
  const nextArticle = currentIndex >= 0 && currentIndex < sportArticles.length - 1 ? { slug: sportArticles[currentIndex + 1].slug, title: sportArticles[currentIndex + 1].title } : null;

  const breadcrumbItems = [
    { label: "خانه", href: "/" },
    { label: "اخبار", href: "/news" },
    { label: sportLabel, href: `/news/${sportType === "beach" ? "beach-soccer" : "futsal"}` },
    { label: title },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[var(--background)]">
      <div className="container space-y-6 px-4 pt-6 sm:px-6" dir="rtl">
        <Breadcrumb items={breadcrumbItems} />

        <article className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8" itemScope itemType="https://schema.org/NewsArticle">
          <meta itemProp="headline" content={title} />
          <meta itemProp="datePublished" content={publishedAt} />
          {imageUrl ? <meta itemProp="image" content={imageUrl} /> : null}

          {/* Main Content */}
          <div className="space-y-6">
            {/* Header */}
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block rounded-full bg-brand/10 px-4 py-1.5 text-sm font-semibold text-brand">
                  {category}
                </span>
                <span className="inline-block rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-700">
                  {sportLabel}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl" itemProp="headline">
                {title}
              </h1>
              {lead && (
                <p className="text-lg leading-relaxed text-slate-700" itemProp="description">
                  {lead}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-4 text-sm text-slate-600">
                <span className="text-slate-600">{formattedDateTime}</span>
                <span className="h-1 w-1 rounded-full bg-slate-400" aria-hidden="true" />
                <NewsCode code={newsCode} />
                <span className="h-1 w-1 rounded-full bg-slate-400" aria-hidden="true" />
                <span>زمان مطالعه: {readingTime} دقیقه</span>
                <span className="h-1 w-1 rounded-full bg-slate-400" aria-hidden="true" />
                <span>منبع: 2020news.ir</span>
              </div>

              {/* Share Buttons - Mobile */}
              <div className="border-t border-[var(--border)] pt-4 lg:hidden">
                <ArticleShareSidebar url={`/news/${params.slug}`} title={title} description={lead} />
              </div>
            </header>

            {/* Mobile TOC */}
            <MobileTOC html={bodyHtml} />

            {/* Hero Image */}
            {imageUrl && (
              <figure className="relative -mx-4 w-[calc(100%+2rem)] overflow-hidden sm:-mx-6 sm:w-[calc(100%+3rem)] lg:mx-0 lg:w-full">
                <div className="relative h-64 w-full sm:h-80 lg:h-96">
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes="(min-width: 1024px) 1024px, 100vw"
                    className="object-cover"
                    priority
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </figure>
            )}

            {/* Article Body */}
            <div
              className="prose prose-slate max-w-none text-base leading-8 prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-800 prose-a:text-blue-600 prose-strong:text-slate-900 prose-ul:text-slate-800 prose-ol:text-slate-800 prose-li:text-slate-800 prose-blockquote:text-slate-600"
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />

            {/* Tags and Teams */}
            {(tags.length > 0 || teams.length > 0) && (
              <section className="space-y-4 rounded-xl border border-[var(--border)] bg-white p-6">
                {tags.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">برچسب‌ها</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/news?q=${encodeURIComponent(tag)}`}
                          className="rounded-full border border-[var(--border)] bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-brand hover:bg-brand/5 hover:text-brand"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {teams.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">تیم‌های مرتبط</h3>
                    <div className="flex flex-wrap gap-2">
                      {teams.map((team) => (
                        <span key={team} className="rounded-full border border-[var(--border)] bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                          {team}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Newsletter */}
            <section aria-label="خبرنامه">
              <NewsletterBox />
            </section>

            {/* Engagement */}
            <section aria-label="تعاملات">
              <ArticleEngagement slug={params.slug} isAuthenticated={isAuthenticated} />
            </section>

            {/* Previous/Next Navigation */}
            <ArticleNavigation prevArticle={prevArticle} nextArticle={nextArticle} />

            {/* Related Articles */}
            {related.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">مطالب مرتبط</h2>
                <RelatedArticlesGrid articles={related} />
              </section>
            )}
          </div>

          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-[var(--border)] bg-white p-6">
                <ArticleShareSidebar url={`/news/${params.slug}`} title={title} description={lead} />
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-white p-6">
                <TableOfContents html={bodyHtml} />
              </div>
              {related.length > 0 && (
                <div className="rounded-xl border border-[var(--border)] bg-white p-6">
                  <RelatedArticlesSidebar articles={related} />
                </div>
              )}
              {tags.length > 0 && (
                <div className="rounded-xl border border-[var(--border)] bg-white p-6">
                  <ArticleTagsSidebar tags={tags} />
                </div>
              )}
              <NewsletterBox variant="compact" />
            </div>
          </aside>
        </article>
      </div>

      <Footer />
    </div>
  );
}

