"use client";

import { useEffect, useState } from "react";

type ArticleLikeButtonProps = {
  slug: string;
};

export function ArticleLikeButton({ slug }: ArticleLikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const likeKey = `2020news:like:${slug}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(likeKey);
      setLiked(stored === "1");
    } catch {
      setLiked(false);
    }
  }, [likeKey]);

  const toggleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(likeKey, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggleLike}
      className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
        liked
          ? "border-brand bg-brand text-white"
          : "border-[var(--border)] bg-white text-slate-700 hover:border-brand hover:bg-brand/5 hover:text-brand"
      }`}
      aria-label={liked ? "لغو پسند" : "پسندیدن"}
    >
      {liked ? (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )}
    </button>
  );
}

