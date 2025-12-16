import Link from "next/link";
import { leagueTables } from "@/data/mock/tables";

export function LeagueTablesPreview() {
  return (
    <section className="container space-y-6" id="tables-preview">
      <header className="space-y-1">
        <p className="section-subtitle">خلاصه جدول</p>
        <h2 className="section-title">جدول لیگ (فوتسال و فوتبال ساحلی)</h2>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <PreviewTable title="لیگ برتر فوتسال" rows={leagueTables.futsal.slice(0, 4)} />
        <PreviewTable title="لیگ برتر فوتبال ساحلی" rows={leagueTables.beach.slice(0, 4)} />
      </div>
      <div className="flex justify-end">
        <Link href="/tables" className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
          مشاهده جدول کامل
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

type PreviewProps = {
  title: string;
  rows: {
    rank: number;
    team: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    points: number;
  }[];
};

function PreviewTable({ title, rows }: PreviewProps) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-card" dir="rtl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
        <span className="text-xs text-[var(--muted)]">به‌روزرسانی امروز</span>
      </div>
      <ul className="mt-4 space-y-3">
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
    </div>
  );
}
