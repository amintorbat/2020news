"use client";

import { useState } from "react";
import Link from "next/link";
import { matchSchedules } from "@/data/content";
import type { MatchSchedule } from "@/data/content";

type TabKey = keyof typeof matchSchedules;

const tabs: { key: TabKey; label: string }[] = [
  { key: "futsal", label: "فوتسال" },
  { key: "beach", label: "فوتبال ساحلی" },
];

export function MatchesSummary() {
  const [activeTab, setActiveTab] = useState<TabKey>("futsal");
  const tabData = matchSchedules[activeTab];

  return (
    <section className="container space-y-6" aria-labelledby="matches-summary">
      <header id="matches-summary" className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-white/60">برنامه کامل لیگ‌ها</p>
          <h2 className="mt-1 text-2xl font-black text-white">بازی‌ها و نتایج</h2>
        </div>
        <Link
          href={`/matches?tab=${activeTab}`}
          className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white/80 hover:text-white"
        >
          مشاهده صفحه کامل
        </Link>
      </header>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="انتخاب رشته">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeTab === tab.key
                ? "bg-primary/20 text-primary"
                : "bg-white/5 text-white/70 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2" dir="rtl">
        <MatchesColumn title="بازی‌های پیش رو" matches={tabData.upcoming} />
        <MatchesColumn title="آخرین نتایج" matches={tabData.recent} />
      </div>
    </section>
  );
}

type MatchesColumnProps = {
  title: string;
  matches: MatchSchedule[];
};

function MatchesColumn({ title, matches }: MatchesColumnProps) {
  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-[#040b18] p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <span className="text-[11px] text-white/40">{matches.length} بازی</span>
      </div>

      <ul className="space-y-4">
        {matches.map((match) => (
          <li key={match.id} className="rounded-2xl border border-white/5 bg-white/5 p-4 text-white">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <TeamRow label="میزبان" team={match.home} />
              <div className="text-center text-sm text-white/60">
                <p>{match.date}</p>
                <p>{match.time}</p>
              </div>
              <TeamRow label="میهمان" team={match.away} align="left" />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-white/60">
              <span>محل برگزاری: {match.venue}</span>
              <span>
                وضعیت: {match.status}
                {match.result ? ` | نتیجه ${match.result}` : ""}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

type TeamRowProps = {
  label: string;
  team: { name: string; logo: string };
  align?: "right" | "left";
};

function TeamRow({ label, team, align = "right" }: TeamRowProps) {
  const isRight = align === "right";
  return (
    <div className={`flex items-center gap-3 ${isRight ? "flex-row" : "flex-row-reverse"}`}>
      {isRight && (
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs font-bold">
          {team.logo}
        </span>
      )}
      <div className="text-right text-sm">
        <p className="text-xs text-white/40">{label}</p>
        <p className="font-semibold text-white">{team.name}</p>
      </div>
      {!isRight && (
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs font-bold">
          {team.logo}
        </span>
      )}
    </div>
  );
}
