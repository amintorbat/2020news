import Link from "next/link";
import { PageHero } from "@/components/common/PageHero";
import { Footer } from "@/components/layout/Footer";
import { MatchCard } from "@/components/matches/MatchCard";
import { leagueOptions, matchSeasons, matchStatuses, matchWeeks, matchesCollection, type LeagueKey } from "@/lib/data";
import { cn } from "@/lib/cn";

type MatchStatus = (typeof matchStatuses)[number]["id"];

type MatchesPageProps = {
  searchParams?: { league?: string; season?: string; week?: string; status?: string };
};

type Filters = {
  league: LeagueKey;
  season: string;
  week: string;
  status: MatchStatus;
};

export default function MatchesPage({ searchParams }: MatchesPageProps) {
  const filters = resolveFilters(searchParams);
  const buildHref = (overrides: Partial<Filters>) => {
    const params = new URLSearchParams({
      league: (overrides.league ?? filters.league) as string,
      season: overrides.season ?? filters.season,
      week: overrides.week ?? filters.week,
      status: overrides.status ?? filters.status,
    });
    return `/matches?${params.toString()}`;
  };

  const filteredMatches = matchesCollection.filter(
    (match) => match.league === filters.league && match.season === filters.season && match.week === filters.week && match.status === filters.status
  );

  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="مرکز مسابقات"
        title="بازی‌ها و نتایج"
        subtitle="جدیدترین برنامه و نتایج لیگ‌های فوتبال، فوتسال و فوتبال ساحلی"
      />

      <section className="container space-y-8" dir="rtl">
        <div className="flex flex-wrap gap-3">
          {leagueOptions.map((option) => (
            <Link
              key={option.id}
              href={buildHref({ league: option.id })}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold",
                filters.league === option.id ? "bg-brand text-white shadow-lg" : "bg-[#f5f6f8] text-[var(--muted)] hover:text-brand"
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
                "rounded-full px-4 py-2 text-xs font-semibold",
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
            <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white p-8 text-center text-sm text-[var(--muted)] lg:col-span-2">
              در این فیلتر بازی فعالی ثبت نشده است. فیلترها را تغییر دهید تا برنامه‌های دیگر نمایش داده شود.
            </div>
          ) : (
            filteredMatches.map((match) => <MatchCard key={match.id} match={match} />)
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
      <input type="hidden" name="league" value={filters.league} />
      <input type="hidden" name="status" value={filters.status} />
      <label className="text-sm font-semibold text-[var(--foreground)]">
        فصل
        <select
          name="season"
          defaultValue={filters.season}
          className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--muted)] focus:border-brand focus:outline-none"
        >
          {matchSeasons.map((season) => (
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
          {matchWeeks.map((week) => (
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

function resolveFilters(searchParams?: MatchesPageProps["searchParams"]): Filters {
  const league = leagueOptions.some((option) => option.id === searchParams?.league) ? (searchParams?.league as LeagueKey) : leagueOptions[0].id;
  const season = matchSeasons.some((season) => season.id === searchParams?.season) ? (searchParams?.season as string) : matchSeasons[0].id;
  const week = matchWeeks.some((week) => week.id === searchParams?.week) ? (searchParams?.week as string) : matchWeeks[0].id;
  const status = matchStatuses.some((status) => status.id === searchParams?.status)
    ? (searchParams?.status as MatchStatus)
    : (matchStatuses[0].id as MatchStatus);

  return { league, season, week, status };
}
