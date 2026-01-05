"use client";

import { useState } from "react";
import Image from "next/image";
import type { PhotoItem, PhotoAlbum } from "@/lib/data/gallery";

type Comment = {
  id: string;
  author: string;
  text: string;
  date: string;
  likes: number;
};

type AlbumViewProps = {
  photos: PhotoItem[];
  album: PhotoAlbum;
};

const mockComments: Comment[] = [
  {
    id: "c1",
    author: "علی احمدی",
    text: "تصاویر عالی بود! ممنون از تیم تحریریه",
    date: "۲ ساعت پیش",
    likes: 12,
  },
  {
    id: "c2",
    author: "محمد رضایی",
    text: "خیلی خوب بود، منتظر آلبوم‌های بعدی هستیم",
    date: "۳ ساعت پیش",
    likes: 8,
  },
  {
    id: "c3",
    author: "حسین کریمی",
    text: "عالی! لطفا بیشتر از این آلبوم‌ها بذارید",
    date: "۵ ساعت پیش",
    likes: 15,
  },
];

export function AlbumView({ photos, album }: AlbumViewProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(87);
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);

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

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = album.title;

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      alert("لینک کپی شد");
      setShowShareMenu(false);
      return;
    }

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank");
      setShowShareMenu(false);
    }
  };


  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c${Date.now()}`,
      author: "کاربر",
      text: newComment,
      date: "همین الان",
      likes: 0,
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Photo Grid */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6">
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
      </div>

      {/* Actions: Like, Share */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              isLiked
                ? "bg-red-50 text-red-600"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <svg className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likesCount}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              اشتراک‌گذاری
            </button>
            {showShareMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-lg border border-[var(--border)] bg-white p-2 shadow-lg z-10">
                <button
                  onClick={() => handleShare("copy")}
                  className="w-full rounded px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50"
                >
                  کپی لینک
                </button>
                <button
                  onClick={() => handleShare("telegram")}
                  className="w-full rounded px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50"
                >
                  تلگرام
                </button>
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="w-full rounded px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50"
                >
                  واتساپ
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="w-full rounded px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50"
                >
                  توییتر
                </button>
                <button
                  onClick={() => handleShare("facebook")}
                  className="w-full rounded px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50"
                >
                  فیسبوک
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-6">
        <h3 className="mb-4 text-lg font-bold text-slate-900">نظرات ({comments.length})</h3>
        
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="نظر خود را بنویسید..."
              className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="submit"
              className="rounded-lg bg-brand px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
            >
              ارسال
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-slate-100 pb-4 last:border-b-0">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                  {comment.author[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{comment.author}</span>
                    <span className="text-xs text-slate-500">{comment.date}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{comment.text}</p>
                  <button className="mt-2 flex items-center gap-1 text-xs text-slate-500 hover:text-brand">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {comment.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
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

          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare("copy");
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
    </div>
  );
}
