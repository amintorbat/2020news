import { PlayerStatRow } from "./PlayerStatRow";
import type { PlayerWithStats } from "@/lib/data/players";

type StatConfig = {
  key: keyof PlayerWithStats["stats"];
  label: string;
  sortDesc?: boolean;
};

const statConfigs: Record<string, StatConfig> = {
  goals: { key: "goals", label: "گل", sortDesc: true },
  shots: { key: "shots", label: "شوت", sortDesc: true },
  shotsOnTarget: { key: "shotsOnTarget", label: "شوت در چارچوب", sortDesc: true },
  minutesPlayed: { key: "minutesPlayed", label: "دقایق بازی", sortDesc: true },
  yellowCards: { key: "yellowCards", label: "کارت زرد", sortDesc: true },
  redCards: { key: "redCards", label: "کارت قرمز", sortDesc: true },
  cleanSheets: { key: "cleanSheets", label: "کلین‌شیت", sortDesc: true },
  goalsConceded: { key: "goalsConceded", label: "گل خورده", sortDesc: false },
};

type PlayerStatsTableProps = {
  title: string;
  statKey: string;
  players: PlayerWithStats[];
  compact?: boolean;
  limit?: number;
};

export function PlayerStatsTable({ title, statKey, players, compact = false, limit }: PlayerStatsTableProps) {
  const config = statConfigs[statKey];
  if (!config) return null;

  const sortedPlayers = [...players].sort((a, b) => {
    const aVal = (a.stats[config.key] as number) || 0;
    const bVal = (b.stats[config.key] as number) || 0;
    return config.sortDesc ? bVal - aVal : aVal - bVal;
  });

  const displayPlayers = limit ? sortedPlayers.slice(0, limit) : sortedPlayers;

  const getStatValue = (player: PlayerWithStats) => player.stats[config.key];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white overflow-hidden">
      {title && (
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900" style={{ color: '#0f172a' }}>{title}</h3>
        </div>
      )}
      {displayPlayers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 w-16">رتبه</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600">بازیکن</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600 w-20">{config.label}</th>
              </tr>
            </thead>
            <tbody>
              {displayPlayers.map((player, index) => (
                <PlayerStatRow
                  key={player.id}
                  rank={index + 1}
                  player={player}
                  statValue={getStatValue(player)}
                  compact={compact}
                  showTeamLogo={!compact}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-4 py-8 text-center text-sm text-slate-600">
          اطلاعاتی یافت نشد
        </div>
      )}
    </div>
  );
}

