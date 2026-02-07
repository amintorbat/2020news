"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/admin/Badge";
import { Toast } from "@/components/admin/Toast";
import { MediaPicker } from "@/components/admin/MediaPicker";
import {
  getAllPublicAlbums,
  getPhotosByAlbumId,
  createPublicAlbum,
  updatePublicAlbum,
  deletePublicAlbum,
  addPhotoToAlbum,
  removePhotoFromAlbum,
  getAllMedia,
} from "@/lib/admin/mediaData";
import type { PhotoAlbum, PhotoItem } from "@/lib/data/gallery";
import type { LeagueKey } from "@/lib/data";
import type { Media } from "@/types/media";

const sportLabels: Record<LeagueKey, string> = {
  futsal: "فوتسال",
  beach: "فوتبال ساحلی",
};

export function PublicGalleriesManager() {
  const [albums, setAlbums] = useState<PhotoAlbum[]>(getAllPublicAlbums());
  const [selectedAlbum, setSelectedAlbum] = useState<PhotoAlbum | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<LeagueKey | "">("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const allMedia = getAllMedia();

  const filteredAlbums = useMemo(() => {
    let result = [...albums];

    if (search.trim()) {
      result = result.filter((a) =>
        a.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sportFilter) {
      result = result.filter((a) => a.sport === sportFilter);
    }

    return result;
  }, [albums, search, sportFilter]);

  const handleCreateAlbum = (data: {
    title: string;
    coverImageUrl: string;
    sport: LeagueKey;
    publishedAt: string;
    relatedNewsSlug?: string;
  }) => {
    const newAlbum = createPublicAlbum({
      ...data,
      imageCount: 0,
    });
    setAlbums(getAllPublicAlbums());
    setShowCreateModal(false);
    setToast({ message: "گالری با موفقیت ایجاد شد", type: "success" });
    setSelectedAlbum(newAlbum);
  };

  const handleDeleteAlbum = (id: string) => {
    if (confirm("آیا از حذف این گالری اطمینان دارید؟")) {
      deletePublicAlbum(id);
      setAlbums(getAllPublicAlbums());
      if (selectedAlbum?.id === id) {
        setSelectedAlbum(null);
      }
      setToast({ message: "گالری با موفقیت حذف شد", type: "success" });
    }
  };

  const handleAddPhoto = (media: Media) => {
    if (!selectedAlbum) return;

    if (media.type !== "image") {
      setToast({ message: "فقط تصاویر می‌توانند به گالری اضافه شوند", type: "error" });
      return;
    }

    addPhotoToAlbum(selectedAlbum.id, {
      imageUrl: media.filePath || media.thumbnailPath || "",
      caption: media.title,
    });

    setAlbums(getAllPublicAlbums());
    setShowPicker(false);
    setToast({ message: "تصویر با موفقیت به گالری اضافه شد", type: "success" });
  };

  const handleRemovePhoto = (photoId: string) => {
    if (confirm("آیا از حذف این تصویر اطمینان دارید؟")) {
      removePhotoFromAlbum(photoId);
      setAlbums(getAllPublicAlbums());
      setToast({ message: "تصویر با موفقیت حذف شد", type: "success" });
    }
  };

  const selectedPhotos = selectedAlbum ? getPhotosByAlbumId(selectedAlbum.id) : [];

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">گالری‌های عمومی</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
        >
          + ایجاد گالری جدید
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Albums List */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-sm font-semibold text-slate-700">گالری‌ها</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredAlbums.map((album) => (
              <div
                key={album.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAlbum?.id === album.id
                    ? "border-brand bg-brand/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                onClick={() => setSelectedAlbum(album)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900">{album.title}</h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAlbum(album.id);
                    }}
                    className="rounded p-1 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="info" className="text-[10px]">
                    {sportLabels[album.sport]}
                  </Badge>
                  <span className="text-xs text-slate-500">{album.imageCount} تصویر</span>
                </div>
                <p className="text-xs text-slate-600">{album.publishedAt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Album Editor */}
        <div className="lg:col-span-2">
          {selectedAlbum ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{selectedAlbum.title}</h3>
                <button
                  onClick={() => setShowPicker(true)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
                >
                  + افزودن تصویر
                </button>
              </div>

              {selectedPhotos.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-slate-200 p-12 text-center">
                  <p className="text-slate-500 text-sm">هیچ تصویری در این گالری وجود ندارد</p>
                  <button
                    onClick={() => setShowPicker(true)}
                    className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-brand border border-brand hover:bg-brand/5 transition-colors"
                  >
                    افزودن تصویر
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {selectedPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative rounded-lg border border-slate-200 overflow-hidden bg-white"
                    >
                      <div className="aspect-square bg-slate-100 relative">
                        <img
                          src={photo.imageUrl}
                          alt={photo.caption || "تصویر"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                          }}
                        />
                        <button
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-red-500 p-1.5 text-white hover:bg-red-600"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      {photo.caption && (
                        <div className="p-2">
                          <p className="text-xs text-slate-700 line-clamp-2">{photo.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-slate-200 p-12 text-center">
              <p className="text-slate-500 text-sm">یک گالری را انتخاب کنید یا گالری جدید ایجاد کنید</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Album Modal */}
      {showCreateModal && (
        <CreateAlbumModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateAlbum}
        />
      )}

      {/* Media Picker */}
      <MediaPicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={handleAddPhoto}
        allowedTypes={["image"]}
        title="انتخاب تصویر برای گالری"
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

// Create Album Modal
function CreateAlbumModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    coverImageUrl: string;
    sport: LeagueKey;
    publishedAt: string;
    relatedNewsSlug?: string;
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [sport, setSport] = useState<LeagueKey>("futsal");
  const [publishedAt, setPublishedAt] = useState("");
  const [relatedNewsSlug, setRelatedNewsSlug] = useState("");
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const allMedia = getAllMedia();

  const handleSubmit = () => {
    if (!title.trim() || !coverImageUrl.trim() || !publishedAt.trim()) {
      return;
    }
    onSubmit({
      title: title.trim(),
      coverImageUrl,
      sport,
      publishedAt,
      relatedNewsSlug: relatedNewsSlug.trim() || undefined,
    });
  };

  const handleMediaSelect = (media: Media) => {
    if (media.type === "image" && media.filePath) {
      setCoverImageUrl(media.filePath);
      setShowMediaPicker(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-xl p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">ایجاد گالری جدید</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">عنوان</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان گالری"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">تصویر کاور</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="URL تصویر کاور"
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
              />
              <button
                onClick={() => setShowMediaPicker(true)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                انتخاب
              </button>
            </div>
            {coverImageUrl && (
              <div className="mt-2 h-32 w-full rounded-lg border border-slate-200 overflow-hidden">
                <img
                  src={coverImageUrl}
                  alt="Cover"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                  }}
                />
              </div>
            )}
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

      {showMediaPicker && (
        <MediaPicker
          isOpen={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
          onSelect={handleMediaSelect}
          allowedTypes={["image"]}
          title="انتخاب تصویر کاور"
        />
      )}
    </div>
  );
}
