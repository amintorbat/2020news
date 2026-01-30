"use client";

import { useState, useRef, useEffect } from "react";
import { mockMedia, type MediaItem } from "@/lib/admin/mock";

type MediaPickerProps = {
  type: "image" | "video";
  value: string;
  onChange: (mediaId: string) => void;
  onFileUpload?: (file: File) => void;
  disabled?: boolean;
};

export function MediaPicker({
  type,
  value,
  onChange,
  onFileUpload,
  disabled = false,
}: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const availableMedia = mockMedia.filter((m) => m.type === type);
  const selectedMedia = mockMedia.find((m) => m.id === value);

  const handleFileSelect = (file: File) => {
    if (onFileUpload) {
      onFileUpload(file);
    } else {
      // Create a preview URL
      const url = URL.createObjectURL(file);
      // In a real app, you would upload the file here
      console.log("File selected:", file.name);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (
        (type === "image" && file.type.startsWith("image/")) ||
        (type === "video" && file.type.startsWith("video/"))
      ) {
        handleFileSelect(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2" dir="rtl">
      {/* Selected Media Display */}
      {selectedMedia && (
        <div className="rounded-lg border border-[var(--border)] bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                {type === "image" ? "🖼" : "▶"}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-900">{selectedMedia.title}</p>
                <p className="text-[10px] text-slate-500">
                  {(selectedMedia.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={disabled}
              className="rounded px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              حذف
            </button>
          </div>
        </div>
      )}

      {/* Media Selection */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {selectedMedia ? "تغییر" : "انتخاب از گالری"}
        </button>

        {isOpen && (
          <div className="rounded-lg border border-[var(--border)] bg-white p-3 max-h-48 overflow-y-auto">
            <div className="space-y-2">
              {availableMedia.length > 0 ? (
                availableMedia.map((media) => (
                  <button
                    key={media.id}
                    type="button"
                    onClick={() => {
                      onChange(media.id);
                      setIsOpen(false);
                    }}
                    className={`w-full rounded-lg border p-2 text-right text-xs transition-colors ${
                      value === media.id
                        ? "border-brand bg-brand/10"
                        : "border-[var(--border)] bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-slate-200 flex items-center justify-center text-[10px]">
                        {type === "image" ? "🖼" : "▶"}
                      </div>
                      <div className="flex-1 text-right">
                        <p className="font-medium text-slate-900">{media.title}</p>
                        <p className="text-[10px] text-slate-500">
                          {(media.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">
                  هیچ {type === "image" ? "تصویری" : "ویدیویی"} در گالری وجود ندارد
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Drag & Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
          dragActive
            ? "border-brand bg-brand/5"
            : "border-[var(--border)] bg-slate-50 hover:border-brand/50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={type === "image" ? "image/*" : "video/*"}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
        <div className="space-y-2">
          <div className="text-2xl">{type === "image" ? "🖼" : "▶"}</div>
          <p className="text-xs font-medium text-slate-700">
            {type === "image" ? "آپلود تصویر" : "آپلود ویدیو"}
          </p>
          <p className="text-[10px] text-slate-500">
            فایل را اینجا بکشید یا کلیک کنید
          </p>
        </div>
      </div>
    </div>
  );
}
