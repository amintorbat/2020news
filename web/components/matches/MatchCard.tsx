import Image from "next/image";
import type { MatchItem } from "@/lib/data/matches";

type MatchCardProps = {
  match: MatchItem;
  compact?: boolean;
};

export function MatchCard({ match, compact = false }: MatchCardProps) {
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";

  const getStatusBadge = () => {
    if (isLive) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
          زنده
        </span>
      );
    }
    if (isFinished) {
      return (
        <span className="inline-flex items-center rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
          تمام‌شده
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
        در انتظار
      </span>
    );
  };

  const getCompetitionTypeBadge = (type: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      league: { label: "لیگ", className: "bg-blue-100 text-blue-700" },
      cup: { label: "جام", className: "bg-purple-100 text-purple-700" },
      international: { label: "بین‌المللی", className: "bg-green-100 text-green-700" },
      friendly: { label: "دوستانه", className: "bg-gray-100 text-gray-700" },
      women: { label: "بانوان", className: "bg-pink-100 text-pink-700" },
      youth: { label: "جوانان", className: "bg-yellow-100 text-yellow-700" },
      other: { label: "سایر", className: "bg-slate-100 text-slate-700" },
    };
    return badges[type] || badges.other;
  };

  if (compact) {
    return (
      <article className="rounded-xl border border-[var(--border)] bg-white p-3 shadow-sm transition hover:shadow-md sm:p-4 text-slate-900">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-2 overflow-hidden">
            {/* Date and Time */}
            <div className="flex items-center gap-2 text-xs text-slate-900 sm:text-sm">
              <span className="whitespace-nowrap">{match.datePersian}</span>
              <span className="text-slate-400 flex-shrink-0">•</span>
              <span className="whitespace-nowrap">{match.time}</span>
            </div>

            {/* Competition Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-700">{match.competitionTitle || match.competition}</span>
              {match.competitionType && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getCompetitionTypeBadge(match.competitionType).className}`}>
                  {getCompetitionTypeBadge(match.competitionType).label}
                </span>
              )}
              {match.competitionType === "league" && match.weekNumber && (
                <span className="text-xs text-slate-600">هفته {match.weekNumber}</span>
              )}
              {match.roundLabel && (
                <span className="text-xs text-slate-600">{match.roundLabel}</span>
              )}
            </div>

            {/* Teams */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm font-semibold sm:text-base">
              <span className="truncate text-right text-slate-900" style={{ color: '#0f172a' }}>{match.homeTeam.name}</span>

              {isFinished && match.score ? (
                <span className="font-bold text-brand px-1">
                  {match.score.home} - {match.score.away}
                </span>
              ) : isLive && match.score ? (
                <span className="font-bold text-red-600 px-1">
                  {match.score.home} - {match.score.away}
                </span>
              ) : (
                <span className="text-slate-400 px-1">vs</span>
              )}

              <span className="truncate text-left text-slate-900" style={{ color: '#0f172a' }}>{match.awayTeam.name}</span>
            </div>

            {/* Venue */}
            <div className="text-xs text-slate-900 sm:text-sm truncate">{match.venue}</div>
          </div>

          {/* Status Badge */}
          <div className="flex-shrink-0">{getStatusBadge()}</div>
        </div>
      </article>
    );
  }

  // Full card layout
  return (
    <article
      className={`rounded-lg border border-[var(--border)] bg-white p-3 shadow-sm transition hover:shadow-md sm:p-4 ${
        isLive ? "bg-red-50/30 border-red-200" : ""
      }`}
      dir="rtl"
    >
      <div className="flex flex-col items-center gap-3">
        {/* Top Row: Time, Venue, Status */}
        <div className="flex w-full items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-600 sm:text-sm">
            <span className="font-medium text-slate-700">{match.time}</span>
            <span className="h-1 w-1 rounded-full bg-slate-400" aria-hidden="true" />
            <span className="truncate">{match.venue}</span>
          </div>
          <span className="h-1 w-1 rounded-full bg-slate-400" aria-hidden="true" />
          {getStatusBadge()}
        </div>

        {/* Competition Info */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="text-xs font-semibold text-slate-700">{match.competitionTitle || match.competition}</span>
          {match.competitionType && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getCompetitionTypeBadge(match.competitionType).className}`}>
              {getCompetitionTypeBadge(match.competitionType).label}
            </span>
          )}
          {match.competitionType === "league" && match.weekNumber && (
            <span className="text-xs text-slate-600">• هفته {match.weekNumber}</span>
          )}
          {match.roundLabel && (
            <span className="text-xs text-slate-600">• {match.roundLabel}</span>
          )}
        </div>

        {/* Teams and Score - Centered */}
        <div className="flex w-full items-center justify-center gap-4">
          {/* Home Team */}
          <div className="flex flex-1 items-center justify-end gap-2">
            {match.homeTeam.logo ? (
              <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden sm:h-10 sm:w-10">
                <Image
                  src={match.homeTeam.logo}
                  alt={match.homeTeam.name}
                  fill
                  className="object-contain"
                  sizes="40px"
                  style={{ borderRadius: 0 }}
                />
              </div>
            ) : (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-white text-[10px] font-bold text-slate-700 shadow-sm sm:h-10 sm:w-10 sm:text-xs">
                {match.homeTeam.name.slice(0, 2)}
              </div>
            )}
            <span className="truncate text-center text-sm font-semibold text-slate-900 sm:text-base" style={{ color: '#0f172a' }}>
              {match.homeTeam.name}
            </span>
          </div>

          {/* Score - Center */}
          <div className="flex-shrink-0">
            {isFinished && match.score ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-900 sm:text-2xl">{match.score.home}</span>
                <span className="text-slate-400">-</span>
                <span className="text-xl font-bold text-slate-900 sm:text-2xl">{match.score.away}</span>
              </div>
            ) : isLive && match.score ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-red-600 sm:text-2xl">{match.score.home}</span>
                <span className="text-red-400">-</span>
                <span className="text-xl font-bold text-red-600 sm:text-2xl">{match.score.away}</span>
              </div>
            ) : (
              <span className="text-lg font-semibold text-slate-400 sm:text-xl">vs</span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-1 items-center justify-start gap-2">
            <span className="truncate text-center text-sm font-semibold text-slate-900 sm:text-base" style={{ color: '#0f172a' }}>
              {match.awayTeam.name}
            </span>
            {match.awayTeam.logo ? (
              <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden sm:h-10 sm:w-10">
                <Image
                  src={match.awayTeam.logo}
                  alt={match.awayTeam.name}
                  fill
                  className="object-contain"
                  sizes="40px"
                  style={{ borderRadius: 0 }}
                />
              </div>
            ) : (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-white text-[10px] font-bold text-slate-700 shadow-sm sm:h-10 sm:w-10 sm:text-xs">
                {match.awayTeam.name.slice(0, 2)}
              </div>
            )}
      </div>
      </div>
      </div>
    </article>
  );
}
