import Link from "next/link";
import Image from "next/image";
import type { SectionItem } from "@/components/home/ContentSection";

type ReportListingCardProps = {
  item: SectionItem;
};

export function ReportListingCard({ item }: ReportListingCardProps) {
  return (
    <article
      className="flex gap-4 rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm transition hover:border-brand hover:shadow-md sm:items-center"
      dir="rtl"
    >
      <div className="relative h-44 w-44 flex-shrink-0 overflow-hidden sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes="(min-width: 1024px) 112px, (min-width: 640px) 96px, 176px"
          className="object-cover"
          style={{ borderRadius: 0 }}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden text-right">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-brand/10 px-3 py-1 font-semibold text-brand">
            {item.category}
          </span>
          <span className="whitespace-nowrap">{item.publishedAt}</span>
        </div>
        <Link
          href={item.href}
          className="break-words text-lg font-bold leading-snug text-slate-900 transition hover:text-brand sm:text-xl"
        >
          {item.title}
        </Link>
        {item.excerpt && (
          <p className="line-clamp-2 break-words text-sm leading-6 text-slate-600 sm:text-base">
            {item.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}

