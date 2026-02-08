"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { BracketView } from "@/components/bracket/BracketView";
import {
  getBracketForLeague,
  saveBracket,
  generateEmptyBracket,
} from "@/lib/admin/bracketData";
import type { BracketStructure, BracketMatchSlot } from "@/types/bracket";
import type { League } from "@/types/leagues";

type Props = { leagueId: string; league: League | null };

export default function BracketAdminClient({ leagueId, league }: Props) {
  const [bracket, setBracket] = useState<BracketStructure | null>(null);
  const [teamCount, setTeamCount] = useState(16);
  const [hasThird, setHasThird] = useState(true);

  useEffect(() => {
    const opts = {
      teamCount: league?.numberOfTeams ?? 16,
      hasThirdPlace: league?.hasThirdPlaceMatch ?? true,
    };
    setTeamCount(opts.teamCount);
    setHasThird(opts.hasThirdPlace);
    setBracket(getBracketForLeague(leagueId, opts));
  }, [leagueId, league?.numberOfTeams, league?.hasThirdPlaceMatch]);

  const handleRegenerate = () => {
    const next = generateEmptyBracket(leagueId, teamCount, hasThird);
    saveBracket(next);
    setBracket(next);
  };

  const handleSlotClick = (slot: BracketMatchSlot) => {
    // TODO: open modal to assign match / teams / result
    return;
  };

  if (!bracket) {
    return (
      <div className="p-6 text-center text-slate-500" dir="rtl">
        در حال بارگذاری چارت…
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title={league ? `چارت: ${league.title}` : "چارت حذفی"}
        subtitle="ساختار چارت حذفی — مشاهده و اختصاص مسابقه به هر سلول"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/leagues"
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              بازگشت به لیگ‌ها
            </Link>
          </div>
        }
      />

      <div className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <span>تعداد تیم:</span>
            <select
              value={teamCount}
              onChange={(e) => setTeamCount(Number(e.target.value))}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm"
            >
              <option value={8}>۸</option>
              <option value={16}>۱۶</option>
              <option value={32}>۳۲</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={hasThird}
              onChange={(e) => setHasThird(e.target.checked)}
            />
            مسابقه مقام سوم
          </label>
          <button
            type="button"
            onClick={handleRegenerate}
            className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm text-amber-800 hover:bg-amber-100"
          >
            ساخت مجدد چارت
          </button>
        </div>
        <BracketView
          bracket={bracket}
          editable
          onSlotClick={handleSlotClick}
        />
      </div>
    </div>
  );
}
