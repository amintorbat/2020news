export type HeroItem = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  badge?: "live" | "breaking";
};

export const heroItems: HeroItem[] = [
  {
    id: 1,
    title: "ایران – ژاپن | نیمه نهایی فوتسال آسیا",
    excerpt: "تیم ملی فوتسال ایران در دیداری حساس مقابل ژاپن به میدان می‌رود.",
    image: "/hero/futsal-1.jpg",
    badge: "live",
  },
  {
    id: 2,
    title: "صعود تیم ملی فوتبال ساحلی به فینال",
    excerpt: "ملی‌پوشان ساحلی ایران با پیروزی در نیمه نهایی راهی فینال شدند.",
    image: "/hero/beach-1.jpg",
    badge: "breaking",
  },
  {
    id: 3,
    title: "اعلام برنامه هفته آینده لیگ فوتسال",
    excerpt: "سازمان لیگ برنامه کامل مسابقات هفته آینده را اعلام کرد.",
    image: "/hero/futsal-2.jpg",
  },
];
