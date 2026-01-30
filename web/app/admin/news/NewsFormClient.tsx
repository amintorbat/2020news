"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { BlockEditor } from "@/components/admin/BlockEditor";
import { PersianDatePicker } from "@/components/admin/PersianDatePicker";
import { PersianTimePicker } from "@/components/admin/PersianTimePicker";
import { Toast } from "@/components/admin/Toast";
import { Badge } from "@/components/admin/Badge";
import { generateId } from "@/lib/utils/id";
import { generateUniqueSlug } from "@/lib/utils/slug";
import { calculateReadingTimeFromBlocks } from "@/lib/utils/readingTime";
import { mockNews, mockNewsCategories } from "@/lib/admin/newsData";
import { mockLeagues } from "@/lib/admin/leaguesData";
import { mockMatches } from "@/lib/admin/matchesData";
import { mockTeams } from "@/lib/admin/teamsData";
import { mockPlayers } from "@/lib/admin/playersData";
import type { News, NewsStatus, NewsBlock } from "@/types/news";
import jalaali from "jalaali-js";
import { useRouter as useNewsRouter } from "next/navigation";

type Props = {
  initialNews?: News;
};

const statusLabels: Record<NewsStatus, string> = {
  draft: "پیش‌نویس",
  review: "در انتظار بررسی",
  scheduled: "زمان‌بندی شده",
  published: "منتشر شده",
  archived: "آرشیو شده",
};

