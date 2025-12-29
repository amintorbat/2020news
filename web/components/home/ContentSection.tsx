import Link from "next/link";

export type Category = "فوتبال ساحلی" | "فوتسال" | "گزارش" | "یادداشت" | "اخبار استان‌ها";

export type SectionItem = {
  id: number;
  title: string;
  excerpt: string;
  category: Category;
  publishedAt: string;
  imageUrl: string;
  href: string;
};

type ContentSectionProps = {
  title: string;
  items: SectionItem[];
};

export function ContentSection({ title, items }: ContentSectionProps) {
  return (
    <section className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex flex-row-reverse items-center gap-4 rounded-3xl border border-[var(--border)] bg-white p-4 shadow-card transition hover:bg-slate-50"
          >
            <div className="min-w-0 flex-1 space-y-2 text-right">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-slate-600">
                  {item.category}
                </span>
                <span>{item.publishedAt}</span>
              </div>
              <h3 className="news-title line-clamp-2 text-sm leading-6 sm:text-base">
                {item.title}
              </h3>
              <p className="news-excerpt line-clamp-2 text-xs sm:text-sm">{item.excerpt}</p>
            </div>
            <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-24 sm:w-36">
              <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
