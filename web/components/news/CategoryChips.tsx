import Link from "next/link";

const categories = [
  { id: "all", label: "همه" },
  { id: "لیگ", label: "لیگ" },
  { id: "ملی", label: "ملی" },
  { id: "باشگاهی", label: "باشگاهی" },
  { id: "انتقالات", label: "انتقالات" },
  { id: "مصاحبه", label: "مصاحبه" },
];

type CategoryChipsProps = {
  currentCategory?: string;
  currentQuery?: string;
  currentSort?: string;
};

export function CategoryChips({ currentCategory, currentQuery, currentSort }: CategoryChipsProps) {
  const buildUrl = (categoryId: string) => {
    const params = new URLSearchParams();
    if (categoryId !== "all") {
      params.set("category", categoryId);
    }
    if (currentQuery) {
      params.set("q", currentQuery);
    }
    if (currentSort && currentSort !== "newest") {
      params.set("sort", currentSort);
    }
    const queryString = params.toString();
    return `/news${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <div className="flex flex-wrap gap-2" dir="rtl">
      {categories.map((category) => {
        const isActive = currentCategory === category.id || (!currentCategory && category.id === "all");
        return (
          <Link
            key={category.id}
            href={buildUrl(category.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              isActive
                ? "border-brand bg-brand text-white"
                : "border-[var(--border)] bg-white text-slate-700 hover:border-brand hover:bg-brand/5 hover:text-brand"
            }`}
          >
            {category.label}
          </Link>
        );
      })}
    </div>
  );
}

