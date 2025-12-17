import { LiveMatch } from "./live-data";

export function LiveMatchRow({ match }: { match: LiveMatch }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-default last:border-0">
      {/* اطلاعات مسابقه */}
      <div>
        <p className="text-xs text-muted mb-1">{match.league}</p>
        <p className="text-sm font-medium">
          {match.home} vs {match.away}
        </p>
      </div>

      {/* نتیجه */}
      <div className="flex items-center gap-4">
        <div className="text-lg font-bold tabular-nums">
          {match.homeScore} - {match.awayScore}
        </div>

        {/* وضعیت */}
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            match.status === "live"
              ? "bg-danger text-white"
              : match.status === "ongoing"
              ? "bg-primary text-black"
              : "bg-muted/30 text-muted"
          }`}
        >
          {match.minute}
        </span>
      </div>
    </div>
  );
}
