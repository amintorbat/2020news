"use client"; 
import { DataTable } from "@/components/admin/DataTable";

export type StandingItem = {
    id: number;
    team: string;
    played: string;
    points: string;
}

export default function StandingClient({items}: {items : StandingItem[]}){
    const columns : {key: keyof StandingItem; label: string }[] = [
        {key: "team", label: "تیم"},
        {key: "played", label: "بازی"},
        {key: "points", label: "امتیاز"},
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-x font-bold">جدول لیگ</h1>
            <DataTable<StandingItem>
              columns={columns}
              data={items}
              keyExtractor={(row) => row.id}
            />
        </div>
    )
}