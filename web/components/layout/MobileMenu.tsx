"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navigationMenu } from "@/data/navigation";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  onSearch: () => void;
};

export function MobileMenu({ open, onClose, onSearch }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setExpanded(null);
    }
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-40 transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <aside
        className={`absolute inset-y-0 right-0 flex w-80 max-w-full flex-col border-r border-white/10 bg-[#040a18] p-6 text-white transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        dir="rtl"
      >
        <div className="flex items-center justify-between">
          <p className="text-base font-bold">منوی اصلی</p>
          <button
            type="button"
            aria-label="بستن منوی موبایل"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-white/70"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-8 space-y-4 text-sm font-medium">
          {navigationMenu.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((prev) => (prev === item.title ? null : item.title))
                    }
                    className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-right"
                  >
                    <span>{item.title}</span>
                    <svg
                      viewBox="0 0 24 24"
                      className={`h-4 w-4 transition ${expanded === item.title ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    >
                      <path
                        d="M6 9.5 12 15l6-5.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-[max-height] duration-200 ${
                      expanded === item.title ? "max-h-64" : "max-h-0"
                    }`}
                  >
                    <ul className="mt-2 space-y-2 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-right text-xs text-white/70">
                      {item.children.map((child) => (
                        <li key={child.title}>
                          <Link href={child.href} onClick={onClose} className="block rounded-xl px-2 py-2 hover:text-primary">
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href ?? "#"}
                  onClick={onClose}
                  className="block rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-right hover:text-primary"
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onSearch}
          className="mt-auto w-full rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-bold text-primary"
        >
          جستجو در اخبار
        </button>
      </aside>
    </div>
  );
}
