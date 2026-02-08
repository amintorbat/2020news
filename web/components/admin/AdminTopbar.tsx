"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_LABELS } from "@/types/rbac";
import { getAllUsers } from "@/lib/admin/usersData";
import type { RoleKey } from "@/types/rbac";

function PersianDateTime() {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const persianDate = new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(now);
      setDateTime(persianDate);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return <span className="text-sm font-medium text-slate-700">{dateTime}</span>;
}

type AdminTopbarProps = {
  onMenuClick: () => void;
};

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const { currentUser, login, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const users = typeof window !== "undefined" ? getAllUsers() : [];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white shadow-sm" dir="rtl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
            aria-label="منو"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/admin" className="text-lg font-bold text-slate-900" style={{ color: "#0f172a" }}>
            پنل مدیریت
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <PersianDateTime />
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setUserDropdownOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              aria-label="کاربر"
            >
              <span className="max-w-[120px] truncate sm:max-w-[180px]">
                {currentUser ? `${currentUser.name} (${ROLE_LABELS[currentUser.role as RoleKey]})` : "انتخاب کاربر"}
              </span>
              <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {userDropdownOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      login(u.id);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-right text-sm hover:bg-slate-50 ${
                      currentUser?.id === u.id ? "bg-brand/10 text-brand font-medium" : "text-slate-700"
                    }`}
                  >
                    <span className="block truncate">{u.name}</span>
                    <span className="block truncate text-xs text-slate-500">{ROLE_LABELS[u.role]}</span>
                  </button>
                ))}
                {currentUser && (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full border-t border-slate-100 px-4 py-2 text-right text-sm text-red-600 hover:bg-red-50"
                  >
                    خروج
                  </button>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            className="relative rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="اعلان‌ها"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
