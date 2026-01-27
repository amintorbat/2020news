"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { mockPlayers } from "@/lib/admin/mock";
import StatCard from "./components/StatCard";

export default function TopPlayersClient() {
  const topScorers = [...mockPlayers]
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 5);

  const bestGoalkeepers = [...mockPlayers]
    .filter(p => p.position === "GK")
    .sort((a, b) => a.goalsConceded - b.goalsConceded)
    .slice(0, 5);

  const yellowCards = [...mockPlayers]
    .sort((a, b) => b.yellowCards - a.yellowCards)
    .slice(0, 5);

  const redCards = [...mockPlayers]
    .sort((a, b) => b.redCards - a.redCards)
    .slice(0, 5);

  const cleanSheets = [...mockPlayers]
    .sort((a, b) => b.cleanSheets - a.cleanSheets)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="برترین بازیکنان"
        subtitle="تحلیل آماری برترین‌های فوتسال"
      />

      <StatCard
        title="گلزنان برتر"
        valueLabel="گل"
        players={topScorers}
        valueKey="goals"
      />

      <StatCard
        title="کمترین گل خورده (دروازه‌بان)"
        valueLabel="گل خورده"
        players={bestGoalkeepers}
        valueKey="goalsConceded"
      />

      <StatCard
        title="بیشترین کارت زرد"
        valueLabel="کارت زرد"
        players={yellowCards}
        valueKey="yellowCards"
      />

      <StatCard
        title="بیشترین کارت قرمز"
        valueLabel="کارت قرمز"
        players={redCards}
        valueKey="redCards"
      />

      <StatCard
        title="بیشترین کلین‌شیت"
        valueLabel="کلین‌شیت"
        players={cleanSheets}
        valueKey="cleanSheets"
      />
    </div>
  );
}