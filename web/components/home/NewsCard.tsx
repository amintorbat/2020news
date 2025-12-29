import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/acs/types";
import type { NewsArticle } from "@/lib/data";
import { cn } from "@/lib/cn";

type CardArticle = Article | NewsArticle;

export function NewsCard({ article, compact = false }: { article: CardArticle; compact?: boolean }) {
  const rawImage = "image" in article ? article.image : article.imageUrl;
  const imageSrc = rawImage || "/images/placeholder-article.png";
  const description = "summary" in article ? article.summary : "excerpt" in article ? article.excerpt : "";
  const href = `/news/${article.slug}`;
  const meta = "timeAgo" in article ? article.timeAgo : formatDate("publishedAt" in article ? article.publishedAt : undefined);

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-white p-4 text-right shadow-card sm:flex-row sm:items-stretch",
        compact && "lg:gap-3 lg:rounded-2xl lg:p-3"
      )}
      dir="rtl"
    >
      <div
        className={cn(
          "relative h-44 w-full overflow-hidden rounded-2xl sm:h-auto sm:w-60 lg:w-72",
          compact && "lg:h-28 lg:w-52"
        )}
      >
        <Image src={imageSrc} alt={article.title} fill sizes="(min-width: 640px) 300px, 90vw" className="object-cover" />
      </div>
      <div className={cn("flex flex-1 flex-col justify-center gap-3 sm:pr-6", compact && "lg:gap-2 lg:pr-4")}>
        <div className={cn("flex flex-wrap items-center gap-2 text-xs text-slate-400", compact && "lg:gap-1.5 lg:text-[11px]")}>
          <span className="rounded-full bg-brand/10 px-3 py-1 font-semibold text-brand">{article.category}</span>
          {meta && <span>{meta}</span>}
        </div>
        <Link
          href={href}
          className={cn("text-lg font-bold leading-snug text-slate-900", compact && "lg:text-base")}
        >
          {article.title}
        </Link>
        {description && (
          <p className={cn("text-sm leading-6 text-slate-600", compact && "lg:text-xs lg:leading-5")}>{description}</p>
        )}
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
