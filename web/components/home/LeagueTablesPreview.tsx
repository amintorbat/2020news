"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { StandingsTable } from "@/components/standings/StandingsTable";
import type { StandingsRow } from "@/lib/acs/types";
import { leagueOptions, standingsSeasons, standingsWeeks, type LeagueKey, type LeagueRow } from "@/lib/data";
import { type CompetitionType } from "@/components/filters/CompetitionTypeFilter";
import { cn } from "@/lib/cn";

const leagueHeadings: Record<LeagueKey, string> = {
  futsal: "لیگ برتر فوتسال",
  beach: "لیگ فوتبال ساحلی",
};

const leagueTabOrder: LeagueKey[] = ["futsal", "beach"];
const standingsCta: Record<LeagueKey, string> = {
  futsal: "/standings?league=futsal",
  beach: "/standings?league=beach",
};

function buildStandingsUrl(league: LeagueKey, season: string, week: string): string {
  const params = new URLSearchParams({
    league,
    season,
    week,
  });
  return `/standings?${params.toString()}`;
}

type LeagueTablesPreviewProps = {
  standings: Record<LeagueKey, StandingsRow[]>;
  container?: boolean;
  className?: string;
};

export function LeagueTablesPreview({ standings, container = true, className }: LeagueTablesPreviewProps) {
  const [activeLeague, setActiveLeague] = useState<LeagueKey>("futsal");
  const [selectedSeason, setSelectedSeason] = useState<string>(standingsSeasons[0]?.id ?? "1403");
  const [selectedWeek, setSelectedWeek] = useState<string>(standingsWeeks[0]?.id ?? "1");
  const [selectedCompetitionType, setSelectedCompetitionType] = useState<CompetitionType>("all");

  const orderedLeagues = leagueTabOrder
    .map((key) => leagueOptions.find((option) => option.id === key))
    .filter((option): option is (typeof leagueOptions)[number] => Boolean(option));

  // Convert StandingsRow to LeagueRow (sorted by points by default)
  const sortedRows = useMemo(() => {
    const rawRows = standings[activeLeague] ?? [];
    const leagueRows = rawRows.map(toLeagueRow);
    
    // Sort by points (descending) as default
    const rowsCopy = [...leagueRows];
    return rowsCopy.sort((a, b) => b.points - a.points);
  }, [standings, activeLeague]);

  // Update ranks after sorting
  const rankedRows = useMemo(() => {
    return sortedRows.map((row, index) => ({
      ...row,
      rank: index + 1,
    }));
  }, [sortedRows]);

  return (
    <section className={cn(container && "container", "space-y-6 lg:space-y-4", className)} id="tables-preview">
      <div className="card p-3 sm:p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="!text-slate-900 text-lg font-bold text-slate-900 lg:text-base">جدول لیگ</h2>
        </div>

        {/* Filters - 2 rows layout, organized and symmetric */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 w-full items-end min-w-0">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-900 sm:text-sm min-w-0">
            <span className="h-5 flex items-center whitespace-nowrap text-slate-800 font-semibold">رشته:</span>
            <select
              value={activeLeague}
              onChange={(e) => setActiveLeague(e.target.value as LeagueKey)}
              className="w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 h-[42px] min-w-0"
              style={{ color: "#0f172a !important", WebkitTextFillColor: "#0f172a !important" }}
            >
              {orderedLeagues.map((league) => (
                <option key={league.id} value={league.id} style={{ color: "#0f172a", fontWeight: "600" }}>
                  {league.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-900 sm:text-sm min-w-0">
            <span className="h-5 flex items-center whitespace-nowrap text-slate-800 font-semibold">فصل:</span>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 h-[42px] min-w-0"
              style={{ color: "#0f172a !important", WebkitTextFillColor: "#0f172a !important" }}
            >
              {standingsSeasons.map((season) => (
                <option key={season.id} value={season.id} style={{ color: "#0f172a", fontWeight: "600" }}>
                  {season.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-900 sm:text-sm min-w-0">
            <span className="h-5 flex items-center whitespace-nowrap text-slate-800 font-semibold">هفته:</span>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 h-[42px] min-w-0"
              style={{ color: "#0f172a !important", WebkitTextFillColor: "#0f172a !important" }}
            >
              {standingsWeeks.map((week) => (
                <option key={week.id} value={week.id} style={{ color: "#0f172a", fontWeight: "600" }}>
                  {week.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-900 sm:text-sm min-w-0">
            <span className="h-5 flex items-center whitespace-nowrap text-slate-800 font-semibold">نوع مسابقه:</span>
            <select
              value={selectedCompetitionType}
              onChange={(e) => setSelectedCompetitionType(e.target.value as CompetitionType)}
              className="w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 h-[42px] min-w-0"
              style={{ color: "#0f172a !important", WebkitTextFillColor: "#0f172a !important" }}
            >
              <option value="all" style={{ color: "#0f172a", fontWeight: "600" }}>همه</option>
              <option value="league" style={{ color: "#0f172a", fontWeight: "600" }}>لیگ</option>
              <option value="womens-league" style={{ color: "#0f172a", fontWeight: "600" }}>لیگ بانوان</option>
              <option value="cup" style={{ color: "#0f172a", fontWeight: "600" }}>جام</option>
              <option value="world-cup" style={{ color: "#0f172a", fontWeight: "600" }}>جام جهانی</option>
              <option value="friendly" style={{ color: "#0f172a", fontWeight: "600" }}>دوستانه</option>
            </select>
          </label>
        </div>

        <div>
          {rankedRows.length ? (
            <StandingsTable rows={rankedRows.slice(0, 6)} compact />
          ) : (
            <p className="rounded-xl border border-dashed border-[var(--border)] bg-white p-4 text-center text-sm text-slate-900">
              جدول این لیگ در دسترس نیست.
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Link 
            href={buildStandingsUrl(activeLeague, selectedSeason, selectedWeek)}
            className="inline-flex text-sm font-semibold text-brand hover:text-brand lg:text-xs"
          >
            مشاهده جدول کامل
          </Link>
        </div>
      </div>
    </section>
  );
}

function toLeagueRow(row: StandingsRow, index: number): LeagueRow {
  return {
    rank: row.position || index + 1,
    team: row.teamName,
    played: row.played,
    wins: row.wins,
    draws: row.draws,
    losses: row.losses,
    goalDifference: row.goalDiff,
    points: row.points,
  };
}
