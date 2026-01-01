"use client";

import { useState } from "react";

type NewsletterBoxProps = {
  variant?: "default" | "compact";
};

export function NewsletterBox({ variant = "default" }: NewsletterBoxProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError("لطفا ایمیل خود را وارد کنید");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("لطفا یک ایمیل معتبر وارد کنید");
      return;
    }

    // TODO: Connect to backend API
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 3000);
  };

  if (variant === "compact") {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-gradient-to-br from-brand/5 to-brand/10 p-4" dir="rtl">
        <h3 className="mb-2 text-sm font-bold text-slate-900">خبرنامه</h3>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل شما"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          {submitted && (
            <p className="text-xs text-green-600">عضویت شما با موفقیت ثبت شد!</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-brand/90"
          >
            عضویت در خبرنامه
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-gradient-to-br from-slate-50 to-white p-6" dir="rtl">
      <h3 className="mb-2 text-lg font-bold text-slate-900">عضویت در خبرنامه</h3>
      <p className="mb-4 text-sm text-slate-600">
        آخرین اخبار و تحلیل‌های فوتسال و فوتبال ساحلی را در ایمیل خود دریافت کنید
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="آدرس ایمیل شما"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          {submitted && (
            <p className="mt-1 text-xs text-green-600">عضویت شما با موفقیت ثبت شد!</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-brand/90"
        >
          عضویت در خبرنامه
        </button>
      </form>
    </div>
  );
}

