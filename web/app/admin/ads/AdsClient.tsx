"use client";

import { DataTable } from "@/components/admin/DataTable";
import { mockAds, type AdItem } from "@/lib/admin/mock";

export default function AdsClient() {
  const columns = [
    { key: "title", label: "عنوان تبلیغ" },
    { key: "customer", label: "مشتری" },
    { key: "type", label: "نوع" },
    { key: "position", label: "جایگاه" },
    { key: "status", label: "وضعیت" },
    { key: "impressions", label: "نمایش" },
    { key: "clicks", label: "کلیک" },
  ] as const;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">مدیریت تبلیغات</h1>
        <button className="rounded-lg  px-4 py-2 text-sm text-white bg-brand hover:bg-brand/90">
          افزودن تبلیغ
        </button>
      </div>

      <DataTable<AdItem>
        columns={columns}
        data={mockAds}
        keyExtractor={(row) => row.id}
      />
    </div>
  );
}