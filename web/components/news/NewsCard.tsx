import Image from "next/image";
import type { NewsArticle } from "@/data/content";

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="grid gap-4 rounded-3xl border border-[var(--border)] bg-white p-4 shadow-card sm:grid-cols-[160px,1fr]" dir="rtl">
      <div className="relative h-36 w-full overflow-hidden rounded-2xl sm:order-2">
        <Image src={article.image} alt={article.title} fill sizes="(min-width: 640px) 160px, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col justify-between sm:order-1">
        <div>
          <div className="flex items-center gap-3 text-xs font-semibold text-brand">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-brand">{article.category}</span>
            <span className="text-[var(--muted)]">{article.timeAgo}</span>
          </div>
          <h3 className="mt-3 text-lg font-bold text-[var(--foreground)]">{article.title}</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">{article.summary}</p>
        </div>
      </div>
    </article>
  );
}
