import { LeagueRow } from "@/lib/data";

function toPersianNumber(num: number): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

function RankChangeIndicator({ currentRank, previousRank, isMobile = false }: { currentRank: number; previousRank?: number; isMobile?: boolean }) {
  if (!previousRank) {
    return <span className={isMobile ? "text-[8px] text-slate-400" : "text-[9px] text-slate-400"}>—</span>;
  }
  
  const change = previousRank - currentRank;
  if (change > 0) {
    // Rank improved (moved up) - only green arrow
    return <span className={isMobile ? "text-[10px] text-green-600 font-bold" : "text-[12px] text-green-600 font-bold"}>↑</span>;
  } else if (change < 0) {
    // Rank dropped (moved down) - only red arrow
    return <span className={isMobile ? "text-[10px] text-red-600 font-bold" : "text-[12px] text-red-600 font-bold"}>↓</span>;
  } else {
    // No change
    return <span className={isMobile ? "text-[8px] text-slate-400" : "text-[9px] text-slate-400"}>—</span>;
  }
}

function FormIndicator({ form }: { form?: ("W" | "D" | "L")[] }) {
  if (!form || form.length === 0) {
    return <div className="flex gap-1.5 justify-center items-center h-full">—</div>;
  }
  
  return (
    <div className="flex gap-0.5 items-center justify-center h-full md:gap-1 lg:gap-1.5" title="۵ بازی اخیر">
      {form.slice(0, 5).map((result, idx) => {
        const color = result === "W" ? "bg-green-500" : result === "D" ? "bg-yellow-500" : "bg-red-500";
        const textColor = result === "W" ? "text-white" : result === "D" ? "text-slate-900" : "text-white";
        return (
          <span
            key={idx}
            className={`w-4 h-4 rounded-full ${color} flex-shrink-0 flex items-center justify-center font-bold text-[8px] md:w-5 md:h-5 md:text-[9px] lg:w-7 lg:h-7 lg:text-xs ${textColor}`}
          >
            {result}
          </span>
        );
      })}
    </div>
  );
}

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
    <div dir="rtl" className="text-slate-900 rounded-lg border border-[var(--border)] bg-white overflow-hidden">
      {/* Mobile Portrait: Compact table */}
      <div className="sm:hidden overflow-x-auto">
        <table className="text-[10px] border-collapse w-full">
          <colgroup>
            <col style={{ width: '20px' }} />
            <col style={{ width: '12px' }} />
            <col style={{ width: '48px' }} />
            <col style={{ width: '20px' }} />
            <col style={{ width: '20px' }} />
            <col style={{ width: '20px' }} />
            <col style={{ width: '20px' }} />
            <col style={{ width: '24px' }} />
            <col style={{ width: '24px' }} />
            <col style={{ width: '24px' }} />
            <col style={{ width: '28px' }} />
          </colgroup>
          <thead className="bg-[#f7f8fa] sticky top-0 z-10">
            <tr style={{ height: '28px' }}>
              <th className="px-0.5 py-1 text-center font-semibold text-slate-900 whitespace-nowrap">رتبه</th>
              <th className="px-0 py-1 text-center font-semibold text-slate-900 whitespace-nowrap"></th>
              <th className="px-0.5 py-1 text-right font-semibold text-slate-900 whitespace-nowrap">تیم</th>
              <th className="px-0.5 py-1 text-center font-semibold text-slate-900 whitespace-nowrap">بازی</th>
              <th className="px-0.5 py-1 text-center font-semibold text-slate-900 whitespace-nowrap">برد</th>
              <th className="px-0.5 py-1 text-center font-semibold text-slate-900 whitespace-nowrap">مساوی</th>
              <th className="px-0.5 py-1 text-center font-semibold text-slate-900 whitespace-nowrap">باخت</th>
              <th className="px-0.5 py-1 text-center font-semibold text-slate-900 whitespace-nowrap">گل زده</th>
              <th className="px-0.5 py-1 text-center font-semibold text-slate-900 whitespace-nowrap">گل خورده</th>
              <th className="px-0.5 py-1 text-center font-semibold text-slate-900 whitespace-nowrap">تفاضل</th>
              <th className="px-0.5 py-1 text-center font-semibold text-slate-900 whitespace-nowrap">امتیاز</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const goalDifference = row.goalDifference ?? 0;
              const goalsFor = row.goalsFor ?? 0;
              const goalsAgainst = row.goalsAgainst ?? 0;
              return (
                <tr key={row.team} className="border-t border-[var(--border)]" style={{ height: '28px' }}>
                  <td className="px-0.5 py-1 text-center text-slate-900 whitespace-nowrap align-middle">{toPersianNumber(row.rank)}</td>
                  <td className="px-0 py-1 text-center whitespace-nowrap align-middle">
                    <RankChangeIndicator currentRank={row.rank} previousRank={row.previousRank} isMobile={true} />
                  </td>
                  <td className="px-0.5 py-1 whitespace-nowrap align-middle">
                    <div className="flex items-center gap-0.5 min-w-0">
                      <span className="flex h-3 w-3 flex-shrink-0 items-center justify-center bg-[#f2f4f7] text-[5px] font-bold text-brand">
                        {row.team.slice(0, 2)}
                      </span>
                      <span className="font-semibold text-slate-900 truncate text-[8px] min-w-0">{row.team}</span>
                    </div>
                  </td>
                  <td className="px-0.5 py-1 text-center text-slate-900 whitespace-nowrap align-middle">{toPersianNumber(row.played)}</td>
                  <td className="px-0.5 py-1 text-center text-slate-900 whitespace-nowrap align-middle">{toPersianNumber(row.wins)}</td>
                  <td className="px-0.5 py-1 text-center text-slate-900 whitespace-nowrap align-middle">{toPersianNumber(row.draws)}</td>
                  <td className="px-0.5 py-1 text-center text-slate-900 whitespace-nowrap align-middle">{toPersianNumber(row.losses)}</td>
                  <td className="px-0.5 py-1 text-center text-slate-900 whitespace-nowrap align-middle">{goalsFor > 0 ? toPersianNumber(goalsFor) : "-"}</td>
                  <td className="px-0.5 py-1 text-center text-slate-900 whitespace-nowrap align-middle">{goalsAgainst > 0 ? toPersianNumber(goalsAgainst) : "-"}</td>
                  <td className="px-0.5 py-1 text-center text-slate-900 whitespace-nowrap align-middle">
                    {goalDifference > 0 ? `+${toPersianNumber(goalDifference)}` : goalDifference < 0 ? `-${toPersianNumber(Math.abs(goalDifference))}` : toPersianNumber(0)}
                  </td>
                  <td className="px-0.5 py-1 text-center font-semibold text-brand whitespace-nowrap align-middle">{toPersianNumber(row.points)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Landscape & Tablet Portrait: Medium table */}
      <div className="hidden sm:block md:hidden overflow-x-auto">
        <table className="text-xs border-collapse w-full">
          <colgroup>
            <col style={{ width: '32px' }} />
            <col style={{ width: '20px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '32px' }} />
            <col style={{ width: '32px' }} />
            <col style={{ width: '32px' }} />
            <col style={{ width: '32px' }} />
            <col style={{ width: '40px' }} />
            <col style={{ width: '40px' }} />
            <col style={{ width: '40px' }} />
            <col style={{ width: '48px' }} />
          </colgroup>
          <thead className="bg-[#f7f8fa] sticky top-0 z-10">
            <tr>
              <th className="px-1 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs">رتبه</th>
              <th className="px-0.5 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs"></th>
              <th className="px-1 py-2 text-right font-semibold text-slate-900 whitespace-nowrap text-xs">تیم</th>
              <th className="px-1 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs">بازی</th>
              <th className="px-1 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs">برد</th>
              <th className="px-1 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs">مساوی</th>
              <th className="px-1 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs">باخت</th>
              <th className="px-1 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs">گل+</th>
              <th className="px-1 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs">گل-</th>
              <th className="px-1 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs">تفاضل</th>
              <th className="px-1 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs">امتیاز</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const goalDifference = row.goalDifference ?? 0;
              const goalsFor = row.goalsFor ?? 0;
              const goalsAgainst = row.goalsAgainst ?? 0;
              return (
                <tr key={row.team} className="border-t border-[var(--border)]">
                  <td className="px-1 py-2 text-center text-slate-900 whitespace-nowrap align-middle">{toPersianNumber(row.rank)}</td>
                  <td className="px-0.5 py-2 text-center whitespace-nowrap align-middle">
                    <RankChangeIndicator currentRank={row.rank} previousRank={row.previousRank} />
                  </td>
                  <td className="px-1 py-2 whitespace-nowrap align-middle">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center bg-[#f2f4f7] text-[7px] font-bold text-brand">
                        {row.team.slice(0, 2)}
                      </span>
                      <span className="font-semibold text-slate-900 truncate text-xs min-w-0">{row.team}</span>
                    </div>
                  </td>
                  <td className="px-1 py-2 text-center text-slate-900 whitespace-nowrap align-middle">{toPersianNumber(row.played)}</td>
                  <td className="px-1 py-2 text-center text-slate-900 whitespace-nowrap align-middle">{toPersianNumber(row.wins)}</td>
                  <td className="px-1 py-2 text-center text-slate-900 whitespace-nowrap align-middle">{toPersianNumber(row.draws)}</td>
                  <td className="px-1 py-2 text-center text-slate-900 whitespace-nowrap align-middle">{toPersianNumber(row.losses)}</td>
                  <td className="px-1 py-2 text-center text-slate-900 whitespace-nowrap align-middle">{goalsFor > 0 ? toPersianNumber(goalsFor) : "-"}</td>
                  <td className="px-1 py-2 text-center text-slate-900 whitespace-nowrap align-middle">{goalsAgainst > 0 ? toPersianNumber(goalsAgainst) : "-"}</td>
                  <td className="px-1 py-2 text-center text-slate-900 whitespace-nowrap align-middle">
                    {goalDifference > 0 ? `+${toPersianNumber(goalDifference)}` : goalDifference < 0 ? `-${toPersianNumber(Math.abs(goalDifference))}` : toPersianNumber(0)}
                  </td>
                  <td className="px-1 py-2 text-center font-semibold text-brand whitespace-nowrap align-middle">{toPersianNumber(row.points)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tablet Landscape & Desktop: Full table with form */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f7f8fa]">
            <tr>
              <th className="px-2 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">رتبه</th>
              <th className="px-1 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm"></th>
              <th className="px-2 py-2 text-right font-semibold text-slate-900 whitespace-nowrap text-xs min-w-[120px] md:px-4 md:py-3 md:text-sm md:min-w-[200px]">تیم</th>
              <th className="px-2 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">بازی</th>
              <th className="px-2 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">برد</th>
              <th className="px-2 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">مساوی</th>
              <th className="px-2 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">باخت</th>
              <th className="px-2 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">گل زده</th>
              <th className="px-2 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">گل خورده</th>
              <th className="px-2 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">تفاضل</th>
              <th className="px-2 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">امتیاز</th>
              <th className="px-1 py-2 text-center font-semibold text-slate-900 whitespace-nowrap text-xs md:px-2 md:py-3 md:text-sm">۵ بازی اخیر</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const goalDifference = row.goalDifference ?? 0;
              const goalsFor = row.goalsFor ?? 0;
              const goalsAgainst = row.goalsAgainst ?? 0;
              return (
                <tr key={row.team} className="border-t border-[var(--border)] transition hover:bg-slate-50">
                  <td className="px-2 py-2 text-center text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">{toPersianNumber(row.rank)}</td>
                  <td className="px-1 py-2 text-center whitespace-nowrap md:px-4 md:py-3">
                    <RankChangeIndicator currentRank={row.rank} previousRank={row.previousRank} />
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap md:px-4 md:py-3">
                    <div className="flex items-center gap-1.5 md:gap-3">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center bg-[#f2f4f7] text-[8px] font-bold text-brand md:h-7 md:w-7 md:text-xs">
                        {row.team.slice(0, 2)}
                      </span>
                      <span className="font-semibold text-slate-900 text-xs md:text-sm truncate max-w-[80px] md:max-w-[120px] lg:max-w-none">{row.team}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">{toPersianNumber(row.played)}</td>
                  <td className="px-2 py-2 text-center text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">{toPersianNumber(row.wins)}</td>
                  <td className="px-2 py-2 text-center text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">{toPersianNumber(row.draws)}</td>
                  <td className="px-2 py-2 text-center text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">{toPersianNumber(row.losses)}</td>
                  <td className="px-2 py-2 text-center text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">{goalsFor > 0 ? toPersianNumber(goalsFor) : "-"}</td>
                  <td className="px-2 py-2 text-center text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">{goalsAgainst > 0 ? toPersianNumber(goalsAgainst) : "-"}</td>
                  <td className="px-2 py-2 text-center text-slate-900 whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">
                    {goalDifference > 0 ? `+${toPersianNumber(goalDifference)}` : goalDifference < 0 ? `-${toPersianNumber(Math.abs(goalDifference))}` : toPersianNumber(0)}
                  </td>
                  <td className="px-2 py-2 text-center font-semibold text-brand whitespace-nowrap text-xs md:px-4 md:py-3 md:text-sm">{toPersianNumber(row.points)}</td>
                  <td className="px-1 py-2 text-center whitespace-nowrap md:px-2 md:py-3">
                    <FormIndicator form={row.form} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
