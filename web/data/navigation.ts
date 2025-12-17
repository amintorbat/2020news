export type NavChild = {
  title: string;
  href: string;
};

export type NavItem = {
  title: string;
  href: string;
  children?: NavChild[];
};

export const navigationMenu: NavItem[] = [
  { title: "خانه", href: "/" },
  {
    title: "فوتسال",
    href: "/futsal",
    children: [
      { title: "اخبار", href: "/news/futsal" },
      { title: "برنامه و نتایج", href: "/matches?league=futsal" },
      { title: "جدول لیگ", href: "/tables/futsal" },
    ],
  },
  {
    title: "فوتبال ساحلی",
    href: "/beach-soccer",
    children: [
      { title: "اخبار", href: "/news/beach-soccer" },
      { title: "برنامه و نتایج", href: "/matches?league=beach" },
      { title: "جدول لیگ", href: "/tables/beach-soccer" },
    ],
  },
  { title: "باشگاه هواداری", href: "/fan-club" },
  { title: "پادکست", href: "/podcast" },
];
