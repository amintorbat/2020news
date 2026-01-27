"use client";

import Link from "next/link";
import { mockMatches } from "@/lib/admin/mock";
import { Badge } from "@/components/admin/Badge";

export default function TodayMatches() {
  const today = new Date().toLocaleDateString("fa-IR");
  const todayMatches = mockMatches.filter(
    (m) => m.date === today || m.status === "live" || m.status === "upcoming"
  ).slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge variant="danger">زنده</Badge>;
      case "finished":
        return <Badge variant="success">پایان</Badge>;
      case "upcoming":
        return <Badge variant="info">پیش‌رو</Badge>;
      default:
        return <Badge variant="warning">تعویق</Badge>;
    }
  };

  return (
    <section className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">مسابقات امروز</h3>
        <Link 
          href="/admin/matches"
          className="text-xs sm:text-sm font-medium text-brand hover:text-brand/80 transition-colors"
        >
          مشاهده همه →
        </Link>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {todayMatches.length > 0 ? (
          todayMatches.map((match) => (
            <Link
              key={match.id}
              href={`/admin/matches/${match.id}`}
              className="block group"
            >
              <div className="p-3 sm:p-4 rounded-lg border border-[var(--border)] hover:border-brand/50 hover:bg-slate-50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">{match.date}</span>
                  {getStatusBadge(match.status)}
                </div>
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  <div className="flex-1 text-right">
                    <p className="text-sm sm:text-base font-semibold !text-slate-900 group-hover:!text-brand transition-colors" style={{ color: '#0f172a' }}>
                      {match.homeTeam}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {match.homeScore !== null && match.awayScore !== null ? (
                      <>
                        <span className="text-base sm:text-lg font-bold !text-slate-900" style={{ color: '#0f172a' }}>
                          {match.homeScore}
                        </span>
                        <span className="text-slate-400">-</span>
                        <span className="text-base sm:text-lg font-bold !text-slate-900" style={{ color: '#0f172a' }}>
                          {match.awayScore}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs sm:text-sm text-slate-400">vs</span>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm sm:text-base font-semibold !text-slate-900 group-hover:!text-brand transition-colors" style={{ color: '#0f172a' }}>
                      {match.awayTeam}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-slate-500">{match.venue}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 capitalize">{match.competitionType}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500 text-sm">
            مسابقه‌ای برای امروز ثبت نشده است
          </div>
        )}
      </div>
    </section>
  );
}