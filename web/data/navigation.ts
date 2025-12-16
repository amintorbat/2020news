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
      { title: "اخبار", href: "/futsal" },
      { title: "برنامه و نتایج", href: "/matches?type=futsal" },
      { title: "جدول لیگ", href: "/tables?type=futsal" },
    ],
  },
  {
    title: "فوتبال ساحلی",
    href: "/beach-football",
    children: [
      { title: "اخبار", href: "/beach-football" },
      { title: "برنامه و نتایج", href: "/matches?type=beach" },
      { title: "جدول لیگ", href: "/tables?type=beach" },
    ],
  },
  { title: "باشگاه هواداری", href: "/fan-club" },
  { title: "پادکست", href: "/podcast" },
];
