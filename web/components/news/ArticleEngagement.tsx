"use client";

import { useEffect, useMemo, useState } from "react";

type StoredComment = {
  id: string;
  text: string;
  createdAt: string;
};

export function ArticleEngagement({ slug }: { slug: string }) {
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
      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
        <span>بازدید: {views.toLocaleString("fa-IR")}</span>
        <button
          type="button"
          onClick={toggleLike}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold ${liked ? "bg-brand text-white" : "bg-slate-100 text-[var(--muted)]"}`}
        >
          {liked ? "لغو پسند" : "پسندیدن"}
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-[var(--foreground)]" htmlFor="comment-input">
          دیدگاه خود را بنویسید
        </label>
        <textarea
          id="comment-input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="نظر شما..."
          className="min-h-[100px] w-full rounded-2xl border border-[var(--border)] bg-[#f7f8fa] px-4 py-3 text-sm text-[var(--foreground)] focus:border-brand focus:outline-none"
        />
        <button type="button" onClick={addComment} className="rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-lg">
          ارسال دیدگاه
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-[var(--foreground)]">دیدگاه‌ها</p>
        {comments.length ? (
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li key={comment.id} className="rounded-2xl border border-[var(--border)] bg-[#f7f8fa] p-3 text-sm text-[var(--muted)]">
                <p className="font-medium text-[var(--foreground)]">کاربر میهمان</p>
                <p>{comment.text}</p>
                <span className="text-xs">{new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(comment.createdAt))}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-[var(--muted)]">هنوز نظری ثبت نشده است.</p>
        )}
      </div>
    </section>
  );
}
