"use client";

import { useState, useRef } from "react";
import { Toast } from "./Toast";
import { createMedia, formatFileSize } from "@/lib/admin/mediaData";
import type { Media, MediaType, UploadProgress } from "@/types/media";

type MediaUploadProps = {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (media: Media) => void;
  allowedTypes?: MediaType[];
  maxSize?: number; // In bytes
};

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB default

export function MediaUpload({
  isOpen,
  onClose,
  onUploadComplete,
  allowedTypes,
  maxSize = MAX_FILE_SIZE,
}: MediaUploadProps) {
  const [uploadType, setUploadType] = useState<"file" | "embed">("file");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Validate file type
      const fileType = getFileType(file);
      if (!fileType) {
        setToast({ message: `نوع فایل ${file.name} پشتیبانی نمی‌شود`, type: "error" });
        return;
      }

      if (allowedTypes && !allowedTypes.includes(fileType)) {
        setToast({ message: `نوع فایل ${file.name} مجاز نیست`, type: "error" });
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        setToast({ message: `حجم فایل ${file.name} بیش از حد مجاز است`, type: "error" });
        return;
      }

      // Add to upload queue
      const fileId = `${Date.now()}-${Math.random()}`;
      setUploads((prev) => [
        ...prev,
        {
          fileId,
          fileName: file.name,
          progress: 0,
          status: "pending",
        },
      ]);

      // Start upload
      uploadFile(file, fileId, fileType);
    });
  };

  const uploadFile = async (file: File, fileId: string, type: MediaType) => {
    setUploads((prev) =>
      prev.map((u) => (u.fileId === fileId ? { ...u, status: "uploading" } : u))
    );

    try {
      // Simulate chunked upload
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      let uploadedBytes = 0;

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        uploadedBytes += chunk.size;
        const progress = Math.round((uploadedBytes / file.size) * 100);

        setUploads((prev) =>
          prev.map((u) => (u.fileId === fileId ? { ...u, progress } : u))
        );
      }

      // Create media object
      const media = createMedia({
        type,
        title: title || file.name,
        description: description || undefined,
        filePath: `/uploads/${type}s/${file.name}`, // In real app, use actual uploaded path
        size: file.size,
        mimeType: file.type,
        width: type === "image" ? 1920 : undefined, // Would be extracted from file
        height: type === "image" ? 1080 : undefined,
        uploadedBy: "user-1", // In real app, use actual user ID
        status: "active",
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      });

      setUploads((prev) =>
        prev.map((u) =>
          u.fileId === fileId
            ? { ...u, status: "completed", progress: 100, uploadedMediaId: media.id }
            : u
        )
      );

      onUploadComplete(media);
      setToast({ message: `${file.name} با موفقیت آپلود شد`, type: "success" });
    } catch (error) {
      setUploads((prev) =>
        prev.map((u) =>
          u.fileId === fileId
            ? { ...u, status: "error", error: "خطا در آپلود فایل" }
            : u
        )
      );
      setToast({ message: `خطا در آپلود ${file.name}`, type: "error" });
    }
  };

  const handleEmbedSubmit = () => {
    if (!embedUrl) {
      setToast({ message: "لطفاً لینک ویدیو را وارد کنید", type: "error" });
      return;
    }

    // Validate embed URL (YouTube or Aparat)
    if (!isValidEmbedUrl(embedUrl)) {
      setToast({ message: "لینک باید از آپارات یا یوتیوب باشد", type: "error" });
      return;
    }

    const media = createMedia({
      type: "embed",
      title: title || "ویدیوی جاسازی شده",
      description: description || undefined,
      embedUrl,
      size: 0,
      mimeType: "text/html",
      uploadedBy: "user-1",
      status: "active",
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
    });

    onUploadComplete(media);
    setToast({ message: "ویدیو با موفقیت اضافه شد", type: "success" });
    handleReset();
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setTags("");
    setEmbedUrl("");
    setUploads([]);
    setUploadType("file");
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
    handleFileSelect(e.dataTransfer.files);
  };

  const getFileType = (file: File): MediaType | null => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    if (file.type === "application/pdf" || file.type.includes("document")) return "document";
    return null;
  };

  const isValidEmbedUrl = (url: string): boolean => {
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/;
    const aparatRegex = /aparat\.com\//;
    return youtubeRegex.test(url) || aparatRegex.test(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h2 className="text-lg font-bold text-slate-900">آپلود رسانه</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Upload Type Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200">
            <button
              onClick={() => setUploadType("file")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                uploadType === "file"
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              آپلود فایل
            </button>
            <button
              onClick={() => setUploadType("embed")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                uploadType === "embed"
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              ویدیوی جاسازی شده
            </button>
          </div>

          {/* Common Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">عنوان</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان رسانه"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">توضیحات (اختیاری)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات رسانه"
                rows={3}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">برچسب‌ها (جدا شده با کاما)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="مسابقه, گیتی پسند, گزارش"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
              />
            </div>
          </div>

          {/* File Upload */}
          {uploadType === "file" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">فایل</label>
              <div
                ref={dropZoneRef}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  dragActive
                    ? "border-brand bg-brand/5"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={allowedTypes?.map((t) => {
                    if (t === "image") return "image/*";
                    if (t === "video") return "video/*";
                    if (t === "audio") return "audio/*";
                    if (t === "document") return "application/pdf,.doc,.docx";
                    return "*/*";
                  }).join(",")}
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
                <div className="space-y-2">
                  <div className="text-4xl">📁</div>
                  <p className="text-sm font-medium text-slate-700">
                    فایل را اینجا بکشید یا کلیک کنید
                  </p>
                  <p className="text-xs text-slate-500">
                    حداکثر حجم: {formatFileSize(maxSize)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Embed URL */}
          {uploadType === "embed" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                لینک ویدیو (آپارات یا یوتیوب)
              </label>
              <input
                type="url"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="https://www.aparat.com/v/..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
              />
            </div>
          )}

          {/* Upload Progress */}
          {uploads.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">پیشرفت آپلود</label>
              {uploads.map((upload) => (
                <div key={upload.fileId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700">{upload.fileName}</span>
                    <span className="text-slate-500">{upload.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        upload.status === "error"
                          ? "bg-red-500"
                          : upload.status === "completed"
                          ? "bg-green-500"
                          : "bg-brand"
                      }`}
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                  {upload.error && (
                    <p className="text-xs text-red-600">{upload.error}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 p-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            بستن
          </button>
          {uploadType === "embed" && (
            <button
              onClick={handleEmbedSubmit}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
            >
              افزودن
            </button>
          )}
        </div>
      </div>

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
