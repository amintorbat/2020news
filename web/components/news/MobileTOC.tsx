"use client";

import { useState } from "react";
import { TableOfContents } from "./TableOfContents";

type MobileTOCProps = {
  html: string;
};

export function MobileTOC({ html }: MobileTOCProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden" dir="rtl">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-slate-900"
      >
        <span>فهرست مطالب</span>
        <svg
          className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-2 rounded-lg border border-[var(--border)] bg-white p-4">
          <TableOfContents html={html} />
        </div>
      )}
    </div>
  );
}

