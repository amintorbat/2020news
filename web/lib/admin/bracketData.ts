/**
 * ساختار براکت حذفی — ذخیره/بارگذاری و ساخت خالی
 */

import type { BracketMatchSlot, BracketRound, BracketStructure } from "@/types/bracket";

const STORAGE_KEY_PREFIX = "2020news_bracket_";

function storageKey(leagueId: string): string {
  return `${STORAGE_KEY_PREFIX}${leagueId}`;
}

function loadBracketFromStorage(leagueId: string): BracketStructure | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(leagueId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BracketStructure;
    return parsed && Array.isArray(parsed.rounds) && Array.isArray(parsed.slots) ? parsed : null;
  } catch {
    return null;
  }
}

function saveBracketToStorage(structure: BracketStructure): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(structure.leagueId), JSON.stringify(structure));
  } catch { /* ignore */ }
}

const ROUND_TITLES: Record<number, string> = {
  0: "یک‌شانزدهم نهایی",
  1: "یک‌هشتم نهایی",
  2: "یک‌چهارم نهایی",
  3: "نیمه‌نهایی",
  4: "فینال",
};

/** تولید براکت خالی برای ۸، ۱۶ یا ۳۲ تیم */
export function generateEmptyBracket(
  leagueId: string,
  teamCount: number,
  hasThirdPlaceMatch: boolean
): BracketStructure {
  const allSlots: BracketMatchSlot[] = [];
  const rounds: BracketRound[] = [];
  let slotIdCounter = 0;
  const nextId = () => `slot-${++slotIdCounter}`;

  let matchesInRound = teamCount / 2;
  const roundCount = teamCount <= 8 ? 3 : teamCount <= 16 ? 4 : 5;

  for (let r = 0; r < roundCount; r++) {
    const roundSlotIds: string[] = [];
    for (let i = 0; i < matchesInRound; i++) {
      const id = nextId();
      roundSlotIds.push(id);
      allSlots.push({
        id,
        roundIndex: r,
        slotIndex: i,
      });
    }
    rounds.push({
      index: r,
      title: ROUND_TITLES[r] ?? `دور ${r + 1}`,
      slotIds: roundSlotIds,
    });
    matchesInRound = Math.floor(matchesInRound / 2);
  }

  // Wire nextSlotId: دو مسابقه هر دور به یک سلول دور بعد می‌روند
  for (let r = 0; r < roundCount - 1; r++) {
    const roundSlots = allSlots.filter((s) => s.roundIndex === r);
    const nextRoundSlots = allSlots.filter((s) => s.roundIndex === r + 1);
    roundSlots.forEach((slot, i) => {
      const nextSlot = nextRoundSlots[Math.floor(i / 2)];
      if (nextSlot) slot.nextSlotId = nextSlot.id;
    });
  }

  if (hasThirdPlaceMatch) {
    const thirdId = nextId();
    allSlots.push({
      id: thirdId,
      roundIndex: roundCount,
      slotIndex: 0,
      isThirdPlace: true,
    });
    rounds.push({ index: roundCount, title: "مقام سوم", slotIds: [thirdId] });
  }

  return {
    leagueId,
    teamCount,
    rounds,
    slots: allSlots,
    hasThirdPlaceMatch,
    updatedAt: new Date().toISOString(),
  };
}

export function loadBracket(leagueId: string): BracketStructure | null {
  return loadBracketFromStorage(leagueId);
}

export function saveBracket(structure: BracketStructure): void {
  structure.updatedAt = new Date().toISOString();
  saveBracketToStorage(structure);
}

/** بارگذاری براکت یا ساخت خالی برای لیگ حذفی */
export function getBracketForLeague(
  leagueId: string,
  options: { teamCount?: number; hasThirdPlace?: boolean } = {}
): BracketStructure {
  const saved = loadBracketFromStorage(leagueId);
  if (saved) return saved;
  const teamCount = options.teamCount ?? 16;
  const hasThirdPlace = options.hasThirdPlace ?? true;
  return generateEmptyBracket(leagueId, teamCount, hasThirdPlace);
}

/** به‌روزرسانی یک سلول (مثلاً اختصاص مسابقه یا نتیجه) */
export function updateBracketSlot(
  leagueId: string,
  slotId: string,
  update: Partial<BracketMatchSlot>
): BracketStructure | null {
  const bracket = loadBracketFromStorage(leagueId);
  if (!bracket) return null;
  const idx = bracket.slots.findIndex((s) => s.id === slotId);
  if (idx < 0) return null;
  bracket.slots[idx] = { ...bracket.slots[idx], ...update };
  saveBracket(bracket);
  return bracket;
}
