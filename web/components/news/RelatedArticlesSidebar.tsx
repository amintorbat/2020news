import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/acs/types";

type RelatedArticlesSidebarProps = {
  articles: Article[];
};

export function RelatedArticlesSidebar({ articles }: RelatedArticlesSidebarProps) {
  if (articles.length === 0) return null;

  return (
    <div className="space-y-4" dir="rtl">
      <h3 className="text-sm font-semibold text-slate-900">مطالب مرتبط</h3>
      <div className="space-y-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="group flex gap-3"
          >
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden">
              {article.imageUrl ? (
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  sizes="64px"
                  className="object-cover transition-transform group-hover:scale-105"
                  style={{ borderRadius: 0 }}
                />
              ) : (
                <div className="h-full w-full bg-slate-200" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition group-hover:text-brand">
                {article.title}
              </h4>
              <p className="mt-1 text-xs text-slate-500">{article.category}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

