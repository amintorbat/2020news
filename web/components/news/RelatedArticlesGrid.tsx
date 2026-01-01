import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/acs/types";

type RelatedArticlesGridProps = {
  articles: Article[];
};

export function RelatedArticlesGrid({ articles }: RelatedArticlesGridProps) {
  if (articles.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" dir="rtl">
      {articles.map((article) => {
        const imageUrl = article.imageUrl || "/images/placeholder-article.png";
        return (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm transition hover:border-brand hover:shadow-md"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform group-hover:scale-105"
                style={{ borderRadius: 0 }}
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-brand/10 px-2 py-1 font-semibold text-brand">
                  {article.category}
                </span>
                <span className="text-slate-600">
                  {formatDate(article.publishedAt)}
                </span>
              </div>
              <h3 className="line-clamp-2 flex-1 text-base font-bold leading-snug text-slate-900 transition group-hover:text-brand">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                  {article.excerpt}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function formatDate(dateString: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      calendar: "persian",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

