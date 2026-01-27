import PlayerMiniCard from "./PlayerMiniCard";

type StatCardProps = {
  title: string;
  valueLabel: string;
  valueKey: keyof any;
  players: any[];
};

export default function StatCard({
  title,
  valueLabel,
  valueKey,
  players,
}: StatCardProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {players.map(player => (
          <PlayerMiniCard
            key={player.id}
            player={player}
            value={player[valueKey]}
            valueLabel={valueLabel}
          />
        ))}
      </div>
    </section>
  );
}