import { matchSchedules } from "@/data/content";
import { MatchCard } from "./MatchCard";

export function MatchesSection() {
  return (
    <section className="container space-y-6" id="matches">
      <header className="space-y-2">
        <p className="section-subtitle">برنامه و نتایج مهم هفته</p>
        <h2 className="section-title">بازی‌ها و نتایج</h2>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">فوتسال</h3>
          {matchSchedules.futsal.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">فوتبال ساحلی</h3>
          {matchSchedules.beach.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </section>
  );
}
