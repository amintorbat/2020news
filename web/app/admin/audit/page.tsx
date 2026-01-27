// import { PageHeader } from "@/components/admin/PageHeader";
// import { DataTable } from "@/components/admin/DataTable";
// import { mockAuditLogs, type AuditLog } from "@/lib/admin/mock";

// export default function AdminAuditPage() {
//   const columns = [
//     {
//       key: "action",
//       label: "عمل",
//     },
//     {
//       key: "user",
//       label: "کاربر",
//     },
//     {
//       key: "resource",
//       label: "منبع",
//     },
//     {
//       key: "resourceId",
//       label: "شناسه منبع",
//     },
//     {
//       key: "timestamp",
//       label: "زمان",
//     },
//     {
//       key: "ipAddress",
//       label: "آدرس IP",
//     },
//   ];

//   return (
//     <div className="space-y-6" dir="rtl">
//       <PageHeader title="گزارشات سیستم" subtitle="لاگ فعالیت‌های سیستم" />
//       <DataTable
//         data={mockAuditLogs}
//         columns={columns}
//         keyExtractor={(row) => row.id}
//       />
//     </div>
//   );
// }

import AuditClient from "./AuditClient";

export default function AdminAuditPage() {
  return <AuditClient />;
}