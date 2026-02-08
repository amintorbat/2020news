/**
 * نگاشت رشته (صفحه عمومی) به لیگ حذفی برای نمایش براکت
 * از داده لیگ‌های ادمین استفاده می‌کند تا یک منبع حقیقت باشد.
 */
import type { LeagueKey } from "@/lib/data";
import { mockLeagues } from "@/lib/admin/leaguesData";

const leagueKeyToSport: Record<LeagueKey, "futsal" | "beach_soccer"> = {
  futsal: "futsal",
  beach: "beach_soccer",
};

export type BracketLeagueInfo = {
  id: string;
  title: string;
  numberOfTeams: number;
  hasThirdPlaceMatch: boolean;
};

/**
 * برای یک رشته (فوتسال / فوتبال ساحلی) در صورت وجود لیگ حذفی، اطلاعات براکت را برمی‌گرداند.
 */
export function getBracketLeagueForSport(
  leagueKey: LeagueKey
): BracketLeagueInfo | null {
  const sport = leagueKeyToSport[leagueKey];
  const league = mockLeagues.find(
    (l) =>
      l.sportType === sport &&
      (l.competitionType === "knockout" ||
        (l.competitionFormat && ["knockout", "group_knockout", "playoff"].includes(l.competitionFormat)))
  );
  if (!league) return null;
  return {
    id: league.id,
    title: league.title,
    numberOfTeams: league.numberOfTeams,
    hasThirdPlaceMatch: league.hasThirdPlaceMatch ?? false,
  };
}

/**
 * آیا برای فیلتر فعلی (رشته + نوع مسابقه) باید لینک/نمای براکت نشان داده شود؟
 */
export function shouldShowBracketLink(
  leagueKey: LeagueKey,
  competitionType: string
): boolean {
  if (competitionType !== "cup" && competitionType !== "all") return false;
  return getBracketLeagueForSport(leagueKey) !== null;
}
