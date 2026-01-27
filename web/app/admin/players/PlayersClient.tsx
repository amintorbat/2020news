"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { PlayerFormModal, PlayerFormValues } from "@/components/admin/PlayerFormModal";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmationModal";
import { Toast } from "@/components/admin/Toast";
import { Badge } from "@/components/admin/Badge";

type PlayerPosition = "GK" | "FIXO" | "ALA" | "PIVO";

type Player = {
  id: string;
  name: string;
  team: string;
  position: PlayerPosition;
  photo?: string;
  goals: number;
  goalsConceded: number;
  yellowCards: number;
  redCards: number;
  cleanSheets: number;
  matchesPlayed: number;
};

const positionLabel: Record<PlayerPosition, string> = {
  GK: "دروازه‌بان",
  FIXO: "فیکسو",
  ALA: "آلا",
  PIVO: "پیوت",
};

// Enhanced mock data
const initialPlayers: Player[] = [
  {
    id: "1",
    name: "علی رضایی",
    team: "گیتی پسند",
    position: "PIVO",
    goals: 12,
    goalsConceded: 0,
    yellowCards: 2,
    redCards: 0,
    cleanSheets: 0,
    matchesPlayed: 15,
    photo: "",
  },
  {
    id: "2",
    name: "مهدی جاوید",
    team: "گیتی پسند",
    position: "ALA",
    goals: 8,
    goalsConceded: 0,
    yellowCards: 1,
    redCards: 0,
    cleanSheets: 0,
    matchesPlayed: 14,
    photo: "",
  },
  {
    id: "3",
    name: "قدرت بهادری",
    team: "مس سونگون",
    position: "GK",
    goals: 0,
    goalsConceded: 15,
    yellowCards: 0,
    redCards: 0,
    cleanSheets: 5,
    matchesPlayed: 12,
    photo: "",
  },
  {
    id: "4",
    name: "احمد کریمی",
    team: "مس سونگون",
    position: "FIXO",
    goals: 3,
    goalsConceded: 0,
    yellowCards: 3,
    redCards: 1,
    cleanSheets: 0,
    matchesPlayed: 13,
    photo: "",
  },
];

type SortOption = "goals-desc" | "goals-asc" | "goalsConceded-asc" | "matches-desc" | "none";

