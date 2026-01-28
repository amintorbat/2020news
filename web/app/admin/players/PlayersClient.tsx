"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { PlayerFormModal, PlayerFormValues } from "@/components/admin/PlayerFormModal";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmationModal";
import { Toast } from "@/components/admin/Toast";
import { Badge } from "@/components/admin/Badge";
import { mockTeams } from "@/lib/admin/teamsData";
import type { SportType } from "@/types/matches";
import type { Team } from "@/types/teams";
import { generateId } from "@/lib/utils/id";

type PlayerPosition = "GK" | "FIXO" | "ALA" | "PIVO";
type PlayerStatus = "active" | "injured" | "suspended" | "inactive";

const statusLabel: Record<PlayerStatus, string> = {
  active: "فعال",
  injured: "مصدوم",
  suspended: "محروم",
  inactive: "غیرفعال",
};

const statusBadgeVariant: Record<PlayerStatus, "success" | "warning" | "danger" | "default"> = {
  active: "success",
  injured: "warning",
  suspended: "danger",
  inactive: "default",
};

type Player = {
  id: string;
  name: string;
  sport: SportType;
  teamId: string;
  position: PlayerPosition;
  status: PlayerStatus;
  jerseyNumber?: number;
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

// Seed players linked to existing teams
const initialPlayers: Player[] = [
  {
    id: "player-1",
    name: "مهدی جاوید",
    sport: "futsal",
    teamId: "team-1", // گیتی پسند
    position: "PIVO",
    status: "active",
    jerseyNumber: 10,
    goals: 15,
    goalsConceded: 0,
    yellowCards: 2,
    redCards: 0,
    cleanSheets: 0,
    matchesPlayed: 18,
    photo: "",
  },
  {
    id: "player-2",
    name: "قدرت بهادری",
    sport: "futsal",
    teamId: "team-2", // مس سونگون
    position: "ALA",
    status: "active",
    jerseyNumber: 9,
    goals: 11,
    goalsConceded: 0,
    yellowCards: 1,
    redCards: 0,
    cleanSheets: 0,
    matchesPlayed: 17,
    photo: "",
  },
  {
    id: "player-3",
    name: "دروازه‌بان نمونه",
    sport: "futsal",
    teamId: "team-2",
    position: "GK",
    status: "active",
    jerseyNumber: 1,
    goals: 0,
    goalsConceded: 22,
    yellowCards: 0,
    redCards: 0,
    cleanSheets: 6,
    matchesPlayed: 18,
    photo: "",
  },
  {
    id: "player-4",
    name: "ملی‌پوش ساحلی",
    sport: "beach-soccer",
    teamId: "team-7", // تیم ملی ایران
    position: "PIVO",
    status: "active",
    jerseyNumber: 11,
    goals: 20,
    goalsConceded: 0,
    yellowCards: 1,
    redCards: 0,
    cleanSheets: 0,
    matchesPlayed: 10,
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
  const [sportFilter, setSportFilter] = useState<SportType | "">("");
  const [teamFilter, setTeamFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState<PlayerPosition | "">("");
  const [statusFilter, setStatusFilter] = useState<PlayerStatus | "">("");
  const [sortOption, setSortOption] = useState<SortOption>("none");

  const allTeams: Team[] = mockTeams;

  // Derived helpers
  const filteredTeamsBySport = useMemo(
    () => (sportFilter ? allTeams.filter((t) => t.sport === sportFilter) : allTeams),
    [allTeams, sportFilter]
  );

  const teamOptionsForFilter = useMemo(
    () =>
      filteredTeamsBySport
        .filter((t) => t.status === "active")
        .map((t) => ({ id: t.id, name: t.name })),
    [filteredTeamsBySport]
  );

  const playersWithTeamData = useMemo(
    () =>
      players.map((p) => {
        const team = allTeams.find((t) => t.id === p.teamId);
        return {
          ...p,
          teamName: team?.name ?? "—",
          teamSport: team?.sport ?? p.sport,
        };
      }),
    [players, allTeams]
  );

  // Filtered and sorted players
  const filteredPlayers = useMemo(() => {
    let result = playersWithTeamData.filter((p) => {
      const matchesSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.teamName.toLowerCase().includes(search.toLowerCase());
      const matchesSport = sportFilter === "" || p.sport === sportFilter;
      const matchesTeam = teamFilter === "" || p.teamId === teamFilter;
      const matchesPosition = positionFilter === "" || p.position === positionFilter;
      const matchesStatus = statusFilter === "" || p.status === statusFilter;
      return matchesSearch && matchesSport && matchesTeam && matchesPosition && matchesStatus;
    });

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
  }, [playersWithTeamData, search, sportFilter, teamFilter, positionFilter, statusFilter, sortOption]);

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
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      if (editingPlayer) {
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === editingPlayer.id
              ? {
                  ...p,
                  ...formData,
                  id: p.id,
                }
              : p
          )
        );
        setToast({ message: "بازیکن با موفقیت ویرایش شد", type: "success" });
      } else {
        const newPlayer: Player = {
          ...formData,
          id: generateId(),
        };
        setPlayers((prev) => [...prev, newPlayer]);
        setToast({ message: "بازیکن جدید با موفقیت اضافه شد", type: "success" });
      }
      setIsModalOpen(false);
      setEditingPlayer(null);
    } catch {
      setToast({ message: "خطا در ذخیره اطلاعات", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPlayer) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      setPlayers((prev) => prev.filter((p) => p.id !== deletingPlayer.id));
      setToast({ message: "بازیکن با موفقیت حذف شد", type: "success" });
      setIsDeleteModalOpen(false);
      setDeletingPlayer(null);
    } catch {
      setToast({ message: "خطا در حذف بازیکن", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const columns: readonly Column<(typeof playersWithTeamData)[number]> = [
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
          <div className="flex flex-col">
            <span className="font-medium text-slate-900">{row.name}</span>
            <span className="text-[11px] text-slate-500">
              {row.jerseyNumber ? `شماره ${row.jerseyNumber}` : "بدون شماره"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "teamId",
      label: "تیم / ورزش",
      render: (row) => {
        const team = allTeams.find((t) => t.id === row.teamId);
        return (
          <div className="flex flex-col text-xs">
            <span className="font-medium text-slate-900">{team?.name ?? "—"}</span>
            <span className="text-slate-500">
              {row.sport === "futsal" ? "فوتسال" : "فوتبال ساحلی"}
            </span>
          </div>
        );
      },
    },
    {
      key: "position",
      label: "پست",
      render: (row) => (
        <Badge variant="info" className="text-[11px]">
          {positionLabel[row.position]}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "وضعیت",
      render: (row) => (
        <Badge variant={statusBadgeVariant[row.status]} className="text-[11px]">
          {statusLabel[row.status]}
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

  // Mobile card layout
  const renderMobileCards = () => (
    <div className="space-y-3 md:hidden">
      {filteredPlayers.map((player) => {
        const team = allTeams.find((t) => t.id === player.teamId);
        return (
          <div
            key={player.id}
            className="rounded-xl border border-[var(--border)] bg-white p-3 shadow-sm flex gap-3"
          >
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                {player.photo ? (
                  <img
                    src={player.photo}
                    alt={player.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-slate-500 text-sm font-semibold">
                    {player.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">
                    {player.name}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {team?.name ?? "—"} ·{" "}
                    {player.sport === "futsal" ? "فوتسال" : "فوتبال ساحلی"}
                  </span>
                </div>
                <Badge
                  variant={statusBadgeVariant[player.status]}
                  className="text-[10px]"
                >
                  {statusLabel[player.status]}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>{positionLabel[player.position]}</span>
                <span>بازی: {player.matchesPlayed}</span>
                <span>گل: {player.goals}</span>
                {player.position === "GK" && (
                  <span>گل خورده: {player.goalsConceded}</span>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => handleEditPlayer(player)}
                  className="rounded-lg border border-[var(--border)] px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => handleDeleteClick(player)}
                  className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[11px] text-red-600 hover:bg-red-100"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="مدیریت بازیکنان"
        subtitle="بازیکنان فوتسال و فوتبال ساحلی متصل به تیم‌های ثبت‌شده"
        action={
          <button
            onClick={handleAddPlayer}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
          >
            افزودن بازیکن
          </button>
        }
      />

      {/* فیلترها - طراحی بهتر و مرتب‌تر */}
      <div className="rounded-xl border border-[var(--border)] bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 border-b border-[var(--border)] px-4 py-3">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 className="text-sm font-semibold text-slate-900">فیلترها و جستجو</h3>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {/* Search - Full width on mobile, spans 2 columns on larger screens */}
            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                جستجو
              </label>
              <div className="relative">
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="نام بازیکن یا تیم..."
                  className="w-full rounded-lg border border-[var(--border)] pr-9 pl-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                />
              </div>
            </div>

            {/* Sport Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                ورزش
              </label>
              <select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value as SportType | "")}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand bg-white"
              >
                <option value="">همه ورزش‌ها</option>
                <option value="futsal">فوتسال</option>
                <option value="beach-soccer">فوتبال ساحلی</option>
              </select>
            </div>

            {/* Team Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                تیم
              </label>
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand bg-white"
              >
                <option value="">همه تیم‌ها</option>
                {teamOptionsForFilter.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Position Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                پست
              </label>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value as PlayerPosition | "")}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand bg-white"
              >
                <option value="">همه پست‌ها</option>
                <option value="GK">دروازه‌بان</option>
                <option value="FIXO">فیکسو</option>
                <option value="ALA">آلا</option>
                <option value="PIVO">پیوت</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                وضعیت
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as PlayerStatus | "")}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand bg-white"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="injured">مصدوم</option>
                <option value="suspended">محروم</option>
                <option value="inactive">غیرفعال</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                مرتب‌سازی
              </label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand bg-white"
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
      </div>

      {/* Mobile cards */}
      {renderMobileCards()}

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-[var(--border)] bg-white overflow-hidden shadow-sm">
        {filteredPlayers.length > 0 ? (
          <DataTable<typeof playersWithTeamData[number]>
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
                sport: editingPlayer.sport,
                teamId: editingPlayer.teamId,
                position: editingPlayer.position,
                jerseyNumber: editingPlayer.jerseyNumber,
                status: editingPlayer.status,
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
        teams={allTeams}
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
