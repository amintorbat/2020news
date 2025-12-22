import { matchSchedules } from "@/data/content";
import type { MatchResult } from "@/lib/data";
import { MatchCard } from "./MatchCard";

type MatchSchedule = (typeof matchSchedules.futsal)[number];

const toMatchResult = (match: MatchSchedule): MatchResult => ({
  id: match.id,
  league: match.sport,
  opponent: match.title,
  venue: match.venue,
  date: match.date,
  status: "upcoming",
  season: "1404-1405",
  week: "1",
});

export function MatchesSection() {
  const futsalMatches = matchSchedules.futsal.map(toMatchResult);
  const beachMatches = matchSchedules.beach.map(toMatchResult);

  return (
    <section className="container space-y-6" id="matches">
      <header className="space-y-2">
        <p className="section-subtitle">برنامه و نتایج مهم هفته</p>
        <h2 className="section-title">بازی‌ها و نتایج</h2>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">فوتسال</h3>
          {futsalMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">فوتبال ساحلی</h3>
          {beachMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </section>
  );
}
