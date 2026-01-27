"use client";

import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/admin/Badge";
import { mockUsers, AdminUser } from "@/lib/admin/mock";

export default function UsersClient() {
  const columns: readonly Column<AdminUser>[] = [
    { key: "name", label: "نام" },
    { key: "email", label: "ایمیل" },
    { key: "role", label: "نقش" },
    {
      key: "isActive",
      label: "وضعیت",
      render: (row) => (
        <Badge variant={row.isActive ? "success" : "default"}>
          {row.isActive ? "فعال" : "غیرفعال"}
        </Badge>
      ),
    },
    { key: "lastLogin", label: "آخرین ورود" },
    { key: "createdAt", label: "تاریخ عضویت" },
    {
      key: "id",
      label: "عملیات",
      render: (row) => (
        <div className="flex gap-2">
          <button
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
            title="ویرایش"
          >
            ✏️
          </button>
          <button
            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition-colors"
            title="مسدودسازی"
          >
            ⛔
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">مدیریت کاربران</h1>
        <button className="rounded-lg px-4 py-2 text-sm text-white bg-brand hover:bg-brand/90">
          افزودن کاربر
        </button>
      </div>

      <DataTable<AdminUser>
        columns={columns}
        data={mockUsers}
        keyExtractor={(row) => row.id}
      />
    </div>
  );
}