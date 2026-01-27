"use client";

import { DataTable } from "@/components/admin/DataTable";
import { mockUsers, AdminUser } from "@/lib/admin/mock";

export default function UsersClient() {
  const columns = [
    { key: "name", label: "نام" },
    { key: "email", label: "ایمیل" },
    { key: "role", label: "نقش" },
    { key: "status", label: "وضعیت" },
    { key: "lastLogin", label: "آخرین ورود" },
    { key: "createdAt", label: "تاریخ عضویت" },
  ] as const;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">مدیریت کاربران</h1>
        <button className="rounded-lg bg-black px-4 py-2 text-sm text-white">
          افزودن کاربر
        </button>
      </div>

      <DataTable<AdminUser>
        columns={columns}
        data={mockUsers}
        keyExtractor={(row) => row.id}
        actions={(row) => (
          <div className="flex gap-2">
            <button
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
              title="ویرایش"
            >
              ✏️
            </button>
            <button
              className="rounded-lg  px-4 py-2 text-sm text-white bg-brand hover:bg-brand/90"
              title="مسدودسازی"
            >
              ⛔
            </button>
          </div>
        )}
      />
    </div>
  );
}