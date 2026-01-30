import NewsFormClient from "../../NewsFormClient";
import { mockNews } from "@/lib/admin/newsData";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditNewsPage({ params }: Props) {
  const { id } = await params;
  const news = mockNews.find((n) => n.id === id);
  
  if (!news) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">خبر یافت نشد</p>
      </div>
    );
  }

  return <NewsFormClient initialNews={news} />;
}
