"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/admin/Badge";
import { Toast } from "@/components/admin/Toast";
import { MediaPicker } from "@/components/admin/MediaPicker";
import {
  getAllPublicVideos,
  createPublicVideo,
  updatePublicVideo,
  deletePublicVideo,
  getAllMedia,
} from "@/lib/admin/mediaData";
import type { VideoItem } from "@/lib/data/videos";
import type { LeagueKey } from "@/lib/data";
import type { Media } from "@/types/media";

const sportLabels: Record<LeagueKey, string> = {
  futsal: "فوتسال",
  beach: "فوتبال ساحلی",
};

export function PublicVideosManager() {
  const [videos, setVideos] = useState<VideoItem[]>(getAllPublicVideos());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<LeagueKey | "">("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerFor, setPickerFor] = useState<"thumbnail" | "video">("thumbnail");

  const filteredVideos = useMemo(() => {
    let result = [...videos];

    if (search.trim()) {
      result = result.filter((v) =>
        v.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sportFilter) {
      result = result.filter((v) => v.sport === sportFilter);
    }

    return result;
  }, [videos, search, sportFilter]);

  const handleCreateVideo = (data: {
    title: string;
    thumbnailUrl: string;
    duration: string;
    videoUrl: string;
    sport: LeagueKey;
    publishedAt: string;
    relatedNewsSlug?: string;
  }) => {
    createPublicVideo(data);
    setVideos(getAllPublicVideos());
    setShowCreateModal(false);
    setToast({ message: "ویدیو با موفقیت ایجاد شد", type: "success" });
  };

  const handleUpdateVideo = (id: string, updates: Partial<VideoItem>) => {
    updatePublicVideo(id, updates);
    setVideos(getAllPublicVideos());
    setEditingVideo(null);
    setToast({ message: "ویدیو با موفقیت به‌روزرسانی شد", type: "success" });
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm("آیا از حذف این ویدیو اطمینان دارید؟")) {
      deletePublicVideo(id);
      setVideos(getAllPublicVideos());
      setToast({ message: "ویدیو با موفقیت حذف شد", type: "success" });
    }
  };

  const handleMediaSelect = (media: Media) => {
    if (!editingVideo) return;

    if (pickerFor === "thumbnail" && media.type === "image" && media.filePath) {
      handleUpdateVideo(editingVideo.id, { thumbnailUrl: media.filePath });
      setShowPicker(false);
    } else if (pickerFor === "video" && media.type === "video" && media.filePath) {
      handleUpdateVideo(editingVideo.id, { videoUrl: media.filePath });
      setShowPicker(false);
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">ویدیوهای عمومی</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
        >
          + افزودن ویدیو
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو..."
          className="h-8 min-w-[120px] flex-shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
        />
        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value as LeagueKey | "")}
          className="h-8 min-w-[140px] flex-shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
        >
          <option value="">همه ورزش‌ها</option>
          {Object.entries(sportLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-500 text-sm">هیچ ویدیویی یافت نشد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="group relative rounded-lg border border-slate-200 overflow-hidden bg-white"
            >
              <div className="aspect-video bg-slate-100 relative">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand shadow-lg">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                  {video.duration}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-slate-900 line-clamp-2 mb-2">{video.title}</h3>
                <div className="flex items-center justify-between">
                  <Badge variant="info" className="text-[10px]">
                    {sportLabels[video.sport]}
                  </Badge>
                  <span className="text-xs text-slate-500">{video.publishedAt}</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => {
                      setEditingVideo(video);
                      setPickerFor("thumbnail");
                      setShowPicker(true);
                    }}
                    className="flex-1 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    تغییر کاور
                  </button>
                  <button
                    onClick={() => {
                      setEditingVideo(video);
                      setPickerFor("video");
                      setShowPicker(true);
                    }}
                    className="flex-1 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    تغییر ویدیو
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Video Modal */}
      {showCreateModal && (
        <CreateVideoModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateVideo}
        />
      )}

      {/* Media Picker */}
      <MediaPicker
        isOpen={showPicker}
        onClose={() => {
          setShowPicker(false);
          setEditingVideo(null);
        }}
        onSelect={handleMediaSelect}
        allowedTypes={pickerFor === "thumbnail" ? ["image"] : ["video", "embed"]}
        title={pickerFor === "thumbnail" ? "انتخاب تصویر کاور" : "انتخاب ویدیو"}
      />

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

// Create Video Modal
function CreateVideoModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    thumbnailUrl: string;
    duration: string;
    videoUrl: string;
    sport: LeagueKey;
    publishedAt: string;
    relatedNewsSlug?: string;
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [sport, setSport] = useState<LeagueKey>("futsal");
  const [publishedAt, setPublishedAt] = useState("");
  const [relatedNewsSlug, setRelatedNewsSlug] = useState("");
  const [showThumbnailPicker, setShowThumbnailPicker] = useState(false);
  const [showVideoPicker, setShowVideoPicker] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !thumbnailUrl.trim() || !duration.trim() || !videoUrl.trim() || !publishedAt.trim()) {
      return;
    }
    onSubmit({
      title: title.trim(),
      thumbnailUrl,
      duration,
      videoUrl,
      sport,
      publishedAt,
      relatedNewsSlug: relatedNewsSlug.trim() || undefined,
    });
  };

  const handleThumbnailSelect = (media: Media) => {
    if (media.type === "image" && media.filePath) {
      setThumbnailUrl(media.filePath);
      setShowThumbnailPicker(false);
    }
  };

  const handleVideoSelect = (media: Media) => {
    if (media.type === "video" && media.filePath) {
      setVideoUrl(media.filePath);
      setShowVideoPicker(false);
    } else if (media.type === "embed" && media.embedUrl) {
      setVideoUrl(media.embedUrl);
      setShowVideoPicker(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-900 mb-4">افزودن ویدیو جدید</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">عنوان</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان ویدیو"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">تصویر کاور</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="URL تصویر کاور"
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
              />
              <button
                onClick={() => setShowThumbnailPicker(true)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                انتخاب
              </button>
            </div>
            {thumbnailUrl && (
              <div className="mt-2 h-32 w-full rounded-lg border border-slate-200 overflow-hidden">
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                  }}
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">لینک ویدیو</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="URL ویدیو یا embed"
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
              />
              <button
                onClick={() => setShowVideoPicker(true)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                انتخاب
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">مدت زمان</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="مثال: 05:32"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ورزش</label>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value as LeagueKey)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
            >
              <option value="futsal">فوتسال</option>
              <option value="beach">فوتبال ساحلی</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">تاریخ انتشار</label>
            <input
              type="text"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              placeholder="مثال: ۱۴۰۳/۰۱/۲۰"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              لینک خبر مرتبط (اختیاری)
            </label>
            <input
              type="text"
              value={relatedNewsSlug}
              onChange={(e) => setRelatedNewsSlug(e.target.value)}
              placeholder="slug خبر"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              لغو
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
            >
              ایجاد
            </button>
          </div>
        </div>
      </div>

      {showThumbnailPicker && (
        <MediaPicker
          isOpen={showThumbnailPicker}
          onClose={() => setShowThumbnailPicker(false)}
          onSelect={handleThumbnailSelect}
          allowedTypes={["image"]}
          title="انتخاب تصویر کاور"
        />
      )}

      {showVideoPicker && (
        <MediaPicker
          isOpen={showVideoPicker}
          onClose={() => setShowVideoPicker(false)}
          onSelect={handleVideoSelect}
          allowedTypes={["video", "embed"]}
          title="انتخاب ویدیو"
        />
      )}
    </div>
  );
}
