import Link from "next/link";
import Image from "next/image";
import type { NewsArticle } from "@/lib/data";

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-white p-4 text-right shadow-card sm:flex-row sm:items-stretch sm:justify-between sm:gap-12 lg:gap-16" dir="rtl">
      <div className="relative h-48 w-full overflow-hidden rounded-2xl sm:w-60 lg:w-64">
        <Image src={article.image} alt={article.title} fill sizes="(min-width: 640px) 240px, 90vw" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-3 sm:max-w-[60%]">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
          <span className="rounded-full bg-brand/10 px-3 py-1 font-semibold text-brand">{article.category}</span>
          <span>{article.timeAgo}</span>
        </div>
        <Link href={`/news/${article.slug}`} className="text-lg font-bold text-[var(--foreground)]">
          {article.title}
        </Link>
        {article.summary && <p className="text-sm text-[var(--muted)]">{article.summary}</p>}
      </div>
    </article>
  );
}
