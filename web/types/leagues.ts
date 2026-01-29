// هسته‌ی جدید مدل لیگ در پنل ادمین
// این مدل فقط روی فوتسال و فوتبال ساحلی تمرکز دارد
// و آماده‌ی گسترش به سایر رشته‌ها در آینده است.

export type LeagueSportType = "futsal" | "beach_soccer";

export type LeagueCompetitionType = "league" | "knockout";

export type LeagueStatus = "active" | "draft" | "archived";

/**
 * سیستم امتیازدهی برای لیگ‌های دوره‌ای
 */
export interface PointsSystem {
  winPoints: number;
  drawPoints: number;
  lossPoints: number;
}

export interface League {
  id: string;
  /**
   * عنوان مسابقات (فارسی)
   * مثال: "لیگ برتر فوتسال ایران" یا "جام حذفی فوتسال"
   */
  title: string;
  sportType: LeagueSportType;
  competitionType: LeagueCompetitionType;

  /**
   * فصل بر اساس سال شمسی
   * مثال: "۱۴۰۳-۱۴۰۴" یا "۱۴۰۳"
   */
  season: string;

  /**
   * تعداد تیم‌های حاضر در مسابقات
   */
  numberOfTeams: number;

  status: LeagueStatus;

  /**
   * بازه‌ی زمانی برگزاری مسابقات
   */
  startDate: string;
  endDate: string;

  description?: string;

  createdAt: string;

  // ===== فیلدهای مخصوص لیگ (League) =====
  /**
   * تعداد سهمیه‌های صعود و سقوط (فقط برای لیگ)
   */
  promotionSpots?: number;
  relegationSpots?: number;

  /**
   * آیا لیگ به صورت گروهی برگزار می‌شود؟ (فقط برای لیگ)
   */
  hasGroups?: boolean;

  /**
   * سیستم امتیازدهی (فقط برای لیگ)
   */
  pointsSystem?: PointsSystem;

  /**
   * آیا جدول رده‌بندی فعال است؟ (فقط برای لیگ)
   * پیش‌فرض: true
   */
  hasStandingsTable?: boolean;

  // ===== فیلدهای مخصوص جام حذفی (Knockout) =====
  /**
   * آیا مسابقات به صورت رفت و برگشت برگزار می‌شود؟ (فقط برای جام حذفی)
   */
  twoLeggedMatches?: boolean;

  /**
   * آیا مسابقه رده‌بندی (مقام سوم) برگزار می‌شود؟ (فقط برای جام حذفی)
   */
  hasThirdPlaceMatch?: boolean;
}

