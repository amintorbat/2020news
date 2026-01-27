'use client';

import { DataTable, Column } from '@/components/admin/DataTable';
import { PageHeader } from '@/components/admin/PageHeader';
import { mockAuditLogs, AuditLog } from '@/lib/admin/mock';

const columns: readonly Column<AuditLog>[] = [
  {
    key: 'user',
    label: 'کاربر',
  },
  {
    key: 'action',
    label: 'عملیات',
  },
  {
    key: 'resource',
    label: 'بخش',
  },
  {
    key: 'resourceId',
    label: 'شناسه',
    render: (row) => row.resourceId ?? '-',
  },
  {
    key: 'ipAddress',
    label: 'IP',
  },
  {
    key: 'timestamp',
    label: 'تاریخ',
  },
];

export default function AuditClient() {
  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="گزارشات سیستم"
        subtitle="لاگ فعالیت‌های کاربران و تغییرات سیستم"
      />

      <div className="rounded-xl border border-[var(--border)] bg-white overflow-hidden">
        <DataTable<AuditLog>
          columns={columns}
          data={mockAuditLogs}
          keyExtractor={(row) => row.id}
        />
      </div>
    </div>
  );
}