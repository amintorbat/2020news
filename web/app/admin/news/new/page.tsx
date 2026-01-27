import { PageHeader } from "@/components/admin/PageHeader";

export default function AdminNewsNewPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader title="ایجاد خبر جدید" subtitle="افزودن خبر جدید به سایت" />
      <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">عنوان</label>
            <input
              type="text"
              className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              placeholder="عنوان خبر"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">اسلاگ</label>
            <input
              type="text"
              className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              placeholder="news-slug"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">لید</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              placeholder="خلاصه خبر..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">محتوا</label>
            <textarea
              rows={10}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              placeholder="متن کامل خبر..."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">دسته‌بندی</label>
              <select className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20">
                <option>گزارش</option>
                <option>یادداشت</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">ورزش</label>
              <select className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20">
                <option>فوتسال</option>
                <option>فوتبال ساحلی</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90"
            >
              ذخیره
            </button>
            <button
              type="button"
              className="rounded-xl border border-[var(--border)] bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
