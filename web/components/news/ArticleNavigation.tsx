import Link from "next/link";

type ArticleNavigationProps = {
  prevArticle?: { slug: string; title: string } | null;
  nextArticle?: { slug: string; title: string } | null;
};

export function ArticleNavigation({ prevArticle, nextArticle }: ArticleNavigationProps) {
  if (!prevArticle && !nextArticle) return null;

  return (
    <nav className="flex flex-col gap-4 border-t border-[var(--border)] pt-6 sm:flex-row sm:justify-between" dir="rtl">
      {prevArticle ? (
        <Link
          href={`/news/${prevArticle.slug}`}
          className="group flex flex-col gap-1 rounded-lg border border-[var(--border)] bg-white p-4 transition hover:border-brand hover:shadow-md sm:flex-1"
        >
          <span className="text-xs font-semibold text-slate-500">خبر قبلی</span>
          <span className="text-sm font-semibold text-slate-900 transition group-hover:text-brand">
            {prevArticle.title}
          </span>
        </Link>
      ) : (
        <div className="sm:flex-1" />
      )}
      {nextArticle ? (
        <Link
          href={`/news/${nextArticle.slug}`}
          className="group flex flex-col gap-1 rounded-lg border border-[var(--border)] bg-white p-4 transition hover:border-brand hover:shadow-md sm:flex-1 sm:text-right"
        >
          <span className="text-xs font-semibold text-slate-500">خبر بعدی</span>
          <span className="text-sm font-semibold text-slate-900 transition group-hover:text-brand">
            {nextArticle.title}
          </span>
        </Link>
      ) : (
        <div className="sm:flex-1" />
      )}
    </nav>
  );
}

