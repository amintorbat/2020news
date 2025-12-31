import Link from "next/link";
import { getFallbackMatchesPayload } from "@/lib/acs/fallback";
import type { Match, SportType } from "@/lib/acs/types";
import { cn } from "@/lib/cn";

type AnnotatedMatch = Match & { leagueLabel: string };

function annotateMatches(sport: SportType, matches: Match[]): AnnotatedMatch[] {
  const leagueLabel = sport === "beach" ? "فوتبال ساحلی" : "فوتسال";
  return matches.map((match) => ({ ...match, leagueLabel }));
}

function formatStatus(match: Match) {
  const normalized = match.status?.toLowerCase() ?? "";
  if (normalized.includes("live") || /زنده/.test(normalized)) {
    return { label: "زنده", tone: "bg-red-500/20 text-red-200 border border-red-500/40", pulse: true };
  }
  if (normalized.includes("پایان") || normalized.includes("finished") || normalized.includes("ft")) {
    return { label: "پایان یافته", tone: "bg-white/10 text-white/80 border border-white/20" };
  }
  return { label: "در انتظار", tone: "bg-amber-500/20 text-amber-100 border border-amber-500/30" };
}

async function loadTickerMatches() {
  try {
    // فقط از fallback استفاده می‌کنیم - بدون ACS
    const [futsal, beach] = await Promise.all([
      getFallbackMatchesPayload("futsal"),
      getFallbackMatchesPayload("beach"),
    ]);
    const futsalMatches = futsal?.matches ?? [];
    const beachMatches = beach?.matches ?? [];
    const dataset = [...annotateMatches("futsal", futsalMatches), ...annotateMatches("beach", beachMatches)];
    return dataset.slice(0, 12);
  } catch (error) {
    console.error("[LiveTicker] Error loading matches:", error);
    return [];
  }
}

function hasLiveOrTodayMatches(matches: AnnotatedMatch[]): boolean {
  if (!matches.length) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if any match is live or today
  const hasRelevantMatch = matches.some((match) => {
    const status = formatStatus(match);
    const isLive = status.pulse || status.label === "زنده";
    
    if (isLive) return true;
    
    // Check if match is today
    if (match.dateTime) {
      try {
        // Try parsing as ISO date
        const matchDate = new Date(match.dateTime);
        if (!isNaN(matchDate.getTime())) {
          matchDate.setHours(0, 0, 0, 0);
          if (matchDate.getTime() === today.getTime()) return true;
        }
      } catch {
        // If dateTime is in Persian format (like "شنبه ۲۸ اسفند")
        const dateStr = String(match.dateTime).toLowerCase();
        if (dateStr.includes("امروز") || dateStr.includes("today") || dateStr.includes("این هفته")) {
          return true;
        }
      }
    }
    
    // If status indicates live
    if (match.status && (match.status.toLowerCase().includes("live") || /زنده/.test(match.status))) {
      return true;
    }
    
    return false;
  });
  
  // If using fallback data (Persian dates), show ticker if there are matches
  // This handles the case where dateTime is in Persian format
  if (!hasRelevantMatch && matches.length > 0) {
    // Check if we're likely using fallback data (Persian date format)
    const hasPersianDates = matches.some((m) => {
      if (!m.dateTime) return false;
      const dt = String(m.dateTime);
      // Persian date indicators
      return /[۰-۹]|اسفند|بهمن|دی|آذر|آبان|مهر|شهریور|مرداد|تیر|خرداد|اردیبهشت|فروردین/.test(dt);
    });
    
    // If we have Persian dates, assume they're current/upcoming and show ticker
    if (hasPersianDates) return true;
  }
  
  return hasRelevantMatch;
}

export async function LiveTicker() {
  const matches = await loadTickerMatches();
  const shouldShow = hasLiveOrTodayMatches(matches);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="border-b border-slate-200 bg-slate-900 text-white" dir="rtl">
      <div className="container flex flex-col gap-3 py-2 text-sm sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 font-semibold text-emerald-200">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
          <span>بازی‌ها و نتایج امروز</span>
        </div>
        {matches.length ? (
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0">
              {matches.map((match) => {
                const status = formatStatus(match);
                return (
                  <div
                    key={match.id}
                    className="min-w-[220px] rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-xs backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px] text-white/70">
                      <span>{match.leagueLabel}</span>
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5", status.tone)}>
                        {status.label}
                        {status.pulse && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />}
                      </span>
                    </div>
                    <div className="mt-2 text-sm font-bold text-white">
                      {match.homeTeam}
                      <span className="mx-1 text-xs text-white/70">vs</span>
                      {match.awayTeam}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-white/70">
                      <span>{match.score || match.dateTime || match.status || "به‌زودی"}</span>
                      <span>{match.venue || "نامشخص"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-xs text-white/70">فعلاً اطلاعاتی موجود نیست.</p>
        )}
        <div className="flex justify-start gap-3 text-xs text-white/80 sm:justify-end">
          <Link href="/matches?league=futsal" className="rounded-full border border-white/30 px-3 py-1 hover:border-white">
            فوتسال
          </Link>
          <Link href="/matches?league=beach" className="rounded-full border border-white/30 px-3 py-1 hover:border-white">
            فوتبال ساحلی
          </Link>
        </div>
      </div>
    </div>
  );
}
