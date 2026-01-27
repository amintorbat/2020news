"use client";

import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import type { NewsItem } from "@/lib/admin/mock";

type Props = {
  items: NewsItem[];
};

export default function NewsClient({ items }: Props) {
  const columns = [
    {
      key: "title",
      label: "عنوان",
      render: (row: NewsItem) => (
        <div className="min-w-0">
          <div className="truncate font-semibold text-slate-900">{row.title}</div>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-2 py-0.5">{row.sport}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5">{row.category}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5">{row.status}</span>
          </div>
        </div>
      ),
    },
    {
      key: "publishedAt",
      label: "تاریخ",
      render: (row: NewsItem) => <span className="text-slate-700">{row.publishedAt}</span>,
    },
    {
      key: "author",
      label: "نویسنده",
      render: (row: NewsItem) => <span className="text-slate-700">{row.author}</span>,
    },
    {
      key: "actions",
      label: "عملیات",
      render: (row: NewsItem) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/news/${row.id}`}
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-slate-50"
          >
            مشاهده
          </Link>
          <Link
            href={`/admin/news/${row.id}/edit`}
            className="rounded-lg bg-[var(--brand)] px-3 py-1 text-xs font-semibold text-white hover:opacity-90"
          >
            ویرایش
          </Link>
        </div>
      ),
    },
  ] as const;

  return (
    <section className="space-y-4">
      <PageHeader
        title="اخبار"
        subtitle="مدیریت خبرها، وضعیت انتشار، دسته‌بندی و نویسنده"
      />

      <div className="rounded-2xl border border-[var(--border)] bg-white p-3 sm:p-4">
        <DataTable<NewsItem> 
          columns={columns as any} 
          data={items}
          keyExtractor={(row) => row.id}
        />
      </div>
    </section>
  );
}
