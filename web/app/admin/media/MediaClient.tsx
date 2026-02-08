"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/admin/Badge";
import { Toast } from "@/components/admin/Toast";
import { FilterBar, FilterSearch, FilterSelect } from "@/components/admin/FilterBar";
import {
  getAllMedia,
  searchMedia,
  deleteMedia,
  archiveMedia,
  getAllTags,
  formatFileSize,
  formatDuration,
  userNames,
} from "@/lib/admin/mediaData";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { GalleryManager } from "./GalleryManager";
import { PublicGalleriesManager } from "./PublicGalleriesManager";
import { PublicVideosManager } from "./PublicVideosManager";
import type { Media, MediaType as MediaTypeEnum, MediaStatus } from "@/types/media";

const typeLabels: Record<MediaTypeEnum, string> = {
  image: "تصویر",
  video: "ویدیو",
  audio: "صوتی",
  document: "سند",
  embed: "جاسازی شده",
};

const typeColors: Record<MediaTypeEnum, "default" | "info" | "warning" | "success" | "danger"> = {
  image: "info",
  video: "warning",
  audio: "success",
  document: "default",
  embed: "danger",
};

type TabId = "library" | "galleries" | "videos" | "gallery-manager";

const TABS: { id: TabId; label: string; href?: string }[] = [
  { id: "library", label: "کتابخانه رسانه" },
  { id: "galleries", label: "گالری تصاویر", href: "/gallery" },
  { id: "videos", label: "ویدیوها", href: "/videos" },
  { id: "gallery-manager", label: "مدیریت گالری‌ها" },
];

