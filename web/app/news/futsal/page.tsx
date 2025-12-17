import { redirect } from "next/navigation";

export default function NewsFutsalPage() {
  redirect("/news?category=futsal");
}