export default function PlayersClient() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [deletingPlayer, setDeletingPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("none");

  // Get unique teams for filter
  const teams = useMemo(() => {
    const uniqueTeams = Array.from(new Set(players.map((p) => p.team)));
    return uniqueTeams.sort();
  }, [players]);

  // Filtered and sorted players
  const filteredPlayers = useMemo(() => {
    let result = players.filter((p) => {
      const matchesSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase());
      const matchesTeam = teamFilter === "" || p.team === teamFilter;
      const matchesPosition = positionFilter === "" || p.position === positionFilter;
      return matchesSearch && matchesTeam && matchesPosition;
    });

    // Apply sorting
    if (sortOption !== "none") {
      result = [...result].sort((a, b) => {
        switch (sortOption) {
          case "goals-desc":
            return b.goals - a.goals;
          case "goals-asc":
            return a.goals - b.goals;
          case "goalsConceded-asc":
            return a.goalsConceded - b.goalsConceded;
          case "matches-desc":
            return b.matchesPlayed - a.matchesPlayed;
          default:
            return 0;
        }
      });
    }

    return result;
  }, [players, search, teamFilter, positionFilter, sortOption]);

  const handleAddPlayer = () => {
    setEditingPlayer(null);
    setIsModalOpen(true);
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (player: Player) => {
    setDeletingPlayer(player);
    setIsDeleteModalOpen(true);
  };

  const handleSavePlayer = async (formData: PlayerFormValues) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      if (editingPlayer) {
        // Update existing player
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === editingPlayer.id
              ? {
                  ...p,
                  ...formData,
                  id: p.id, // Keep original ID
                }
              : p
          )
        );
        setToast({ message: "بازیکن با موفقیت ویرایش شد", type: "success" });
      } else {
        // Add new player
        const newPlayer: Player = {
          ...formData,
          id: crypto.randomUUID(),
        };
        setPlayers((prev) => [...prev, newPlayer]);
        setToast({ message: "بازیکن جدید با موفقیت اضافه شد", type: "success" });
      }
      setIsModalOpen(false);
      setEditingPlayer(null);
    } catch (error) {
      setToast({ message: "خطا در ذخیره اطلاعات", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPlayer) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      setPlayers((prev) => prev.filter((p) => p.id !== deletingPlayer.id));
      setToast({ message: "بازیکن با موفقیت حذف شد", type: "success" });
      setIsDeleteModalOpen(false);
      setDeletingPlayer(null);
    } catch (error) {
      setToast({ message: "خطا در حذف بازیکن", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const columns: readonly Column<Player>[] = [
    {
      key: "name",
      label: "بازیکن",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {row.photo ? (
              <img src={row.photo} alt={row.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-slate-500 text-sm font-medium">
                {row.name.charAt(0)}
              </span>
            )}
          </div>
          <span className="font-medium text-slate-900">{row.name}</span>
        </div>
      ),
    },
    { key: "team", label: "تیم" },
    {
      key: "position",
      label: "پست",
      render: (row) => (
        <Badge variant="info" className="text-xs">
          {positionLabel[row.position]}
        </Badge>
      ),
    },
    {
      key: "goals",
      label: "گل",
      render: (row) => (
        <span className="font-semibold text-slate-900">{row.goals}</span>
      ),
    },
    {
      key: "goalsConceded",
      label: "گل خورده",
      render: (row) => (
        <span className="text-slate-700">{row.goalsConceded}</span>
      ),
    },
    {
      key: "yellowCards",
      label: "کارت زرد",
      render: (row) => (
        <span className="text-yellow-600 font-medium">{row.yellowCards}</span>
      ),
    },
    {
      key: "redCards",
      label: "کارت قرمز",
      render: (row) => (
        <span className="text-red-600 font-medium">{row.redCards}</span>
      ),
    },
    {
      key: "matchesPlayed",
      label: "بازی",
      render: (row) => (
        <span className="text-slate-700">{row.matchesPlayed}</span>
      ),
    },
    {
      key: "id",
      label: "عملیات",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditPlayer(row)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            title="ویرایش"
            aria-label="ویرایش بازیکن"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
            title="حذف"
            aria-label="حذف بازیکن"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="مدیریت آمار بازیکنان فوتسال"
        subtitle="مدیریت کامل اطلاعات و آمار بازیکنان لیگ فوتسال"
        action={
          <button
            onClick={handleAddPlayer}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
          >
            افزودن بازیکن
          </button>
        }
      />

      {/* Advanced Filters */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-2">
              جستجو
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="نام بازیکن یا تیم..."
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            />
          </div>

          {/* Team Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              تیم
            </label>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            >
              <option value="">همه تیم‌ها</option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          {/* Position Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              پست
            </label>
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            >
              <option value="">همه پست‌ها</option>
              <option value="GK">دروازه‌بان</option>
              <option value="FIXO">فیکسو</option>
              <option value="ALA">آلا</option>
              <option value="PIVO">پیوت</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              مرتب‌سازی
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            >
              <option value="none">بدون مرتب‌سازی</option>
              <option value="goals-desc">بیشترین گل</option>
              <option value="goals-asc">کمترین گل</option>
              <option value="goalsConceded-asc">کمترین گل خورده</option>
              <option value="matches-desc">بیشترین بازی</option>
            </select>
          </div>
        </div>
      </div>

      {/* Players Table */}
      <div className="rounded-xl border border-[var(--border)] bg-white overflow-hidden shadow-sm">
        {filteredPlayers.length > 0 ? (
          <DataTable<Player>
            columns={columns}
            data={filteredPlayers}
            keyExtractor={(row) => row.id}
          />
        ) : (
          <div className="p-12 text-center">
            <p className="text-slate-500 text-sm">هیچ بازیکنی یافت نشد</p>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      <PlayerFormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPlayer(null);
        }}
        onSubmit={handleSavePlayer}
        initialValues={
          editingPlayer
            ? {
                name: editingPlayer.name,
                team: editingPlayer.team,
                position: editingPlayer.position,
                photo: editingPlayer.photo,
                goals: editingPlayer.goals,
                goalsConceded: editingPlayer.goalsConceded,
                yellowCards: editingPlayer.yellowCards,
                redCards: editingPlayer.redCards,
                cleanSheets: editingPlayer.cleanSheets,
                matchesPlayed: editingPlayer.matchesPlayed,
              }
            : undefined
        }
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        title="حذف بازیکن"
        message={`آیا از حذف بازیکن "${deletingPlayer?.name}" اطمینان دارید؟ این عمل قابل بازگشت نیست.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingPlayer(null);
        }}
        isLoading={isLoading}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