export default function MediaClient() {
  const [activeTab, setActiveTab] = useState<TabId>("library");
  const [media, setMedia] = useState<Media[]>(getAllMedia());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MediaTypeEnum | "">("");
  const [statusFilter, setStatusFilter] = useState<MediaStatus | "">("");
  const [tagFilter, setTagFilter] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const allTags = getAllTags();

  const filteredMedia = useMemo(() => {
    let result = [...media];
    if (search.trim()) {
      const searched = searchMedia(search);
      const ids = new Set(searched.map((m) => m.id));
      result = result.filter((m) => ids.has(m.id));
    }
    if (typeFilter) result = result.filter((m) => m.type === typeFilter);
    if (statusFilter) result = result.filter((m) => m.status === statusFilter);
    if (tagFilter) result = result.filter((m) => m.tags.includes(tagFilter));
    return result;
  }, [media, search, typeFilter, statusFilter, tagFilter]);

  const stats = useMemo(() => {
    const all = media;
    return {
      total: all.length,
      image: all.filter((m) => m.type === "image").length,
      video: all.filter((m) => m.type === "video").length,
      audio: all.filter((m) => m.type === "audio").length,
      document: all.filter((m) => m.type === "document").length,
      archived: all.filter((m) => m.status === "archived").length,
    };
  }, [media]);

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredMedia.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredMedia.map((m) => m.id)));
  };

  const handleBulkAction = (action: "archive" | "delete") => {
    if (selectedIds.size === 0) {
      setToast({ message: "حداقل یک مورد انتخاب کنید", type: "error" });
      return;
    }
    const text = action === "archive" ? "آرشیو" : "حذف";
    if (!confirm(`آیا از ${text} کردن ${selectedIds.size} مورد اطمینان دارید؟`)) return;
    selectedIds.forEach((id) => (action === "archive" ? archiveMedia(id) : deleteMedia(id)));
    setMedia(getAllMedia());
    setSelectedIds(new Set());
    setToast({ message: `${selectedIds.size} مورد ${text} شد`, type: "success" });
  };

  const handleDelete = (id: string) => {
    if (confirm("آیا از حذف این رسانه اطمینان دارید؟")) {
      deleteMedia(id);
      setMedia(getAllMedia());
      setToast({ message: "رسانه حذف شد", type: "success" });
    }
  };

  const handleArchive = (id: string) => {
    archiveMedia(id);
    setMedia(getAllMedia());
    setToast({ message: "رسانه آرشیو شد", type: "success" });
  };

  const handleUploadComplete = () => {
    setMedia(getAllMedia());
    setShowUploadModal(false);
    setToast({ message: "رسانه با موفقیت اضافه شد", type: "success" });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="مرکز رسانه"
        subtitle="کتابخانه رسانه، گالری تصاویر و ویدیوهای عمومی — هماهنگ با صفحات /gallery و /videos"
        action={
          activeTab === "library" ? (
            <button
              onClick={() => setShowUploadModal(true)}
              className="rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors touch-manipulation min-h-[44px]"
            >
              + افزودن رسانه
            </button>
          ) : null
        }
      />

      {/* تب‌های اصلی */}
      <div className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
        <nav className="flex flex-wrap gap-1" aria-label="بخش‌های مرکز رسانه">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors touch-manipulation min-h-[44px] ${
                activeTab === tab.id
                  ? "bg-brand text-white shadow"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {tab.label}
              {tab.href && (
                <Link
                  href={tab.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-80 hover:opacity-100"
                  title="باز کردن در سایت"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              )}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "library" && (
        <>
          {/* آمار سریع */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: "کل", value: stats.total, color: "bg-slate-100 text-slate-700" },
              { label: "تصویر", value: stats.image, color: "bg-blue-100 text-blue-700" },
              { label: "ویدیو", value: stats.video, color: "bg-amber-100 text-amber-700" },
              { label: "صوتی", value: stats.audio, color: "bg-green-100 text-green-700" },
              { label: "سند", value: stats.document, color: "bg-slate-100 text-slate-600" },
              { label: "آرشیو", value: stats.archived, color: "bg-slate-100 text-slate-500" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl border border-slate-200/80 p-3 sm:p-4 ${s.color}`}>
                <div className="text-xs font-medium opacity-90">{s.label}</div>
                <div className="text-xl sm:text-2xl font-bold mt-0.5">{s.value}</div>
              </div>
            ))}
          </div>

          {/* فیلترها */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-700 px-1">فیلتر و جستجو</h2>
            <FilterBar>
              <FilterSearch value={search} onChange={setSearch} placeholder="جستجو در رسانه..." className="min-w-[160px] sm:min-w-[200px]" />
              <FilterSelect
                label="نوع"
                value={typeFilter}
                options={Object.entries(typeLabels).map(([v, l]) => ({ value: v as MediaTypeEnum, label: l }))}
                onChange={setTypeFilter}
                placeholder="همه انواع"
              />
              <FilterSelect
                label="وضعیت"
                value={statusFilter}
                options={[{ value: "active" as MediaStatus, label: "فعال" }, { value: "archived" as MediaStatus, label: "آرشیو شده" }]}
                onChange={setStatusFilter}
                placeholder="همه وضعیت‌ها"
              />
              <FilterSelect
                label="برچسب"
                value={tagFilter}
                options={allTags.map((t) => ({ value: t, label: t }))}
                onChange={setTagFilter}
                placeholder="همه برچسب‌ها"
              />
              <div className="flex items-end gap-2 shrink-0">
                <span className="text-xs font-medium text-slate-600 hidden sm:block">نمایش</span>
                <div className="flex rounded-xl border border-slate-200 p-0.5 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors touch-manipulation ${viewMode === "grid" ? "bg-white shadow text-brand" : "text-slate-500 hover:text-slate-700"}`}
                    title="شبکه‌ای"
                    aria-label="نمایش شبکه‌ای"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors touch-manipulation ${viewMode === "list" ? "bg-white shadow text-brand" : "text-slate-500 hover:text-slate-700"}`}
                    title="لیستی"
                    aria-label="نمایش لیستی"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </FilterBar>
          </div>

          {/* نوار عملیات گروهی */}
          {selectedIds.size > 0 && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-brand/30 bg-brand/5 p-4">
              <span className="text-sm font-medium text-slate-800">{selectedIds.size} مورد انتخاب شده</span>
              <button onClick={() => handleBulkAction("archive")} className="rounded-lg bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-200 transition-colors">
                آرشیو
              </button>
              <button onClick={() => handleBulkAction("delete")} className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors">
                حذف
              </button>
              <button onClick={() => setSelectedIds(new Set())} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                لغو انتخاب
              </button>
            </div>
          )}

          {/* لیست / گرید */}
          {filteredMedia.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-500 mb-4">هیچ رسانه‌ای با این فیلترها یافت نشد</p>
              <button onClick={() => setShowUploadModal(true)} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand/90">
                + افزودن رسانه
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {filteredMedia.map((item) => (
                <MediaCard
                  key={item.id}
                  media={item}
                  selected={selectedIds.has(item.id)}
                  onSelect={() => handleSelect(item.id)}
                  onDelete={() => handleDelete(item.id)}
                  onArchive={() => handleArchive(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-3 text-right w-10">
                        <input type="checkbox" checked={selectedIds.size === filteredMedia.length && filteredMedia.length > 0} onChange={handleSelectAll} className="rounded border-slate-300 text-brand focus:ring-brand" />
                      </th>
                      <th className="px-3 py-3 text-right font-semibold text-slate-700">رسانه</th>
                      <th className="px-3 py-3 text-right font-semibold text-slate-700 hidden md:table-cell">نوع</th>
                      <th className="px-3 py-3 text-right font-semibold text-slate-700 hidden lg:table-cell">حجم</th>
                      <th className="px-3 py-3 text-right font-semibold text-slate-700 hidden lg:table-cell">آپلود</th>
                      <th className="px-3 py-3 text-right font-semibold text-slate-700 w-24">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMedia.map((item) => (
                      <MediaRow key={item.id} media={item} selected={selectedIds.has(item.id)} onSelect={() => handleSelect(item.id)} onDelete={() => handleDelete(item.id)} onArchive={() => handleArchive(item.id)} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "galleries" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <p className="text-sm text-slate-600 mb-4">محتوای این بخش در صفحه <strong>/gallery</strong> نمایش داده می‌شود.</p>
          <PublicGalleriesManager />
        </div>
      )}

      {activeTab === "videos" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <p className="text-sm text-slate-600 mb-4">محتوای این بخش در صفحه <strong>/videos</strong> نمایش داده می‌شود.</p>
          <PublicVideosManager />
        </div>
      )}

      {activeTab === "gallery-manager" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <GalleryManager />
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} isVisible={!!toast} onClose={() => setToast(null)} />}
      <MediaUpload isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onUploadComplete={handleUploadComplete} />
    </div>
  );
}

function MediaCard({ media, selected, onSelect, onDelete, onArchive }: { media: Media; selected: boolean; onSelect: () => void; onDelete: () => void; onArchive: () => void }) {
  const getPreviewUrl = () => {
    if (media.type === "image" && media.filePath) return media.filePath;
    if (media.type === "video" && media.thumbnailPath) return media.thumbnailPath;
    if (media.type === "embed") return "/images/placeholder-video.jpg";
    return "/images/placeholder-document.jpg";
  };

  return (
    <div
      className={`group relative rounded-2xl border-2 overflow-hidden bg-white transition-all touch-manipulation ${selected ? "border-brand ring-2 ring-brand/20" : "border-slate-200 hover:border-slate-300"}`}
      onClick={onSelect}
    >
      <div className="absolute top-2 right-2 z-10">
        <input type="checkbox" checked={selected} onChange={onSelect} onClick={(e) => e.stopPropagation()} className="h-5 w-5 rounded border-slate-300 text-brand focus:ring-brand cursor-pointer" />
      </div>
      <div className="aspect-square bg-slate-100 relative overflow-hidden">
        <img src={getPreviewUrl()} alt={media.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }} />
        {media.type === "video" && media.duration && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">{formatDuration(media.duration)}</div>
        )}
        {media.status === "archived" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="danger" className="text-xs">آرشیو</Badge>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs font-medium text-slate-900 line-clamp-2 mb-2">{media.title}</p>
        <div className="flex items-center justify-between flex-wrap gap-1">
          <Badge variant={typeColors[media.type]} className="text-[10px]">{typeLabels[media.type]}</Badge>
          <span className="text-[10px] text-slate-500">{formatFileSize(media.size)}</span>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
        <button onClick={(e) => { e.stopPropagation(); onArchive(); }} className="rounded-xl bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-white">آرشیو</button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="rounded-xl bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600">حذف</button>
      </div>
    </div>
  );
}

function MediaRow({ media, selected, onSelect, onDelete, onArchive }: { media: Media; selected: boolean; onSelect: () => void; onDelete: () => void; onArchive: () => void }) {
  const getPreviewUrl = () => {
    if (media.type === "image" && media.filePath) return media.filePath;
    if (media.type === "video" && media.thumbnailPath) return media.thumbnailPath;
    if (media.type === "embed") return "/images/placeholder-video.jpg";
    return "/images/placeholder-document.jpg";
  };

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50/50">
      <td className="px-3 py-2.5">
        <input type="checkbox" checked={selected} onChange={onSelect} className="rounded border-slate-300 text-brand focus:ring-brand" />
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
            <img src={getPreviewUrl()} alt={media.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }} />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-900 truncate">{media.title}</p>
            {media.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-0.5">
                {media.tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5 hidden md:table-cell">
        <Badge variant={typeColors[media.type]} className="text-xs">{typeLabels[media.type]}</Badge>
      </td>
      <td className="px-3 py-2.5 text-slate-600 hidden lg:table-cell">
        {formatFileSize(media.size)}
        {media.duration != null && <span className="text-xs text-slate-400 block">{formatDuration(media.duration)}</span>}
      </td>
      <td className="px-3 py-2.5 text-slate-600 text-xs hidden lg:table-cell">{userNames[media.uploadedBy] || media.uploadedBy}</td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1">
          <button onClick={onArchive} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" title="آرشیو" aria-label="آرشیو">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
          </button>
          <button onClick={onDelete} className="rounded-lg p-2 text-red-600 hover:bg-red-50" title="حذف" aria-label="حذف">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
