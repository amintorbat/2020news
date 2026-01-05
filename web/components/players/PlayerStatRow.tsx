import Image from "next/image";
import { PlayerAvatar } from "./PlayerAvatar";
import type { PlayerWithStats } from "@/lib/data/players";

type PlayerStatRowProps = {
  rank: number;
  player: PlayerWithStats;
  statValue: number;
  compact?: boolean;
  showTeamLogo?: boolean;
};

export function PlayerStatRow({ rank, player, statValue, compact = false, showTeamLogo = false }: PlayerStatRowProps) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="px-3 py-3 text-center">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm font-bold text-slate-700">
          {rank}
        </div>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-3">
          <PlayerAvatar photoUrl={player.photoUrl} name={player.name} size={compact ? "sm" : "md"} />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-900 truncate" style={{ color: '#0f172a' }}>
              {player.name}
            </div>
            {!compact && (
              <div className="flex items-center gap-2 mt-1">
                {showTeamLogo && player.team.logoUrl && (
                  <div className="relative h-4 w-4 flex-shrink-0 overflow-hidden rounded">
                    <Image
                      src={player.team.logoUrl}
                      alt={player.team.name}
                      fill
                      className="object-contain"
                      sizes="16px"
                    />
                  </div>
                )}
                <div className="text-xs text-slate-600 truncate">{player.team.name}</div>
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-3 py-3 text-center">
        <div className="text-base font-bold text-brand">
          {statValue}
        </div>
      </td>
    </tr>
  );
}

