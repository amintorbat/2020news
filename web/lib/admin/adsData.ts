/**
 * داده و منطق تبلیغات — CRUD، جایگاه‌ها، ثبت نمایش و کلیک
 */

import type { Advertisement, AdSlot, AdType } from "@/types/advertising";
import { generateId } from "@/lib/utils/id";

const STORAGE_KEY = "2020news_ads";

export const AD_SLOTS: { value: AdSlot; label: string }[] = [
  { value: "HOME_TOP", label: "بالای صفحه اصلی" },
  { value: "HOME_MID", label: "میان صفحه اصلی" },
  { value: "SIDEBAR_TOP", label: "بالای سایدبار" },
  { value: "SIDEBAR_STICKY", label: "سایدبار ثابت" },
  { value: "ARTICLE_TOP", label: "بالای مقاله" },
  { value: "ARTICLE_MID", label: "میان مقاله" },
  { value: "ARTICLE_BOTTOM", label: "پایین مقاله" },
  { value: "FOOTER", label: "فوتر" },
];

export const AD_TYPES: { value: AdType; label: string }[] = [
  { value: "banner", label: "بنر (تصویر / GIF)" },
  { value: "html", label: "HTML / اسکریپت" },
  { value: "native", label: "تبلیغ بومی (شبیه محتوا)" },
  { value: "sponsored", label: "محتوای حمایت‌شده (آینده)" },
];

function loadAds(): Advertisement[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultAds();
    const parsed = JSON.parse(raw) as Advertisement[];
    return Array.isArray(parsed) ? parsed : getDefaultAds();
  } catch {
    return getDefaultAds();
  }
}

function saveAds(ads: Advertisement[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
  } catch (_) {}
}

function getDefaultAds(): Advertisement[] {
  const now = new Date();
  const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  return [
    {
      id: "ad-1",
      title: "بنر نمونه صفحه اصلی",
      type: "banner",
      slot: "HOME_TOP",
      imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=200&fit=crop",
      linkUrl: "https://example.com",
      startDate: start,
      endDate: end,
      isActive: true,
      priority: 10,
      impressions: 0,
      clicks: 0,
      createdAt: start,
    },
  ];
}

/** همه تبلیغات */
export function getAllAds(): Advertisement[] {
  return loadAds();
}

/** یک تبلیغ با id */
export function getAdById(id: string): Advertisement | undefined {
  return loadAds().find((a) => a.id === id);
}

/** تبلیغات فعال و در بازه زمانی برای یک جایگاه — مرتب‌سازی بر اساس اولویت */
export function getActiveAdsForSlot(slot: AdSlot): Advertisement[] {
  const now = Date.now();
  return loadAds()
    .filter(
      (a) =>
        a.slot === slot &&
        a.isActive &&
        new Date(a.startDate).getTime() <= now &&
        new Date(a.endDate).getTime() >= now
    )
    .sort((a, b) => b.priority - a.priority);
}

/** تبلیغی که برای نمایش در یک Slot باید نشان داده شود (اولین با بالاترین اولویت) */
export function getDisplayAdForSlot(slot: AdSlot): Advertisement | null {
  const list = getActiveAdsForSlot(slot);
  return list.length > 0 ? list[0] : null;
}

/** ثبت نمایش */
export function recordImpression(id: string): void {
  const ads = loadAds();
  const i = ads.findIndex((a) => a.id === id);
  if (i === -1) return;
  ads[i] = { ...ads[i], impressions: ads[i].impressions + 1 };
  saveAds(ads);
}

/** ثبت کلیک */
export function recordClick(id: string): void {
  const ads = loadAds();
  const i = ads.findIndex((a) => a.id === id);
  if (i === -1) return;
  ads[i] = { ...ads[i], clicks: ads[i].clicks + 1 };
  saveAds(ads);
}

/** ایجاد تبلیغ */
export function createAd(data: Omit<Advertisement, "id" | "impressions" | "clicks" | "createdAt">): Advertisement {
  const ads = loadAds();
  const now = new Date().toISOString();
  const ad: Advertisement = {
    ...data,
    id: generateId(),
    impressions: 0,
    clicks: 0,
    createdAt: now,
    updatedAt: now,
  };
  ads.push(ad);
  saveAds(ads);
  return ad;
}

/** به‌روزرسانی تبلیغ */
export function updateAd(id: string, updates: Partial<Omit<Advertisement, "id" | "createdAt">>): Advertisement | null {
  const ads = loadAds();
  const i = ads.findIndex((a) => a.id === id);
  if (i === -1) return null;
  const updated: Advertisement = {
    ...ads[i],
    ...updates,
    id: ads[i].id,
    impressions: updates.impressions ?? ads[i].impressions,
    clicks: updates.clicks ?? ads[i].clicks,
    createdAt: ads[i].createdAt,
    updatedAt: new Date().toISOString(),
  };
  ads[i] = updated;
  saveAds(ads);
  return updated;
}

/** حذف تبلیغ */
export function deleteAd(id: string): boolean {
  const ads = loadAds().filter((a) => a.id !== id);
  if (ads.length === loadAds().length) return false;
  saveAds(ads);
  return true;
}
