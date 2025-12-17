import { redirect } from "next/navigation";

export default function FutsalStandingsRedirect() {
  redirect("/standings?league=futsal");
}
