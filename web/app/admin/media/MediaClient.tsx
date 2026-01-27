"use client";

import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/admin/Badge";
import { mockMedia, type MediaItem } from "@/lib/admin/mock";

export default function MediaClient() {
  const columns: readonly Column<MediaItem>[] = [
    { 
      key: "title", 
      label: "عنوان" 
    },
    { 
      key: "type", 
      label: "نوع",
      render: (row) => (
        <Badge variant={row.type === "image" ? "info" : "warning"}>
          {row.type === "image" ? "تصویر" : "ویدیو"}
        </Badge>
      )
    },
    { 
      key: "size", 
      label: "حجم",
      render: (row) => `${(row.size / 1024 / 1024).toFixed(2)} MB`
    },
    { 
      key: "uploadedBy", 
      label: "آپلود کننده" 
    },
    { 
      key: "uploadedAt", 
      label: "تاریخ آپلود" 
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">مدیریت گالری و ویدیو</h1>
        <button className="rounded-lg px-4 py-2 text-sm text-white bg-brand hover:bg-brand/90">
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
