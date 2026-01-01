import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/acs/types";

type FeaturedNewsSectionProps = {
  articles: Article[];
};

export function FeaturedNewsSection({ articles }: FeaturedNewsSectionProps) {
  if (articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 5);

  return (
    <section className="space-y-4" dir="rtl">
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">خبرهای برجسته</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main Featured Article */}
        <Link
          href={`/news/${mainArticle.slug}`}
          className="group relative h-64 overflow-hidden bg-slate-900 lg:col-span-2 lg:h-80"
        >
          {mainArticle.imageUrl && (
            <Image
              src={mainArticle.imageUrl}
              alt={mainArticle.title}
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover transition-transform group-hover:scale-105"
              style={{ borderRadius: 0 }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/30" />
          <div className="relative flex h-full flex-col justify-end p-6">
            <span className="mb-3 inline-block w-fit rounded-full bg-brand px-2.5 py-1 text-[10px] font-semibold text-white">
              {mainArticle.category}
            </span>
            <h3 className="text-xl font-bold leading-tight sm:text-2xl lg:text-3xl" style={{ color: '#ffffff' }}>
              {mainArticle.title}
            </h3>
            {mainArticle.excerpt && (
              <p className="mt-2.5 line-clamp-2 text-sm font-medium sm:text-base" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                {mainArticle.excerpt}
              </p>
            )}
          </div>
        </Link>

        {/* Side Articles */}
        <div className="space-y-4">
          {sideArticles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group flex gap-3 rounded-xl border border-[var(--border)] bg-white p-3 transition hover:border-brand hover:shadow-md"
            >
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden sm:h-24 sm:w-24">
                {article.imageUrl ? (
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    sizes="96px"
                    className="object-cover transition-transform group-hover:scale-105"
                    style={{ borderRadius: 0 }}
                  />
                ) : (
                  <div className="h-full w-full bg-slate-200" />
                )}
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <span className="mb-1 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
                  {article.category}
                </span>
                <h4 className="line-clamp-2 text-sm font-bold leading-snug sm:text-base" style={{ color: '#0f172a' }}>
                  {article.title}
                </h4>
                <p className="mt-1 line-clamp-2 text-xs sm:text-sm" style={{ color: '#475569' }}>
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

