import Link from "next/link";

type ArticleTagsSidebarProps = {
  tags: string[];
};

export function ArticleTagsSidebar({ tags }: ArticleTagsSidebarProps) {
  if (tags.length === 0) return null;

  return (
    <div className="space-y-3" dir="rtl">
      <h3 className="text-sm font-semibold text-slate-900">برچسب‌ها</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/news?q=${encodeURIComponent(tag)}`}
            className="rounded-full border border-[var(--border)] bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-brand hover:bg-brand/5 hover:text-brand"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}

