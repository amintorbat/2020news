import Link from "next/link";

export default function AdminForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-xl border-2 border-red-200 bg-red-50 p-8 text-center" dir="rtl">
      <h1 className="text-xl font-bold text-red-800">دسترسی غیرمجاز</h1>
      <p className="mt-2 text-slate-700">شما به این بخش دسترسی ندارید.</p>
      <Link
        href="/admin"
        className="mt-6 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90"
      >
        بازگشت به داشبورد
      </Link>
    </div>
  );
}
