import NewsClient from "./NewsClient";
import { mockNews } from "@/lib/admin/mock";

export default function AdminNewsPage() {
  return <NewsClient items={mockNews} />;
}
