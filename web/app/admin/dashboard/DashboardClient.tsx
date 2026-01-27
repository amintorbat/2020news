"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import StatKPI from "./components/StatKPI";
import RecentNews from "./components/RecentNews";
import TodayMatches from "./components/TodayMatches";
import SystemAlerts from "./components/SystemAlerts";
import { mockNews, mockMatches, mockUsers, mockPlayers } from "@/lib/admin/mock";

export default function DashboardClient() {
  const publishedNews = mockNews.filter((n) => n.status === "published").length;
  const todayMatches = mockMatches.filter((m) => {
    const today = new Date().toLocaleDateString("fa-IR");
    return m.date === today || m.status === "live";
  }).length;
  const totalPlayers = mockPlayers.length;
  const activeUsers = mockUsers.filter((u) => u.isActive).length;

  return (
    <div className="space-y-6 sm:space-y-8" dir="rtl">
      <PageHeader
        title="داشبورد مدیریتی"
        subtitle="وضعیت کلی پلتفرم فوتسال 2020news"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatKPI 
          title="اخبار منتشر شده" 
          value={publishedNews}
          icon="📝"
          trend="+12%"
        />
        <StatKPI 
          title="مسابقات امروز" 
          value={todayMatches}
          icon="⚽"
          trend="زنده"
        />
        <StatKPI 
          title="بازیکنان ثبت‌شده" 
          value={totalPlayers}
          icon="👥"
          trend="+5"
        />
        <StatKPI 
          title="کاربران فعال" 
          value={activeUsers}
          icon="🔐"
          trend="+3"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <RecentNews />
          <TodayMatches />
        </div>

        {/* Right Column - 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <SystemAlerts />
        </div>
      </div>
    </div>
  );
}
