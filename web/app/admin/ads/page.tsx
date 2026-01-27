// import { PageHeader } from "@/components/admin/PageHeader";
// import { DataTable } from "@/components/admin/DataTable";
// import { Badge } from "@/components/admin/Badge";
// import { Toggle } from "@/components/admin/Toggle";
// import { mockAds, type AdSlot } from "@/lib/admin/mock";

// export default function AdminAdsPage() {
//   const columns = [
//     {
//       key: "name",
//       label: "نام",
//     },
//     {
//       key: "type",
//       label: "نوع",
//       render: (value: string) => {
//         const labels: Record<string, string> = {
//           popup: "پاپ‌آپ",
//           click: "کلیک",
//           banner: "بنر",
//         };
//         return <Badge variant="info">{labels[value] || value}</Badge>;
//       },
//     },
//     {
//       key: "isActive",
//       label: "وضعیت",
//       render: (value: boolean) => (
//         <Badge variant={value ? "success" : "default"}>{value ? "فعال" : "غیرفعال"}</Badge>
//       ),
//     },
//     {
//       key: "impressions",
//       label: "نمایش",
//     },
//     {
//       key: "clicks",
//       label: "کلیک",
//     },
//     {
//       key: "startDate",
//       label: "شروع",
//     },
//     {
//       key: "endDate",
//       label: "پایان",
//       render: (value: string | null) => value || "-",
//     },
//   ];

//   return (
//     <div className="space-y-6" dir="rtl">
//       <PageHeader title="مدیریت تبلیغات" subtitle="مدیریت اسلات‌های تبلیغاتی" />
//       <DataTable
//         data={mockAds}
//         columns={columns}
//         keyExtractor={(row) => row.id}
//         actions={(row) => (
//           <div className="flex items-center gap-2">
//             <Toggle checked={row.isActive} onChange={() => {}} label="" />
//             <button className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100" title="ویرایش">
//               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//               </svg>
//             </button>
//           </div>
//         )}
//       />
//     </div>
//   );
// }


import AdsClient from "./AdsClient";

export default function AdminAdsPage() {
  return <AdsClient />;
}