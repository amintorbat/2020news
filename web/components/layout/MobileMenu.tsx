"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navigationMenu } from "@/lib/data";
import { cn } from "@/lib/cn";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setExpanded(null);
    }
  }, [open]);

  return (
    <div className={cn("fixed inset-0 z-40 md:hidden", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
      <div className={cn("absolute inset-0 bg-black/40 transition-opacity duration-200", open ? "opacity-100" : "opacity-0")} onClick={onClose} />
      <aside
        className={cn(
          "absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col bg-white text-right shadow-[0_12px_40px_rgba(15,23,42,0.3)] transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <p className="text-sm font-semibold text-[var(--foreground)]">منوی اصلی</p>
          <button type="button" onClick={onClose} className="rounded-full border border-[var(--border)] p-2 text-[var(--foreground)]" aria-label="بستن منو">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6 18 18M18 6 6 18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6">
          <ul className="space-y-4 text-sm font-semibold text-[var(--foreground)]">
            {navigationMenu.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const isOpen = expanded === item.title;

              if (!hasChildren) {
                return (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="block rounded-3xl border border-[var(--border)] px-4 py-3 transition hover:border-brand"
                      onClick={onClose}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.title}>
                  <div className="rounded-3xl border border-[var(--border)]">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-4 py-3"
                      onClick={() => setExpanded(isOpen ? null : item.title)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.title}</span>
                      <svg viewBox="0 0 24 24" className={cn("h-4 w-4 transition", isOpen ? "-rotate-90" : "rotate-90")} fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <div className={cn("overflow-hidden border-t border-transparent transition-all duration-300", isOpen ? "border-[var(--border)]" : "")}>
                      <ul className={cn("space-y-1 bg-[#f7f8fa] px-4", isOpen ? "max-h-64 py-3" : "max-h-0")}>
                        {item.children?.map((child) => (
                          <li key={child.title}>
                            <Link
                              href={child.href}
                              className="block rounded-2xl px-3 py-2 text-[var(--muted)] transition hover:bg-white hover:text-brand"
                              onClick={onClose}
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
