"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navigationMenu, type NavItem } from "@/data/navigation";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--border)] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <div className="container flex flex-row-reverse items-center gap-6 py-4">
        <Link href="/" className="flex h-14 w-14 flex-shrink-0 items-center justify-center">
          <Image src="/images/logo.png" alt="لوگوی ۲۰۲۰نیوز" width={56} height={56} priority className="h-14 w-14 object-contain" />
          <span className="sr-only">۲۰۲۰نیوز</span>
        </Link>

        <nav className="hidden flex-1 justify-start md:flex" dir="rtl" onMouseLeave={() => setDropdown(null)}>
          <ul className="flex flex-row-reverse items-center gap-6 text-sm font-semibold text-[var(--foreground)]">
            {navigationMenu.map((item) => (
              <DesktopItem key={item.title} item={item} openKey={dropdown} onOpen={setDropdown} />
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="ml-auto rounded-full border border-[var(--border)] bg-white p-2 text-[var(--foreground)] md:hidden"
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

type DesktopItemProps = {
  item: NavItem;
  openKey: string | null;
  onOpen: (value: string | null) => void;
};

function DesktopItem({ item, openKey, onOpen }: DesktopItemProps) {
  const hasChildren = Boolean(item.children?.length);
  const isOpen = openKey === item.title;

  return (
    <li
      className="relative"
      onMouseEnter={() => hasChildren && onOpen(item.title)}
      onMouseLeave={() => hasChildren && onOpen(null)}
    >
      <Link
        href={item.href}
        className="inline-flex items-center gap-1 rounded-full px-3 py-2 transition hover:text-brand"
        aria-haspopup={hasChildren ? "true" : undefined}
        aria-expanded={hasChildren ? isOpen : undefined}
        onFocus={() => hasChildren && onOpen(item.title)}
        onBlur={() => hasChildren && onOpen(null)}
      >
        {item.title}
        {hasChildren && (
          <svg
            viewBox="0 0 24 24"
            className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </Link>
      {hasChildren && isOpen && (
        <div className="absolute left-0 top-full mt-3 w-48 rounded-2xl border border-[var(--border)] bg-white p-3 text-right text-sm text-[var(--muted)] shadow-card">
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
      )}
    </li>
  );
}
