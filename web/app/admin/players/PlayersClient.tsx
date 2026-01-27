"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterBar } from "@/components/admin/FilterBar";
import { DataTable, Column } from "@/components/admin/DataTable";
import { PlayerFormModal, PlayerFormValues } from "@/components/admin/PlayerFormModal";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmationModal";

type PlayerPosition = "GK" | "FIXO" | "ALA" | "PIVO";

type Player = {
  id: string;
  name: string;
  team: string;
  position: PlayerPosition;
  photo?: string;
  goals: number;
  yellowCards: number;
  redCards: number;
  cleanSheets: number;
};

const positionLabel: Record<PlayerPosition, string> = {
  GK: "دروازه‌بان",
  FIXO: "فیکسو",
  ALA: "آلا",
  PIVO: "پیوت",
};

const mockPlayers: Player[] = [
  {
    id: "1",
    name: "علی رضایی",
    team: "گیتی پسند",
    position: "PIVO",
    goals: 12,
    yellowCards: 2,
    redCards: 0,
    cleanSheets: 0,
    photo: "",
  },
];

export default function PlayersClient() {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");

  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      const matchesSearch =
        p.name.includes(search) || p.team.includes(search);

      const matchesTeam = teamFilter ? p.team === teamFilter : true;
      const matchesPosition = positionFilter
        ? p.position === positionFilter
        : true;

      return matchesSearch && matchesTeam && matchesPosition;
    });
  }, [players, search, teamFilter, positionFilter]);

  const columns: readonly Column<Player>[] = [
    { key: "name", label: "بازیکن" },
    { key: "team", label: "تیم" },
    {
      key: "position",
      label: "پست",
    },
    { key: "goals", label: "گل" },
    { key: "yellowCards", label: "زرد" },
    { key: "redCards", label: "قرمز" },
    { key: "cleanSheets", label: "کلین‌شیت" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="مدیریت بازیکنان فوتسال"
        action={
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg  px-4 py-2 text-sm text-white bg-brand hover:bg-brand/90"
          >
            افزودن بازیکن
          </button>
        }
      />

      <FilterBar>
        <input
          className="rounded-lg border px-3 py-2 text-sm"
          placeholder="جستجو بازیکن یا تیم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="rounded-lg border px-3 py-2 text-sm"
          onChange={(e) => setTeamFilter(e.target.value)}
        >
          <option value="">همه تیم‌ها</option>
          <option>گیتی پسند</option>
        </select>

        <select
          className="rounded-lg border px-3 py-2 text-sm"
          onChange={(e) => setPositionFilter(e.target.value)}
        >
          <option value="">همه پست‌ها</option>
          <option value="GK">دروازه‌بان</option>
          <option value="FIXO">فیکسو</option>
          <option value="ALA">آلا</option>
          <option value="PIVO">پیوت</option>
        </select>
      </FilterBar>

      <DataTable
        data={filteredPlayers.map((p) => ({
          ...p,
          position: positionLabel[p.position],
        })) as any}
        columns={columns}
        keyExtractor={(row) => row.id}
      />

      <PlayerFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(player) =>
          setPlayers((prev) => [...prev, { ...player, id: crypto.randomUUID() }])
        }
      />
    </div>
  );
}