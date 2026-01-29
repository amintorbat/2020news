"use client";

import { useState, useMemo } from "react";
import { generateId } from "@/lib/utils/id";
import { mockTeams } from "@/lib/admin/teamsData";
import type { Team } from "@/types/teams";
import type { LeagueSportType } from "@/types/leagues";

export interface LeagueGroup {
  id: string;
  name: string; // A, B, C, etc.
  teamIds: string[];
}

type GroupStageManagerProps = {
  numberOfTeams: number;
  sportType: LeagueSportType;
  groups: LeagueGroup[];
  onGroupsChange: (groups: LeagueGroup[]) => void;
  disabled?: boolean;
};

export function GroupStageManager({
  numberOfTeams,
  sportType,
  groups,
  onGroupsChange,
  disabled = false,
}: GroupStageManagerProps) {
  const [draggedTeamId, setDraggedTeamId] = useState<string | null>(null);
  const [draggedFromGroupId, setDraggedFromGroupId] = useState<string | null>(null);

  // Get available teams for this sport
  const availableTeams = useMemo(() => {
    return mockTeams.filter(
      (t) => t.sport === (sportType === "futsal" ? "futsal" : "beach-soccer") && t.status === "active"
    );
  }, [sportType]);

  // Get teams not in any group
  const unassignedTeams = useMemo(() => {
    const assignedTeamIds = new Set(groups.flatMap((g) => g.teamIds));
    return availableTeams.filter((t) => !assignedTeamIds.has(t.id));
  }, [availableTeams, groups]);

  // Calculate teams per group
  const teamsPerGroup = useMemo(() => {
    if (groups.length === 0) return 0;
    return Math.floor(numberOfTeams / groups.length);
  }, [numberOfTeams, groups.length]);

  const handleAddGroup = () => {
    const groupNames = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const nextName = groupNames[groups.length] || String.fromCharCode(65 + groups.length);
    onGroupsChange([
      ...groups,
      {
        id: generateId(),
        name: nextName,
        teamIds: [],
      },
    ]);
  };

  const handleDeleteGroup = (groupId: string) => {
    onGroupsChange(groups.filter((g) => g.id !== groupId));
  };

  const handleAddTeamToGroup = (groupId: string, teamId: string) => {
    onGroupsChange(
      groups.map((g) =>
        g.id === groupId
          ? { ...g, teamIds: [...g.teamIds, teamId] }
          : g
      )
    );
  };

  const handleRemoveTeamFromGroup = (groupId: string, teamId: string) => {
    onGroupsChange(
      groups.map((g) =>
        g.id === groupId
          ? { ...g, teamIds: g.teamIds.filter((id) => id !== teamId) }
          : g
      )
    );
  };

  const handleDragStart = (teamId: string, fromGroupId: string | null) => {
    setDraggedTeamId(teamId);
    setDraggedFromGroupId(fromGroupId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetGroupId: string | null) => {
    if (!draggedTeamId) return;

    if (draggedFromGroupId) {
      // Remove from source group
      const updatedGroups = groups.map((g) =>
        g.id === draggedFromGroupId
          ? { ...g, teamIds: g.teamIds.filter((id) => id !== draggedTeamId) }
          : g
      );

      // Add to target group
      if (targetGroupId) {
        onGroupsChange(
          updatedGroups.map((g) =>
            g.id === targetGroupId
              ? { ...g, teamIds: [...g.teamIds, draggedTeamId] }
              : g
          )
        );
      } else {
        // Dropped in unassigned area
        onGroupsChange(updatedGroups);
      }
    } else {
      // From unassigned
      if (targetGroupId) {
        onGroupsChange(
          groups.map((g) =>
            g.id === targetGroupId
              ? { ...g, teamIds: [...g.teamIds, draggedTeamId] }
              : g
          )
        );
      }
    }

    setDraggedTeamId(null);
    setDraggedFromGroupId(null);
  };

  const getTeamById = (teamId: string): Team | undefined => {
    return availableTeams.find((t) => t.id === teamId);
  };

  // Validation
  const totalAssignedTeams = groups.reduce((sum, g) => sum + g.teamIds.length, 0);
  const isValid = totalAssignedTeams === numberOfTeams;
  const isBalanced = groups.every((g) => g.teamIds.length === teamsPerGroup || groups.length === 0);

  return (
    <div className="space-y-4" dir="rtl">
      {/* Header with Add Group Button */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">مدیریت گروه‌ها</h4>
          <p className="mt-1 text-[11px] text-slate-500">
            تیم‌ها را به گروه‌ها اختصاص دهید. می‌توانید با drag & drop تیم‌ها را جابجا کنید.
          </p>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={handleAddGroup}
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            + افزودن گروه
          </button>
        )}
      </div>

      {/* Validation Status */}
      <div className="rounded-lg border border-[var(--border)] bg-slate-50 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">تیم‌های اختصاص‌یافته:</span>
          <span className={`font-semibold ${isValid ? "text-emerald-700" : "text-amber-700"}`}>
            {totalAssignedTeams} / {numberOfTeams}
          </span>
        </div>
        {groups.length > 0 && (
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-600">تیم‌ها در هر گروه:</span>
            <span className={`font-semibold ${isBalanced ? "text-emerald-700" : "text-amber-700"}`}>
              {teamsPerGroup} (متوسط)
            </span>
          </div>
        )}
        {!isValid && (
          <p className="mt-2 text-[11px] text-amber-600">
            ⚠️ باید تمام {numberOfTeams} تیم را به گروه‌ها اختصاص دهید.
          </p>
        )}
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="rounded-lg border-2 border-[var(--border)] bg-white p-3 shadow-sm"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(group.id)}
          >
            <div className="mb-2 flex items-center justify-between">
              <h5 className="text-sm font-semibold text-slate-900">گروه {group.name}</h5>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleDeleteGroup(group.id)}
                  className="rounded px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-50"
                >
                  حذف
                </button>
              )}
            </div>
            <div className="mb-2 text-[10px] text-slate-500">
              {group.teamIds.length} تیم
            </div>
            <div className="min-h-[100px] space-y-1.5 rounded border border-dashed border-[var(--border)] bg-slate-50/50 p-2">
              {group.teamIds.length === 0 ? (
                <div className="py-4 text-center text-[11px] text-slate-400">
                  تیمی اختصاص نیافته
                </div>
              ) : (
                group.teamIds.map((teamId) => {
                  const team = getTeamById(teamId);
                  if (!team) return null;
                  return (
                    <div
                      key={teamId}
                      draggable={!disabled}
                      onDragStart={() => handleDragStart(teamId, group.id)}
                      className="flex items-center justify-between rounded border border-[var(--border)] bg-white px-2 py-1.5 text-xs hover:bg-slate-50 cursor-move"
                    >
                      <span className="font-medium text-slate-900">{team.name}</span>
                      {!disabled && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTeamFromGroup(group.id, teamId)}
                          className="rounded px-1.5 py-0.5 text-[10px] text-red-600 hover:bg-red-50"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            {!disabled && (
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddTeamToGroup(group.id, e.target.value);
                    e.target.value = "";
                  }
                }}
                className="mt-2 w-full rounded border border-[var(--border)] bg-white px-2 py-1 text-[11px] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                <option value="">افزودن تیم...</option>
                {availableTeams
                  .filter((t) => !group.teamIds.includes(t.id))
                  .map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} {team.city ? `(${team.city})` : ""}
                    </option>
                  ))}
              </select>
            )}
          </div>
        ))}
      </div>

      {/* Unassigned Teams */}
      {unassignedTeams.length > 0 && (
        <div
          className="rounded-lg border-2 border-dashed border-[var(--border)] bg-slate-50 p-4"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(null)}
        >
          <h5 className="mb-2 text-sm font-semibold text-slate-900">
            تیم‌های اختصاص نیافته ({unassignedTeams.length})
          </h5>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {unassignedTeams.map((team) => (
              <div
                key={team.id}
                draggable={!disabled}
                onDragStart={() => handleDragStart(team.id, null)}
                className="flex items-center justify-center rounded border border-[var(--border)] bg-white px-2 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-move"
              >
                {team.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {groups.length === 0 && (
        <div className="rounded-lg border border-dashed border-[var(--border)] bg-slate-50/70 px-4 py-8 text-center">
          <p className="text-sm text-slate-600">هنوز گروهی ایجاد نشده است</p>
          <p className="mt-1 text-[11px] text-slate-500">
            برای شروع، دکمه "افزودن گروه" را بزنید
          </p>
        </div>
      )}
    </div>
  );
}
