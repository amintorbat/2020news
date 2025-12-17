import { leagueTables } from "@/data/content";

export function LeagueTables() {
  return (
    <section className="container space-y-6" id="tables">
      <header className="space-y-2">
        <p className="section-subtitle">جدول خلاصه لیگ‌ها</p>
        <h2 className="section-title">جدول لیگ</h2>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <LeagueTable title="لیگ برتر فوتسال" rows={leagueTables.futsal} />
        <LeagueTable title="لیگ برتر فوتبال ساحلی" rows={leagueTables.beach} />
      </div>
    </section>
  );
}

type TableProps = {
  title: string;
  rows: { rank: number; team: string; played: number; points: number }[];
};

function LeagueTable({ title, rows }: TableProps) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-card" dir="rtl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
        <span className="text-xs text-[var(--muted)]">به‌روزرسانی امروز</span>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="bg-[#f7f8fa] text-xs text-[var(--muted)]">
            <tr>
              <th className="py-2">رتبه</th>
              <th className="py-2">تیم</th>
              <th className="py-2">بازی</th>
              <th className="py-2">امتیاز</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.team} className="text-center text-[var(--foreground)]">
                <td className="py-3 font-semibold">{row.rank}</td>
                <td className="py-3 text-right font-semibold">{row.team}</td>
                <td className="py-3 text-[var(--muted)]">{row.played}</td>
                <td className="py-3 font-bold text-brand">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
