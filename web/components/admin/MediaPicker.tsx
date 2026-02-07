"use client";

import { useState, useMemo } from "react";
import { Badge } from "./Badge";
import {
  getAllMedia,
  filterMedia,
  searchMedia,
  formatFileSize,
  formatDuration,
  type Media as MediaType,
} from "@/lib/admin/mediaData";
import type { Media, MediaType as MediaTypeEnum } from "@/types/media";

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

type MediaPickerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
  allowedTypes?: MediaTypeEnum[];
  multiple?: boolean;
  selectedMediaIds?: string[];
  title?: string;
};

export function MediaPicker({
  isOpen,
  onClose,
  onSelect,
  allowedTypes,
  multiple = false,
  selectedMediaIds = [],
  title = "انتخاب رسانه",
}: MediaPickerProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MediaTypeEnum | "">("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(selectedMediaIds));
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const allMedia = getAllMedia();
  const filteredMedia = useMemo(() => {
    let result = [...allMedia];

    // Filter by allowed types
    if (allowedTypes && allowedTypes.length > 0) {
      result = result.filter((m) => allowedTypes.includes(m.type));
    }

    // Apply search
    if (search) {
      const searched = searchMedia(search);
      result = result.filter((m) => searched.some((s) => s.id === m.id));
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((m) => m.type === typeFilter);
    }

    // Only show active media
    result = result.filter((m) => m.status === "active");

    return result;
  }, [allMedia, search, typeFilter, allowedTypes]);

  const handleSelect = (media: Media) => {
    if (multiple) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(media.id)) {
          next.delete(media.id);
        } else {
          next.add(media.id);
        }
        return next;
      });
    } else {
      onSelect(media);
      onClose();
    }
  };

  const handleConfirmMultiple = () => {
    const selected = filteredMedia.filter((m) => selectedIds.has(m.id));
    if (selected.length > 0) {
      selected.forEach((m) => onSelect(m));
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-6xl max-h-[90vh] bg-white rounded-xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 p-4 border-b border-slate-200 flex-wrap">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو..."
            className="h-8 flex-1 min-w-[150px] rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as MediaTypeEnum | "")}
            className="h-8 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
          >
            <option value="">همه انواع</option>
            {Object.entries(typeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`h-8 w-8 rounded-md border flex items-center justify-center transition-colors ${
                viewMode === "grid"
                  ? "border-brand bg-brand text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`h-8 w-8 rounded-md border flex items-center justify-center transition-colors ${
                viewMode === "list"
                  ? "border-brand bg-brand text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-sm">هیچ رسانه‌ای یافت نشد</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((item) => (
                <MediaPickerCard
                  key={item.id}
                  media={item}
                  selected={selectedIds.has(item.id)}
                  onSelect={() => handleSelect(item)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMedia.map((item) => (
                <MediaPickerRow
                  key={item.id}
                  media={item}
                  selected={selectedIds.has(item.id)}
                  onSelect={() => handleSelect(item)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 p-4">
          <div className="text-sm text-slate-600">
            {multiple && selectedIds.size > 0 && (
              <span>{selectedIds.size} مورد انتخاب شده</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {multiple && (
              <button
                onClick={handleConfirmMultiple}
                disabled={selectedIds.size === 0}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                تأیید ({selectedIds.size})
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Media Picker Card
function MediaPickerCard({
  media,
  selected,
  onSelect,
}: {
  media: Media;
  selected: boolean;
  onSelect: () => void;
}) {
  const getPreviewUrl = () => {
    if (media.type === "image" && media.filePath) {
      return media.filePath;
    }
    if (media.type === "video" && media.thumbnailPath) {
      return media.thumbnailPath;
    }
    if (media.type === "embed") {
      return "/images/placeholder-video.jpg";
    }
    return "/images/placeholder-document.jpg";
  };

  return (
    <div
      className={`group relative rounded-lg border-2 overflow-hidden bg-white cursor-pointer transition-all ${
        selected ? "border-brand ring-2 ring-brand/20" : "border-slate-200 hover:border-slate-300"
      }`}
      onClick={onSelect}
    >
      {/* Checkbox */}
      <div className="absolute top-2 right-2 z-10">
        <div
          className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
            selected
              ? "border-brand bg-brand"
              : "border-white bg-white/80 group-hover:bg-white"
          }`}
        >
          {selected && (
            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="aspect-square bg-slate-100 relative overflow-hidden">
        <img
          src={getPreviewUrl()}
          alt={media.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
          }}
        />
        {media.type === "video" && media.duration && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(media.duration)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="text-xs font-medium text-slate-900 line-clamp-2 mb-1">{media.title}</p>
        <div className="flex items-center justify-between">
          <Badge variant={typeColors[media.type]} className="text-[10px]">
            {typeLabels[media.type]}
          </Badge>
          <span className="text-[10px] text-slate-500">{formatFileSize(media.size)}</span>
        </div>
      </div>
    </div>
  );
}

// Media Picker Row
function MediaPickerRow({
  media,
  selected,
  onSelect,
}: {
  media: Media;
  selected: boolean;
  onSelect: () => void;
}) {
  const getPreviewUrl = () => {
    if (media.type === "image" && media.filePath) {
      return media.filePath;
    }
    if (media.type === "video" && media.thumbnailPath) {
      return media.thumbnailPath;
    }
    if (media.type === "embed") {
      return "/images/placeholder-video.jpg";
    }
    return "/images/placeholder-document.jpg";
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
        selected ? "border-brand bg-brand/5" : "border-slate-200 hover:border-slate-300"
      }`}
      onClick={onSelect}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={onSelect}
        className="rounded border-slate-300 text-brand focus:ring-brand"
      />
      <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
        <img
          src={getPreviewUrl()}
          alt={media.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 truncate">{media.title}</p>
        {media.description && (
          <p className="text-xs text-slate-500 truncate">{media.description}</p>
        )}
      </div>
      <Badge variant={typeColors[media.type]} className="text-xs">
        {typeLabels[media.type]}
      </Badge>
      <span className="text-xs text-slate-500">{formatFileSize(media.size)}</span>
    </div>
  );
}
