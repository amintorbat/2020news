import Image from "next/image";
import Link from "next/link";
import type { NewsArticle } from "@/data/content";

type NewsCardProps = {
  article: NewsArticle;
};

export function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="flex flex-row-reverse items-stretch gap-4 rounded-3xl border border-white/10 bg-[#050f23] p-4" dir="rtl">
      <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl sm:h-40 sm:w-40">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          sizes="160px"
        />
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 text-[11px] font-bold text-white">
          {article.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between text-right">
        <div className="space-y-2">
          <Link href={`/news/${article.slug}`} className="text-lg font-bold leading-relaxed text-white hover:text-primary">
            {article.title}
          </Link>
          <p className="text-sm leading-loose text-white/70">{article.summary}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-white/50">
          <span>{article.author}</span>
          <span className="h-1 w-1 rounded-full bg-white/30" aria-hidden="true" />
          <span>{article.timeAgo}</span>
        </div>
      </div>
    </article>
  );
}
