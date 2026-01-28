"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/admin/Badge";
import { Toggle } from "@/components/admin/Toggle";
import { Match, MATCH_STATUS_LABELS, getSportConfig, MATCH_EVENT_TYPE_LABELS } from "@/types/matches";
import { mockCompetitions } from "@/lib/admin/matchesData";

type Props = {
  match: Match;
};

export default function MatchDetailsClient({ match }: Props) {
  const router = useRouter();
  const [isPublished, setIsPublished] = useState(match.isPublished);
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePublish = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsPublished(!isPublished);
    setIsLoading(false);
  };

  const getStatusBadge = (status: Match["status"]) => {
    const variants: Record<Match["status"], "success" | "danger" | "info" | "warning" | "default"> = {
      finished: "success",
      live: "danger",
      scheduled: "info",
      postponed: "warning",
      cancelled: "default",
    };
    return <Badge variant={variants[status]}>{MATCH_STATUS_LABELS[status]}</Badge>;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal":
        return "⚽";
      case "yellow-card":
        return "🟨";
      case "red-card":
        return "🟥";
      case "blue-card":
        return "🔵";
      case "substitution":
        return "🔄";
      case "penalty":
        return "🎯";
      case "own-goal":
        return "😞";
      case "timeout":
        return "⏸️";
      default:
        return "•";
    }
  };

  const sportConfig = getSportConfig(match.sport);

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title={`${match.homeTeam} vs ${match.awayTeam}`}
        subtitle={`${match.competitionName} - ${match.seasonName}`}
        action={
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">وضعیت انتشار:</span>
              <Toggle
                checked={isPublished}
                onChange={handleTogglePublish}
                disabled={isLoading}
                label={isPublished ? "منتشر شده" : "پیش‌نویس"}
              />
            </div>
            <button
              onClick={() => router.push(`/admin/matches/${match.id}/edit`)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
            >
              ویرایش مسابقه
            </button>
          </div>
        }
      />

      {/* Match Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Match Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Score Card */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{sportConfig.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{sportConfig.label}</h3>
                  <p className="text-sm text-slate-600">{match.date} - {match.time}</p>
                </div>
              </div>
              {getStatusBadge(match.status)}
            </div>

            <div className="grid grid-cols-3 gap-4 items-center py-6 border-y border-[var(--border)]">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">{match.homeTeam}</div>
                <div className="text-sm text-slate-600">تیم میزبان</div>
              </div>
              <div className="text-center">
                {match.homeScore !== null && match.awayScore !== null ? (
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl font-bold text-slate-900">{match.homeScore}</span>
                    <span className="text-2xl text-slate-400">-</span>
                    <span className="text-4xl font-bold text-slate-900">{match.awayScore}</span>
                  </div>
                ) : (
                  <div className="text-xl text-slate-400 font-medium">vs</div>
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">{match.awayTeam}</div>
                <div className="text-sm text-slate-600">تیم میهمان</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">مکان:</span>
                <span className="mr-2 font-medium text-slate-900">{match.venue}</span>
              </div>
              {match.referee && (
                <div>
                  <span className="text-slate-600">داور:</span>
                  <span className="mr-2 font-medium text-slate-900">{match.referee}</span>
                </div>
              )}
              {match.attendance && (
                <div>
                  <span className="text-slate-600">تماشاگر:</span>
                  <span className="mr-2 font-medium text-slate-900">{match.attendance.toLocaleString("fa-IR")}</span>
                </div>
              )}
              <div>
                <span className="text-slate-600">مدت زمان:</span>
                <span className="mr-2 font-medium text-slate-900">
                  {sportConfig.matchDuration} دقیقه ({sportConfig.periods} نیمه × {sportConfig.periodDuration} دقیقه)
                </span>
              </div>
              <div>
                <span className="text-slate-600">بازیکنان:</span>
                <span className="mr-2 font-medium text-slate-900">{sportConfig.maxPlayers} بازیکن در هر تیم</span>
              </div>
            </div>
          </div>

          {/* Match Events */}
          {match.events.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">رویدادهای مسابقه</h3>
              <div className="space-y-3">
                {match.events
                  .sort((a, b) => b.minute - a.minute)
                  .map((event) => (
                    <div
                      key={event.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        event.team === "home" ? "bg-blue-50" : "bg-red-50"
                      }`}
                    >
                      <span className="text-xl">{getEventIcon(event.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-slate-900">{event.playerName || "نامشخص"}</span>
                          <span className="text-xs text-slate-500">({event.minute}')</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-600">{MATCH_EVENT_TYPE_LABELS[event.type]}</span>
                        </div>
                        {event.description && (
                          <div className="text-xs text-slate-600 mt-1">{event.description}</div>
                        )}
                      </div>
                      <div className="text-xs font-medium text-slate-600">
                        {event.team === "home" ? match.homeTeam : match.awayTeam}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Competition Info */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">اطلاعات مسابقات</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-slate-600">مسابقات:</span>
                <div className="mt-1 font-medium text-slate-900">{match.competitionName}</div>
              </div>
              <div>
                <span className="text-slate-600">فصل:</span>
                <div className="mt-1 font-medium text-slate-900">{match.seasonName}</div>
              </div>
              {(() => {
                const competition = mockCompetitions.find((c) => c.id === match.competitionId);
                if (!competition) return null;
                const typeLabels: Record<typeof competition.type, string> = {
                  league: "لیگ",
                  cup: "جام",
                  international: "بین‌المللی",
                  friendly: "دوستانه",
                };
                return (
                  <div>
                    <span className="text-slate-600">نوع:</span>
                    <div className="mt-1">
                      <Badge variant="info">{typeLabels[competition.type]}</Badge>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">عملیات سریع</h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push(`/admin/matches/${match.id}/edit`)}
                className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-right"
              >
                ویرایش مسابقه
              </button>
              <button
                onClick={() => router.push("/admin/matches")}
                className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-right"
              >
                بازگشت به لیست
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
