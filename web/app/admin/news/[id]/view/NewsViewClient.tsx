"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/admin/Badge";
import { mockNewsCategories } from "@/lib/admin/newsData";
import { mockLeagues } from "@/lib/admin/leaguesData";
import { mockMatches } from "@/lib/admin/matchesData";
import { mockTeams } from "@/lib/admin/teamsData";
import { mockPlayers } from "@/lib/admin/playersData";
import type { News } from "@/types/news";
import jalaali from "jalaali-js";

type Props = {
  news: News;
};

const statusLabels: Record<News["status"], string> = {
  draft: "پیش‌نویس",
  review: "در انتظار بررسی",
  scheduled: "زمان‌بندی شده",
  published: "منتشر شده",
  archived: "آرشیو شده",
};

const statusColors: Record<News["status"], "default" | "info" | "warning" | "success" | "danger"> = {
  draft: "default",
  review: "warning",
  scheduled: "info",
  published: "success",
  archived: "danger",
};

export default function NewsViewClient({ news }: Props) {
  const router = useRouter();
  const category = mockNewsCategories.find((c) => c.id === news.categoryId);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const jalali = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
      return `${jalali.jy}/${String(jalali.jm).padStart(2, "0")}/${String(jalali.jd).padStart(2, "0")}`;
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="مشاهده خبر"
        subtitle={news.title}
        action={
          <div className="flex gap-2">
            <Link
              href={`/admin/news/${news.id}/edit`}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand/90"
            >
              ویرایش
            </Link>
            <Link
              href="/admin/news"
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              بازگشت به لیست
            </Link>
          </div>
        }
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Article Content - 8 columns */}
        <div className="lg:col-span-8 space-y-6">
          {/* Article Header */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <Badge variant={statusColors[news.status]}>
                {statusLabels[news.status]}
              </Badge>
              {category && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {category.name}
                </span>
              )}
            </div>
            <h1 className="mb-4 text-3xl font-bold text-slate-900">{news.title}</h1>
            <p className="mb-4 text-lg text-slate-600">{news.summary}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span>⏱ {news.readingTime} دقیقه مطالعه</span>
              <span>👁 {news.viewCount.toLocaleString("fa-IR")} بازدید</span>
              {news.publishAt && (
                <span>📅 {formatDate(news.publishAt)}</span>
              )}
              {news.createdAt && (
                <span>🕐 ایجاد شده: {formatDate(news.createdAt)}</span>
              )}
            </div>
            {news.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {news.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Article Blocks */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">محتوا</h2>
            <div className="prose prose-slate max-w-none space-y-6">
              {news.blocks.length > 0 ? (
                news.blocks.map((block) => <BlockPreview key={block.id} block={block} />)
              ) : (
                <p className="text-slate-500">هنوز محتوایی اضافه نشده است.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - 4 columns */}
        <div className="lg:col-span-4 space-y-4">
          {/* SEO Info */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-base font-bold text-slate-900">اطلاعات SEO</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-slate-700">عنوان SEO:</span>
                <p className="mt-1 text-slate-600">{news.seoTitle || news.title}</p>
              </div>
              <div>
                <span className="font-medium text-slate-700">توضیحات SEO:</span>
                <p className="mt-1 text-slate-600">{news.seoDescription || news.summary}</p>
              </div>
              <div>
                <span className="font-medium text-slate-700">اسلاگ:</span>
                <p className="mt-1 font-mono text-slate-600">{news.slug}</p>
              </div>
            </div>
          </div>

          {/* Related Content */}
          {(news.relatedLeagues.length > 0 ||
            news.relatedMatches.length > 0 ||
            news.relatedTeams.length > 0 ||
            news.relatedPlayers.length > 0) && (
            <div className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm overflow-hidden">
              <h3 className="mb-3 text-base font-bold text-slate-900">محتوای مرتبط</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {news.relatedLeagues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-slate-700">لیگ‌ها</h4>
                    <div className="space-y-1.5">
                      {news.relatedLeagues.map((leagueId) => {
                        const league = mockLeagues.find((l) => l.id === leagueId);
                        return league ? (
                          <div
                            key={leagueId}
                            className="rounded-lg border border-[var(--border)] bg-slate-50 px-3 py-2 text-sm text-slate-700 break-words"
                          >
                            {league.title}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                {news.relatedMatches.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-slate-700">مسابقات</h4>
                    <div className="space-y-1.5">
                      {news.relatedMatches.map((matchId) => {
                        const match = mockMatches.find((m) => m.id === matchId);
                        return match ? (
                          <div
                            key={matchId}
                            className="rounded-lg border border-[var(--border)] bg-slate-50 px-3 py-2 text-sm text-slate-700 break-words"
                          >
                            {match.homeTeam} vs {match.awayTeam}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                {news.relatedTeams.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-slate-700">تیم‌ها</h4>
                    <div className="space-y-1.5">
                      {news.relatedTeams.map((teamId) => {
                        const team = mockTeams.find((t) => t.id === teamId);
                        return team ? (
                          <div
                            key={teamId}
                            className="rounded-lg border border-[var(--border)] bg-slate-50 px-3 py-2 text-sm text-slate-700 break-words"
                          >
                            {team.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                {news.relatedPlayers.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-slate-700">بازیکنان</h4>
                    <div className="space-y-1.5">
                      {news.relatedPlayers.map((playerId) => {
                        const player = mockPlayers.find((p) => p.id === playerId);
                        return player ? (
                          <div
                            key={playerId}
                            className="rounded-lg border border-[var(--border)] bg-slate-50 px-3 py-2 text-sm text-slate-700 break-words"
                          >
                            {player.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other Info */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-base font-bold text-slate-900">سایر اطلاعات</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-slate-700">اولویت:</span>
                <span className="mr-2 text-slate-600">{news.priority}</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">تعداد بلاک‌ها:</span>
                <span className="mr-2 text-slate-600">{news.blocks.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Block Preview Component
function BlockPreview({ block }: { block: News["blocks"][0] }) {
  try {
    const content = JSON.parse(block.content || "{}");

    switch (block.type) {
      case "paragraph":
        return <p className="text-base leading-7 text-slate-900 whitespace-pre-wrap">{content.text || ""}</p>;
      case "heading":
        const HeadingTag = `h${content.level || 2}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          1: "text-4xl font-bold mb-4",
          2: "text-3xl font-bold mb-3",
          3: "text-2xl font-semibold mb-2",
          4: "text-xl font-semibold mb-2",
        };
        return (
          <HeadingTag className={headingClasses[content.level as keyof typeof headingClasses] || "text-2xl"}>
            {content.text || ""}
          </HeadingTag>
        );
      case "quote":
        return (
          <blockquote className="border-r-4 border-brand bg-slate-50 pr-6 py-4 italic text-slate-700">
            <p className="text-lg">{content.text || ""}</p>
            {content.author && (
              <cite className="mt-2 block text-sm text-slate-500">— {content.author}</cite>
            )}
          </blockquote>
        );
      case "list":
        const ListTag = content.type === "ordered" ? "ol" : "ul";
        return (
          <ListTag className="list-inside space-y-2 text-base text-slate-900">
            {content.items?.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ListTag>
        );
      case "divider":
        return <hr className="my-6 border-[var(--border)]" />;
      case "note":
        return (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-base text-amber-900">
            <strong>یادداشت:</strong> {content.text || ""}
          </div>
        );
      case "report":
        return (
          <div className="rounded-lg border-2 border-blue-300 bg-blue-50 p-4">
            <div className="mb-2 text-sm font-bold text-blue-900">📊 گزارش مسابقه</div>
            {content.matchId && (
              <div className="text-sm text-blue-800">
                مسابقه: {content.matchId}
              </div>
            )}
            {content.sections && content.sections.length > 0 && (
              <div className="mt-3 space-y-3">
                {content.sections.map((section: { title: string; content: string }, idx: number) => (
                  <div key={idx} className="rounded bg-white p-3">
                    <h4 className="font-semibold text-blue-900">{section.title}</h4>
                    <p className="mt-1 text-sm text-blue-800">{section.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="rounded-lg border border-dashed border-[var(--border)] bg-slate-50 p-4 text-center text-sm text-slate-500">
            [{block.type}]
          </div>
        );
    }
  } catch {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
        خطا در نمایش بلاک
      </div>
    );
  }
}
