"use client";

import { useState } from "react";
import Image from "next/image";
import type { PhotoItem } from "@/lib/data/gallery";

type AlbumViewProps = {
  photos: PhotoItem[];
  albumTitle: string;
};

export function AlbumView({ photos, albumTitle }: AlbumViewProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (photo: PhotoItem, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: "prev" | "next") => {
    if (!selectedPhoto) return;
    const newIndex = direction === "next" 
      ? (currentIndex + 1) % photos.length
      : (currentIndex - 1 + photos.length) % photos.length;
    setCurrentIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const downloadPhoto = (photo: PhotoItem) => {
    const link = document.createElement("a");
    link.href = photo.imageUrl;
    link.download = `${albumTitle}-${photo.id}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sharePhoto = async (photo: PhotoItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: albumTitle,
          text: photo.caption || albumTitle,
          url: photo.imageUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(photo.imageUrl);
      alert("لینک تصویر کپی شد");
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => openLightbox(photo, index)}
            className="group relative aspect-square w-full overflow-hidden rounded-lg bg-slate-100 transition hover:opacity-90"
          >
            <Image
              src={photo.imageUrl}
              alt={photo.caption || "تصویر"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          </button>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-4 left-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadPhoto(selectedPhoto);
              }}
              className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
              title="دانلود"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                sharePhoto(selectedPhoto);
              }}
              className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
              title="اشتراک‌گذاری"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigatePhoto("prev");
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigatePhoto("next");
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.caption || "تصویر"}
              width={1200}
              height={800}
              className="max-h-[90vh] w-auto rounded-lg object-contain"
            />
            {selectedPhoto.caption && (
              <p className="mt-4 text-center text-white">{selectedPhoto.caption}</p>
            )}
            <div className="mt-2 text-center text-sm text-white/70">
              {currentIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

