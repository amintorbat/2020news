import { Footer } from "@/components/layout/Footer";
import { type CompetitionType } from "@/components/filters/CompetitionTypeFilter";
import { leagueOptions, matchSeasons, matchWeeks, type LeagueKey } from "@/lib/data";
import { mockMatches, timeRangeOptions, statusOptions, type MatchItem, type MatchStatusFilter, type TimeRange } from "@/lib/data/matches";
import Image from "next/image";

type MatchesPageProps = {
  searchParams?: { league?: string; season?: string; week?: string; status?: string; timeRange?: string; competitionType?: string };
};

type Filters = {
  league: LeagueKey;
  season: string;
  week: string;
  status: MatchStatusFilter;
  timeRange?: TimeRange;
  competitionType?: CompetitionType;
};

export default function MatchesPage({ searchParams }: MatchesPageProps) {
  const filters = resolveFilters(searchParams);

  // Filter matches
  let filteredMatches: MatchItem[] = mockMatches.filter((match) => match.sport === filters.league);

  // Filter by competition type
  if (filters.competitionType && filters.competitionType !== "all") {
    filteredMatches = filteredMatches.filter((match) => {
      const matchType = match.competitionType || "league";
      return matchType === filters.competitionType;
    });
  }

  // Filter by time range
  if (filters.timeRange && filters.timeRange !== "all") {
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

  // Filter by season
  filteredMatches = filteredMatches.filter((match) => match.season === filters.season);

  // Filter by week (if not "all")
  if (filters.week && filters.week !== "all") {
    filteredMatches = filteredMatches.filter((match) => match.week === filters.week);
  }

  // Sort: live first, then by date (newest first for archive)
  filteredMatches.sort((a, b) => {
    if (a.status === "live" && b.status !== "live") return -1;
    if (a.status !== "live" && b.status === "live") return 1;
    return new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime();
  });

  // Group matches by date for better organization
  const groupedMatches = groupMatchesByDate(filteredMatches);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Page Header */}
        <section className="container pt-8 sm:pt-12 lg:pt-16" dir="rtl">
          <div className="space-y-3">
            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl">برنامه مسابقات</h1>
            <p className="text-sm text-slate-600 sm:text-base">
              آرشیو کامل و بایگانی تمامی مسابقات لیگ‌های فوتسال و فوتبال ساحلی
            </p>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="container" dir="rtl">
          <FiltersForm filters={filters} />
        </section>

        {/* Results Count */}
        {filteredMatches.length > 0 && (
          <section className="container" dir="rtl">
            <div className="rounded-lg bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">{filteredMatches.length}</span> مسابقه یافت شد
            </div>
          </section>
        )}

        {/* Matches List */}
        <section className="container pb-8 sm:pb-12" dir="rtl">
          {filteredMatches.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-8 text-center">
              <p className="text-sm text-slate-600 sm:text-base">
                در این فیلتر بازی فعالی ثبت نشده است. فیلترها را تغییر دهید تا برنامه‌های دیگر نمایش داده شود.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedMatches).map(([dateKey, matches]) => (
                <div key={dateKey} className="space-y-2.5">
                  {/* Date Header */}
                  <div className="sticky top-[var(--header-height)] z-10 -mx-4 bg-[var(--background)] px-4 py-2 sm:-mx-6 sm:px-6">
                    <h2 className="text-sm font-bold text-slate-900 sm:text-base">{dateKey}</h2>
                  </div>
                  {/* Matches for this date */}
                  <div className="space-y-2">
                    {matches.map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <Footer />
      </div>
    </div>
  );
}

function FiltersForm({ filters }: { filters: Filters }) {
  return (
    <form className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6" action="/matches" dir="rtl">
      {/* Sport Filter */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="league-filter" className="text-xs font-semibold text-slate-700 sm:text-sm">
          رشته
        </label>
        <select
          id="league-filter"
          name="league"
          defaultValue={filters.league}
          className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:py-2.5"
        >
          {leagueOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Competition Type Filter */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="competition-type-filter" className="text-xs font-semibold text-slate-700 sm:text-sm whitespace-nowrap">
          نوع مسابقه
        </label>
        <select
          id="competition-type-filter"
          name="competitionType"
          defaultValue={filters.competitionType || "all"}
          className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:py-2.5"
        >
          <option value="all">همه</option>
          <option value="league">لیگ برتر</option>
          <option value="womens-league">لیگ بانوان</option>
          <option value="cup">جام‌ها</option>
          <option value="world-cup">جام جهانی</option>
          <option value="friendly">ملی / دوستانه</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="status-filter" className="text-xs font-semibold text-slate-700 sm:text-sm">
          وضعیت
        </label>
        <select
          id="status-filter"
          name="status"
          defaultValue={filters.status}
          className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:py-2.5"
        >
          {statusOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="time-range-filter" className="text-xs font-semibold text-slate-700 sm:text-sm whitespace-nowrap">
          بازه زمانی
        </label>
        <select
          id="time-range-filter"
          name="timeRange"
          defaultValue={filters.timeRange || "all"}
          className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:py-2.5"
        >
          {timeRangeOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Season Filter */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="season-filter" className="text-xs font-semibold text-slate-700 sm:text-sm">
          فصل
        </label>
        <select
          id="season-filter"
          name="season"
          defaultValue={filters.season}
          className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:py-2.5"
        >
          {matchSeasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.label}
            </option>
          ))}
        </select>
      </div>

      {/* Week Filter */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="week-filter" className="text-xs font-semibold text-slate-700 sm:text-sm">
          هفته
        </label>
        <select
          id="week-filter"
          name="week"
          defaultValue={filters.week || "all"}
          className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:py-2.5"
        >
          <option value="all">همه</option>
          {matchWeeks.map((week) => (
            <option key={week.id} value={week.id}>
              {week.label}
            </option>
          ))}
        </select>
      </div>

      {/* Apply Button */}
      <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-6">
        <label className="text-xs font-semibold text-slate-700 sm:text-sm opacity-0">اعمال</label>
        <button
          type="submit"
          className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand/90 hover:shadow-xl sm:py-3"
        >
          اعمال فیلتر
        </button>
      </div>
    </form>
  );
}

function MatchCard({ match }: { match: MatchItem }) {
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";
  const isUpcoming = match.status === "upcoming";

  return (
    <article
      className={`rounded-lg border border-[var(--border)] bg-white p-3 shadow-sm transition hover:shadow-md sm:p-4 ${
        isLive ? "bg-red-50/30 border-red-200" : ""
      }`}
      dir="rtl"
    >
      {/* Main Content - Centered Layout */}
      <div className="flex flex-col items-center gap-3">
        {/* Top Row: Time, Venue, Status */}
        <div className="flex w-full items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 sm:text-sm">
            <span className="font-medium text-slate-700">{match.time}</span>
            <span className="h-1 w-1 rounded-full bg-slate-400" aria-hidden="true" />
            <span className="truncate">{match.venue}</span>
          </div>
          <span className="h-1 w-1 rounded-full bg-slate-400" aria-hidden="true" />
          {/* Status Badge */}
          {isLive ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
              زنده
            </span>
          ) : isFinished ? (
            <span className="inline-flex items-center rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
              تمام‌شده
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
              در انتظار
            </span>
          )}
        </div>

        {/* Teams and Score - Centered */}
        <div className="flex w-full items-center justify-center gap-4">
          {/* Home Team */}
          <div className="flex flex-1 items-center justify-end gap-2">
            {match.homeTeam.logo ? (
              <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden sm:h-10 sm:w-10">
                <Image
                  src={match.homeTeam.logo}
                  alt={match.homeTeam.name}
                  fill
                  className="object-contain"
                  sizes="40px"
                  style={{ borderRadius: 0 }}
                />
              </div>
            ) : (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-white text-[10px] font-bold text-slate-700 shadow-sm sm:h-10 sm:w-10 sm:text-xs">
                {match.homeTeam.name.slice(0, 2)}
              </div>
            )}
            <span className="truncate text-center text-sm font-semibold text-slate-900 sm:text-base" style={{ color: '#0f172a' }}>{match.homeTeam.name}</span>
          </div>

          {/* Score - Center */}
          <div className="flex-shrink-0">
            {isFinished && match.score ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-900 sm:text-2xl">{match.score.home}</span>
                <span className="text-slate-400">-</span>
                <span className="text-xl font-bold text-slate-900 sm:text-2xl">{match.score.away}</span>
              </div>
            ) : isLive && match.score ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-red-600 sm:text-2xl">{match.score.home}</span>
                <span className="text-red-400">-</span>
                <span className="text-xl font-bold text-red-600 sm:text-2xl">{match.score.away}</span>
              </div>
            ) : (
              <span className="text-lg font-semibold text-slate-400 sm:text-xl">vs</span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-1 items-center justify-start gap-2">
            <span className="truncate text-center text-sm font-semibold text-slate-900 sm:text-base" style={{ color: '#0f172a' }}>{match.awayTeam.name}</span>
            {match.awayTeam.logo ? (
              <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden sm:h-10 sm:w-10">
                <Image
                  src={match.awayTeam.logo}
                  alt={match.awayTeam.name}
                  fill
                  className="object-contain"
                  sizes="40px"
                  style={{ borderRadius: 0 }}
                />
              </div>
            ) : (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-white text-[10px] font-bold text-slate-700 shadow-sm sm:h-10 sm:w-10 sm:text-xs">
                {match.awayTeam.name.slice(0, 2)}
              </div>
            )}
          </div>
        </div>

        {/* Competition - Centered */}
        <div className="text-center text-xs text-slate-600 sm:text-sm">{match.competition}</div>
      </div>
    </article>
  );
}

function groupMatchesByDate(matches: MatchItem[]): Record<string, MatchItem[]> {
  const grouped: Record<string, MatchItem[]> = {};
  
  matches.forEach((match) => {
    const dateKey = match.datePersian;
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(match);
  });
  
  return grouped;
}

function resolveFilters(searchParams?: MatchesPageProps["searchParams"]): Filters {
  const league = leagueOptions.some((option) => option.id === searchParams?.league)
    ? (searchParams?.league as LeagueKey)
    : leagueOptions[0].id;
  const season = matchSeasons.some((season) => season.id === searchParams?.season)
    ? (searchParams?.season as string)
    : matchSeasons[0]?.id ?? "1403";
  const week = searchParams?.week && searchParams.week !== "all"
    ? searchParams.week
    : matchWeeks[0]?.id ?? "all";

  const statusValue = searchParams?.status;
  let status: MatchStatusFilter = "all";
  if (statusValue === "all" || statusValue === "live" || statusValue === "finished" || statusValue === "upcoming") {
    status = statusValue;
  } else if (statusOptions.some((s) => s.id === statusValue)) {
    status = statusValue as "live" | "finished" | "upcoming";
  }

  const timeRange = timeRangeOptions.some((tr) => tr.id === searchParams?.timeRange)
    ? (searchParams?.timeRange as TimeRange)
    : "all";

  const competitionType: CompetitionType | undefined =
    searchParams?.competitionType &&
    ["all", "league", "womens-league", "cup", "world-cup", "friendly"].includes(searchParams.competitionType)
      ? (searchParams.competitionType as CompetitionType)
      : undefined;

  return { league, season, week, status, timeRange, competitionType };
}
