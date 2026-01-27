import { Column } from "@/components/admin/DataTable";
import { PlayerStatRow } from "@/types/players";

export const playerColumns : readonly Column<PlayerStatRow>[] = [
    {key: "name", label:"بازیکن"},
    {key: "team", label:"تیم"},
    {key: "goals", label:"گل"},
    {key: "yellowCards", label:"کارت زرد"},
    {key: "redCards", label:"کارت قرمز"},
    {key: "cleanSheets", label:"کلین شیت"},
]