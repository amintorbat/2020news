import Link from "next/link";
import { PageHero } from "@/components/common/PageHero";
import { Footer } from "@/components/layout/Footer";
import { matchStatuses, matchesCollection, seasons, weeks } from "@/data/mock/matches";
import { cn } from "@/lib/cn";

const typeOptions = [
  { id: "futsal", label: "فوتسال" },
  { id: "beach", label: "فوتبال ساحلی" },
] as const;

type SportType = (typeof typeOptions)[number]["id"];
type MatchStatus = (typeof matchStatuses)[number]["id"];

type MatchesPageProps = {
  searchParams?: { type?: string; season?: string; week?: string; status?: string };
};

type Filters = {
  type: SportType;
  season: string;
  week: string;
  status: MatchStatus;
};

export default function MatchesPage({ searchParams }: MatchesPageProps) {
  const filters = resolveFilters(searchParams);
  const statusLabels = Object.fromEntries(matchStatuses.map((status) => [status.id, status.label])) as Record<MatchStatus, string>;
  const filteredMatches = matchesCollection.filter(
    (match) =>
      match.type === filters.type &&
      match.season === filters.season &&
      match.week === filters.week &&
      match.status === filters.status
  );

  const buildHref = (overrides: Partial<Filters>) => {
    const params = new URLSearchParams({
      type: overrides.type ?? filters.type,
      season: overrides.season ?? filters.season,
      week: overrides.week ?? filters.week,
      status: overrides.status ?? filters.status,
    });
    return `/matches?${params.toString()}`;
  };

  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="بازی‌ها و نتایج"
        title="مرکز مسابقات فوتسال و فوتبال ساحلی"
        subtitle="فیلتر کامل برای مشاهده بازی‌های زنده، برنامه‌ی هفتگی و نتایج نهایی دو رشته اصلی ۲۰۲۰نیوز"
      />

      <section className="container space-y-8" dir="rtl">
        <div className="flex flex-wrap gap-3">
          {typeOptions.map((option) => (
            <Link
              key={option.id}
              href={buildHref({ type: option.id })}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition",
                filters.type === option.id ? "bg-brand text-white shadow-lg" : "bg-[#f5f6f8] text-[var(--muted)] hover:text-brand"
              )}
            >
              {option.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-3" role="tablist" aria-label="وضعیت بازی‌ها">
          {matchStatuses.map((statusOption) => (
            <Link
              key={statusOption.id}
              href={buildHref({ status: statusOption.id as MatchStatus })}
              role="tab"
              aria-selected={filters.status === statusOption.id}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold transition",
                filters.status === statusOption.id ? "bg-slate-900 text-white" : "bg-[#f5f6f8] text-[var(--muted)] hover:text-brand"
              )}
            >
              {statusOption.label}
            </Link>
          ))}
        </div>

        <FiltersForm filters={filters} />

        <div className="grid gap-4 lg:grid-cols-2">
          {filteredMatches.length === 0 ? (
            <EmptyState />
          ) : (
            filteredMatches.map((match) => (
              <article key={match.id} className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-card" dir="rtl">
                <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>{match.venue}</span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold",
                      match.status === "live" && "bg-red-500/10 text-red-600",
                      match.status === "upcoming" && "bg-brand/10 text-brand",
                      match.status === "finished" && "bg-slate-200 text-slate-600"
                    )}
                  >
                    {statusLabels[match.status]}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-[var(--foreground)]">{match.opponent}</h3>
                <div className="mt-3 flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>فصل {match.season}</span>
                  <span>هفته {match.week}</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>{match.date}</span>
                  {match.score ? (
                    <p className="text-3xl font-black text-[var(--foreground)]">{match.score}</p>
                  ) : (
                    <span className="text-xs text-brand">گزارش زنده از استودیو ۲۰۲۰نیوز</span>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FiltersForm({ filters }: { filters: Filters }) {
  return (
    <form className="grid gap-4 md:grid-cols-3" action="/matches" dir="rtl">
      <input type="hidden" name="type" value={filters.type} />
      <input type="hidden" name="status" value={filters.status} />
      <label className="text-sm font-semibold text-[var(--foreground)]">
        فصل
        <select
          name="season"
          defaultValue={filters.season}
          className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--muted)] focus:border-brand focus:outline-none"
        >
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-semibold text-[var(--foreground)]">
        هفته
        <select
          name="week"
          defaultValue={filters.week}
          className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--muted)] focus:border-brand focus:outline-none"
        >
          {weeks.map((week) => (
            <option key={week.id} value={week.id}>
              {week.label}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-lg">
        اعمال فیلتر
      </button>
    </form>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white p-8 text-center text-sm text-[var(--muted)] lg:col-span-2">
      در این فیلتر بازی فعالی ثبت نشده است. فیلترها را تغییر دهید تا برنامه‌های دیگر نمایش داده شود.
    </div>
  );
}

function resolveFilters(searchParams?: MatchesPageProps["searchParams"]): Filters {
  const requestedType = searchParams?.type;
  const fallbackType: SportType = typeOptions[0].id;
  const type = typeOptions.some((option) => option.id === requestedType) ? (requestedType as SportType) : fallbackType;

  const defaultSeason = seasons[0].id;
  const season = seasons.some((item) => item.id === searchParams?.season) ? (searchParams?.season as string) : defaultSeason;

  const defaultWeek = weeks[0].id;
  const week = weeks.some((item) => item.id === searchParams?.week) ? (searchParams?.week as string) : defaultWeek;

  const defaultStatus = (matchStatuses.find((item) => item.id === "finished") ?? matchStatuses[0]).id as MatchStatus;
  const status = matchStatuses.some((item) => item.id === searchParams?.status) ? (searchParams?.status as MatchStatus) : defaultStatus;

  return { type, season, week, status };
}
