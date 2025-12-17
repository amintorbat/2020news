import { redirect } from "next/navigation";

export default function FutsalMatchesRedirect() {
  redirect("/matches?league=futsal");
}
