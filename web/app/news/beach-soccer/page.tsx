import { redirect } from "next/navigation";

export default function NewsBeachPage() {
  redirect("/news?category=beach");
}
