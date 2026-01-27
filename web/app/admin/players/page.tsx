import PlayersClient from "./PlayersClient";
import { mockPlayers } from "@/lib/admin/mock";

export default function AdminPlayersPage() {
  return <PlayersClient data={mockPlayers} />;
}