export default function NewsFormClient({ initialNews }: Props) {
  const router = useRouter();
  const isEdit = !!initialNews;

  const [form, setForm] = useState<Partial<News>>({
    title: initialNews?.title || "",
    slug: initialNews?.slug || "",
    summary: initialNews?.summary || "",
    status: initialNews?.status || "draft",
    publishAt: initialNews?.publishAt || null,
    categoryId: initialNews?.categoryId || null,
    tags: initialNews?.tags || [],
    seoTitle: initialNews?.seoTitle || "",
    seoDescription: initialNews?.seoDescription || "",
    priority: initialNews?.priority || 50,
    blocks: initialNews?.blocks || [],
    relatedLeagues: initialNews?.relatedLeagues || [],
    relatedMatches: initialNews?.relatedMatches || [],
    relatedTeams: initialNews?.relatedTeams || [],
    relatedPlayers: initialNews?.relatedPlayers || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "settings" | "seo" | "links">("content");

  // Auto-generate slug from title
  useEffect(() => {
    if (form.title && !isEdit) {
      const existingSlugs = mockNews.map((n) => n.slug);
      const newSlug = generateUniqueSlug(form.title, existingSlugs);
      setForm((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [form.title, isEdit]);

  // Auto-generate SEO title from title
  useEffect(() => {
    if (form.title && !form.seoTitle) {
      setForm((prev) => ({ ...prev, seoTitle: prev.title || "" }));
    }
  }, [form.title, form.seoTitle]);

  // Calculate reading time
  const readingTime = useMemo(() => {
    return calculateReadingTimeFromBlocks(form.blocks || []);
  }, [form.blocks]);

  // Parse publish date/time
  const publishDate = useMemo(() => {
    if (!form.publishAt) return { date: "", time: "" };
    try {
      const date = new Date(form.publishAt);
      const jalali = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
      return {
        date: `${jalali.jy}-${String(jalali.jm).padStart(2, "0")}-${String(jalali.jd).padStart(2, "0")}`,
        time: `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
      };
    } catch {
      return { date: "", time: "" };
    }
  }, [form.publishAt]);

  const handleSave = async (status: NewsStatus) => {
    const newErrors: Record<string, string> = {};

    if (!form.title?.trim()) {
      newErrors.title = "عنوان الزامی است";
    }
    if (!form.summary?.trim()) {
      newErrors.summary = "خلاصه الزامی است";
    }
    if (!form.slug?.trim()) {
      newErrors.slug = "اسلاگ الزامی است";
    }
    if ((form.blocks?.length || 0) === 0) {
      newErrors.blocks = "حداقل یک بلاک محتوا لازم است";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setToast({ message: "لطفاً خطاها را برطرف کنید", type: "error" });
      return;
    }

    setIsSaving(true);

    // Convert publish date/time to ISO
    let publishAtISO: string | null = null;
    if (publishDate.date && publishDate.time && (status === "scheduled" || status === "published")) {
      try {
        const [year, month, day] = publishDate.date.split("-").map(Number);
        const [hours, minutes] = publishDate.time.split(":").map(Number);
        const gregorian = jalaali.toGregorian(year, month, day);
        const date = new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd, hours, minutes);
        publishAtISO = date.toISOString();
      } catch {
        // Ignore
      }
    }

    const newsData: News = {
      id: initialNews?.id || generateId(),
      title: form.title!,
      slug: form.slug!,
      summary: form.summary!,
      status,
      publishAt: publishAtISO,
      createdAt: initialNews?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: initialNews?.authorId || "user-3",
      editorId: form.status === "published" ? "user-2" : null,
      categoryId: form.categoryId || null,
      tags: form.tags || [],
      featuredMediaId: form.featuredMediaId || null,
      relatedLeagues: form.relatedLeagues || [],
      relatedMatches: form.relatedMatches || [],
      relatedTeams: form.relatedTeams || [],
      relatedPlayers: form.relatedPlayers || [],
      seoTitle: form.seoTitle || form.title!,
      seoDescription: form.seoDescription || form.summary!,
      viewCount: initialNews?.viewCount || 0,
      readingTime,
      priority: form.priority || 50,
      blocks: form.blocks || [],
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setToast({
      message: isEdit ? "خبر با موفقیت به‌روزرسانی شد" : "خبر با موفقیت ایجاد شد",
      type: "success",
    });

    setIsSaving(false);
    router.push("/admin/news");
  };

  const handleAddTag = () => {
    if (newTag.trim() && !form.tags?.includes(newTag.trim())) {
      setForm((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  return (
    <div className="space-y-4" dir="rtl">
      <PageHeader
        title={isEdit ? "ویرایش خبر" : "ایجاد خبر جدید"}
        subtitle="ایجاد و مدیریت محتوای خبری با ویرایشگر بلاک‌محور حرفه‌ای"
        action={
          <Link
            href="/admin/news"
            className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            بازگشت به لیست
          </Link>
        }
      />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 overflow-hidden">
        {/* Editor Section - Takes 8 columns on large screens */}
        <div className="lg:col-span-8 space-y-4 min-w-0">
          {/* Basic Info Card */}
          <div className="rounded-xl border border-[var(--border)] bg-white shadow-sm">
            <div className="border-b border-[var(--border)] bg-slate-50 px-4 py-3">
              <h2 className="text-base font-bold text-slate-900">اطلاعات پایه</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  عنوان خبر <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="عنوان خبر را وارد کنید..."
                  className="w-full rounded-lg border border-[var(--border)] px-4 py-3 text-base focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    اسلاگ <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.slug || ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="slug"
                      className="flex-1 rounded-lg border border-[var(--border)] px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (form.title) {
                          const existingSlugs = mockNews.map((n) => n.slug);
                          const newSlug = generateUniqueSlug(form.title, existingSlugs);
                          setForm((prev) => ({ ...prev, slug: newSlug }));
                        }
                      }}
                      className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                    >
                      تولید خودکار
                    </button>
                  </div>
                  {errors.slug && (
                    <p className="mt-1 text-xs text-red-500">{errors.slug}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    دسته‌بندی
                  </label>
                  <select
                    value={form.categoryId || ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value || null }))}
                    className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                  >
                    <option value="">بدون دسته‌بندی</option>
                    {mockNewsCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  خلاصه خبر <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.summary || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
                  placeholder="خلاصه کوتاه خبر (حداکثر 200 کاراکتر)..."
                  rows={3}
                  maxLength={200}
                  className="w-full rounded-lg border border-[var(--border)] px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 resize-none"
                />
                <p className="mt-1 text-xs text-slate-500">
                  {form.summary?.length || 0} / 200 کاراکتر
                </p>
                {errors.summary && (
                  <p className="mt-1 text-xs text-red-500">{errors.summary}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  تگ‌ها
                </label>
                <div className="flex flex-wrap gap-2 rounded-lg border border-[var(--border)] bg-slate-50 p-3">
                  {form.tags?.map((tag) => (
                    <Badge key={tag} variant="info" className="flex items-center gap-1.5 px-2.5 py-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-xs hover:text-red-600 font-bold"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  <div className="flex flex-1 gap-2 min-w-[200px]">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="افزودن تگ..."
                      className="flex-1 rounded border border-[var(--border)] bg-white px-3 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand/90 whitespace-nowrap"
                    >
                      افزودن
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Editor Card */}
          <div className="rounded-xl border border-[var(--border)] bg-white shadow-sm">
            <div className="border-b border-[var(--border)] bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">محتوا</h2>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span>زمان مطالعه: {readingTime} دقیقه</span>
                  <span className="h-4 w-px bg-[var(--border)]" />
                  <span>{form.blocks?.length || 0} بلاک</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <BlockEditor
                blocks={form.blocks || []}
                onBlocksChange={(blocks) => setForm((prev) => ({ ...prev, blocks }))}
              />
              {errors.blocks && (
                <p className="mt-3 text-xs text-red-500">{errors.blocks}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Takes 4 columns on large screens */}
        <div className="lg:col-span-4 space-y-4 min-w-0">
          {/* Publish Settings Card */}
          <div className="rounded-xl border border-[var(--border)] bg-white shadow-sm">
            <div className="border-b border-[var(--border)] bg-slate-50 px-4 py-3">
              <h3 className="text-base font-bold text-slate-900">تنظیمات انتشار</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  وضعیت
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as NewsStatus }))}
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {(form.status === "scheduled" || form.status === "published") && (
                <div className="space-y-3 rounded-lg border border-[var(--border)] bg-slate-50 p-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                      تاریخ انتشار
                    </label>
                    <PersianDatePicker
                      value={publishDate.date}
                      onChange={(date) => {
                        const time = publishDate.time || "00:00";
                        if (date) {
                          const [year, month, day] = date.split("-").map(Number);
                          const [hours, minutes] = time.split(":").map(Number);
                          const gregorian = jalaali.toGregorian(year, month, day);
                          const dateObj = new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd, hours, minutes);
                          setForm((prev) => ({ ...prev, publishAt: dateObj.toISOString() }));
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                      زمان انتشار
                    </label>
                    <PersianTimePicker
                      value={publishDate.time}
                      onChange={(time) => {
                        const date = publishDate.date;
                        if (date && time) {
                          const [year, month, day] = date.split("-").map(Number);
                          const [hours, minutes] = time.split(":").map(Number);
                          const gregorian = jalaali.toGregorian(year, month, day);
                          const dateObj = new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd, hours, minutes);
                          setForm((prev) => ({ ...prev, publishAt: dateObj.toISOString() }));
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => handleSave("draft")}
                  disabled={isSaving}
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  {isSaving ? "در حال ذخیره..." : "ذخیره پیش‌نویس"}
                </button>
                <button
                  type="button"
                  onClick={() => handleSave("review")}
                  disabled={isSaving}
                  className="w-full rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
                >
                  ارسال برای بررسی
                </button>
                <button
                  type="button"
                  onClick={() => handleSave("published")}
                  disabled={isSaving}
                  className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
                >
                  انتشار
                </button>
              </div>
            </div>
          </div>

          {/* SEO Settings Card */}
          <div className="rounded-xl border border-[var(--border)] bg-white shadow-sm">
            <div className="border-b border-[var(--border)] bg-slate-50 px-4 py-3">
              <h3 className="text-base font-bold text-slate-900">تنظیمات SEO</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  عنوان SEO
                </label>
                <input
                  type="text"
                  value={form.seoTitle || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
                  placeholder="عنوان برای موتورهای جستجو..."
                  maxLength={60}
                  className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
                <p className="mt-1 text-xs text-slate-500">
                  {form.seoTitle?.length || 0} / 60 کاراکتر
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  توضیحات SEO
                </label>
                <textarea
                  value={form.seoDescription || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
                  placeholder="توضیحات برای موتورهای جستجو..."
                  rows={3}
                  maxLength={160}
                  className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 resize-none"
                />
                <p className="mt-1 text-xs text-slate-500">
                  {form.seoDescription?.length || 0} / 160 کاراکتر
                </p>
              </div>

              {/* SEO Preview */}
              <div className="rounded-lg border border-[var(--border)] bg-slate-50 p-3">
                <p className="mb-2 text-xs font-medium text-slate-700">پیش‌نمایش:</p>
                <div className="space-y-1.5">
                  <div className="text-sm font-semibold text-blue-600 line-clamp-1">
                    {form.seoTitle || form.title || "عنوان SEO"}
                  </div>
                  <div className="text-xs text-green-700 line-clamp-1">
                    https://2020news.ir/news/{form.slug || "slug"}
                  </div>
                  <div className="text-xs text-slate-600 line-clamp-2">
                    {form.seoDescription || form.summary || "توضیحات SEO"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reports & Notes Link Card */}
          <div className="rounded-xl border border-[var(--border)] bg-white shadow-sm">
            <div className="border-b border-[var(--border)] bg-slate-50 px-4 py-3">
              <h3 className="text-base font-bold text-slate-900">گزارش‌ها و یادداشت‌ها</h3>
            </div>
            <div className="p-4">
              <p className="mb-3 text-xs text-slate-600">
                گزارش‌ها و یادداشت‌های مسابقات که در بلاک‌های "گزارش مسابقه" و "یادداشت" ایجاد می‌کنید،
                به صورت خودکار به صفحه گزارش‌ها متصل می‌شوند.
              </p>
              <a
                href="/reports"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 text-center transition-colors"
              >
                مشاهده صفحه گزارش‌ها →
              </a>
            </div>
          </div>

          {/* Internal Links Card */}
          <div className="rounded-xl border border-[var(--border)] bg-white shadow-sm">
            <div className="border-b border-[var(--border)] bg-slate-50 px-4 py-3">
              <h3 className="text-base font-bold text-slate-900">پیوندهای داخلی</h3>
            </div>
            <div className="max-h-[500px] overflow-y-auto p-4">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-700">
                    لیگ‌های مرتبط
                  </label>
                  <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-white">
                    <select
                      multiple
                      value={form.relatedLeagues || []}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                        setForm((prev) => ({ ...prev, relatedLeagues: selected }));
                      }}
                      className="block w-full border-0 bg-transparent px-3 py-2 text-xs focus:ring-0 focus:outline-none"
                      style={{ 
                        height: "120px", 
                        overflowY: "auto",
                        overflowX: "hidden"
                      }}
                    >
                      {mockLeagues.map((league) => (
                        <option key={league.id} value={league.id} className="break-words px-2 py-1.5">
                          {league.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-1.5 text-[10px] text-slate-500">
                    Ctrl/Cmd برای انتخاب چندتایی
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-700">
                    مسابقات مرتبط
                  </label>
                  <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-white">
                    <select
                      multiple
                      value={form.relatedMatches || []}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                        setForm((prev) => ({ ...prev, relatedMatches: selected }));
                      }}
                      className="block w-full border-0 bg-transparent px-3 py-2 text-xs focus:ring-0 focus:outline-none"
                      style={{ 
                        height: "120px", 
                        overflowY: "auto",
                        overflowX: "hidden"
                      }}
                    >
                      {mockMatches.map((match) => (
                        <option key={match.id} value={match.id} className="break-words px-2 py-1.5">
                          {match.homeTeam} vs {match.awayTeam}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-700">
                    تیم‌های مرتبط
                  </label>
                  <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-white">
                    <select
                      multiple
                      value={form.relatedTeams || []}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                        setForm((prev) => ({ ...prev, relatedTeams: selected }));
                      }}
                      className="block w-full border-0 bg-transparent px-3 py-2 text-xs focus:ring-0 focus:outline-none"
                      style={{ 
                        height: "120px", 
                        overflowY: "auto",
                        overflowX: "hidden"
                      }}
                    >
                      {mockTeams.map((team) => (
                        <option key={team.id} value={team.id} className="break-words px-2 py-1.5">
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-700">
                    بازیکنان مرتبط
                  </label>
                  <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-white">
                    <select
                      multiple
                      value={form.relatedPlayers || []}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                        setForm((prev) => ({ ...prev, relatedPlayers: selected }));
                      }}
                      className="block w-full border-0 bg-transparent px-3 py-2 text-xs focus:ring-0 focus:outline-none"
                      style={{ 
                        height: "120px", 
                        overflowY: "auto",
                        overflowX: "hidden"
                      }}
                    >
                      {mockPlayers.map((player) => (
                        <option key={player.id} value={player.id} className="break-words px-2 py-1.5">
                          {player.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Priority & Preview */}
          <div className="rounded-xl border border-[var(--border)] bg-white shadow-sm">
            <div className="border-b border-[var(--border)] bg-slate-50 px-4 py-3">
              <h3 className="text-base font-bold text-slate-900">سایر تنظیمات</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  اولویت (۰-۱۰۰)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.priority || 50}
                  onChange={(e) => setForm((prev) => ({ ...prev, priority: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full rounded-lg border-2 border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                {showPreview ? "بستن پیش‌نمایش" : "پیش‌نمایش خبر"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowPreview(false)}>
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[var(--border)] bg-slate-50 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">پیش‌نمایش خبر</h3>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                بستن
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <article className="prose prose-slate max-w-none">
                <h1 className="text-3xl font-bold mb-4">{form.title || "عنوان خبر"}</h1>
                <p className="text-lg text-slate-600 mb-6">{form.summary || "خلاصه خبر"}</p>
                <div className="mt-6 space-y-6">
                  {(form.blocks || []).map((block) => (
                    <BlockPreview key={block.id} block={block} />
                  ))}
                </div>
              </article>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

// Block Preview Component for Preview Modal
function BlockPreview({ block }: { block: NewsBlock }) {
  try {
    const content = JSON.parse(block.content || "{}");

    switch (block.type) {
      case "paragraph":
        return <p className="text-base leading-7 text-slate-900">{content.text || ""}</p>;
      case "heading":
        const HeadingTag = `h${content.level || 2}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          1: "text-4xl font-bold mb-4",
          2: "text-3xl font-bold mb-3",
          3: "text-2xl font-semibold mb-2",
          4: "text-xl font-semibold mb-2",
          5: "text-lg font-semibold mb-1",
          6: "text-base font-semibold mb-1",
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
              <cite className="mt-2 block text-sm text-slate-500">
                — {content.author}
              </cite>
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
