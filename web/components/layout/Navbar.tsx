"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { navigationMenu, type NavItem } from "@/lib/data";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const clearTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleDelayedClose = () => {
    clearTimer();
    closeTimer.current = setTimeout(() => setOpenItem(null), 200);
  };

  useEffect(() => {
    if (!openItem) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenItem(null);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [openItem]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className="sticky inset-x-0 top-0 z-50 border-b border-[var(--border)] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
      ref={navRef}
      dir="rtl"
    >
      {/* Desktop Header */}
      <div className="hidden container md:grid md:grid-cols-[auto,1fr,auto] md:items-center md:gap-4 md:py-3">
        <Link href="/" className="justify-self-end" aria-label="۲۰۲۰نیوز">
          <Image src="/images/logo.png" alt="لوگوی ۲۰۲۰نیوز" width={140} height={36} priority className="h-9 w-auto object-contain" />
        </Link>

        <nav className="justify-center md:flex" aria-label="منوی اصلی">
          <ul className="flex items-center gap-6 text-sm font-semibold text-[var(--foreground)]">
            {navigationMenu.map((item) => (
              <DesktopNavItem
                key={item.title}
                item={item}
                openKey={openItem}
                onOpen={(value) => {
                  clearTimer();
                  setOpenItem(value);
                }}
                onClose={handleDelayedClose}
              />
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 justify-self-start" dir="ltr">
          <button
            type="button"
            aria-label="جستجو"
            className="rounded-full border border-[var(--border)] bg-white p-2 text-slate-900 transition hover:text-brand"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m16.5 16.5 3.5 3.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="container flex items-center justify-between gap-2 py-2.5 md:hidden" dir="rtl">
        {/* Logo - Right */}
        <Link href="/" className="flex-shrink-0" aria-label="۲۰۲۰نیوز">
          <Image src="/images/logo.png" alt="لوگوی ۲۰۲۰نیوز" width={120} height={30} priority className="h-8 w-auto object-contain" />
        </Link>

        {/* Search - Center */}
        <div className="flex-1 min-w-0">
          <input
            type="search"
            placeholder="جستجو..."
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            dir="rtl"
          />
        </div>

        {/* Hamburger - Left */}
        <button
          type="button"
          className="flex-shrink-0 rounded-lg border border-[var(--border)] bg-white p-2 text-[var(--foreground)] transition hover:bg-slate-50"
          aria-label="باز کردن منو"
          onClick={() => setMobileOpen(true)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

type DesktopNavItemProps = {
  item: NavItem;
  openKey: string | null;
  onOpen: (key: string | null) => void;
  onClose: () => void;
};

function DesktopNavItem({ item, openKey, onOpen, onClose }: DesktopNavItemProps) {
  const hasChildren = Boolean(item.children?.length);
  const isOpen = openKey === item.title;

  return (
    <li
      className="relative"
      onMouseEnter={() => hasChildren && onOpen(item.title)}
      onMouseLeave={() => hasChildren && onClose()}
    >
      <Link
        href={item.href}
        className="inline-flex items-center gap-1 rounded-full px-3 py-2 transition hover:text-brand"
        aria-haspopup={hasChildren ? "true" : undefined}
        aria-expanded={hasChildren ? isOpen : undefined}
        onFocus={() => hasChildren && onOpen(item.title)}
      >
        {item.title}
        {hasChildren && (
          <svg viewBox="0 0 24 24" className={cn("h-4 w-4 transition", isOpen ? "-scale-y-100" : "")} fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </Link>
      {hasChildren && isOpen && (
        <div className="absolute left-0 top-full z-50 w-48 pt-3" onMouseEnter={() => onOpen(item.title)} onMouseLeave={() => onClose()}>
          <div className="rounded-2xl border border-[var(--border)] bg-white p-3 text-right text-sm text-[var(--muted)] shadow-card">
            <ul className="space-y-1">
              {item.children?.map((child) => (
                <li key={child.title}>
                  <Link href={child.href} className="block rounded-xl px-3 py-2 transition hover:bg-[#f7f8fa] hover:text-brand">
                    {child.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}
