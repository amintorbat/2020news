"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navigationMenu } from "@/data/navigation";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-[var(--border)] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <div className="container flex flex-row-reverse items-center gap-6 py-4">
        <Link href="/" className="flex-shrink-0">
          <Image src="/images/logo.png" alt="لوگوی ۲۰۲۰نیوز" width={64} height={64} priority className="h-16 w-auto object-contain" />
          <span className="sr-only">۲۰۲۰نیوز</span>
        </Link>

        <nav className="pointer-events-auto hidden flex-1 justify-start md:flex" dir="rtl">
          <ul className="flex flex-row-reverse items-center gap-6 text-sm font-semibold text-[var(--foreground)]">
            {navigationMenu.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              return (
                <li key={item.title} className="group relative">
                  <Link href={item.href} className="inline-flex items-center gap-1 rounded-full px-3 py-2 transition hover:text-brand">
                    {item.title}
                    {hasChildren && (
                      <svg viewBox="0 0 24 24" className="h-4 w-4 transition group-hover:-scale-y-100" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </Link>
                  {hasChildren && (
                    <div className="absolute left-0 top-full z-50 hidden w-52 pt-3 group-hover:block">
                      <div className="pointer-events-none translate-y-2 rounded-2xl border border-[var(--border)] bg-white p-3 text-right text-sm text-[var(--muted)] opacity-0 shadow-card transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
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
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="ml-auto rounded-full border border-[var(--border)] bg-white p-2 text-slate-900 md:hidden"
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
