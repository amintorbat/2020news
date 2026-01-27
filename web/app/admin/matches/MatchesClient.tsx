"use client";

import { DataTable } from "@/components/admin/DataTable";

export type MatchItem = {
  id: number;
  home: string;
  away: string;
  score: string;
  competition: string;
  week: string;
  date: string;
  status: string;
};

export default function MatchesClient({
  items,
}: {
  items: MatchItem[];
}) {
  const columns: { key: keyof MatchItem; label: string }[] = [
    { key: "home", label: "میزبان" },
    { key: "score", label: "نتیجه" },
    { key: "away", label: "میهمان" },
    { key: "competition", label: "مسابقات" },
    { key: "week", label: "هفته" },
    { key: "date", label: "تاریخ" },
    { key: "status", label: "وضعیت" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">مسابقات</h1>
        <button className="rounded-lg  px-4 py-2 text-white bg-brand hover:bg-brand/90">
          افزودن مسابقه
        </button>
      </div>

      <DataTable<MatchItem>
        columns={columns}
        data={items}
        keyExtractor={(row) => row.id}
      />
    </div>
  );
}