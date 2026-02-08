import BracketAdminClient from "./BracketAdminClient";
import { mockLeagues } from "@/lib/admin/leaguesData";

type Props = { params: Promise<{ leagueId: string }> };

export default async function BracketPage({ params }: Props) {
  const { leagueId } = await params;
  const league = mockLeagues.find((l) => l.id === leagueId);
  return <BracketAdminClient leagueId={leagueId} league={league ?? null} />;
}
