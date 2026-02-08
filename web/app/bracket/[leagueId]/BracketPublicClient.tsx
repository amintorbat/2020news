"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BracketView } from "@/components/bracket/BracketView";
import { getBracketForLeague } from "@/lib/admin/bracketData";
import type { BracketStructure } from "@/types/bracket";

type Props = {
  leagueId: string;
  leagueTitle: string;
  teamCount: number;
  hasThirdPlace: boolean;
};

export default function BracketPublicClient({
  leagueId,
  leagueTitle,
  teamCount,
  hasThirdPlace,
}: Props) {
  const [bracket, setBracket] = useState<BracketStructure | null>(null);

  useEffect(() => {
    setBracket(
      getBracketForLeague(leagueId, { teamCount, hasThirdPlace })
    );
  }, [leagueId, teamCount, hasThirdPlace]);

  if (!bracket) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-slate-500" dir="rtl">
        در حال بارگذاری چارت…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8" dir="rtl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">{leagueTitle} — چارت</h1>
        <Link
          href="/matches"
          className="text-sm font-medium text-brand hover:underline"
        >
          بازگشت به مسابقات
        </Link>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm">
        <BracketView bracket={bracket} />
      </div>
    </div>
  );
}
