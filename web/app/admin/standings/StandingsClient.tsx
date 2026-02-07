"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { LeagueContextSelector } from "@/components/admin/LeagueContextSelector";
import { useLeagueContext } from "@/contexts/LeagueContext";
import { mockLeagues } from "@/lib/admin/leaguesData";
import { mockMatches } from "@/lib/admin/matchesData";
import type { League } from "@/types/leagues";
import type { Match, MatchStatus } from "@/types/matches";

// Standings row interface
interface StandingRow {
  rank: number;
  team: string;
  teamId?: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

// Calculate standings from finished matches
function calculateStandings(
  matches: Match[],
  pointsConfig: { win: number; draw: number; loss: number }
): StandingRow[] {
  const standingsMap = new Map<string, StandingRow>();

  // Process only finished matches
  const finishedMatches = matches.filter(
    (m) => m.status === "finished" && m.homeScore !== null && m.awayScore !== null
  );

  finishedMatches.forEach((match) => {
    const homeScore = match.homeScore!;
    const awayScore = match.awayScore!;

    // Home team
    const homeKey = match.homeTeamId || match.homeTeam;
    if (!standingsMap.has(homeKey)) {
      standingsMap.set(homeKey, {
        rank: 0,
        team: match.homeTeam,
        teamId: match.homeTeamId,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      });
    }

    // Away team
    const awayKey = match.awayTeamId || match.awayTeam;
    if (!standingsMap.has(awayKey)) {
      standingsMap.set(awayKey, {
        rank: 0,
        team: match.awayTeam,
        teamId: match.awayTeamId,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      });
    }

    const homeStanding = standingsMap.get(homeKey)!;
    const awayStanding = standingsMap.get(awayKey)!;

    // Update stats
    homeStanding.played++;
    homeStanding.goalsFor += homeScore;
    homeStanding.goalsAgainst += awayScore;

    awayStanding.played++;
    awayStanding.goalsFor += awayScore;
    awayStanding.goalsAgainst += homeScore;

    // Determine result
    if (homeScore > awayScore) {
      homeStanding.wins++;
      homeStanding.points += pointsConfig.win;
      awayStanding.losses++;
    } else if (awayScore > homeScore) {
      awayStanding.wins++;
      awayStanding.points += pointsConfig.win;
      homeStanding.losses++;
    } else {
      homeStanding.draws++;
      homeStanding.points += pointsConfig.draw;
      awayStanding.draws++;
      awayStanding.points += pointsConfig.draw;
    }
  });

  // Calculate goal difference and sort
  const standings = Array.from(standingsMap.values()).map((s) => ({
    ...s,
    goalDifference: s.goalsFor - s.goalsAgainst,
  }));

  // Sort by: Points (desc), Goal Difference (desc), Goals For (desc), Team name (asc)
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.localeCompare(b.team);
  });

  // Assign ranks
  standings.forEach((s, index) => {
    s.rank = index + 1;
  });

  return standings;
}

