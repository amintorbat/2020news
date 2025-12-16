import Link from "next/link";
import Image from "next/image";
import type { NewsArticle } from "@/data/mock/news";

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="grid gap-4 rounded-3xl border border-[var(--border)] bg-white p-4 shadow-card sm:grid-cols-[200px,1fr]" dir="rtl">
      <div className="relative h-40 w-full overflow-hidden rounded-2xl sm:order-2">
        <Image src={article.image} alt={article.title} fill sizes="(min-width: 640px) 200px, 90vw" className="object-cover" />
      </div>
      <div className="flex flex-col sm:order-1">
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-full bg-brand/10 px-3 py-1 font-semibold text-brand">{article.category}</span>
          <span className="text-[var(--muted)]">{article.timeAgo}</span>
        </div>
        <Link href={`/news/${article.slug}`} className="mt-3 text-lg font-bold text-[var(--foreground)]">
          {article.title}
        </Link>
        <p className="mt-2 text-sm text-[var(--muted)]">{article.summary}</p>
      </div>
    </article>
  );
}
