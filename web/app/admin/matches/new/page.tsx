import MatchNewClient from "./MatchNewClient";
import { mockCompetitions } from "@/lib/admin/matchesData";

export default function MatchNewPage() {
  return <MatchNewClient competitions={mockCompetitions} />;
}
