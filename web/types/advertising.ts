/**
 * سیستم تبلیغات — انواع، جایگاه‌ها و مدل دیتا
 * آماده برای گزارش‌گیری، قیمت‌گذاری و پنل Advertiser در آینده
 */

/** انواع تبلیغ */
export type AdType = "banner" | "html" | "native" | "sponsored";

/** جایگاه‌های ثابت تبلیغ (Ad Slots) */
export type AdSlot =
  | "HOME_TOP"
  | "HOME_MID"
  | "SIDEBAR_TOP"
  | "SIDEBAR_STICKY"
  | "ARTICLE_TOP"
  | "ARTICLE_MID"
  | "ARTICLE_BOTTOM"
  | "FOOTER";

export interface Advertisement {
  id: string;
  title: string;
  type: AdType;
  slot: AdSlot;
  imageUrl?: string;
  htmlCode?: string;
  linkUrl?: string;
  startDate: string; // ISO DateTime
  endDate: string;   // ISO DateTime
  isActive: boolean;
  priority: number;
  impressions: number;
  clicks: number;
  createdAt: string; // ISO DateTime
  updatedAt?: string;
}

/** برای فرم: تاریخ و ساعت شمسی جدا */
export interface AdFormDateTime {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}
