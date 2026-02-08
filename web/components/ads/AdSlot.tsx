"use client";

import { useEffect, useState } from "react";
import { getDisplayAdForSlot, recordImpression, recordClick } from "@/lib/admin/adsData";
import type { AdSlot as AdSlotType } from "@/types/advertising";

type AdSlotProps = {
  slot: AdSlotType;
  className?: string;
};

/**
 * جایگاه تبلیغ در سایت عمومی.
 * فقط تبلیغ فعال و در بازه زمانی نمایش داده می‌شود.
 * با بالاترین اولویت؛ Impression روی رندر و Click روی کلیک ثبت می‌شود.
 */
export function AdSlot({ slot, className = "" }: AdSlotProps) {
  const [ad, setAd] = useState<ReturnType<typeof getDisplayAdForSlot>>(null);

  useEffect(() => {
    const current = getDisplayAdForSlot(slot);
    setAd(current);
    if (current) recordImpression(current.id);
  }, [slot]);

  if (!ad) return null;

  const handleClick = () => {
    recordClick(ad.id);
  };

  return (
    <div className={`ad-slot ad-slot--${slot} ${className}`} data-slot={slot} data-ad-id={ad.id}>
      {ad.type === "banner" && ad.imageUrl && (
        <a
          href={ad.linkUrl || "#"}
          target={ad.linkUrl?.startsWith("http") ? "_blank" : undefined}
          rel={ad.linkUrl?.startsWith("http") ? "noopener noreferrer" : undefined}
          onClick={handleClick}
          className="block rounded-lg overflow-hidden border border-slate-200 bg-white hover:opacity-95 transition-opacity"
        >
          <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </a>
      )}

      {ad.type === "html" && ad.htmlCode && (
        <div className="rounded-lg overflow-hidden border border-slate-200 bg-white [&>script]:max-w-full" dangerouslySetInnerHTML={{ __html: ad.htmlCode }} />
      )}

      {(ad.type === "native" || ad.type === "sponsored") && (
        <a
          href={ad.linkUrl || "#"}
          target={ad.linkUrl?.startsWith("http") ? "_blank" : undefined}
          rel={ad.linkUrl?.startsWith("http") ? "noopener noreferrer" : undefined}
          onClick={handleClick}
          className="block rounded-lg border border-slate-200 bg-white p-3 hover:bg-slate-50 transition-colors"
        >
          {ad.imageUrl && <img src={ad.imageUrl} alt="" className="w-full rounded-md mb-2 max-h-32 object-cover" />}
          <span className="text-xs text-slate-400">حمایت شده</span>
          <p className="font-medium text-slate-900 text-sm mt-0.5">{ad.title}</p>
        </a>
      )}

      {ad.type === "banner" && !ad.imageUrl && null}
    </div>
  );
}
