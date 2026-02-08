import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { leagueOptions, matchSeasons, type LeagueKey } from "@/lib/data";
import { getBracketLeagueForSport } from "@/lib/data/knockoutBrackets";
import { mockMatches, type MatchItem, type MatchStatusFilter, type TimeRange, type CompetitionType } from "@/lib/data/matches";
import { filterAndSortMatches, type MatchFilters as FilterType } from "@/lib/matches/filtering";
import { MatchFilters } from "@/components/matches/MatchFilters";
import { MatchCard } from "@/components/matches/MatchCard";
import { BracketCTA } from "@/components/bracket/BracketCTA";

type MatchesPageProps = {
  searchParams?: { 
    league?: string; 
    season?: string; 
    week?: string; 
    status?: string; 
    timeRange?: string; 
    competitionType?: string;
    competitionId?: string;
    q?: string;
  };
};

export default function MatchesPage({ searchParams }: MatchesPageProps) {
  const filters = resolveFilters(searchParams);

  // Use shared filtering logic
  const filteredMatches = filterAndSortMatches(mockMatches, filters);

  // Group matches by date for better organization
  const groupedMatches = groupMatchesByDate(filteredMatches);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Page Header */}
        <section className="container pt-8 sm:pt-12 lg:pt-16" dir="rtl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl">برنامه مسابقات</h1>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                بازگشت به خانه
              </Link>
            </div>
            <p className="text-sm text-slate-600 sm:text-base">
              آرشیو کامل و بایگانی تمامی مسابقات لیگ‌های فوتسال و فوتبال ساحلی
            </p>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="container" dir="rtl">
          <MatchFilters
            currentLeague={filters.league}
            currentCompetitionType={filters.competitionType}
            currentTimeRange={filters.timeRange}
            currentStatus={filters.status}
            currentSeason={filters.season}
            currentWeek={filters.week}
            currentSearchQuery={filters.searchQuery}
            showSearch={true}
            showSeasonWeek={true}
          />
        </section>

        {/* Results Count */}
        {filteredMatches.length > 0 && (
          <section className="container" dir="rtl">
            <div className="rounded-lg bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">{filteredMatches.length}</span> مسابقه یافت شد
            </div>
          </section>
        )}

        {/* نمای چارت برای مسابقات حذفی — وقتی نوع مسابقه جام است یا «همه» و برای این رشته لیگ حذفی داریم */}
        {(filters.competitionType === "cup" || filters.competitionType === "all") &&
          getBracketLeagueForSport(filters.league) && (
            <section className="container" dir="rtl">
              <BracketCTA leagueKey={filters.league} variant="full" />
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
                <div key={dateKey} className="space-y-3">
                  {/* Date Header */}
                  <div className="pb-2 border-b border-slate-200">
                    <h2 className="text-sm font-bold text-slate-900 sm:text-base" style={{ color: '#0f172a' }}>{dateKey}</h2>
                  </div>
                  {/* Matches for this date */}
                  <div className="space-y-2">
                    {matches.map((match) => (
                      <MatchCard key={match.id} match={match} compact={false} />
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

function resolveFilters(searchParams?: MatchesPageProps["searchParams"]): FilterType {
  const league = leagueOptions.some((option) => option.id === searchParams?.league)
    ? (searchParams?.league as LeagueKey)
    : leagueOptions[0].id;
  const season = matchSeasons.some((season) => season.id === searchParams?.season)
    ? (searchParams?.season as string)
    : matchSeasons[0]?.id ?? "1403";
  const week = searchParams?.week && searchParams.week !== "all"
    ? searchParams.week
    : "all";

  const statusValue = searchParams?.status;
  let status: MatchStatusFilter = "all";
  if (statusValue === "all" || statusValue === "live" || statusValue === "finished" || statusValue === "upcoming") {
    status = statusValue;
  }

  const timeRange: TimeRange = (searchParams?.timeRange as TimeRange) || "all";

  const competitionType: CompetitionType | "all" | undefined =
    searchParams?.competitionType &&
    ["all", "league", "cup", "international", "friendly", "women", "youth", "other", "womens-league", "world-cup"].includes(searchParams.competitionType)
      ? (searchParams.competitionType as CompetitionType | "all")
      : "all";

  const competitionId = searchParams?.competitionId;
  const searchQuery = searchParams?.q;

  return { league, season, week, status, timeRange, competitionType, competitionId, searchQuery };
}
