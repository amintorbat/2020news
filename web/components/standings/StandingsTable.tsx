import { LeagueRow } from "@/lib/data";

export function StandingsTable({ rows, compact = false }: { rows: LeagueRow[]; compact?: boolean }) {
  if (compact) {
    return (
      <div className="overflow-hidden border border-[var(--border)] bg-white" dir="rtl">
        <table className="w-full text-sm">
          <thead className="bg-[#f7f8fa] text-xs">
            <tr>
              <th className="py-2 text-center font-semibold text-slate-900">رتبه</th>
              <th className="py-2 text-right font-semibold text-slate-900">تیم</th>
              <th className="py-2 text-center font-semibold text-slate-900">بازی</th>
              <th className="py-2 text-center font-semibold text-slate-900">امتیاز</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.team} className="border-t border-[var(--border)]">
                <td className="py-2.5 text-center text-xs text-slate-700">{row.rank}</td>
                <td className="py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center bg-[#f2f4f7] text-[10px] font-bold text-brand">
                      {row.team.slice(0, 2)}
                    </span>
                    <span className="font-semibold text-slate-900">{row.team}</span>
                  </div>
                </td>
                <td className="py-2.5 text-center text-xs text-slate-700">{row.played}</td>
                <td className="py-2.5 text-center text-sm font-semibold text-brand">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div dir="rtl" className="text-slate-900">
      {/* Table with horizontal scroll on mobile */}
      <div className="overflow-x-auto md:overflow-x-visible">
        <div className="w-full bg-white min-w-[900px]">
          <table className="w-full text-sm">
            <thead className="bg-[#f7f8fa]">
              <tr>
                <th className="px-4 py-3 text-center font-semibold text-slate-900 whitespace-nowrap">رتبه</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-900 whitespace-nowrap">تیم</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900 whitespace-nowrap">بازی</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900 whitespace-nowrap">برد</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900 whitespace-nowrap">مساوی</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900 whitespace-nowrap">باخت</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900 whitespace-nowrap">گل زده</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900 whitespace-nowrap">گل خورده</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900 whitespace-nowrap">تفاضل</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900 whitespace-nowrap">امتیاز</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const goalDifference = row.goalDifference ?? 0;
                return (
                  <tr key={row.team} className="transition hover:bg-slate-50">
                    <td className="px-4 py-3 text-center text-slate-900 whitespace-nowrap">{row.rank}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center bg-[#f2f4f7] text-xs font-bold text-brand">
                          {row.team.slice(0, 2)}
                        </span>
                        <span className="font-semibold text-slate-900 truncate">{row.team}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-900 whitespace-nowrap">{row.played}</td>
                    <td className="px-4 py-3 text-center text-slate-900 whitespace-nowrap">{row.wins}</td>
                    <td className="px-4 py-3 text-center text-slate-900 whitespace-nowrap">{row.draws}</td>
                    <td className="px-4 py-3 text-center text-slate-900 whitespace-nowrap">{row.losses}</td>
                    <td className="px-4 py-3 text-center text-slate-900 whitespace-nowrap">-</td>
                    <td className="px-4 py-3 text-center text-slate-900 whitespace-nowrap">-</td>
                    <td className="px-4 py-3 text-center text-slate-900 whitespace-nowrap">{goalDifference > 0 ? `+${goalDifference}` : goalDifference}</td>
                    <td className="px-4 py-3 text-center font-semibold text-brand whitespace-nowrap">{row.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
