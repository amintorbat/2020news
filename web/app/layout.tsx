import type { Metadata } from "next";
import "@/app/globals.css";
import { vazirmatn } from "@/lib/fonts";
import { Navbar } from "@/components/layout/Navbar";
import { LiveTicker } from "@/components/layout/LiveTicker";
import { SettingsGate } from "@/components/SettingsGate";

export const metadata: Metadata = {
  title: "2020news | رسانه تخصصی فوتسال و فوتبال ساحلی",
  description:
    "پوشش تخصصی اخبار، نتایج زنده، جدول و گلزنان فوتسال و فوتبال ساحلی",
  icons: {
    icon: "/images/logoicon.png",
    shortcut: "/images/logoicon.png",
    apple: "/images/logoicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased font-sans">
        <LiveTicker />
        <Navbar />
        <main className="pb-16">
          <SettingsGate>{children}</SettingsGate>
        </main>
      </body>
    </html>
  );
}
