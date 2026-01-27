"use client";

import { DataTable } from "@/components/admin/DataTable";
import { mockMedia, type MediaItem } from "@/lib/admin/mock";

export default function MediaClient() {
  const columns = [
    { key: "title", label: "عنوان" },
    { key: "type", label: "نوع" },
    { key: "relatedTo", label: "مرتبط با" },
    { key: "status", label: "وضعیت" },
    { key: "date", label: "تاریخ" },
  ] as const;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">مدیریت گالری و ویدیو</h1>
        <button className="rounded-lg  px-4 py-2 text-sm text-white bg-brand hover:bg-brand/90">
          افزودن مدیا
        </button>
      </div>

      <DataTable<MediaItem>
        columns={columns}
        data={mockMedia}
        keyExtractor={(row) => row.id}
      />
    </div>
  );
}
