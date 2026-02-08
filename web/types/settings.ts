/**
 * Site Settings — Control center types.
 * All configurable; future-proof for new sports.
 */

export type SiteStatus = "active" | "maintenance" | "disabled";

export type SupportedSport = "futsal" | "beach_soccer";
export type DateFormatKey = "jalali" | "gregorian";
export type JournalistExpirationBehavior = "revoke" | "notify" | "extend_request";

// ─── 1. General ─────────────────────────────────────────────────────────────
export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  defaultLanguage: string;
  timezone: string;
  defaultDateFormat: DateFormatKey;
  enableNews: boolean;
  enableMatches: boolean;
  enableStandings: boolean;
  enableMedia: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

// ─── 2. Sports ──────────────────────────────────────────────────────────────
export interface SportsSettings {
  enabledSports: SupportedSport[];
  defaultSport: SupportedSport;
  sportSpecificRules: boolean;
  /** Reserved for future: add new sports (UI disabled, structure ready) */
  allowNewSports: boolean;
}

// ─── 3. News & Journalist ──────────────────────────────────────────────────
export interface NewsJournalistSettings {
  autoGenerateSlug: boolean;
  requireEditorApprovalBeforePublish: boolean;
  journalistDefaultDurationHours: number;
  journalistMaxDurationHours: number;
  journalistExpirationBehavior: JournalistExpirationBehavior;
  richEditorEnabled: boolean;
  mandatoryReportNotePerNews: boolean;
}

// ─── 4. Match & League ──────────────────────────────────────────────────────
export interface MatchLeagueSettings {
  defaultMatchDurationMinutes: number;
  pointsWin: number;
  pointsDraw: number;
  pointsLoss: number;
  enableKnockoutCompetitions: boolean;
  groupStageDefaultTeamsPerGroup: number;
  autoGenerateStandingsRules: boolean;
  matchStatusAutoFinish: boolean;
}

// ─── 5. Advertising ────────────────────────────────────────────────────────
export interface AdvertisingSettings {
  adsEnabledGlobally: boolean;
  maxActiveAdsPerSlot: number;
  defaultAdDurationDays: number;
  preventOverlappingPlacements: boolean;
  warnOnExpiringSoonDays: number;
  warnOnOverlap: boolean;
}

// ─── 6. Roles & Permissions ─────────────────────────────────────────────────
export interface RolesPermissionsSettings {
  adminCanAll: boolean;
  editorCanPublish: boolean;
  editorCanDelete: boolean;
  journalistTemporaryOnly: boolean;
  journalistReadOnlyByDefault: boolean;
  timeBasedAccessSupported: boolean;
  customRoleToggles: Record<string, { read: boolean; write: boolean; publish: boolean }>;
}

// ─── 7. System Reports & Warnings ──────────────────────────────────────────
export interface SystemReportsSettings {
  enableSystemLogs: boolean;
  logRetentionDays: number;
  warningSensitivity: "low" | "medium" | "high";
  autoGenerateAlerts: boolean;
  requireAdminNoteForCriticalActions: boolean;
}

// ─── 8. Smart Automation ───────────────────────────────────────────────────
export interface SmartAutomationSettings {
  autoExpireJournalistAccess: boolean;
  autoDisableExpiredAds: boolean;
  autoFlagIncompleteMatches: boolean;
  autoDetectLogicalInconsistencies: boolean;
  dailySystemHealthCheck: boolean;
}

// ─── Combined ──────────────────────────────────────────────────────────────
export interface SiteSettings {
  general: GeneralSettings;
  sports: SportsSettings;
  newsJournalist: NewsJournalistSettings;
  matchLeague: MatchLeagueSettings;
  advertising: AdvertisingSettings;
  rolesPermissions: RolesPermissionsSettings;
  systemReports: SystemReportsSettings;
  automation: SmartAutomationSettings;
}

/** Legacy flat shape (for backward compatibility if needed) */
export interface Settings {
  siteName: string;
  siteDescription: string;
  siteStatus: SiteStatus;
  requireContentApproval: boolean;
  enableComments: boolean;
  defaultUserRole: string;
  maxAds: number;
  maxUploadSizeMB: number;
  allowedMediaTypes: string[];
  enableAuditLog: boolean;
}
