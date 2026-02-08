"use client";

import { useMemo } from "react";
import type { BracketStructure, BracketMatchSlot } from "@/types/bracket";

const SLOT_WIDTH = 156;
const SLOT_HEIGHT = 52;
const ROW_GAP = 14;
const COL_GAP = 28;
const CONNECTOR_STEP = 20;
const TITLE_HEIGHT = 26;

type BracketViewProps = {
  bracket: BracketStructure;
  editable?: boolean;
  onSlotClick?: (slot: BracketMatchSlot) => void;
};

function SlotCard({
  slot,
  editable,
  onSlotClick,
  style,
}: {
  slot: BracketMatchSlot;
  editable?: boolean;
  onSlotClick?: (slot: BracketMatchSlot) => void;
  style: { top: number; left: number };
}) {
  const hasScore =
    slot.homeScore != null && slot.awayScore != null;

  return (
    <div
      role={editable ? "button" : undefined}
      onClick={editable && onSlotClick ? () => onSlotClick(slot) : undefined}
      className={`
        absolute rounded-lg border-2 border-slate-200 bg-white p-2 shadow-sm
        ${editable ? "cursor-pointer hover:border-brand hover:bg-brand/5 hover:shadow" : ""}
      `}
      dir="rtl"
      style={{
        width: SLOT_WIDTH,
        height: SLOT_HEIGHT,
        top: style.top,
        left: style.left,
      }}
    >
      {slot.isThirdPlace ? (
        <div className="text-center text-xs text-slate-500 leading-tight py-1">
          مقام سوم
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center gap-1 text-xs">
            <span className="truncate flex-1 font-medium text-slate-800">
              {slot.homeTeamName || "—"}
            </span>
            {hasScore && (
              <span className="shrink-0 font-bold text-slate-900 tabular-nums">
                {slot.homeScore} – {slot.awayScore}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center gap-1 text-xs mt-0.5">
            <span className="truncate flex-1 text-slate-600">
              {slot.awayTeamName || "—"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/** محاسبه موقعیت عمودی مرکز هر سلول در یک دور (ساختار درختی) */
function slotCenterY(roundIndex: number, slotIndex: number, numFirstRoundSlots: number): number {
  const n = numFirstRoundSlots;
  const power = Math.pow(2, roundIndex);
  const centerRow = power * slotIndex + (power - 1) / 2;
  const rowUnit = SLOT_HEIGHT + ROW_GAP;
  return centerRow * rowUnit + SLOT_HEIGHT / 2;
}

export function BracketView({ bracket, editable, onSlotClick }: BracketViewProps) {
  const { rounds, slots: allSlots, hasThirdPlaceMatch } = bracket;

  const mainRounds = useMemo(
    () => (hasThirdPlaceMatch ? rounds.slice(0, -1) : rounds),
    [rounds, hasThirdPlaceMatch]
  );
  const thirdPlaceRound = useMemo(
    () => (hasThirdPlaceMatch ? rounds[rounds.length - 1] : null),
    [rounds, hasThirdPlaceMatch]
  );

  const numFirstRound = mainRounds[0]?.slotIds.length ?? 0;
  const totalHeight = numFirstRound * (SLOT_HEIGHT + ROW_GAP) - ROW_GAP;
  const colWidth = SLOT_WIDTH + COL_GAP;
  const totalMainWidth = mainRounds.length * colWidth;
  const thirdPlaceY = TITLE_HEIGHT + totalHeight + ROW_GAP * 2;
  const totalHeightWithThird = thirdPlaceRound
    ? thirdPlaceY + SLOT_HEIGHT + ROW_GAP
    : TITLE_HEIGHT + totalHeight;

  const slotPositions = useMemo(() => {
    const map = new Map<
      string,
      { roundIndex: number; slotIndex: number; centerY: number; left: number }
    >();
    mainRounds.forEach((round, r) => {
      const colLeft = (mainRounds.length - 1 - r) * colWidth;
      const slotLeft = colLeft + COL_GAP / 2;
      round.slotIds.forEach((id, i) => {
        const centerY = TITLE_HEIGHT + slotCenterY(r, i, numFirstRound);
        map.set(id, { roundIndex: r, slotIndex: i, centerY, left: slotLeft });
      });
    });
    if (thirdPlaceRound) {
      thirdPlaceRound.slotIds.forEach((id) => {
        map.set(id, {
          roundIndex: mainRounds.length,
          slotIndex: 0,
          centerY: thirdPlaceY + SLOT_HEIGHT / 2,
          left: (mainRounds.length - 1) * colWidth / 2 + COL_GAP / 2,
        });
      });
    }
    return map;
  }, [mainRounds, thirdPlaceRound, numFirstRound, colWidth, thirdPlaceY]);

  const connectorPaths = useMemo(() => {
    const list: { path: string; hasArrow: boolean }[] = [];
    const step = CONNECTOR_STEP;
    for (let r = 0; r < mainRounds.length - 1; r++) {
      const nextRound = mainRounds[r + 1];
      const round = mainRounds[r];
      const nextRoundSlots = nextRound.slotIds.length;
      for (let j = 0; j < nextRoundSlots; j++) {
        const i0 = j * 2;
        const i1 = j * 2 + 1;
        const id0 = round.slotIds[i0];
        const id1 = round.slotIds[i1];
        const nextId = nextRound.slotIds[j];
        if (!id0 || !id1 || !nextId) continue;
        const from0 = slotPositions.get(id0);
        const from1 = slotPositions.get(id1);
        const to = slotPositions.get(nextId);
        if (!from0 || !from1 || !to) continue;
        const exitX = from0.left;
        const nextRight = to.left + SLOT_WIDTH;
        const midY = (from0.centerY + from1.centerY) / 2;
        list.push({
          path: [
            `M ${exitX} ${from0.centerY}`,
            `L ${exitX - step} ${from0.centerY}`,
            `L ${exitX - step} ${midY}`,
          ].join(" "),
          hasArrow: false,
        });
        list.push({
          path: [
            `M ${exitX} ${from1.centerY}`,
            `L ${exitX - step} ${from1.centerY}`,
            `L ${exitX - step} ${midY}`,
          ].join(" "),
          hasArrow: false,
        });
        list.push({
          path: [
            `M ${exitX - step} ${midY}`,
            `L ${nextRight + step} ${midY}`,
            `L ${nextRight + step} ${to.centerY}`,
            `L ${nextRight} ${to.centerY}`,
          ].join(" "),
          hasArrow: true,
        });
      }
    }
    return list;
  }, [mainRounds, slotPositions]);

  return (
    <div className="w-full overflow-x-auto overflow-y-auto" dir="rtl">
      <div
        className="relative min-h-[200px]"
        style={{
          minWidth: totalMainWidth,
          height: totalHeightWithThird,
        }}
      >
        {/* لایه خطوط اتصال و فلش */}
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          width={totalMainWidth}
          height={totalHeightWithThird}
          style={{ left: 0, top: 0 }}
        >
          <defs>
            <marker
              id="bracket-arrow"
              markerWidth="10"
              markerHeight="8"
              refX="9"
              refY="4"
              orient="auto"
            >
              <path d="M0 0 L10 4 L0 8 Z" fill="var(--border, #94a3b8)" />
            </marker>
          </defs>
          {connectorPaths.map((item, i) => (
            <path
              key={i}
              d={item.path}
              fill="none"
              stroke="var(--border, #94a3b8)"
              strokeWidth="1.5"
              markerEnd={item.hasArrow ? "url(#bracket-arrow)" : undefined}
            />
          ))}
        </svg>

        {/* کارت‌های مسابقه */}
        {mainRounds.map((round, r) => {
          const colLeft = (mainRounds.length - 1 - r) * colWidth;
          return (
            <div
              key={round.index}
              className="absolute flex flex-col"
              style={{
                right: r * colWidth,
                top: 0,
                width: SLOT_WIDTH + COL_GAP,
                height: totalHeight,
              }}
            >
              <h3 className="text-[11px] font-bold text-slate-500 mb-1.5 px-1">
                {round.title}
              </h3>
              {round.slotIds.map((id, i) => {
                const slot = allSlots.find((s) => s.id === id);
                if (!slot) return null;
                const centerY = slotCenterY(r, i, numFirstRound);
                const top = centerY - SLOT_HEIGHT / 2;
                return (
                  <div
                    key={id}
                    className="absolute"
                    style={{
                      top: TITLE_HEIGHT + top,
                      right: COL_GAP / 2,
                      width: SLOT_WIDTH,
                      height: SLOT_HEIGHT,
                    }}
                  >
                    <SlotCard
                      slot={slot}
                      editable={editable}
                      onSlotClick={onSlotClick}
                      style={{ top: 0, left: 0 }}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* مسابقه مقام سوم */}
        {thirdPlaceRound && (
          <div
            className="absolute"
            style={{
              right: totalMainWidth / 2 - SLOT_WIDTH / 2,
              top: thirdPlaceY,
              width: SLOT_WIDTH,
              height: SLOT_HEIGHT,
            }}
          >
            {thirdPlaceRound.slotIds.map((id) => {
              const slot = allSlots.find((s) => s.id === id);
              if (!slot) return null;
              return (
                <SlotCard
                  key={id}
                  slot={slot}
                  editable={editable}
                  onSlotClick={onSlotClick}
                  style={{ top: 0, left: 0 }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
