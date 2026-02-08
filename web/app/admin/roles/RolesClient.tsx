"use client";

import { useAuth } from "@/contexts/AuthContext";
import { PERMISSION_MATRIX } from "@/lib/admin/rbac";
import {
  ROLE_LABELS,
  MODULE_LABELS,
  ACTION_LABELS,
  type RoleKey,
  type ModuleKey,
  type ActionKey,
} from "@/types/rbac";

const MODULES = ["news", "media", "matches", "reporter", "leagues", "players", "ads", "settings", "reports", "users"] as const;
const ACTIONS = ["read", "create", "edit", "delete", "publish"] as const;

export default function RolesClient() {
  const { currentUser, hasPermission } = useAuth();
  const canManageUsers = currentUser && hasPermission("users", "read");

  if (!canManageUsers) {
    return (
      <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 text-center" dir="rtl">
        <p className="font-medium text-red-800">دسترسی غیرمجاز</p>
        <p className="mt-2 text-sm text-red-700">فقط مدیر کل می‌تواند نقش‌ها و دسترسی‌ها را مشاهده کند.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">مدیریت نقش‌ها و دسترسی‌ها</h1>
        <p className="mt-1 text-sm text-slate-600">ماتریس دسترسی هر نقش به ماژول‌ها و عملیات (فقط مشاهده)</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-right font-semibold text-slate-700">ماژول</th>
              {ACTIONS.map((action) => (
                <th key={action} className="px-4 py-3 text-right font-semibold text-slate-700">
                  {ACTION_LABELS[action as ActionKey]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODULES.map((module) => (
              <tr key={module} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {MODULE_LABELS[module as ModuleKey]}
                </td>
                {ACTIONS.map((action) => {
                  const roles = PERMISSION_MATRIX[module as ModuleKey]?.[action as ActionKey] ?? [];
                  return (
                    <td key={action} className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {roles.length === 0 ? (
                          <span className="text-slate-400">—</span>
                        ) : (
                          roles.map((r) => (
                            <span
                              key={r}
                              className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                            >
                              {ROLE_LABELS[r]}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 font-semibold text-slate-800">نقش‌ها</h2>
        <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {(Object.keys(ROLE_LABELS) as RoleKey[]).map((role) => (
            <li key={role} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
              <span className="font-medium text-slate-800">{ROLE_LABELS[role]}</span>
              <span className="mr-2 text-xs text-slate-500">({role})</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
        <h2 className="mb-2 font-semibold text-amber-900">قوانین خاص</h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-amber-800">
          <li>خبرنگار: دسترسی زمانی (شروع و پایان) و محدود به خبر/مسابقهٔ اختصاص‌داده‌شده.</li>
          <li>گزارشگر مسابقه: فقط افزودن رویداد مسابقه و ایجاد خبر مرتبط با همان مسابقه، در بازهٔ زمانی تعیین‌شده.</li>
          <li>اعتبار دسترسی زمانی در UI و API بررسی می‌شود.</li>
        </ul>
      </section>
    </div>
  );
}