export default function StandingsClient() {
  const router = useRouter();
  const { selectedLeague: contextLeague } = useLeagueContext();
  const [selectedSeason, setSelectedSeason] = useState<string>("");

  // Get available leagues (only active leagues with standings table)
  const availableLeagues = useMemo(() => {
    return mockLeagues.filter(
      (l) => l.status === "active" && l.hasStandingsTable && l.competitionType === "league"
    );
  }, []);

  // Use league from context, fallback to first available
  const selectedLeague = useMemo(() => {
    if (contextLeague && contextLeague.hasStandingsTable && contextLeague.competitionType === "league") {
      return contextLeague;
    }
    return availableLeagues.length > 0 ? availableLeagues[0] : null;
  }, [contextLeague, availableLeagues]);

  const selectedLeagueId = selectedLeague?.id || "";

  // Get unique seasons from available leagues
  const availableSeasons = useMemo(() => {
    const seasons = new Set<string>();
    availableLeagues.forEach((l) => seasons.add(l.season));
    return Array.from(seasons).sort().reverse();
  }, [availableLeagues]);

  // Filter matches by selected league and season
  const relevantMatches = useMemo(() => {
    if (!selectedLeague) return [];
    return mockMatches.filter(
      (m) =>
        m.leagueId === selectedLeague.id &&
        m.status === "finished" &&
        (selectedSeason === "" || selectedLeague.season === selectedSeason)
    );
  }, [selectedLeague, selectedSeason]);

  // Calculate standings
  const standings = useMemo(() => {
    if (!selectedLeague || relevantMatches.length === 0) return [];

    const pointsConfig = {
      win: selectedLeague.pointsSystem?.winPoints ?? 3,
      draw: selectedLeague.pointsSystem?.drawPoints ?? 1,
      loss: selectedLeague.pointsSystem?.lossPoints ?? 0,
    };

    return calculateStandings(relevantMatches, pointsConfig);
  }, [selectedLeague, relevantMatches]);

  // Auto-select season when league changes
  useEffect(() => {
    if (selectedLeague) {
      setSelectedSeason(selectedLeague.season);
    }
  }, [selectedLeague]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-white font-bold text-sm shadow-md">
          {rank}
        </span>
      );
    }
    if (rank <= 3) {
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-white font-bold text-sm">
          {rank}
        </span>
      );
    }
    return <span className="text-sm font-medium text-slate-700">{rank}</span>;
  };

  const getRowClassName = (rank: number, totalTeams: number) => {
    if (rank === 1) return "bg-yellow-50 border-yellow-200";
    if (selectedLeague?.promotionSpots && rank <= selectedLeague.promotionSpots && rank > 1) {
      return "bg-green-50 border-green-200";
    }
    if (
      selectedLeague?.relegationSpots &&
      rank > totalTeams - selectedLeague.relegationSpots
    ) {
      return "bg-red-50 border-red-200";
    }
    return "";
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="موتور محاسبه جدول رده‌بندی"
        subtitle="محاسبه خودکار جدول از نتایج مسابقات پایان یافته"
        action={
          <button
            onClick={() => router.push("/admin/matches")}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
          >
            مشاهده مسابقات
          </button>
        }
      />

      {/* League Context Selector */}
      <LeagueContextSelector />

      {/* Filters */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* League Info (read-only, selected from context) */}
          {selectedLeague && (
          <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">لیگ فعال</label>
              <div className="rounded-lg border border-[var(--border)] bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900">
                {selectedLeague.title} ({selectedLeague.season})
          </div>
          </div>
          )}

          {/* Season Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">فصل</label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              disabled={!selectedLeagueId}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">همه فصل‌ها</option>
              {availableSeasons.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Standings Table */}
      {selectedLeague && selectedLeague.hasStandingsTable && standings.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-white overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-slate-50 px-4 sm:px-6 py-4 border-b border-[var(--border)]">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedLeague.title}</h3>
                <p className="text-sm text-slate-600">{selectedLeague.season}</p>
                    </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>تعداد مسابقات: {relevantMatches.length}</span>
                  </div>
                </div>

                {/* Zone Legend */}
            {(selectedLeague.promotionSpots || selectedLeague.relegationSpots) && (
                <div className="mt-4 flex flex-wrap gap-4 text-xs">
                {selectedLeague.promotionSpots && selectedLeague.promotionSpots > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-500"></div>
                      <span className="text-slate-600">
                      {selectedLeague.promotionSpots} تیم اول (صعود)
                      </span>
                    </div>
                  )}
                {selectedLeague.relegationSpots && selectedLeague.relegationSpots > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-red-500"></div>
                      <span className="text-slate-600">
                      {selectedLeague.relegationSpots} تیم آخر (سقوط)
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-500"></div>
                    <span className="text-slate-600">قهرمان</span>
                  </div>
                </div>
            )}
              </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">رتبه</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">تیم</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">بازی</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">برد</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">مساوی</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">باخت</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">گل زده</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">گل خورده</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">تفاضل</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">امتیاز</th>
                    </tr>
                  </thead>
                  <tbody>
                {standings.map((row) => (
                      <tr
                    key={row.teamId || row.team}
                    className={`border-t hover:bg-slate-50 transition-colors ${getRowClassName(
                      row.rank,
                      standings.length
                    )}`}
                      >
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        {getRankBadge(row.rank)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 min-w-[150px]">
                        {row.rank === 1 && (
                          <span className="ml-2 text-yellow-600" title="قهرمان">
                            👑
                          </span>
                        )}
                        {row.team}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-700">{row.played}</td>
                    <td className="px-4 py-3 text-center font-medium text-green-600">
                      {row.wins}
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-yellow-600">
                      {row.draws}
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-red-600">
                      {row.losses}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-700">{row.goalsFor}</td>
                    <td className="px-4 py-3 text-center text-slate-700">{row.goalsAgainst}</td>
                    <td
                      className={`px-4 py-3 text-center font-medium ${
                        row.goalDifference >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {row.goalDifference > 0 ? "+" : ""}
                      {row.goalDifference}
                    </td>
                    <td className="px-4 py-3 text-center text-base font-bold text-slate-900">
                      {row.points}
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-[var(--border)]">
            {standings.map((row) => (
              <div
                key={row.teamId || row.team}
                className={`p-4 ${getRowClassName(row.rank, standings.length)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getRankBadge(row.rank)}
                    <div className="font-medium text-slate-900">
                      {row.rank === 1 && (
                        <span className="ml-2 text-yellow-600" title="قهرمان">
                          👑
                        </span>
                      )}
                      {row.team}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-base font-bold text-slate-900">{row.points}</div>
                    <div className="text-xs text-slate-500">امتیاز</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-slate-700">{row.played}</div>
                    <div className="text-slate-500">بازی</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-600">{row.wins}</div>
                    <div className="text-slate-500">برد</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-yellow-600">{row.draws}</div>
                    <div className="text-slate-500">مساوی</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`font-medium ${
                        row.goalDifference >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {row.goalDifference > 0 ? "+" : ""}
                      {row.goalDifference}
                    </div>
                    <div className="text-slate-500">تفاضل</div>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">گل زده: </span>
                    <span className="font-medium text-slate-700">{row.goalsFor}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">گل خورده: </span>
                    <span className="font-medium text-slate-700">{row.goalsAgainst}</span>
                  </div>
              </div>
            </div>
            ))}
          </div>
          </div>
        )}

      {/* Empty State */}
      {selectedLeague && standings.length === 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-white p-12 text-center">
          <p className="text-slate-500 text-sm mb-2">
            هیچ مسابقه پایان یافته‌ای برای این لیگ یافت نشد
          </p>
          <p className="text-xs text-slate-400">
            جدول رده‌بندی فقط از مسابقات با وضعیت "پایان یافته" محاسبه می‌شود
          </p>
      </div>
      )}

      {!selectedLeague && (
        <div className="rounded-xl border border-[var(--border)] bg-white p-12 text-center">
          <p className="text-slate-500 text-sm">لطفاً یک لیگ را انتخاب کنید</p>
        </div>
      )}
    </div>
  );
}
