"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type StoredComment = {
  id: string;
  text: string;
  createdAt: string;
};

type ArticleEngagementProps = {
  slug: string;
  isAuthenticated?: boolean;
};

export function ArticleEngagement({ slug, isAuthenticated = false }: ArticleEngagementProps) {
  const [views, setViews] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<StoredComment[]>([]);
  const [draft, setDraft] = useState("");

  const viewKey = useMemo(() => `2020news:view:${slug}`, [slug]);
  const likeKey = useMemo(() => `2020news:like:${slug}`, [slug]);
  const commentsKey = useMemo(() => `2020news:comments:${slug}`, [slug]);

  useEffect(() => {
    try {
      const current = Number(localStorage.getItem(viewKey) ?? "0");
      const nextValue = current + 1;
      localStorage.setItem(viewKey, String(nextValue));
      setViews(nextValue);
    } catch {
      setViews((value) => (value === 0 ? 1 : value));
    }
  }, [viewKey]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(likeKey);
      setLiked(stored === "1");
    } catch {
      setLiked(false);
    }
    try {
      const storedComments = localStorage.getItem(commentsKey);
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      }
    } catch {
      setComments([]);
    }
  }, [likeKey, commentsKey]);

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

  const addComment = () => {
    if (!draft.trim()) return;
    setComments((prev) => {
      const next = [
        { id: `${Date.now()}`, text: draft.trim(), createdAt: new Date().toISOString() },
        ...prev,
      ];
      try {
        localStorage.setItem(commentsKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
    setDraft("");
  };

  return (
    <section className="space-y-4 rounded-3xl border border-[var(--border)] bg-white p-6" dir="rtl">
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <span>بازدید: {views.toLocaleString("fa-IR")}</span>
        <button
          type="button"
          onClick={toggleLike}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold ${liked ? "bg-brand text-white" : "bg-slate-100 text-slate-600"}`}
        >
          {liked ? "لغو پسند" : "پسندیدن"}
        </button>
      </div>

      {/* Comment Form - Only show if authenticated */}
      {isAuthenticated ? (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900" htmlFor="comment-input">
            دیدگاه خود را بنویسید
          </label>
          <textarea
            id="comment-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="نظر شما..."
            className="min-h-[100px] w-full rounded-2xl border border-[var(--border)] bg-[#f7f8fa] px-4 py-3 text-sm text-slate-900 focus:border-brand focus:outline-none"
          />
          <button
            type="button"
            onClick={addComment}
            className="rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-brand/90"
          >
            ارسال دیدگاه
          </button>
          <p className="text-xs text-slate-500">دیدگاه شما پس از تایید نمایش داده می‌شود</p>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-slate-50 p-4 text-center">
          <p className="mb-3 text-sm text-slate-700">
            برای ارسال نظر باید وارد حساب کاربری شوید
          </p>
          <Link
            href="/register"
            className="inline-block rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-brand/90"
          >
            ساخت حساب کاربری
          </Link>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-900">دیدگاه‌ها</p>
        {comments.length ? (
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li key={comment.id} className="rounded-2xl border border-[var(--border)] bg-[#f7f8fa] p-3 text-sm text-slate-600">
                <p className="font-medium text-slate-900">کاربر میهمان</p>
                <p className="text-slate-800">{comment.text}</p>
                <span className="text-xs text-slate-500">
                  {new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short", calendar: "persian" }).format(new Date(comment.createdAt))}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-600">هنوز نظری ثبت نشده است.</p>
        )}
      </div>
    </section>
  );
}
