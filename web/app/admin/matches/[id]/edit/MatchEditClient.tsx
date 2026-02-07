"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/admin/Badge";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Toast } from "@/components/admin/Toast";
import { PersianDatePicker } from "@/components/admin/PersianDatePicker";
import { PersianTimePicker } from "@/components/admin/PersianTimePicker";
import { Match, Competition, MatchEvent, MatchEventType, MatchStatus, getAvailableSports, getSportConfig, MATCH_EVENT_TYPE_LABELS } from "@/types/matches";
import { getPlayersByTeamAndSport, getPlayerById, type Player } from "@/lib/admin/playersData";
import { mockTeams } from "@/lib/admin/teamsData";
import { mockUsers } from "@/lib/admin/mock";
import { getAssignmentsForMatch } from "@/lib/admin/reporterAssignments";
import { getAssignmentStatus, type MatchReporterAssignment } from "@/types/reporter";

type Props = {
  match: Match;
  competitions: Competition[];
};

export default function MatchEditClient({ match: initialMatch, competitions }: Props) {
  const router = useRouter();
  const [match, setMatch] = useState<Match>(initialMatch);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const selectedCompetition = useMemo(() => {
    return competitions.find((c) => c.id === match.competitionId);
  }, [competitions, match.competitionId]);

  const availableSeasons = useMemo(() => {
    return selectedCompetition?.seasons || [];
  }, [selectedCompetition]);

  const sportConfig = useMemo(() => {
    return getSportConfig(match.sport);
  }, [match.sport]);

  const availableEventTypes = useMemo(() => {
    return sportConfig.allowedEventTypes;
  }, [sportConfig]);

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setToast({ message: "مسابقه با موفقیت ذخیره شد", type: "success" });
    setIsLoading(false);
    setTimeout(() => {
      router.push(`/admin/matches/${match.id}`);
    }, 1500);
  };

  // Get available players for home and away teams
  const homeTeamPlayers = useMemo(() => {
    if (!match.homeTeamId) return [];
    return getPlayersByTeamAndSport(match.homeTeamId, match.sport);
  }, [match.homeTeamId, match.sport]);

  const awayTeamPlayers = useMemo(() => {
    if (!match.awayTeamId) return [];
    return getPlayersByTeamAndSport(match.awayTeamId, match.sport);
  }, [match.awayTeamId, match.sport]);

  const handleAddEvent = () => {
    const newEvent: MatchEvent = {
      id: crypto.randomUUID(),
      type: "goal",
      minute: 0,
      playerId: "",
      playerName: "",
      team: "home",
    };
    setMatch((prev) => ({
      ...prev,
      events: [...prev.events, newEvent],
    }));
  };

  const handleUpdateEvent = (eventId: string, updates: Partial<MatchEvent>) => {
    setMatch((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === eventId ? { ...e, ...updates } : e)),
    }));
  };

  const handleRemoveEvent = (eventId: string) => {
    setMatch((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== eventId),
    }));
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="ویرایش مسابقه"
        subtitle={`${match.homeTeam} vs ${match.awayTeam}`}
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              انصراف
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">اطلاعات کلی</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">ورزش</label>
                <select
                  value={match.sport}
                  onChange={(e) => {
                    const newSport = e.target.value as Match["sport"];
                    const newSportConfig = getSportConfig(newSport);
                    setMatch((prev) => ({
                      ...prev,
                      sport: newSport,
                      competitionId: "",
                      seasonId: "",
                      // Filter events to only allowed types for new sport
                      events: prev.events.filter((e) => newSportConfig.allowedEventTypes.includes(e.type)),
                    }));
                  }}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                >
                  {getAvailableSports().map((sport) => (
                    <option key={sport.id} value={sport.id}>
                      {sport.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">مسابقات</label>
                <select
                  value={match.competitionId}
                  onChange={(e) => {
                    const comp = competitions.find((c) => c.id === e.target.value);
                    setMatch((prev) => ({
                      ...prev,
                      competitionId: e.target.value,
                      competitionName: comp?.name || "",
                      seasonId: comp?.seasons[0]?.id || "",
                      seasonName: comp?.seasons[0]?.name || "",
                    }));
                  }}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                >
                  <option value="">انتخاب مسابقات</option>
                  {competitions
                    .filter((c) => c.sport === match.sport)
                    .map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">فصل</label>
                <select
                  value={match.seasonId}
                  onChange={(e) => {
                    const season = availableSeasons.find((s) => s.id === e.target.value);
                    setMatch((prev) => ({
                      ...prev,
                      seasonId: e.target.value,
                      seasonName: season?.name || "",
                    }));
                  }}
                  disabled={!match.competitionId}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand disabled:opacity-50"
                >
                  <option value="">انتخاب فصل</option>
                  {availableSeasons.map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">وضعیت</label>
                <select
                  value={match.status}
                  onChange={(e) =>
                    setMatch((prev) => ({
                      ...prev,
                      status: e.target.value as MatchStatus,
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                >
                  <option value="scheduled">برنامه‌ریزی شده</option>
                  <option value="live">زنده</option>
                  <option value="finished">پایان یافته</option>
                  <option value="postponed">تعویق یافته</option>
                  <option value="cancelled">لغو شده</option>
                </select>
              </div>
            </div>
          </div>

          {/* Teams and Score */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">تیم‌ها و نتیجه</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">تیم میزبان</label>
                <input
                  type="text"
                  value={match.homeTeam}
                  onChange={(e) => setMatch((prev) => ({ ...prev, homeTeam: e.target.value }))}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">تیم میهمان</label>
                <input
                  type="text"
                  value={match.awayTeam}
                  onChange={(e) => setMatch((prev) => ({ ...prev, awayTeam: e.target.value }))}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">گل میزبان</label>
                <input
                  type="number"
                  min={0}
                  value={match.homeScore ?? ""}
                  onChange={(e) =>
                    setMatch((prev) => ({
                      ...prev,
                      homeScore: e.target.value === "" ? null : parseInt(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">گل میهمان</label>
                <input
                  type="number"
                  min={0}
                  value={match.awayScore ?? ""}
                  onChange={(e) =>
                    setMatch((prev) => ({
                      ...prev,
                      awayScore: e.target.value === "" ? null : parseInt(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                />
              </div>
            </div>
          </div>

          {/* Date, Time, Venue */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">زمان و مکان</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">تاریخ</label>
                <PersianDatePicker
                  value={match.date}
                  onChange={(value) => setMatch((prev) => ({ ...prev, date: value }))}
                  placeholder="انتخاب تاریخ شمسی"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">ساعت</label>
                <PersianTimePicker
                  value={match.time}
                  onChange={(value) => setMatch((prev) => ({ ...prev, time: value }))}
                  placeholder="انتخاب ساعت"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">مکان</label>
                <input
                  type="text"
                  value={match.venue}
                  onChange={(e) => setMatch((prev) => ({ ...prev, venue: e.target.value }))}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                />
              </div>
            </div>
          </div>

          {/* Match Events */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">رویدادهای مسابقه</h3>
              <button
                onClick={handleAddEvent}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
              >
                افزودن رویداد
              </button>
            </div>
            <div className="space-y-3">
              {match.events.length > 0 ? (
                match.events
                  .sort((a, b) => a.minute - b.minute)
                  .map((event) => (
                  <MatchEventEditor
                    key={event.id}
                    event={event}
                    homeTeam={match.homeTeam}
                    awayTeam={match.awayTeam}
                      homeTeamId={match.homeTeamId}
                      awayTeamId={match.awayTeamId}
                      homeTeamPlayers={homeTeamPlayers}
                      awayTeamPlayers={awayTeamPlayers}
                    maxMinute={sportConfig.matchDuration}
                    onUpdate={(updates) => handleUpdateEvent(event.id, updates)}
                    onRemove={() => handleRemoveEvent(event.id)}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">هیچ رویدادی ثبت نشده است</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assigned Reporters */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">خبرنگاران اختصاص‌یافته</h3>
            <div className="space-y-3">
              {getAssignmentsForMatch(match.id).length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  خبرنگاری اختصاص نیافته است
                </p>
              ) : (
                getAssignmentsForMatch(match.id).map((assignment) => (
                  <div
                    key={assignment.id}
                    className="rounded-lg border border-[var(--border)] p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900">
                        {assignment.userName}
                      </span>
                      <Badge
                        variant={
                          assignment.status === "active"
                            ? "success"
                            : assignment.status === "expired"
                            ? "danger"
                            : "default"
                        }
                      >
                        {assignment.status === "active"
                          ? "فعال"
                          : assignment.status === "expired"
                          ? "منقضی شده"
                          : assignment.status === "scheduled"
                          ? "زمان‌بندی شده"
                          : "غیرفعال"}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-500 space-y-1">
                      <div>ایمیل: {assignment.userEmail}</div>
                      <div>
                        از: {new Date(assignment.startDateTime).toLocaleString("fa-IR")}
                      </div>
                      <div>
                        تا: {new Date(assignment.endDateTime).toLocaleString("fa-IR")}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">اطلاعات تکمیلی</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">داور</label>
                <input
                  type="text"
                  value={match.referee || ""}
                  onChange={(e) => setMatch((prev) => ({ ...prev, referee: e.target.value }))}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">تعداد تماشاگر</label>
                <input
                  type="number"
                  min={0}
                  value={match.attendance || ""}
                  onChange={(e) =>
                    setMatch((prev) => ({
                      ...prev,
                      attendance: e.target.value === "" ? undefined : parseInt(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
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

// Match Event Editor Component
function MatchEventEditor({
  event,
  homeTeam,
  awayTeam,
  homeTeamId,
  awayTeamId,
  homeTeamPlayers,
  awayTeamPlayers,
  maxMinute,
  onUpdate,
  onRemove,
}: {
  event: MatchEvent;
  homeTeam: string;
  awayTeam: string;
  homeTeamId?: string;
  awayTeamId?: string;
  homeTeamPlayers: Player[];
  awayTeamPlayers: Player[];
  maxMinute: number;
  onUpdate: (updates: Partial<MatchEvent>) => void;
  onRemove: () => void;
}) {
  // Only show Goal, Yellow Card, Red Card (Assist is handled via assistPlayerId in goal events)
  const allowedEventTypes: MatchEventType[] = ["goal", "yellow-card", "red-card"];
  
  const eventTypes = allowedEventTypes.map((type) => ({
    value: type,
    label: MATCH_EVENT_TYPE_LABELS[type],
  }));

  const currentTeamPlayers = event.team === "home" ? homeTeamPlayers : awayTeamPlayers;
  const currentTeamName = event.team === "home" ? homeTeam : awayTeam;

  // Get available players for assist (same team as goal scorer)
  const assistPlayers = event.type === "goal" ? currentTeamPlayers : [];

  const handlePlayerChange = (playerId: string) => {
    const player = currentTeamPlayers.find((p) => p.id === playerId);
    onUpdate({
      playerId: playerId || "",
      playerName: player?.name || "",
    });
  };

  const handleAssistChange = (playerId: string) => {
    const player = assistPlayers.find((p) => p.id === playerId);
    onUpdate({
      assistPlayerId: playerId || undefined,
      assistPlayerName: player?.name || undefined,
    });
  };

  return (
    <div className="p-3 sm:p-4 border border-[var(--border)] rounded-lg bg-slate-50 space-y-3">
      {/* Mobile: Stack vertically, Desktop: Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">نوع رویداد</label>
          <select
            value={event.type}
            onChange={(e) => {
              const newType = e.target.value as MatchEventType;
              onUpdate({ type: newType });
              // Clear assist if not a goal
              if (newType !== "goal") {
                onUpdate({ assistPlayerId: undefined, assistPlayerName: undefined });
              }
            }}
            className="w-full rounded-lg border border-[var(--border)] px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            {eventTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">دقیقه</label>
          <input
            type="number"
            min={0}
            max={maxMinute}
            value={event.minute}
            onChange={(e) => onUpdate({ minute: parseInt(e.target.value) || 0 })}
            className="w-full rounded-lg border border-[var(--border)] px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">تیم</label>
          <select
            value={event.team}
            onChange={(e) => {
              const newTeam = e.target.value as "home" | "away";
              onUpdate({
                team: newTeam,
                playerId: "",
                playerName: "",
                assistPlayerId: undefined,
                assistPlayerName: undefined,
              });
            }}
            className="w-full rounded-lg border border-[var(--border)] px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            <option value="home">{homeTeam}</option>
            <option value="away">{awayTeam}</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={onRemove}
            className="w-full rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            حذف
          </button>
        </div>
      </div>

      {/* Player Selection */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">بازیکن</label>
        {currentTeamPlayers.length > 0 ? (
          <select
            value={event.playerId || ""}
            onChange={(e) => handlePlayerChange(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            <option value="">انتخاب بازیکن</option>
            {currentTeamPlayers.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} {player.jerseyNumber ? `(${player.jerseyNumber})` : ""}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={event.playerName}
            onChange={(e) => onUpdate({ playerName: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand/50"
            placeholder="نام بازیکن (در صورت عدم وجود در لیست)"
          />
        )}
      </div>

      {/* Assist Selection (only for goals) */}
      {event.type === "goal" && assistPlayers.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">پاس گل (اختیاری)</label>
          <select
            value={event.assistPlayerId || ""}
            onChange={(e) => handleAssistChange(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            <option value="">بدون پاس گل</option>
            {assistPlayers
              .filter((p) => p.id !== event.playerId)
              .map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name} {player.jerseyNumber ? `(${player.jerseyNumber})` : ""}
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  );
}
