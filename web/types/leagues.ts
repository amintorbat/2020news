// هسته‌ی جدید مدل لیگ در پنل ادمین
// این مدل فقط روی فوتسال و فوتبال ساحلی تمرکز دارد
// و آماده‌ی گسترش به سایر رشته‌ها در آینده است.

export type LeagueSportType = "futsal" | "beach_soccer";

export type LeagueCompetitionType = "league" | "knockout";

export type LeagueStatus = "active" | "draft" | "archived";

export interface League {
  id: string;
  /**
   * عنوان لیگ (فارسی)
   * مثال: "لیگ برتر فوتسال ایران"
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
   * تعداد تیم‌های حاضر در لیگ
   */
  numberOfTeams: number;

  /**
   * تعداد سهمیه‌های صعود و سقوط
   */
  promotionSpots: number;
  relegationSpots: number;

  /**
   * آیا لیگ به صورت گروهی برگزار می‌شود؟
   */
  hasGroups: boolean;

  status: LeagueStatus;

  /**
   * بازه‌ی زمانی برگزاری لیگ
   * (فرمت ذخیره‌سازی آزاد؛ در نسخه‌های بعدی می‌تواند به
   *  تاریخ شمسی استاندارد تبدیل شود)
   */
  startDate: string;
  endDate: string;

  description?: string;

  createdAt: string;
}

