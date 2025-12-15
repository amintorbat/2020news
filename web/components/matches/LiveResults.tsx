import Link from "next/link";
import { liveMatches } from "@/data/content";
import { MatchCard } from "./MatchCard";

export function LiveResults() {
  return (
    <section className="container space-y-6" aria-labelledby="live-results">
      <header className="flex flex-wrap items-center justify-between gap-3" id="live-results">
        <div>
          <p className="text-xs text-white/60">به‌روزرسانی لحظه‌ای</p>
          <h2 className="mt-1 text-2xl font-black text-white">نتایج زنده امروز</h2>
        </div>
        <Link
          href="/matches"
          className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white/80 hover:text-white"
        >
          مشاهده تمام مسابقات
        </Link>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {liveMatches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}
