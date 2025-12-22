import { matchStatuses, type MatchBase } from "@/lib/data";
import { cn } from "@/lib/cn";

const statusClasses: Record<typeof matchStatuses[number]["id"], string> = {
  live: "bg-red-500/10 text-red-600",
  upcoming: "bg-brand/10 text-brand",
  finished: "bg-slate-200 text-slate-700",
};

export function MatchCard({ match }: { match: MatchBase }) {
  const statusLabel = matchStatuses.find((item) => item.id === match.status)?.label ?? "";

  return (
    <article className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-card" dir="rtl">
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>{match.venue}</span>
        <span className={cn("rounded-full px-3 py-1 text-xs font-bold", statusClasses[match.status])}>{statusLabel}</span>
      </div>
      <h3 className="mt-4 text-lg font-bold text-[var(--foreground)]">{match.opponent}</h3>
      <div className="mt-3 flex items-center justify-between text-sm text-[var(--muted)]">
        <span>فصل {match.season}</span>
        <span>هفته {match.week}</span>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-[var(--muted)]">
        <span>{match.date}</span>
        {match.score ? <p className="text-3xl font-black text-[var(--foreground)]">{match.score}</p> : <span className="text-xs text-brand">گزارش ویژه ۲۰۲۰نیوز</span>}
      </div>
    </article>
  );
}
