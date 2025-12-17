import { redirect } from "next/navigation";

export default function BeachMatchesRedirect() {
  redirect("/matches?league=beach");
}
