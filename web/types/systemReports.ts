/**
 * Smart System Reports (Audit Logs) Types
 * 
 * Comprehensive logging system for tracking all system activities
 */

export type EventType = "create" | "update" | "delete" | "access" | "error";

export type ActorRole = "Admin" | "Match Reporter";

export type Module = "Leagues" | "Teams" | "Matches" | "Players" | "News" | "Users" | "System";

export type SeverityLevel = "Normal" | "Important" | "Critical";

export interface SystemReport {
  id: string;
  
  // Event information
  eventType: EventType;
  severity: SeverityLevel;
  
  // Actor information
  actorRole: ActorRole;
  actorName: string;
  actorId?: string;
  
  // Module and resource
  module: Module;
  resourceId?: string;
  resourceName?: string;
  
  // Description
  description: string; // Persian, human-readable
  
  // Timestamp
  timestamp: string; // ISO datetime string
  
  // Additional metadata
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

// Event type labels in Persian
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  create: "ایجاد",
  update: "ویرایش",
  delete: "حذف",
  access: "دسترسی",
  error: "خطا",
};

// Module labels in Persian
export const MODULE_LABELS: Record<Module, string> = {
  Leagues: "لیگ‌ها",
  Teams: "تیم‌ها",
  Matches: "مسابقات",
  Players: "بازیکنان",
  News: "اخبار",
  Users: "کاربران",
  System: "سیستم",
};

// Severity labels and colors
export const SEVERITY_CONFIG: Record<
  SeverityLevel,
  { label: string; variant: "default" | "warning" | "danger" }
> = {
  Normal: { label: "عادی", variant: "default" },
  Important: { label: "مهم", variant: "warning" },
  Critical: { label: "بحرانی", variant: "danger" },
};
