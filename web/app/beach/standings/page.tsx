import { redirect } from "next/navigation";

export default function BeachStandingsRedirect() {
  redirect("/standings?league=beach");
}
