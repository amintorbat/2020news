import { mockNews } from "@/lib/admin/newsData";
import NewsViewClient from "./NewsViewClient";

type Props = {
  params: {
    id: string;
  };
};

export default function NewsViewPage({ params }: Props) {
  const news = mockNews.find((n) => n.id === params.id);

  if (!news) {
    return (
      <div className="flex min-h-screen items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">خبر یافت نشد</h1>
          <p className="mt-2 text-slate-600">خبر مورد نظر وجود ندارد یا حذف شده است.</p>
        </div>
      </div>
    );
  }

  return <NewsViewClient news={news} />;
}
