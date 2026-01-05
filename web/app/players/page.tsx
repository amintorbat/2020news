import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { leagueOptions, matchSeasons, type LeagueKey } from "@/lib/data";
import { getPlayersWithStats } from "@/lib/data/players";
import { filterPlayers, type PlayerFilters } from "@/lib/players/filtering";
import { PlayerStatsTable } from "@/components/players/PlayerStatsTable";
import type { CompetitionType } from "@/lib/data/matches";
import { PlayerFilters as PlayerFiltersComponent } from "@/components/players/PlayerFilters";

type PlayersPageProps = {
  searchParams?: {
    sport?: string;
    season?: string;
    competitionType?: string;
    teamId?: string;
    position?: string;
  };
};

export default function PlayersPage({ searchParams }: PlayersPageProps) {
  const filters = resolveFilters(searchParams);
  const allPlayers = getPlayersWithStats();
  const filteredPlayers = filterPlayers(allPlayers, filters);

  const fieldPlayers = filteredPlayers.filter((p) => p.position === "player");
  const goalkeepers = filteredPlayers.filter((p) => p.position === "goalkeeper");

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        <section className="container pt-8 sm:pt-12 lg:pt-16" dir="rtl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl">آمار بازیکنان</h1>
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
        </section>

        <section className="container" dir="rtl">
          <PlayerFiltersComponent
            currentSport={filters.sport}
            currentSeason={filters.season}
            currentCompetitionType={filters.competitionType}
            currentTeamId={filters.teamId}
            currentPosition={filters.position}
          />
        </section>

        <section className="container pb-8 sm:pb-12" dir="rtl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {fieldPlayers.length > 0 && (
              <>
                <div className="md:col-span-2 lg:col-span-3">
                  <PlayerStatsTable
                    title="گلزنان برتر"
                    statKey="goals"
                    players={fieldPlayers}
                  />
                </div>
                <PlayerStatsTable
                  title="بیشترین شوت"
                  statKey="shots"
                  players={fieldPlayers}
                />
                <PlayerStatsTable
                  title="بیشترین شوت در چارچوب"
                  statKey="shotsOnTarget"
                  players={fieldPlayers}
                />
                <PlayerStatsTable
                  title="بیشترین دقایق بازی"
                  statKey="minutesPlayed"
                  players={fieldPlayers}
                />
                <PlayerStatsTable
                  title="کارت زرد"
                  statKey="yellowCards"
                  players={fieldPlayers}
                />
                <PlayerStatsTable
                  title="کارت قرمز"
                  statKey="redCards"
                  players={fieldPlayers}
                />
              </>
            )}

            {goalkeepers.length > 0 && (
              <>
                <PlayerStatsTable
                  title="کلین‌شیت"
                  statKey="cleanSheets"
                  players={goalkeepers}
                />
                <PlayerStatsTable
                  title="کمترین گل خورده"
                  statKey="goalsConceded"
                  players={goalkeepers}
                />
              </>
            )}

            {filteredPlayers.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 rounded-xl border border-dashed border-[var(--border)] bg-white p-8 text-center">
                <p className="text-sm text-slate-600 sm:text-base">
                  بازیکنی برای این فیلتر یافت نشد.
                </p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

function resolveFilters(searchParams?: PlayersPageProps["searchParams"]): PlayerFilters {
  const sport = leagueOptions.some((option) => option.id === searchParams?.sport)
    ? (searchParams?.sport as LeagueKey)
    : undefined;

  const season = searchParams?.season || undefined;

  const competitionType: CompetitionType | "all" | undefined =
    searchParams?.competitionType &&
    ["all", "league", "cup", "international", "friendly", "women", "youth", "other", "womens-league", "world-cup"].includes(
      searchParams.competitionType
    )
      ? (searchParams.competitionType as CompetitionType | "all")
      : "all";

  const teamId = searchParams?.teamId || undefined;

  const position =
    searchParams?.position && ["goalkeeper", "player", "all"].includes(searchParams.position)
      ? (searchParams.position as "goalkeeper" | "player" | "all")
      : "all";

  return { sport, season, competitionType, teamId, position };
}

