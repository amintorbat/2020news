import Link from "next/link";
import { leagueTables } from "@/data/content";
import { LeagueTable } from "./LeagueTable";

export function LeagueTablePreview() {
  return (
    <section className="container space-y-6" aria-labelledby="league-preview">
      <header className="flex flex-wrap items-center justify-between gap-3" id="league-preview">
        <div>
          <p className="text-xs text-white/60">آخرین وضعیت لیگ‌ها</p>
          <h2 className="mt-1 text-2xl font-black text-white">جدول لیگ (خلاصه)</h2>
        </div>
        <Link
          href="/league-table"
          className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white/80 hover:text-white"
        >
          مشاهده جدول کامل
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <LeagueTable title="لیگ برتر فوتسال" rows={leagueTables.futsal.slice(0, 5)} />
        <LeagueTable title="لیگ برتر فوتبال ساحلی" rows={leagueTables.beach.slice(0, 5)} />
      </div>
    </section>
  );
}
