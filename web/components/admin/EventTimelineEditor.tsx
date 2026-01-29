"use client";

import { useState, useMemo } from "react";
import { generateId } from "@/lib/utils/id";
import type { MatchEvent, MatchEventType } from "@/types/matches";
import { mockPlayers } from "@/lib/admin/playersData";

type EventTimelineEditorProps = {
  events: MatchEvent[];
  homeTeamId: string;
  awayTeamId: string;
  onEventsChange: (events: MatchEvent[]) => void;
  disabled?: boolean;
};

const eventTypeLabels: Record<MatchEventType, string> = {
  goal: "گل",
  "yellow-card": "کارت زرد",
  "red-card": "کارت قرمز",
  substitution: "تعویض",
  penalty: "پنالتی",
  "own-goal": "گل به خودی",
  "blue-card": "کارت آبی",
  timeout: "وقفه",
};

export function EventTimelineEditor({
  events,
  homeTeamId,
  awayTeamId,
  onEventsChange,
  disabled = false,
}: EventTimelineEditorProps) {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Get players for both teams
  const homeTeamPlayers = useMemo(() => {
    return mockPlayers.filter((p) => p.teamId === homeTeamId && p.status === "active");
  }, [homeTeamId]);

  const awayTeamPlayers = useMemo(() => {
    return mockPlayers.filter((p) => p.teamId === awayTeamId && p.status === "active");
  }, [awayTeamId]);

  // Sort events by minute
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => a.minute - b.minute);
  }, [events]);

  // Calculate stats from events
  const calculatedStats = useMemo(() => {
    const stats = {
      homeGoals: 0,
      awayGoals: 0,
      homeYellowCards: 0,
      homeRedCards: 0,
      awayYellowCards: 0,
      awayRedCards: 0,
    };

    events.forEach((event) => {
      if (event.type === "goal" || event.type === "penalty") {
        if (event.team === "home") stats.homeGoals++;
        else stats.awayGoals++;
      } else if (event.type === "own-goal") {
        if (event.team === "home") stats.awayGoals++;
        else stats.homeGoals++;
      } else if (event.type === "yellow-card") {
        if (event.team === "home") stats.homeYellowCards++;
        else stats.awayYellowCards++;
      } else if (event.type === "red-card") {
        if (event.team === "home") stats.homeRedCards++;
        else stats.awayRedCards++;
      }
    });

    return stats;
  }, [events]);

  const handleAddEvent = () => {
    setIsAddingEvent(true);
  };

  const handleSaveEvent = (eventData: Omit<MatchEvent, "id">) => {
    const newEvent: MatchEvent = {
      ...eventData,
      id: generateId(),
    };
    onEventsChange([...events, newEvent]);
    setIsAddingEvent(false);
  };

  const handleEditEvent = (eventId: string) => {
    setEditingEventId(eventId);
  };

  const handleUpdateEvent = (eventId: string, eventData: Partial<MatchEvent>) => {
    onEventsChange(
      events.map((e) => (e.id === eventId ? { ...e, ...eventData } : e))
    );
    setEditingEventId(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    onEventsChange(events.filter((e) => e.id !== eventId));
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Calculated Stats Summary */}
      <div className="rounded-lg border border-[var(--border)] bg-slate-50 p-4">
        <h4 className="mb-3 text-xs font-semibold text-slate-900">آمار محاسبه شده از رویدادها</h4>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-xs text-slate-600">گل میزبان</div>
            <div className="text-lg font-bold text-slate-900">{calculatedStats.homeGoals}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-600">گل میهمان</div>
            <div className="text-lg font-bold text-slate-900">{calculatedStats.awayGoals}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-600">کارت زرد میزبان</div>
            <div className="text-lg font-bold text-yellow-600">{calculatedStats.homeYellowCards}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-600">کارت قرمز میزبان</div>
            <div className="text-lg font-bold text-red-600">{calculatedStats.homeRedCards}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-600">کارت زرد میهمان</div>
            <div className="text-lg font-bold text-yellow-600">{calculatedStats.awayYellowCards}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-600">کارت قرمز میهمان</div>
            <div className="text-lg font-bold text-red-600">{calculatedStats.awayRedCards}</div>
          </div>
        </div>
      </div>

      {/* Add Event Button */}
      {!disabled && (
        <button
          type="button"
          onClick={handleAddEvent}
          className="w-full rounded-lg border-2 border-dashed border-[var(--border)] bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-brand hover:bg-slate-50"
        >
          + افزودن رویداد جدید
        </button>
      )}

      {/* Add Event Form */}
      {isAddingEvent && (
        <EventForm
          homeTeamPlayers={homeTeamPlayers}
          awayTeamPlayers={awayTeamPlayers}
          onSave={handleSaveEvent}
          onCancel={() => setIsAddingEvent(false)}
        />
      )}

      {/* Events Timeline */}
      <div className="space-y-2">
        {sortedEvents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border)] bg-slate-50/70 px-4 py-8 text-center">
            <p className="text-sm text-slate-600">هنوز رویدادی ثبت نشده است</p>
          </div>
        ) : (
          sortedEvents.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              homeTeamPlayers={homeTeamPlayers}
              awayTeamPlayers={awayTeamPlayers}
              isEditing={editingEventId === event.id}
              onEdit={() => handleEditEvent(event.id)}
              onUpdate={(data) => handleUpdateEvent(event.id, data)}
              onDelete={() => handleDeleteEvent(event.id)}
              onCancelEdit={() => setEditingEventId(null)}
              disabled={disabled}
            />
          ))
        )}
      </div>
    </div>
  );
}

type EventFormProps = {
  homeTeamPlayers: typeof mockPlayers;
  awayTeamPlayers: typeof mockPlayers;
  onSave: (event: Omit<MatchEvent, "id">) => void;
  onCancel: () => void;
  initialEvent?: MatchEvent;
};

