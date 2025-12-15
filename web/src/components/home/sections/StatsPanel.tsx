"use client";

import { useState } from "react";
import type { LeagueTableRow, TopScorerRow } from "../data/home-data";

type StatsPanelProps = {
  futsalTable: LeagueTableRow[];
  beachTable: LeagueTableRow[];
  futsalScorers: TopScorerRow[];
  beachScorers: TopScorerRow[];
};

type TabKey = "futsal" | "beach";

export function StatsPanel({
  futsalTable,
  beachTable,
  futsalScorers,
  beachScorers,
}: StatsPanelProps) {
  const [tab, setTab] = useState<TabKey>("futsal");
  const table = tab === "futsal" ? futsalTable : beachTable;
  const scorers = tab === "futsal" ? futsalScorers : beachScorers;

  return (
    <section className="rounded-3xl border border-default/70 bg-background/70 p-6">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] tracking-[0.4em] text-muted">STAT BOX</p>
          <h3 className="text-xl font-bold">وضعیت لیگ و آقای گل</h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          {(["futsal", "beach"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-full border px-4 py-1 transition ${
                tab === key
                  ? "border-primary text-primary"
                  : "border-default/40 text-muted hover:text-foreground"
              }`}
            >
              {key === "futsal" ? "فوتسال" : "فوتبال ساحلی"}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-default/50 bg-surface/30 p-4">
          <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
            جدول
          </div>
          <ul className="space-y-3 text-sm">
            {table.slice(0, 5).map((team) => (
              <li
                key={team.team}
                className="flex items-center justify-between rounded-xl border border-default/30 bg-background/60 px-3 py-2"
              >
                <div className="flex items-center gap-3 text-right">
                  <span className="text-xs font-bold text-muted">
                    {team.position}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{team.team}</p>
                    <p className="text-[11px] text-muted">
                      {team.played} بازی • {team.wins} برد
                    </p>
                  </div>
                </div>
                <span className="text-base font-black text-primary tabular-nums">
                  {team.points}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-default/50 bg-surface/30 p-4">
          <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
            بهترین گلزنان
          </div>
          <ul className="space-y-3 text-sm">
            {scorers.slice(0, 5).map((player) => (
              <li
                key={player.rank + player.name}
                className="flex items-center justify-between rounded-xl border border-default/30 bg-background/60 px-3 py-2"
              >
                <div className="flex items-center gap-3 text-right">
                  <span className="text-xs font-bold text-muted">
                    {player.rank}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">
                      {player.name}
                    </p>
                    <p className="text-[11px] text-muted">{player.team}</p>
                  </div>
                </div>
                <span className="text-base font-black text-primary tabular-nums">
                  {player.goals}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
