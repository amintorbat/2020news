"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { LeagueContextSelector } from "@/components/admin/LeagueContextSelector";
import { useLeagueContext } from "@/contexts/LeagueContext";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/admin/Badge";
import { mockTeams } from "@/lib/admin/teamsData";
import { mockMatches } from "@/lib/admin/matchesData";
import { mockLeagues } from "@/lib/admin/leaguesData";
import { mockPlayers } from "@/lib/admin/playersData";
import { calculatePlayerStatistics, type PlayerStatistics } from "@/lib/admin/playerStatsCalculation";
import type { SportType } from "@/types/matches";
import type { PlayerPosition } from "@/lib/admin/playersData";

const positionLabel: Record<PlayerPosition, string> = {
  GK: "دروازه‌بان",
  FIXO: "فیکسو",
  ALA: "آلا",
  PIVO: "پیوت",
};

type PlayerRow = PlayerStatistics & {
  position?: PlayerPosition;
  jerseyNumber?: number;
};

export default function PlayersClient() {
  const router = useRouter();
  const { selectedLeague } = useLeagueContext();

  // Filter states
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<SportType | "">("");
  const [leagueFilter, setLeagueFilter] = useState<string>("");
  const [teamFilter, setTeamFilter] = useState<string>("");

  // Calculate player statistics from match events
  const allPlayerStats = useMemo(() => {
    const statsMap = calculatePlayerStatistics(mockMatches, mockPlayers);
    return Array.from(statsMap.values());
  }, []);

  // Enrich stats with player info (position, jersey number)
  const enrichedStats = useMemo(() => {
    return allPlayerStats.map((stat) => {
      const player = mockPlayers.find((p) => p.id === stat.playerId);
      return {
        ...stat,
        position: player?.position,
        jerseyNumber: player?.jerseyNumber,
      };
    });
  }, [allPlayerStats]);

  // Filter teams by sport
  const availableTeams = useMemo(() => {
    let teams = mockTeams.filter((t) => t.status === "active");
    if (sportFilter) {
      teams = teams.filter((t) => t.sport === sportFilter);
    }
    return teams;
  }, [sportFilter]);

  // Filter leagues by sport
  const availableLeagues = useMemo(() => {
    let leagues = mockLeagues.filter((l) => l.status === "active");
    if (sportFilter) {
      const sportType = sportFilter === "futsal" ? "futsal" : "beach_soccer";
      leagues = leagues.filter((l) => l.sportType === sportType);
    }
    return leagues;
  }, [sportFilter]);

  // Filter player statistics
  const filteredStats = useMemo(() => {
    let result = enrichedStats;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (stat) =>
          stat.playerName.toLowerCase().includes(searchLower) ||
          stat.teamName.toLowerCase().includes(searchLower)
      );
    }

    // Sport filter
    if (sportFilter) {
      result = result.filter((stat) => stat.sport === sportFilter);
    }

    // Team filter
    if (teamFilter) {
      result = result.filter((stat) => stat.teamId === teamFilter);
    }

    // Filter by selected league from context
    if (selectedLeague) {
      const leagueMatches = mockMatches.filter(
        (m) => m.leagueId === selectedLeague.id && m.status === "finished"
      );
      const leagueStats = calculatePlayerStatistics(leagueMatches, mockPlayers);
      const leagueStatsArray = Array.from(leagueStats.values()).map((stat) => {
        const player = mockPlayers.find((p) => p.id === stat.playerId);
        return {
          ...stat,
          position: player?.position,
          jerseyNumber: player?.jerseyNumber,
        };
      });
      result = result.filter((stat) =>
        leagueStatsArray.some((ls) => ls.playerId === stat.playerId)
      );
    }

    // Additional league filter (if manually selected)
    if (leagueFilter && leagueFilter !== selectedLeague?.id) {
      const leagueMatches = mockMatches.filter(
        (m) => m.leagueId === leagueFilter && m.status === "finished"
      );
      const leagueStats = calculatePlayerStatistics(leagueMatches, mockPlayers);
      const leagueStatsArray = Array.from(leagueStats.values()).map((stat) => {
        const player = mockPlayers.find((p) => p.id === stat.playerId);
        return {
          ...stat,
          position: player?.position,
          jerseyNumber: player?.jerseyNumber,
        };
      });
      result = result.filter((stat) =>
        leagueStatsArray.some((ls) => ls.playerId === stat.playerId)
      );
    }

    // Sort by goals (descending) by default
    result = [...result].sort((a, b) => {
      if (b.goals !== a.goals) return b.goals - a.goals;
      if (b.assists !== a.assists) return b.assists - a.assists;
      return a.playerName.localeCompare(b.playerName);
    });

    return result;
  }, [enrichedStats, search, sportFilter, teamFilter, leagueFilter, selectedLeague]);

  const columns: readonly Column<PlayerRow>[] = [
    {
      key: "playerName",
      label: "بازیکن",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            <span className="text-slate-500 text-sm font-medium">
              {row.playerName.charAt(0)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-slate-900">{row.playerName}</span>
            {row.jerseyNumber && (
              <span className="text-[11px] text-slate-500">شماره {row.jerseyNumber}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "teamName",
      label: "تیم",
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium text-slate-900">{row.teamName}</span>
          <span className="text-slate-500">
            {row.sport === "futsal" ? "فوتسال" : "فوتبال ساحلی"}
          </span>
        </div>
      ),
    },
    {
      key: "position",
      label: "پست",
      render: (row) =>
        row.position ? (
          <Badge variant="info" className="text-[11px]">
            {positionLabel[row.position]}
          </Badge>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        ),
    },
    {
      key: "matchesPlayed",
      label: "بازی",
      render: (row) => (
        <span className="text-slate-700 font-medium">{row.matchesPlayed}</span>
      ),
    },
    {
      key: "goals",
      label: "گل",
      render: (row) => (
        <span className="font-semibold text-slate-900 text-base">{row.goals}</span>
      ),
    },
    {
      key: "assists",
      label: "پاس گل",
      render: (row) => (
        <span className="text-slate-700 font-medium">{row.assists}</span>
      ),
    },
    {
      key: "yellowCards",
      label: "کارت زرد",
      render: (row) => (
        <span className="text-yellow-600 font-medium">{row.yellowCards}</span>
      ),
    },
    {
      key: "redCards",
      label: "کارت قرمز",
      render: (row) => (
        <span className="text-red-600 font-medium">{row.redCards}</span>
      ),
    },
    {
      key: "goalsPerMatch",
      label: "میانگین گل",
      render: (row) => (
        <span className="text-slate-600 text-sm">{row.goalsPerMatch}</span>
      ),
    },
    {
      key: "assistsPerMatch",
      label: "میانگین پاس",
      render: (row) => (
        <span className="text-slate-600 text-sm">{row.assistsPerMatch}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="آمار بازیکنان"
        subtitle="محاسبه خودکار آمار از رویدادهای مسابقات"
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

      {/* Info Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>نکته:</strong> آمار بازیکنان به صورت خودکار از رویدادهای مسابقات پایان یافته محاسبه می‌شود.
          برای ویرایش آمار، لطفاً رویدادهای مسابقه را در صفحه ویرایش مسابقه تغییر دهید.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-2">جستجو</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="نام بازیکن یا تیم..."
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            />
          </div>

          {/* Sport Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">ورزش</label>
            <select
              value={sportFilter}
              onChange={(e) => {
                setSportFilter(e.target.value as SportType | "");
                setLeagueFilter("");
                setTeamFilter("");
              }}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            >
              <option value="">همه ورزش‌ها</option>
              <option value="futsal">فوتسال</option>
              <option value="beach-soccer">فوتبال ساحلی</option>
            </select>
          </div>

          {/* League Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">لیگ</label>
            <select
              value={leagueFilter}
              onChange={(e) => setLeagueFilter(e.target.value)}
              disabled={!sportFilter}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">همه لیگ‌ها</option>
              {availableLeagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.title}
                </option>
              ))}
            </select>
          </div>

          {/* Team Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">تیم</label>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            >
              <option value="">همه تیم‌ها</option>
              {availableTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border border-[var(--border)] bg-white overflow-hidden shadow-sm">
        {filteredStats.length > 0 ? (
          <DataTable<PlayerRow>
            columns={columns}
            data={filteredStats}
            keyExtractor={(row) => row.playerId}
          />
        ) : (
          <div className="p-12 text-center">
            <p className="text-slate-500 text-sm">هیچ آمار بازیکنی یافت نشد</p>
            <p className="text-xs text-slate-400 mt-1">
              آمار فقط از مسابقات پایان یافته با رویدادهای ثبت شده محاسبه می‌شود
            </p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredStats.length > 0 ? (
          filteredStats.map((stat) => (
            <div
              key={stat.playerId}
              className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <span className="text-slate-500 text-sm font-semibold">
                      {stat.playerName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">{stat.playerName}</span>
                    <span className="text-[11px] text-slate-500">{stat.teamName}</span>
                    {stat.position && (
                      <Badge variant="info" className="text-[10px] mt-1 w-fit">
                        {positionLabel[stat.position]}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-slate-900">{stat.goals}</div>
                  <div className="text-xs text-slate-500">گل</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">بازی: </span>
                  <span className="font-medium text-slate-700">{stat.matchesPlayed}</span>
                </div>
                <div>
                  <span className="text-slate-500">پاس گل: </span>
                  <span className="font-medium text-slate-700">{stat.assists}</span>
                </div>
                <div>
                  <span className="text-slate-500">میانگین گل: </span>
                  <span className="font-medium text-slate-700">{stat.goalsPerMatch}</span>
                </div>
                <div>
                  <span className="text-slate-500">میانگین پاس: </span>
                  <span className="font-medium text-slate-700">{stat.assistsPerMatch}</span>
                </div>
                <div>
                  <span className="text-slate-500">کارت زرد: </span>
                  <span className="font-medium text-yellow-600">{stat.yellowCards}</span>
                </div>
                <div>
                  <span className="text-slate-500">کارت قرمز: </span>
                  <span className="font-medium text-red-600">{stat.redCards}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-[var(--border)] bg-white p-12 text-center">
            <p className="text-slate-500 text-sm">هیچ آمار بازیکنی یافت نشد</p>
            <p className="text-xs text-slate-400 mt-1">
              آمار فقط از مسابقات پایان یافته با رویدادهای ثبت شده محاسبه می‌شود
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
