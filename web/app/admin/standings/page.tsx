import StandingsClient, { StandingItem } from "./StandingsClient";

const standings: StandingItem[] = [
  { id: 1, team: "گیتی پسند", played: "10", points: "21" },
  { id: 2, team: "مس سونگون", played: "10", points: "20" },
];

export default function Page() {
  return <StandingsClient items={standings} />;
}