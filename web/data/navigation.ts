export type MenuItem = {
  title: string;
  href?: string;
  children?: { title: string; href: string }[];
};

export const navigationMenu: MenuItem[] = [
  {
    title: "خانه",
    href: "/",
  },
  {
    title: "فوتسال",
    children: [
      { title: "اخبار فوتسال", href: "/futsal" },
      { title: "بازی‌ها و نتایج فوتسال", href: "/matches?tab=futsal" },
      { title: "جدول لیگ فوتسال", href: "/league-table?tab=futsal" },
    ],
  },
  {
    title: "فوتبال ساحلی",
    children: [
      { title: "اخبار فوتبال ساحلی", href: "/beach-football" },
      { title: "بازی‌ها و نتایج فوتبال ساحلی", href: "/matches?tab=beach" },
      { title: "جدول لیگ فوتبال ساحلی", href: "/league-table?tab=beach" },
    ],
  },
  {
    title: "باشگاه هواداری",
    href: "/fan-club",
  },
  {
    title: "پادکست",
    href: "/podcast",
  },
];
