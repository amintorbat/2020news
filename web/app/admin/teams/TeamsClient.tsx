"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { LeagueContextSelector } from "@/components/admin/LeagueContextSelector";
import { useLeagueContext } from "@/contexts/LeagueContext";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/admin/Badge";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmationModal";
import { Toast } from "@/components/admin/Toast";
import { TeamFormModal } from "@/components/admin/TeamFormModal";
import { Team, TeamFormValues } from "@/types/teams";
import { mockTeams } from "@/lib/admin/teamsData";
import { getAvailableSports, getSportConfig } from "@/types/matches";
import { EmptyState } from "@/components/admin/EmptyState";
import { generateId } from "@/lib/utils/id";

export default function TeamsClient() {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null>(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const availableSports = useMemo(() => {
    return getAvailableSports();
  }, []);

  const { selectedLeague } = useLeagueContext();

  // Filtered teams
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      // Filter by selected league's sport type
      if (selectedLeague) {
        const leagueSport = selectedLeague.sportType === "futsal" ? "futsal" : "beach-soccer";
        if (team.sport !== leagueSport) {
          return false;
        }
      }

      const matchesSearch =
        search === "" ||
        team.name.toLowerCase().includes(search.toLowerCase()) ||
        team.city?.toLowerCase().includes(search.toLowerCase());

      const matchesSport = sportFilter === "" || team.sport === sportFilter;
      const matchesStatus = statusFilter === "" || team.status === statusFilter;

      return matchesSearch && matchesSport && matchesStatus;
    });
  }, [teams, search, sportFilter, statusFilter, selectedLeague]);

  const handleAddClick = () => {
    setEditingTeam(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (team: Team) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (team: Team) => {
    setDeletingTeam(team);
    setIsDeleteModalOpen(true);
  };

  const handleSaveTeam = async (formData: TeamFormValues) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      if (editingTeam) {
        // Update existing team
        setTeams((prev) =>
          prev.map((t) =>
            t.id === editingTeam.id
              ? {
                  ...t,
                  ...formData,
                  id: t.id,
                  updatedAt: new Date().toISOString(),
                }
              : t
          )
        );
        setToast({ message: "تیم با موفقیت ویرایش شد", type: "success" });
      } else {
        // Add new team
        const newTeam: Team = {
          ...formData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setTeams((prev) => [...prev, newTeam]);
        setToast({ message: "تیم جدید با موفقیت اضافه شد", type: "success" });
      }
      setIsModalOpen(false);
      setEditingTeam(null);
    } catch (error) {
      setToast({ message: "خطا در ذخیره اطلاعات", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTeam) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      setTeams((prev) => prev.filter((t) => t.id !== deletingTeam.id));
      setToast({ message: "تیم با موفقیت حذف شد", type: "success" });
      setIsDeleteModalOpen(false);
      setDeletingTeam(null);
    } catch (error) {
      setToast({ message: "خطا در حذف تیم", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const columns: readonly Column<Team>[] = [
    {
      key: "logo",
      label: "لوگو",
      render: (row) => (
        <div className="flex items-center justify-center min-w-[50px]">
          {row.logo ? (
            <img
              src={row.logo}
              alt={row.name}
              className="h-10 w-10 rounded-lg object-cover"
              onError={(e) => {
                // Fallback to colored circle if image fails
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<div class="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-xs" style="background-color: ${row.primaryColor || "#3B82F6"}">${row.name.charAt(0)}</div>`;
                }
              }}
            />
          ) : (
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-xs"
              style={{ backgroundColor: row.primaryColor || "#3B82F6" }}
            >
              {row.name.charAt(0)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "نام تیم",
      render: (row) => (
        <div className="font-medium text-slate-900 min-w-[150px]">{row.name}</div>
      ),
    },
    {
      key: "sport",
      label: "ورزش",
      render: (row) => {
        const sportConfig = getSportConfig(row.sport);
        return (
          <div className="flex items-center gap-2">
            <span className="text-lg">{sportConfig.icon}</span>
            <span className="text-sm text-slate-700">{sportConfig.label}</span>
          </div>
        );
      },
    },
    {
      key: "city",
      label: "شهر",
      render: (row) => (
        <span className="text-sm text-slate-600">{row.city || "-"}</span>
      ),
    },
    {
      key: "status",
      label: "وضعیت",
      render: (row) => (
        <Badge variant={row.status === "active" ? "success" : "default"}>
          {row.status === "active" ? "فعال" : "غیرفعال"}
        </Badge>
      ),
    },
    {
      key: "id",
      label: "عملیات",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditClick(row)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            title="ویرایش"
            aria-label="ویرایش تیم"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
            title="حذف"
            aria-label="حذف تیم"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="مدیریت تیم‌ها"
        subtitle="مدیریت کامل تیم‌های فوتسال و فوتبال ساحلی"
        action={
          <button
            onClick={handleAddClick}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
          >
            افزودن تیم
          </button>
        }
      />

      {/* League Context Selector */}
      <LeagueContextSelector />

      {/* Filters */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-2">جستجو</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="نام تیم یا شهر..."
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            />
          </div>

          {/* Sport Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">ورزش</label>
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            >
              <option value="">همه ورزش‌ها</option>
              {availableSports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">وضعیت</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teams Table */}
      {filteredTeams.length > 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-white overflow-hidden shadow-sm">
          <DataTable<Team> columns={columns} data={filteredTeams} keyExtractor={(row) => row.id} />
        </div>
      ) : (
        <EmptyState
          title="هیچ تیمی یافت نشد"
          description={
            search || sportFilter || statusFilter
              ? "لطفاً فیلترها را تغییر دهید"
              : "برای شروع، اولین تیم را اضافه کنید"
          }
          action={
            !search && !sportFilter && !statusFilter ? (
              <button
                onClick={handleAddClick}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
              >
                افزودن تیم
              </button>
            ) : null
          }
        />
      )}

      {/* Add/Edit Modal */}
      <TeamFormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTeam(null);
        }}
        onSubmit={handleSaveTeam}
        initialValues={
          editingTeam
            ? {
                name: editingTeam.name,
                sport: editingTeam.sport,
                city: editingTeam.city,
                logo: editingTeam.logo,
                primaryColor: editingTeam.primaryColor,
                status: editingTeam.status,
              }
            : undefined
        }
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        title="حذف تیم"
        message={`آیا از حذف تیم "${deletingTeam?.name}" اطمینان دارید؟ این عمل قابل بازگشت نیست.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingTeam(null);
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
