type PlayerMiniCardProps = {
    player: any;
    value: number;
    valueLabel: string;
  };
  
  export default function PlayerMiniCard({
    player,
    value,
    valueLabel,
  }: PlayerMiniCardProps) {
    return (
      <div className="min-w-[220px] rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={player.avatar || "/placeholder-player.png"}
            alt={player.name}
            className="h-12 w-12 rounded-full object-cover"
          />
  
          <div>
            <p className="font-medium text-slate-900">{player.name}</p>
            <p className="text-xs text-slate-500">{player.team}</p>
          </div>
        </div>
  
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-slate-500">{valueLabel}</span>
          <span className="text-xl font-bold text-brand">{value}</span>
        </div>
      </div>
    );
  }