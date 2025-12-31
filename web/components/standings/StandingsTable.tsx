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
    <div className="md:overflow-x-auto" dir="rtl">
      <div className="w-full border-0 border-slate-200 bg-white md:inline-block md:min-w-[900px] md:border">
        <table className="block w-full text-xs md:table md:text-sm">
          <thead className="hidden sticky top-0 z-10 bg-[#f7f8fa] md:table-header-group">
            <tr>
              <th className="md:sticky md:right-0 z-20 bg-[#f7f8fa] border-0 border-l-0 border-slate-200 px-2 py-2 text-center text-[10px] font-semibold text-slate-900 shadow-[2px_0_4px_rgba(0,0,0,0.08)] md:border-l md:px-4 md:text-xs">
                رتبه
              </th>
              <th className="md:sticky md:right-[3rem] z-20 bg-[#f7f8fa] border-0 border-l-0 border-slate-200 px-2 py-2 text-right text-[10px] font-semibold text-slate-900 shadow-[2px_0_4px_rgba(0,0,0,0.08)] md:border-l md:px-4 md:right-[4rem] md:text-xs">
                تیم
              </th>
              <th className="w-[3.5rem] border-0 border-l-0 border-slate-200 px-1.5 py-2 text-center text-[10px] font-semibold text-slate-900 md:min-w-[4rem] md:border-l md:px-4 md:text-xs">بازی</th>
              <th className="w-[2.5rem] border-0 border-l-0 border-slate-200 px-1 py-2 text-center text-[10px] font-semibold text-slate-900 md:min-w-[4rem] md:border-l md:px-4 md:text-xs">برد</th>
              <th className="w-[2.5rem] border-0 border-l-0 border-slate-200 px-1 py-2 text-center text-[10px] font-semibold text-slate-900 md:min-w-[4rem] md:border-l md:px-4 md:text-xs">مساوی</th>
              <th className="w-[2.5rem] border-0 border-l-0 border-slate-200 px-1 py-2 text-center text-[10px] font-semibold text-slate-900 md:min-w-[4rem] md:border-l md:px-4 md:text-xs">باخت</th>
              <th className="w-[3rem] border-0 border-l-0 border-slate-200 px-1 py-2 text-center text-[10px] font-semibold text-slate-900 md:min-w-[4.5rem] md:border-l md:px-4 md:text-xs">گل زده</th>
              <th className="w-[3rem] border-0 border-l-0 border-slate-200 px-1 py-2 text-center text-[10px] font-semibold text-slate-900 md:min-w-[4.5rem] md:border-l md:px-4 md:text-xs">گل خورده</th>
              <th className="w-[3rem] border-0 border-l-0 border-slate-200 px-1 py-2 text-center text-[10px] font-semibold text-slate-900 md:min-w-[4.5rem] md:border-l md:px-4 md:text-xs">تفاضل</th>
              <th className="w-[3rem] border-0 px-1 py-2 text-center text-[10px] font-semibold text-slate-900 md:min-w-[4.5rem] md:px-4 md:text-xs">امتیاز</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {rows.map((row) => {
              const goalDifference = row.goalDifference ?? 0;
              return (
                <tr key={row.team} className="grid grid-cols-[2.5rem,1fr,3rem,3rem] items-center gap-x-2 border-0 border-slate-200 transition hover:bg-slate-50 md:table-row md:border-t">
                  <td className="block md:sticky md:right-0 z-10 bg-white border-0 border-l-0 border-slate-200 px-2 py-2 text-center text-[10px] text-slate-700 md:table-cell md:border-l md:px-4 md:text-xs md:shadow-[2px_0_4px_rgba(0,0,0,0.08)]">
                    {row.rank}
                  </td>
                  <td className="block md:sticky md:right-[3rem] z-10 bg-white border-0 border-l-0 border-slate-200 px-2 py-2 md:table-cell md:border-l md:px-4 md:right-[4rem]">
                    <div className="flex min-w-0 items-center gap-1.5 md:gap-3">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center bg-[#f2f4f7] text-[9px] font-bold text-brand md:h-7 md:w-7 md:text-xs">
                        {row.team.slice(0, 2)}
                      </span>
                      <span className="min-w-0 truncate text-[10px] font-semibold text-slate-900 md:text-sm md:max-w-none">{row.team}</span>
                    </div>
                  </td>
                  <td className="block border-0 border-l-0 border-slate-200 px-1.5 py-2 text-center text-[10px] text-slate-700 md:table-cell md:border-l md:px-4 md:text-sm">{row.played}</td>
                  <td className="hidden border-0 border-l-0 border-slate-200 px-1 py-2 text-center text-[10px] text-slate-700 md:table-cell md:border-l md:px-4 md:text-sm">{row.wins}</td>
                  <td className="hidden border-0 border-l-0 border-slate-200 px-1 py-2 text-center text-[10px] text-slate-700 md:table-cell md:border-l md:px-4 md:text-sm">{row.draws}</td>
                  <td className="hidden border-0 border-l-0 border-slate-200 px-1 py-2 text-center text-[10px] text-slate-700 md:table-cell md:border-l md:px-4 md:text-sm">{row.losses}</td>
                  <td className="hidden border-0 border-l-0 border-slate-200 px-1 py-2 text-center text-[10px] text-slate-700 md:table-cell md:border-l md:px-4 md:text-sm">-</td>
                  <td className="hidden border-0 border-l-0 border-slate-200 px-1 py-2 text-center text-[10px] text-slate-700 md:table-cell md:border-l md:px-4 md:text-sm">-</td>
                  <td className="hidden border-0 border-l-0 border-slate-200 px-1 py-2 text-center text-[10px] text-slate-700 md:table-cell md:border-l md:px-4 md:text-sm">{goalDifference > 0 ? `+${goalDifference}` : goalDifference}</td>
                  <td className="block border-0 px-1 py-2 text-center text-[10px] font-semibold text-brand md:table-cell md:px-4 md:text-sm">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
