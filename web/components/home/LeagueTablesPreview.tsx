"use client";

import { useState } from "react";
import Link from "next/link";
import { StandingsTable } from "@/components/standings/StandingsTable";
import type { StandingsRow } from "@/lib/acs/types";
import { leagueOptions, type LeagueKey, type LeagueRow } from "@/lib/data";
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

type LeagueTablesPreviewProps = {
  standings: Record<LeagueKey, StandingsRow[]>;
  container?: boolean;
  className?: string;
};

export function LeagueTablesPreview({ standings, container = true, className }: LeagueTablesPreviewProps) {
  const [activeLeague, setActiveLeague] = useState<LeagueKey>("futsal");
  const rows = standings[activeLeague] ?? [];
  const heading = leagueHeadings[activeLeague];
  const orderedLeagues = leagueTabOrder
    .map((key) => leagueOptions.find((option) => option.id === key))
    .filter((option): option is (typeof leagueOptions)[number] => Boolean(option));

  return (
    <section className={cn(container && "container", "space-y-6 lg:space-y-4", className)} id="tables-preview">
      <div className="card p-3 sm:p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="!text-slate-900 text-lg font-bold text-slate-900 lg:text-base">جدول لیگ</h2>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-slate-900 lg:text-xs">
            رشته:
            <select
              value={activeLeague}
              onChange={(e) => setActiveLeague(e.target.value as LeagueKey)}
              className="mr-2 mt-1 rounded-xl border border-[var(--border)] bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-brand focus:outline-none lg:px-2 lg:py-1 lg:text-xs"
            >
              {orderedLeagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          {rows.length ? (
            <StandingsTable rows={rows.slice(0, 6).map(toLeagueRow)} compact />
          ) : (
            <p className="rounded-xl border border-dashed border-[var(--border)] bg-white p-4 text-center text-sm text-slate-900">
              جدول این لیگ در دسترس نیست.
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Link href={standingsCta[activeLeague]} className="inline-flex text-sm font-semibold text-brand hover:text-brand lg:text-xs">
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
