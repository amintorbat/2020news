import type { Metadata } from "next";
import "@/app/globals.css";
import { vazirmatn } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "2020news | رسانه تخصصی فوتسال و فوتبال ساحلی",
  description:
    "پوشش تخصصی اخبار، نتایج زنده، جدول و گلزنان فوتسال و فوتبال ساحلی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased font-sans">
        <Header />
        <main className="pt-28 pb-16">{children}</main>
      </body>
    </html>
  );
}
