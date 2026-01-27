// import { PageHeader } from "@/components/admin/PageHeader";
// import { DataTable } from "@/components/admin/DataTable";
// import { Badge } from "@/components/admin/Badge";
// import { mockUsers, type AdminUser } from "@/lib/admin/mock";

// export default function AdminUsersPage() {
//   const columns = [
//     {
//       key: "name",
//       label: "نام",
//     },
//     {
//       key: "email",
//       label: "ایمیل",
//     },
//     {
//       key: "role",
//       label: "نقش",
//       render: (value: string) => {
//         const labels: Record<string, string> = {
//           owner: "مالک",
//           supervisor: "ناظر",
//           reporter: "گزارشگر",
//           editor: "ویراستار",
//         };
//         const variants: Record<string, "default" | "success" | "warning" | "danger"> = {
//           owner: "danger",
//           supervisor: "warning",
//           reporter: "info",
//           editor: "success",
//         };
//         return <Badge variant={variants[value] || "default"}>{labels[value] || value}</Badge>;
//       },
//     },
//     {
//       key: "lastLogin",
//       label: "آخرین ورود",
//       render: (value: string | null) => value || "هرگز",
//     },
//     {
//       key: "isActive",
//       label: "وضعیت",
//       render: (value: boolean) => (
//         <Badge variant={value ? "success" : "default"}>{value ? "فعال" : "غیرفعال"}</Badge>
//       ),
//     },
//   ];

//   return (
//     <div className="space-y-6" dir="rtl">
//       <PageHeader title="مدیریت کاربران" subtitle="مدیریت کاربران و نقش‌های دسترسی" />
//       <DataTable
//         data={mockUsers}
//         columns={columns}
//         keyExtractor={(row) => row.id}
//         actions={(row) => (
//           <div className="flex items-center gap-2">
//             <button className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100" title="ویرایش">
//               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//               </svg>
//             </button>
//             <button className="rounded-lg p-1.5 text-red-600 hover:bg-red-50" title="حذف">
//               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//               </svg>
//             </button>
//           </div>
//         )}
//       />
//     </div>
//   );
// }


import UsersClient from "./UsersClient";

export default function AdminUsersPage() {
  return <UsersClient />;
}