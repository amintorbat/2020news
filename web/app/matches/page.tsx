import Link from "next/link";
import { PageHero } from "@/components/common/PageHero";
import { Footer } from "@/components/layout/Footer";
import { MatchCard } from "@/components/matches/MatchCard";
import { MatchFilters } from "@/components/matches/MatchFilters";
import { leagueOptions, matchSeasons, matchStatuses, matchWeeks, matchesCollection, type LeagueKey } from "@/lib/data";
import { mockMatches, timeRangeOptions, statusOptions, type MatchItem, type TimeRange } from "@/lib/data/matches";
import { cn } from "@/lib/cn";

type MatchStatus = (typeof matchStatuses)[number]["id"];

type MatchesPageProps = {
  searchParams?: { league?: string; season?: string; week?: string; status?: string; timeRange?: string };
};

type Filters = {
  league: LeagueKey;
  season: string;
  week: string;
  status: MatchStatus | "all";
  timeRange?: TimeRange;
};

export default function MatchesPage({ searchParams }: MatchesPageProps) {
  const filters = resolveFilters(searchParams);

  // Use mockMatches for better data structure
  let filteredMatches: MatchItem[] = mockMatches.filter((match) => match.sport === filters.league);

  // Filter by time range if provided
  if (filters.timeRange) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    if (filters.timeRange === "today") {
      filteredMatches = filteredMatches.filter((match) => {
        const matchDate = new Date(match.dateISO);
        matchDate.setHours(0, 0, 0, 0);
        return matchDate.getTime() === today.getTime();
      });
    } else if (filters.timeRange === "tomorrow") {
      filteredMatches = filteredMatches.filter((match) => {
        const matchDate = new Date(match.dateISO);
        matchDate.setHours(0, 0, 0, 0);
        return matchDate.getTime() === tomorrow.getTime();
      });
    } else if (filters.timeRange === "this-week") {
      filteredMatches = filteredMatches.filter((match) => {
        const matchDate = new Date(match.dateISO);
        matchDate.setHours(0, 0, 0, 0);
        return matchDate.getTime() >= today.getTime() && matchDate.getTime() < weekEnd.getTime();
      });
    }
  }

  // Filter by status
  if (filters.status && filters.status !== "all") {
    filteredMatches = filteredMatches.filter((match) => match.status === filters.status);
  }

  // Filter by season and week
  filteredMatches = filteredMatches.filter(
    (match) => match.season === filters.season && match.week === filters.week
  );

  // Sort: live first, then by date
  filteredMatches.sort((a, b) => {
    if (a.status === "live" && b.status !== "live") return -1;
    if (a.status !== "live" && b.status === "live") return 1;
    return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime();
  });

  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="مرکز مسابقات"
        title="بازی‌ها و نتایج"
        subtitle="جدیدترین برنامه و نتایج لیگ‌های فوتبال، فوتسال و فوتبال ساحلی"
      />

      <section className="container space-y-8" dir="rtl">
        <MatchFilters
          currentLeague={filters.league}
          currentStatus={filters.status}
          currentSeason={filters.season}
          currentWeek={filters.week}
        />

        <FiltersForm filters={filters} />

        <div className="space-y-3 sm:space-y-4">
          {filteredMatches.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-8 text-center text-sm text-slate-600">
              در این فیلتر بازی فعالی ثبت نشده است. فیلترها را تغییر دهید تا برنامه‌های دیگر نمایش داده شود.
            </div>
          ) : (
            filteredMatches.map((match) => <MatchItemCard key={match.id} match={match} />)
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FiltersForm({ filters }: { filters: Filters }) {
  return (
    <form className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4" action="/matches" dir="rtl">
      <input type="hidden" name="league" value={filters.league} />
      <input type="hidden" name="status" value={filters.status} />
      {filters.timeRange && <input type="hidden" name="timeRange" value={filters.timeRange} />}
      <label className="text-sm font-semibold text-slate-900">
        بازه زمانی
        <select
          name="timeRange"
          defaultValue={filters.timeRange || "today"}
          className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
        >
          {timeRangeOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-semibold text-slate-900">
        فصل
        <select
          name="season"
          defaultValue={filters.season}
          className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
        >
          {matchSeasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-semibold text-slate-900">
        هفته
        <select
          name="week"
          defaultValue={filters.week}
          className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
        >
          {matchWeeks.map((week) => (
            <option key={week.id} value={week.id}>
              {week.label}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-end">
        <button type="submit" className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand/90">
          اعمال فیلتر
        </button>
      </div>
    </form>
  );
}

function MatchItemCard({ match }: { match: MatchItem }) {
  const getStatusBadge = () => {
    if (match.status === "live") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
          زنده {match.liveMinute && `${match.liveMinute}'`}
        </span>
      );
    }
    if (match.status === "finished") {
      return (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          تمام‌شده
        </span>
      );
    }
    return (
      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
        در انتظار
      </span>
    );
  };

  return (
    <article className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="flex items-center gap-2 text-sm text-slate-600" style={{ color: '#475569' }}>
            <span style={{ color: '#475569' }}>{match.datePersian}</span>
            <span className="text-slate-400">•</span>
            <span style={{ color: '#475569' }}>{match.time}</span>
            <span className="text-slate-400">•</span>
            <span style={{ color: '#475569' }}>{match.venue}</span>
          </div>
          <div className="flex items-center gap-3 text-base font-semibold text-slate-800 sm:text-lg" style={{ color: '#1e293b' }}>
            <span className="truncate" style={{ color: '#1e293b' }}>{match.homeTeam.name}</span>
            {match.status === "finished" && match.score ? (
              <span className="flex-shrink-0 font-bold text-brand">
                {match.score.home} - {match.score.away}
              </span>
            ) : match.status === "live" && match.score ? (
              <span className="flex-shrink-0 font-bold text-red-600">
                {match.score.home} - {match.score.away}
              </span>
            ) : (
              <span className="flex-shrink-0 text-slate-400">vs</span>
            )}
            <span className="truncate" style={{ color: '#1e293b' }}>{match.awayTeam.name}</span>
          </div>
          <div className="text-xs text-slate-600 sm:text-sm" style={{ color: '#475569' }}>{match.competition}</div>
        </div>
        <div className="flex-shrink-0">{getStatusBadge()}</div>
      </div>
    </article>
  );
}

function resolveFilters(searchParams?: MatchesPageProps["searchParams"]): Filters {
  const league = leagueOptions.some((option) => option.id === searchParams?.league) ? (searchParams?.league as LeagueKey) : leagueOptions[0].id;
  const season = matchSeasons.some((season) => season.id === searchParams?.season) ? (searchParams?.season as string) : matchSeasons[0].id;
  const week = matchWeeks.some((week) => week.id === searchParams?.week) ? (searchParams?.week as string) : matchWeeks[0].id;
  const status = searchParams?.status === "all" 
    ? "all"
    : matchStatuses.some((status) => status.id === searchParams?.status)
    ? (searchParams?.status as MatchStatus)
    : "all";
  const timeRange = timeRangeOptions.some((tr) => tr.id === searchParams?.timeRange)
    ? (searchParams?.timeRange as TimeRange)
    : undefined;

  return { league, season, week, status, timeRange };
}
