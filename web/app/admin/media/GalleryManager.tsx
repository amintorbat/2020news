"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/admin/Badge";
import { MediaPicker } from "@/components/admin/MediaPicker";
import {
  getAllGalleries,
  createGallery,
  updateGallery,
  deleteGallery,
  getMediaById,
  getAllMedia,
} from "@/lib/admin/mediaData";
import type { Gallery, Media } from "@/types/media";

export function GalleryManager() {
  const [galleries, setGalleries] = useState<Gallery[]>(getAllGalleries());
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [newGalleryDescription, setNewGalleryDescription] = useState("");

  const allMedia = getAllMedia();

  const handleCreateGallery = () => {
    if (!newGalleryTitle.trim()) return;

    const gallery = createGallery({
      title: newGalleryTitle,
      description: newGalleryDescription || undefined,
      mediaIds: [],
      createdBy: "user-1",
    });

    setGalleries(getAllGalleries());
    setNewGalleryTitle("");
    setNewGalleryDescription("");
    setShowCreateModal(false);
    setSelectedGallery(gallery);
  };

  const handleAddMedia = (media: Media) => {
    if (!selectedGallery) return;

    const updated = updateGallery(selectedGallery.id, {
      mediaIds: [...selectedGallery.mediaIds, media.id],
    });

    if (updated) {
      setSelectedGallery(updated);
      setGalleries(getAllGalleries());
    }
  };

  const handleRemoveMedia = (mediaId: string) => {
    if (!selectedGallery) return;

    const updated = updateGallery(selectedGallery.id, {
      mediaIds: selectedGallery.mediaIds.filter((id) => id !== mediaId),
      coverMediaId:
        selectedGallery.coverMediaId === mediaId
          ? undefined
          : selectedGallery.coverMediaId,
    });

    if (updated) {
      setSelectedGallery(updated);
      setGalleries(getAllGalleries());
    }
  };

  const handleSetCover = (mediaId: string) => {
    if (!selectedGallery) return;

    const updated = updateGallery(selectedGallery.id, {
      coverMediaId: mediaId,
    });

    if (updated) {
      setSelectedGallery(updated);
      setGalleries(getAllGalleries());
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (!selectedGallery) return;

    const newMediaIds = [...selectedGallery.mediaIds];
    const [removed] = newMediaIds.splice(fromIndex, 1);
    newMediaIds.splice(toIndex, 0, removed);

    const updated = updateGallery(selectedGallery.id, {
      mediaIds: newMediaIds,
    });

    if (updated) {
      setSelectedGallery(updated);
      setGalleries(getAllGalleries());
    }
  };

  const handleDeleteGallery = (id: string) => {
    if (confirm("آیا از حذف این گالری اطمینان دارید؟")) {
      deleteGallery(id);
      setGalleries(getAllGalleries());
      if (selectedGallery?.id === id) {
        setSelectedGallery(null);
      }
    }
  };

  const selectedMedia = useMemo(() => {
    if (!selectedGallery) return [];
    return selectedGallery.mediaIds
      .map((id) => getMediaById(id))
      .filter((m): m is Media => m !== undefined);
  }, [selectedGallery]);

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">مدیریت گالری‌ها</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
        >
          + ایجاد گالری جدید
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Gallery List */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-sm font-semibold text-slate-700">گالری‌ها</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {galleries.map((gallery) => (
              <div
                key={gallery.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedGallery?.id === gallery.id
                    ? "border-brand bg-brand/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                onClick={() => setSelectedGallery(gallery)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900">{gallery.title}</h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGallery(gallery.id);
                    }}
                    className="rounded p-1 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-2">{gallery.mediaIds.length} رسانه</p>
                {gallery.description && (
                  <p className="text-xs text-slate-600 line-clamp-2">{gallery.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Editor */}
        <div className="lg:col-span-2">
          {selectedGallery ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{selectedGallery.title}</h3>
                <button
                  onClick={() => setShowPicker(true)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
                >
                  + افزودن رسانه
                </button>
              </div>

              {selectedMedia.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-slate-200 p-12 text-center">
                  <p className="text-slate-500 text-sm">هیچ رسانه‌ای در این گالری وجود ندارد</p>
                  <button
                    onClick={() => setShowPicker(true)}
                    className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-brand border border-brand hover:bg-brand/5 transition-colors"
                  >
                    افزودن رسانه
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {selectedMedia.map((media, index) => (
                    <div
                      key={media.id}
                      className="group relative rounded-lg border border-slate-200 overflow-hidden bg-white"
                    >
                      <div className="aspect-square bg-slate-100 relative">
                        <img
                          src={media.filePath || media.thumbnailPath || "/images/placeholder.jpg"}
                          alt={media.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                          }}
                        />
                        {selectedGallery.coverMediaId === media.id && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="success" className="text-[10px]">کاور</Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium text-slate-900 line-clamp-2 mb-2">
                          {media.title}
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleSetCover(media.id)}
                            className="flex-1 rounded px-2 py-1 text-[10px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                          >
                            کاور
                          </button>
                          <button
                            onClick={() => handleRemoveMedia(media.id)}
                            className="rounded px-2 py-1 text-[10px] font-medium text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
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

      {/* Create Gallery Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">ایجاد گالری جدید</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">عنوان</label>
                <input
                  type="text"
                  value={newGalleryTitle}
                  onChange={(e) => setNewGalleryTitle(e.target.value)}
                  placeholder="عنوان گالری"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">توضیحات (اختیاری)</label>
                <textarea
                  value={newGalleryDescription}
                  onChange={(e) => setNewGalleryDescription(e.target.value)}
                  placeholder="توضیحات گالری"
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  لغو
                </button>
                <button
                  onClick={handleCreateGallery}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
                >
                  ایجاد
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker */}
      <MediaPicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={handleAddMedia}
        allowedTypes={["image", "video"]}
        title="انتخاب رسانه برای گالری"
      />
    </div>
  );
}
