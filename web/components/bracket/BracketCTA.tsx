"use client";

import Link from "next/link";
import type { LeagueKey } from "@/lib/data";
import { getBracketLeagueForSport } from "@/lib/data/knockoutBrackets";

type BracketCTAProps = {
  leagueKey: LeagueKey;
  /** compact: فقط لینک. full: جعبه با توضیح و آیکون */
  variant?: "compact" | "full";
  className?: string;
};

export function BracketCTA({
  leagueKey,
  variant = "full",
  className = "",
}: BracketCTAProps) {
  const info = getBracketLeagueForSport(leagueKey);
  if (!info) return null;

  const link = (
    <Link
      href={`/bracket/${info.id}`}
      className="inline-flex items-center gap-2 font-semibold text-brand hover:text-brand/90 hover:underline"
    >
      <span>مشاهده چارت به صورت گرافیکی</span>
      <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
      </svg>
    </Link>
  );

  if (variant === "compact") {
    return <div className={className}>{link}</div>;
  }

  return (
    <div
      className={
        "rounded-xl border border-[var(--border)] bg-slate-50/80 p-3 sm:p-4 " + className
      }
      dir="rtl"
    >
      <p className="text-sm text-slate-700 mb-2">
        مسابقات <strong>{info.title}</strong> به صورت حذفی برگزار می‌شود. می‌توانید چارت پیشرفت را ببینید.
      </p>
      {link}
    </div>
  );
}
