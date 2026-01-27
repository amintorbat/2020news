import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/admin/Badge";
import { mockMedia, type MediaItem } from "@/lib/admin/mock";

// export default function AdminMediaPage() {
//   const columns = [
//     {
//       key: "title",
//       label: "عنوان",
//     },
//     {
//       key: "type",
//       label: "نوع",
//       render: (value: string) => (
//         <Badge variant={value === "image" ? "info" : "warning"}>
//           {value === "image" ? "تصویر" : "ویدیو"}
//         </Badge>
//       ),
//     },
//     {
//       key: "size",
//       label: "حجم",
//       render: (value: number) => `${(value / 1024 / 1024).toFixed(2)} MB`,
//     },
//     {
//       key: "uploadedBy",
//       label: "آپلود کننده",
//     },
//     {
//       key: "uploadedAt",
//       label: "تاریخ آپلود",
//     },
//   ];

//   return (
//     <div className="space-y-6" dir="rtl">
//       <PageHeader title="مدیریت رسانه" subtitle="مدیریت تصاویر و ویدیوها" />
//       <DataTable
//         data={mockMedia}
//         columns={columns}
//         keyExtractor={(row) => row.id}
//         actions={(row) => (
//           <div className="flex items-center gap-2">
//             <button className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100" title="مشاهده">
//               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

import MediaClient from "./MediaClient";

export default function AdminMediaPage() {
  return <MediaClient />;
}
