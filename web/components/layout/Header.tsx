"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { NavMenu } from "./NavMenu";
import { MobileMenu } from "./MobileMenu";
import { SearchModal } from "./SearchModal";
import { newsArticles } from "@/data/content";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchSeed, setSearchSeed] = useState("");
  const [inlineSearchOpen, setInlineSearchOpen] = useState(false);
  const [inlineQuery, setInlineQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const shouldLockBody = mobileOpen || searchOpen;

  useEffect(() => {
    if (shouldLockBody) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [shouldLockBody]);

  useEffect(() => {
    if (inlineSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [inlineSearchOpen]);

  const quickSearchItems = useMemo(() => newsArticles, []);

  const openSearchModal = (prefill = "") => {
    setSearchSeed(prefill);
    setSearchOpen(true);
  };

  const handleInlineSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inlineSearchOpen) {
      setInlineSearchOpen(true);
      return;
    }
    if (inlineQuery.trim()) {
      openSearchModal(inlineQuery.trim());
      setInlineSearchOpen(false);
      setInlineQuery("");
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#030b1c]/90 backdrop-blur">
      <div className="container flex h-20 flex-row-reverse items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="لوگوی ۲۰۲۰نیوز"
            width={52}
            height={52}
            priority
            className="h-12 w-12 rounded-full border border-white/20 bg-white/5 object-contain"
          />
          <div className="text-right leading-tight">
            <p className="text-lg font-black tracking-tight text-white">۲۰۲۰نیوز</p>
            <p className="text-xs text-white/60">رسانه تخصصی فوتسال و فوتبال ساحلی</p>
          </div>
        </Link>

        <div className="flex items-center gap-3 text-sm font-semibold">
          <NavMenu />

          <form
            onSubmit={handleInlineSubmit}
            className={`hidden items-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-white transition-all duration-200 lg:flex ${
              inlineSearchOpen ? "w-64 px-3" : "w-12 px-0"
            }`}
          >
            <button
              type="button"
              aria-label="جستجو"
              onClick={() => {
                if (inlineSearchOpen && inlineQuery.trim()) {
                  openSearchModal(inlineQuery.trim());
                  setInlineSearchOpen(false);
                  setInlineQuery("");
                  return;
                }
                setInlineSearchOpen((prev) => {
                  if (prev) {
                    setInlineQuery("");
                  }
                  return !prev;
                });
              }}
              className="flex h-10 w-10 items-center justify-center text-white/70 hover:text-primary"
            >
              <SearchIcon />
            </button>
            <input
              ref={searchInputRef}
              type="text"
              value={inlineQuery}
              onChange={(event) => setInlineQuery(event.target.value)}
              placeholder="جستجوی خبر..."
              className={`flex-1 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none ${
                inlineSearchOpen ? "opacity-100" : "opacity-0"
              }`}
            />
          </form>

          <button
            type="button"
            aria-label="جستجوی سریع"
            onClick={() => {
              setInlineSearchOpen(false);
              setInlineQuery("");
              openSearchModal();
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:border-primary/60 hover:text-primary transition lg:hidden"
          >
            <SearchIcon />
          </button>

          <button
            type="button"
            aria-label="باز کردن منوی موبایل"
            onClick={() => setMobileOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-primary/60 hover:text-primary lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onSearch={() => {
          setMobileOpen(false);
          openSearchModal();
        }}
      />

      {searchOpen ? (
        <SearchModal
          open={searchOpen}
          onClose={() => {
            setSearchOpen(false);
            setSearchSeed("");
          }}
          articles={quickSearchItems}
          initialQuery={searchSeed}
        />
      ) : null}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm9 3-5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
