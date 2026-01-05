"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { LeagueKey } from "@/lib/data";
import { leagueOptions } from "@/lib/data";
import { CompetitionTypeFilter, type CompetitionType } from "@/components/filters/CompetitionTypeFilter";
import { getPlayersWithStats } from "@/lib/data/players";
import { filterPlayers, type PlayerFilters } from "@/lib/players/filtering";
import { cn } from "@/lib/cn";

type TopScorersPreviewProps = {
  container?: boolean;
  className?: string;
};

export function TopScorersPreview({ container = true, className }: TopScorersPreviewProps) {
  const [active, setActive] = useState<LeagueKey>("futsal");
  const [selectedCompetitionType, setSelectedCompetitionType] = useState<CompetitionType>("all");

  const allPlayers = useMemo(() => getPlayersWithStats(), []);

  const filters: PlayerFilters = useMemo(
    () => ({
      sport: active,
      competitionType: selectedCompetitionType === "all" ? undefined : selectedCompetitionType,
      position: "player",
    }),
    [active, selectedCompetitionType]
  );

  const filteredPlayers = useMemo(() => filterPlayers(allPlayers, filters), [allPlayers, filters]);

  const top5 = filteredPlayers.slice(0, 5);

  return (
    <section className={cn(container && "container", "space-y-6 lg:space-y-4", className)} dir="rtl">
      <div className="card p-3 sm:p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="!text-slate-900 text-lg font-bold text-slate-900 lg:text-base">بازیکنان برتر</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-900 sm:text-sm">
            <span>رشته:</span>
            <select
              value={active}
              onChange={(e) => setActive(e.target.value as LeagueKey)}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-brand focus:outline-none sm:px-3 sm:py-2 sm:text-sm"
            >
              {leagueOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <CompetitionTypeFilter
            value={selectedCompetitionType}
            onChange={setSelectedCompetitionType}
            size="sm"
          />
        </div>

        {top5.length > 0 ? (
          <div className="space-y-3">
            {top5.map((player, index) => (
              <Link
                key={player.id}
                href={`/players?sport=${active}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-brand hover:shadow-sm transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-brand/20 to-brand/10 flex items-center justify-center text-lg font-bold text-brand">
                  {index + 1}
                </div>
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={player.photoUrl}
                    alt={player.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-900 truncate" style={{ color: '#0f172a' }}>
                    {player.name}
                  </div>
                  <div className="text-xs text-slate-600 truncate mt-0.5">{player.team.name}</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-bold text-brand">{player.stats.goals}</div>
                  <div className="text-xs text-slate-500">گل</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-4 text-center text-sm text-slate-900">
            اطلاعاتی یافت نشد
          </div>
        )}

        <div className="flex justify-end">
          <Link
            href={`/players?sport=${active}&competitionType=${selectedCompetitionType}`}
            className="inline-flex text-sm font-semibold text-brand hover:text-brand lg:text-xs"
          >
            مشاهده برترین‌ها
          </Link>
        </div>
      </div>
    </section>
  );
}
