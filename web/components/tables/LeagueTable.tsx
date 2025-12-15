import type { TableRow } from "@/data/content";

type LeagueTableProps = {
  title: string;
  rows: TableRow[];
  highlightTop?: number;
};

export function LeagueTable({ title, rows, highlightTop = 3 }: LeagueTableProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#050f23] p-4" dir="rtl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <span className="text-[11px] text-white/50">بروزرسانی امروز</span>
      </div>

      <div className="mt-4 hidden text-sm text-white/70 md:block">
        <div className="grid grid-cols-4 px-3 pb-2 text-[11px] uppercase tracking-wide text-white/40">
          <span className="text-center">رتبه</span>
          <span className="text-right">تیم</span>
          <span className="text-center">بازی</span>
          <span className="text-center">امتیاز</span>
        </div>
        <ul>
          {rows.map((row) => (
            <li
              key={row.team}
              className={`grid grid-cols-4 items-center rounded-2xl px-3 py-2 text-right ${
                row.rank <= highlightTop ? "bg-white/5" : ""
              }`}
            >
              <span className="text-center text-sm text-white/60">{row.rank}</span>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[11px] font-bold text-white">
                  {row.logo}
                </span>
                <span className="text-sm text-white">{row.team}</span>
              </div>
              <span className="text-center">{row.played}</span>
              <span className="text-center text-base font-black text-primary">{row.points}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 space-y-3 md:hidden">
        {rows.map((row) => (
          <div key={row.team} className="rounded-2xl border border-white/10 p-3 text-right">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">{row.rank}</span>
                <p className="text-sm font-bold text-white">{row.team}</p>
              </div>
              <span className="text-base font-black text-primary">{row.points}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-white/60">
              <span>بازی: {row.played}</span>
              <span>امتیاز: {row.points}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
