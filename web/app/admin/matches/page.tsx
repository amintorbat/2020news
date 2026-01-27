import MatchesClient, { MatchItem } from "./MatchesClient";

const matches: MatchItem[] = [
  {
    id: 1,
    home: "گیتی پسند",
    score: "2 - 1",
    away: "مس سونگون",
    competition: "لیگ برتر",
    week: "هفته ۵",
    date: "1403/05/12",
    status: "پایان‌یافته",
  },
];

export default function Page() {
  return <MatchesClient items={matches} />;
}

