import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="text-sm text-slate-600" dir="rtl">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              {isLast ? (
                <span className="font-semibold text-slate-900">{item.label}</span>
              ) : (
                <>
                  <Link
                    href={item.href || "#"}
                    className="transition hover:text-brand"
                  >
                    {item.label}
                  </Link>
                  <span className="text-slate-400" aria-hidden="true">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

