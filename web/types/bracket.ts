/**
 * فرمت مسابقات و ساختار براکت حذفی
 * Part 3 (Match Formats) + Part 4 (Visual Brackets)
 */

export type CompetitionFormat =
  | "league"           // لیگ دوره‌ای
  | "knockout"         // حذفی ساده
  | "group_stage"      // مرحله گروهی تنها
  | "group_knockout"   // گروه + حذفی (سبک جام جهانی)
  | "playoff"          // پلی‌آف
  | "classification";  // مسابقات رده‌بندی

/** یک مسابقه در براکت (یک سلول در نمودار) */
export interface BracketMatchSlot {
  id: string;
  /** شاخص دور: 0 = یک‌شانزدهم، 1 = یک‌هشتم، ... آخر = فینال */
  roundIndex: number;
  /** جایگاه در آن دور (۰، ۱، ۲، ...) */
  slotIndex: number;
  /** شناسه مسابقه واقعی (از matches) اگر اختصاص داده شده */
  matchId?: string;
  /** تیم میزبان (شناسه یا نام) */
  homeTeamId?: string;
  homeTeamName?: string;
  /** تیم مهمان */
  awayTeamId?: string;
  awayTeamName?: string;
  /** نتیجه (برای نمایش در براکت) */
  homeScore?: number | null;
  awayScore?: number | null;
  /** برنده به این سلول می‌رود: id سلول بعدی */
  nextSlotId?: string;
  /** برای مسابقه رده‌بندی (مقام سوم) */
  isThirdPlace?: boolean;
}

/** یک دور در براکت (مثلاً یک‌هشتم نهایی) */
export interface BracketRound {
  index: number;
  title: string;   // مثلاً "یک‌هشتم نهایی"
  slotIds: string[];
}

/** ساختار کامل براکت یک لیگ/جام حذفی */
export interface BracketStructure {
  leagueId: string;
  /** تعداد تیم‌های ورودی (۸، ۱۶، ۳۲) */
  teamCount: number;
  rounds: BracketRound[];
  slots: BracketMatchSlot[];
  hasThirdPlaceMatch: boolean;
  updatedAt: string;
}

/** گروه در مرحله گروهی */
export interface GroupDefinition {
  id: string;
  name: string;   // مثلاً "گروه A"
  teamIds: string[];
}

/** تنظیمات صعود از گروه به حذفی (برای group_knockout) */
export interface GroupAdvancementRule {
  groupId: string;
  /** رتبه‌هایی که صعود می‌کنند (مثلاً [1, 2] = اول و دوم) */
  advancingPositions: number[];
}

export const FORMAT_LABELS: Record<CompetitionFormat, string> = {
  league: "لیگ دوره‌ای",
  knockout: "حذفی",
  group_stage: "مرحله گروهی",
  group_knockout: "گروه + حذفی",
  playoff: "پلی‌آف",
  classification: "مسابقات رده‌بندی",
};
