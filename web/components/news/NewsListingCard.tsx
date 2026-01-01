import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/acs/types";

type NewsListingCardProps = {
  article: Article;
};

export function NewsListingCard({ article }: NewsListingCardProps) {
  const imageUrl = article.imageUrl || "/images/placeholder-article.png";

  return (
    <article
      className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm transition hover:border-brand hover:shadow-md sm:flex-row sm:items-stretch"
      dir="rtl"
    >
      <div className="relative h-44 w-full overflow-hidden sm:h-auto sm:w-60 lg:w-72">
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          sizes="(min-width: 640px) 300px, 100vw"
          className="object-cover"
          style={{ borderRadius: 0 }}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 overflow-hidden sm:pr-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-brand/10 px-3 py-1 font-semibold text-brand">
            {article.category}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
            {article.sport === "futsal" ? "فوتسال" : "فوتبال ساحلی"}
          </span>
          <span className="whitespace-nowrap">{formatDate(article.publishedAt)}</span>
        </div>
        <Link
          href={`/news/${article.slug}`}
          className="break-words text-lg font-bold leading-snug text-slate-900 transition hover:text-brand sm:text-xl"
        >
          {article.title}
        </Link>
        {article.excerpt && (
          <p className="line-clamp-2 break-words text-sm leading-6 text-slate-600 sm:text-base">
            {article.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}

function formatDate(dateString: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

