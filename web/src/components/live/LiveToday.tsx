import { liveMatches } from "./live-data";
import { LiveMatchRow } from "./LiveMatchRow";

export function LiveToday() {
  return (
    <section className="container mt-12">
      <div className="bg-surface border border-default rounded-xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">نتایج زنده امروز</h3>
          <span className="text-xs text-muted">به‌روزرسانی لحظه‌ای</span>
        </div>

        {/* Matches */}
        <div>
          {liveMatches.map((match) => (
            <LiveMatchRow key={match.id} match={match} />
          ))}
        </div>
      </div>
    </section>
  );
}
