"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/common/SectionHeader";
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
  futsal: "/tables/futsal",
  beach: "/tables/beach-soccer",
};

export function LeagueTablesPreview({ standings }: { standings: Record<LeagueKey, StandingsRow[]> }) {
  const [activeLeague, setActiveLeague] = useState<LeagueKey>("futsal");
  const rows = standings[activeLeague] ?? [];
  const heading = leagueHeadings[activeLeague];
  const orderedLeagues = leagueTabOrder
    .map((key) => leagueOptions.find((option) => option.id === key))
    .filter((option): option is (typeof leagueOptions)[number] => Boolean(option));

  return (
    <section className="container space-y-6" id="tables-preview">
      <SectionHeader title="جدول لیگ" subtitle="خلاصه امروز" />

      <div className="flex flex-wrap gap-3" role="tablist">
        {orderedLeagues.map((league) => (
          <button
            key={league.id}
            role="tab"
            aria-selected={activeLeague === league.id}
            onClick={() => setActiveLeague(league.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold",
              activeLeague === league.id ? "bg-brand text-white shadow-md" : "bg-slate-100 text-[var(--muted)]"
            )}
          >
            {league.label}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-card" dir="rtl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">{heading}</h3>
          <span className="text-xs text-[var(--muted)]">به‌روزرسانی امروز</span>
        </div>
        <div className="mt-4">
          {rows.length ? (
            <StandingsTable rows={rows.slice(0, 6).map(toLeagueRow)} compact />
          ) : (
            <p className="rounded-2xl border border-dashed border-[var(--border)] p-4 text-center text-sm text-[var(--muted)]">
              جدول این لیگ در دسترس نیست.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Link href={standingsCta[activeLeague]} className="inline-flex text-sm font-semibold text-brand">
          مشاهده جدول کامل
        </Link>
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
