import BracketPublicClient from "./BracketPublicClient";
import { mockLeagues } from "@/lib/admin/leaguesData";

type Props = { params: Promise<{ leagueId: string }> };

export default async function PublicBracketPage({ params }: Props) {
  const { leagueId } = await params;
  const league = mockLeagues.find((l) => l.id === leagueId);
  return (
    <BracketPublicClient
      leagueId={leagueId}
      leagueTitle={league?.title ?? "چارت حذفی"}
      teamCount={league?.numberOfTeams ?? 16}
      hasThirdPlace={league?.hasThirdPlaceMatch ?? true}
    />
  );
}
