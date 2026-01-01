"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { StandingsTable } from "@/components/standings/StandingsTable";
import type { StandingsRow } from "@/lib/acs/types";
import { leagueOptions, standingsSeasons, standingsWeeks, type LeagueKey, type LeagueRow } from "@/lib/data";
import { sortOptions, type SortField } from "@/components/standings/StandingsTableWithSort";
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
  const [sortBy, setSortBy] = useState<SortField>("points");

  const orderedLeagues = leagueTabOrder
    .map((key) => leagueOptions.find((option) => option.id === key))
    .filter((option): option is (typeof leagueOptions)[number] => Boolean(option));

  // Convert StandingsRow to LeagueRow and apply sorting
  const sortedRows = useMemo(() => {
    const rawRows = standings[activeLeague] ?? [];
    const leagueRows = rawRows.map(toLeagueRow);
    
    // Apply sorting
    const rowsCopy = [...leagueRows];
    return rowsCopy.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortBy) {
        case "points":
          aValue = a.points;
          bValue = b.points;
          break;
        case "wins":
          aValue = a.wins;
          bValue = b.wins;
          break;
        case "draws":
          aValue = a.draws;
          bValue = b.draws;
          break;
        case "losses":
          aValue = a.losses;
          bValue = b.losses;
          break;
        case "goalsFor":
          aValue = 0;
          bValue = 0;
          break;
        case "goalsAgainst":
          aValue = 0;
          bValue = 0;
          break;
        case "goalDifference":
          aValue = a.goalDifference ?? 0;
          bValue = b.goalDifference ?? 0;
          break;
        default:
          aValue = a.points;
          bValue = b.points;
      }

      // Descending sort
      return bValue - aValue;
    });
  }, [standings, activeLeague, sortBy]);

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

        {/* Filters - Horizontal on desktop, max 2 rows on mobile */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:flex-wrap lg:items-center lg:gap-3">
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-900 sm:text-sm">
            <span>رشته:</span>
            <select
              value={activeLeague}
              onChange={(e) => setActiveLeague(e.target.value as LeagueKey)}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-brand focus:outline-none sm:px-3 sm:py-2 sm:text-sm"
            >
              {orderedLeagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-900 sm:text-sm">
            <span>فصل:</span>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-brand focus:outline-none sm:px-3 sm:py-2 sm:text-sm"
            >
              {standingsSeasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-900 sm:text-sm">
            <span>هفته:</span>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-brand focus:outline-none sm:px-3 sm:py-2 sm:text-sm"
            >
              {standingsWeeks.map((week) => (
                <option key={week.id} value={week.id}>
                  {week.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-900 sm:text-sm">
            <span>مرتب‌سازی:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortField)}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-brand focus:outline-none sm:px-3 sm:py-2 sm:text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
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
