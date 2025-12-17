"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { leagueOptions, type LeagueKey } from "@/lib/data";
import type { Match } from "@/lib/acs/types";
import { cn } from "@/lib/cn";

const matchesCtaMap: Record<LeagueKey, string> = {
  futsal: "/matches?league=futsal",
  beach: "/matches?league=beach",
};

export function MatchesTabs({ matches }: { matches: Record<LeagueKey, Match[]> }) {
  const [active, setActive] = useState<LeagueKey>("futsal");
  const grouped = useMemo(() => groupMatches(matches[active] ?? []), [active, matches]);

  return (
    <section className="container space-y-6" id="weekly">
      <SectionHeader title="بازی‌ها و نتایج" subtitle="تفکیک بازی‌های امروز و برنامه هفتگی" />

      <div className="flex flex-wrap gap-3" role="tablist">
        {leagueOptions.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold",
              active === tab.id ? "bg-brand text-white shadow-md" : "bg-slate-100 text-[var(--muted)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MatchesColumn title="بازی‌های امروز" matches={grouped.today} fallbackText="امروز بازی ثبت نشده است." />
        <MatchesColumn title="برنامه این هفته" matches={grouped.week} fallbackText="برنامه هفتگی به‌زودی اعلام می‌شود." />
      </div>

      <div className="flex justify-end">
        <Link href={matchesCtaMap[active]} className="inline-flex text-sm font-semibold text-brand">
          مشاهده بازی‌ها و نتایج
        </Link>
      </div>
    </section>
  );
}

function MatchesColumn({ title, matches, fallbackText }: { title: string; matches: Match[]; fallbackText: string }) {
  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
        <span className="text-xs text-[var(--muted)]">{matches.length ? `${matches.length} دیدار` : ""}</span>
      </div>
      {matches.length ? (
        <div className="space-y-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <p className="rounded-3xl border border-dashed border-[var(--border)] bg-white p-5 text-center text-xs text-[var(--muted)]">{fallbackText}</p>
      )}
    </div>
  );
}

function MatchCard({ match }: { match: Match }) {
  const status = resolveStatus(match.status);
  return (
    <article className="rounded-3xl border border-[var(--border)] bg-white p-4 shadow-card">
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>{match.dateTime || "به‌زودی"}</span>
        <span className={cn("rounded-full px-3 py-1 text-[10px] font-bold", status.className)}>
          {status.label}
          {status.pulse && <span className="ml-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current align-middle" />}
        </span>
      </div>
      <div className="mt-3 space-y-2 text-right text-[var(--foreground)]">
        <p className="text-lg font-bold">
          {match.homeTeam}
          <span className="mx-2 text-sm text-[var(--muted)]">در مقابل</span>
          {match.awayTeam}
        </p>
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          <span>{match.venue || "نامشخص"}</span>
          <span className="font-semibold text-brand">{match.score || status.label}</span>
        </div>
      </div>
    </article>
  );
}

function resolveStatus(status?: string | null) {
  const normalized = status?.toLowerCase() ?? "";
  if (normalized.includes("live") || /زنده/.test(normalized)) {
    return { label: "زنده", className: "bg-red-100 text-red-600", pulse: true };
  }
  if (normalized.includes("finished") || /پایان/.test(normalized)) {
    return { label: "پایان یافته", className: "bg-slate-100 text-slate-600" };
  }
  return { label: "در انتظار", className: "bg-amber-100 text-amber-600" };
}

function groupMatches(matchList: Match[]) {
  const today: Match[] = [];
  const week: Match[] = [];
  matchList.forEach((match) => {
    if (isTodayMatch(match)) {
      today.push(match);
    } else {
      week.push(match);
    }
  });
  return { today, week };
}

function isTodayMatch(match: Match) {
  const status = match.status?.toLowerCase() ?? "";
  const date = match.dateTime ?? "";
  return status.includes("live") || status.includes("امروز") || date.includes("امروز");
}
