import { LeagueRow } from "@/lib/data";

export function StandingsTable({ rows, compact = false }: { rows: LeagueRow[]; compact?: boolean }) {
  if (compact) {
    return (
      <ul className="space-y-3" dir="rtl">
        {rows.map((row) => (
          <li key={row.team} className="flex items-center justify-between rounded-2xl border border-[var(--border)] px-4 py-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--muted)]">{row.rank}</span>
              <p className="font-semibold text-[var(--foreground)]">{row.team}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
              <span>بازی {row.played}</span>
              <span className="font-bold text-brand">{row.points} امتیاز</span>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white" dir="rtl">
      <table className="w-full text-sm">
        <thead className="bg-[#f7f8fa] text-xs text-[var(--muted)]">
          <tr>
            <th className="py-3 text-center font-semibold">رتبه</th>
            <th className="py-3 text-right font-semibold">تیم</th>
            <th className="py-3 text-center font-semibold">بازی</th>
            <th className="py-3 text-center font-semibold">برد</th>
            <th className="py-3 text-center font-semibold">تفاضل</th>
            <th className="py-3 text-center font-semibold">امتیاز</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.team} className="border-t border-[var(--border)]">
              <td className="py-3 text-center text-xs text-[var(--muted)]">{row.rank}</td>
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f4f7] text-xs font-bold text-brand">
                    {row.team.slice(0, 2)}
                  </span>
                  <span className="font-semibold text-[var(--foreground)]">{row.team}</span>
                </div>
              </td>
              <td className="py-3 text-center text-sm text-[var(--muted)]">{row.played}</td>
              <td className="py-3 text-center text-sm text-[var(--muted)]">{row.wins}</td>
              <td className="py-3 text-center text-sm text-[var(--muted)]">{row.goalDifference}</td>
              <td className="py-3 text-center text-sm font-semibold text-brand">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
