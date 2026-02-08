/**
 * Site Settings — load/save, defaults.
 * Local-first: localStorage; no external API.
 */

import type {
  SiteSettings,
  GeneralSettings,
  SportsSettings,
  NewsJournalistSettings,
  MatchLeagueSettings,
  AdvertisingSettings,
  RolesPermissionsSettings,
  SystemReportsSettings,
  SmartAutomationSettings,
} from "@/types/settings";

const STORAGE_KEY = "2020news_site_settings";

function getDefaultGeneral(): GeneralSettings {
  return {
    siteName: "۲۰۲۰نیوز",
    siteDescription: "رسانه ورزشی فوتسال و فوتبال ساحلی",
    defaultLanguage: "fa",
    timezone: "Asia/Tehran",
    defaultDateFormat: "jalali",
    enableNews: true,
    enableMatches: true,
    enableStandings: true,
    enableMedia: true,
    maintenanceMode: false,
    maintenanceMessage: "سایت در حال به‌روزرسانی است. به زودی برمی‌گردیم.",
  };
}

function getDefaultSports(): SportsSettings {
  return {
    enabledSports: ["futsal", "beach_soccer"],
    defaultSport: "futsal",
    sportSpecificRules: true,
    allowNewSports: false,
  };
}

function getDefaultNewsJournalist(): NewsJournalistSettings {
  return {
    autoGenerateSlug: true,
    requireEditorApprovalBeforePublish: true,
    journalistDefaultDurationHours: 4,
    journalistMaxDurationHours: 24,
    journalistExpirationBehavior: "revoke",
    richEditorEnabled: true,
    mandatoryReportNotePerNews: false,
  };
}

function getDefaultMatchLeague(): MatchLeagueSettings {
  return {
    defaultMatchDurationMinutes: 40,
    pointsWin: 3,
    pointsDraw: 1,
    pointsLoss: 0,
    enableKnockoutCompetitions: true,
    groupStageDefaultTeamsPerGroup: 4,
    autoGenerateStandingsRules: true,
    matchStatusAutoFinish: false,
  };
}

function getDefaultAdvertising(): AdvertisingSettings {
  return {
    adsEnabledGlobally: true,
    maxActiveAdsPerSlot: 3,
    defaultAdDurationDays: 30,
    preventOverlappingPlacements: true,
    warnOnExpiringSoonDays: 3,
    warnOnOverlap: true,
  };
}

function getDefaultRolesPermissions(): RolesPermissionsSettings {
  return {
    adminCanAll: true,
    editorCanPublish: true,
    editorCanDelete: true,
    journalistTemporaryOnly: true,
    journalistReadOnlyByDefault: false,
    timeBasedAccessSupported: true,
    customRoleToggles: {},
  };
}

function getDefaultSystemReports(): SystemReportsSettings {
  return {
    enableSystemLogs: true,
    logRetentionDays: 90,
    warningSensitivity: "medium",
    autoGenerateAlerts: true,
    requireAdminNoteForCriticalActions: true,
  };
}

function getDefaultAutomation(): SmartAutomationSettings {
  return {
    autoExpireJournalistAccess: true,
    autoDisableExpiredAds: true,
    autoFlagIncompleteMatches: true,
    autoDetectLogicalInconsistencies: true,
    dailySystemHealthCheck: true,
  };
}

export function getDefaultSettings(): SiteSettings {
  return {
    general: getDefaultGeneral(),
    sports: getDefaultSports(),
    newsJournalist: getDefaultNewsJournalist(),
    matchLeague: getDefaultMatchLeague(),
    advertising: getDefaultAdvertising(),
    rolesPermissions: getDefaultRolesPermissions(),
    systemReports: getDefaultSystemReports(),
    automation: getDefaultAutomation(),
  };
}

function deepMerge<T extends object>(defaults: T, saved: Partial<T>): T {
  const out = { ...defaults };
  if (!saved || typeof saved !== "object") return out;
  for (const key of Object.keys(saved) as (keyof T)[]) {
    const savedVal = saved[key];
    if (savedVal === undefined) continue;
    const defaultVal = defaults[key];
    if (
      defaultVal !== null &&
      typeof defaultVal === "object" &&
      !Array.isArray(defaultVal) &&
      savedVal !== null &&
      typeof savedVal === "object" &&
      !Array.isArray(savedVal)
    ) {
      (out as Record<string, unknown>)[key as string] = deepMerge(
        defaultVal as object,
        savedVal as object
      );
    } else {
      (out as Record<string, unknown>)[key as string] = savedVal;
    }
  }
  return out;
}

function loadFromStorage(): Partial<SiteSettings> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function loadSettings(): SiteSettings {
  const defaults = getDefaultSettings();
  const saved = loadFromStorage();
  return deepMerge(defaults, saved);
}

export function saveSettings(settings: SiteSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function updateSettingsSection<K extends keyof SiteSettings>(
  section: K,
  data: Partial<SiteSettings[K]>
): SiteSettings {
  const current = loadSettings();
  const next = {
    ...current,
    [section]: { ...current[section], ...data },
  };
  saveSettings(next);
  return next;
}
