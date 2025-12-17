import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/acs/types";
import type { NewsArticle } from "@/lib/data";

type CardArticle = Article | NewsArticle;

export function NewsCard({ article }: { article: CardArticle }) {
  const rawImage = "image" in article ? article.image : article.imageUrl;
  const imageSrc = rawImage || "/images/placeholder-article.png";
  const description = "summary" in article ? article.summary : "excerpt" in article ? article.excerpt : "";
  const href = `/news/${article.slug}`;
  const meta = "timeAgo" in article ? article.timeAgo : formatDate("publishedAt" in article ? article.publishedAt : undefined);

  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-white p-4 text-right shadow-card sm:flex-row sm:items-stretch" dir="rtl">
      <div className="relative h-44 w-full overflow-hidden rounded-2xl sm:h-auto sm:w-60 lg:w-72">
        <Image src={imageSrc} alt={article.title} fill sizes="(min-width: 640px) 300px, 90vw" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-3 sm:pr-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
          <span className="rounded-full bg-brand/10 px-3 py-1 font-semibold text-brand">{article.category}</span>
          {meta && <span>{meta}</span>}
        </div>
        <Link href={href} className="text-lg font-bold leading-snug text-[var(--foreground)]">
          {article.title}
        </Link>
        {description && <p className="text-sm leading-6 text-[var(--muted)]">{description}</p>}
      </div>
    </article>
  );
}

function formatDate(value?: string) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
}