function EventForm({
  homeTeamPlayers,
  awayTeamPlayers,
  onSave,
  onCancel,
  initialEvent,
}: EventFormProps) {
  const [minute, setMinute] = useState(initialEvent?.minute || 0);
  const [type, setType] = useState<MatchEventType>(initialEvent?.type || "goal");
  const [team, setTeam] = useState<"home" | "away">(initialEvent?.team || "home");
  const [playerId, setPlayerId] = useState(initialEvent?.playerId || "");
  const [assistPlayerId, setAssistPlayerId] = useState(initialEvent?.assistPlayerId || "");
  const [description, setDescription] = useState(initialEvent?.description || "");

  const availablePlayers = team === "home" ? homeTeamPlayers : awayTeamPlayers;
  const availableAssistPlayers = team === "home" ? homeTeamPlayers : awayTeamPlayers;

  const handleSubmit = () => {
    const selectedPlayer = availablePlayers.find((p) => p.id === playerId);
    const assistPlayer = assistPlayerId
      ? availableAssistPlayers.find((p) => p.id === assistPlayerId)
      : null;

    if (!selectedPlayer) return;

    onSave({
      type,
      minute,
      playerId,
      playerName: selectedPlayer.name,
      team,
      assistPlayerId: assistPlayer?.id,
      assistPlayerName: assistPlayer?.name,
      description: description || undefined,
    });
  };

  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm">
      <h4 className="mb-3 text-xs font-semibold text-slate-900">
        {initialEvent ? "ویرایش رویداد" : "رویداد جدید"}
      </h4>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-700">
              دقیقه <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              max={120}
              value={minute}
              onChange={(e) => setMinute(Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-700">
              نوع رویداد <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MatchEventType)}
              className="w-full rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              {Object.entries(eventTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-700">
            تیم <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setTeam("home");
                setPlayerId("");
                setAssistPlayerId("");
              }}
              className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                team === "home"
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-[var(--border)] text-slate-700 hover:bg-slate-50"
              }`}
            >
              میزبان
            </button>
            <button
              type="button"
              onClick={() => {
                setTeam("away");
                setPlayerId("");
                setAssistPlayerId("");
              }}
              className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                team === "away"
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-[var(--border)] text-slate-700 hover:bg-slate-50"
              }`}
            >
              میهمان
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-700">
            بازیکن <span className="text-red-500">*</span>
          </label>
          <select
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
          >
            <option value="">انتخاب بازیکن...</option>
            {availablePlayers.map((player) => (
              <option key={player.id} value={player.id}>
                {player.jerseyNumber ? `${player.jerseyNumber} - ` : ""}
                {player.name}
              </option>
            ))}
          </select>
        </div>

        {(type === "goal" || type === "penalty") && (
          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-700">
              پاس گل (اختیاری)
            </label>
            <select
              value={assistPlayerId}
              onChange={(e) => setAssistPlayerId(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="">بدون پاس گل</option>
              {availableAssistPlayers
                .filter((p) => p.id !== playerId)
                .map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.jerseyNumber ? `${player.jerseyNumber} - ` : ""}
                    {player.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-700">
            توضیحات (اختیاری)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="توضیحات اضافی..."
            className="w-full rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!playerId || minute < 0}
            className="flex-1 rounded-lg bg-brand px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ذخیره
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}

type EventItemProps = {
  event: MatchEvent;
  homeTeamPlayers: typeof mockPlayers;
  awayTeamPlayers: typeof mockPlayers;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (data: Partial<MatchEvent>) => void;
  onDelete: () => void;
  onCancelEdit: () => void;
  disabled?: boolean;
};

function EventItem({
  event,
  homeTeamPlayers,
  awayTeamPlayers,
  isEditing,
  onEdit,
  onUpdate,
  onDelete,
  onCancelEdit,
  disabled,
}: EventItemProps) {
  if (isEditing) {
    return (
      <EventForm
        homeTeamPlayers={homeTeamPlayers}
        awayTeamPlayers={awayTeamPlayers}
        initialEvent={event}
        onSave={(newEvent) => {
          onUpdate(newEvent);
          onCancelEdit();
        }}
        onCancel={onCancelEdit}
      />
    );
  }

  const eventColor = {
    goal: "bg-emerald-100 text-emerald-700 border-emerald-300",
    penalty: "bg-blue-100 text-blue-700 border-blue-300",
    "own-goal": "bg-red-100 text-red-700 border-red-300",
    "yellow-card": "bg-yellow-100 text-yellow-700 border-yellow-300",
    "red-card": "bg-red-100 text-red-700 border-red-300",
    "blue-card": "bg-blue-100 text-blue-700 border-blue-300",
    substitution: "bg-slate-100 text-slate-700 border-slate-300",
    timeout: "bg-purple-100 text-purple-700 border-purple-300",
  }[event.type];

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border p-3 ${eventColor} ${
        event.team === "away" ? "flex-row-reverse" : ""
      }`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 text-xs font-bold">
        {event.minute}'
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{eventTypeLabels[event.type]}</span>
          <span className="text-xs">-</span>
          <span className="text-xs font-semibold">{event.playerName}</span>
          {event.assistPlayerName && (
            <>
              <span className="text-xs">(پاس: {event.assistPlayerName})</span>
            </>
          )}
        </div>
        {event.description && (
          <div className="mt-1 text-[10px] text-slate-600">{event.description}</div>
        )}
      </div>
      {!disabled && (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="rounded px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-white/50"
          >
            ویرایش
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded px-2 py-1 text-[10px] font-medium text-red-700 hover:bg-white/50"
          >
            حذف
          </button>
        </div>
      )}
    </div>
  );
}
