export type SportType = "futsal" | "beach";

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  sport: SportType;
  sourceUrl?: string;
  imageUrl: string;
  isFeatured?: boolean;
};

export type LiveEvent = {
  id: string;
  title: string;
  matchTeams: string;
  startTime?: string;
  status?: string;
  streamLabel?: string;
  href: string;
  imageUrl: string;
  sport: SportType;
};

export type StandingsRow = {
  position: number;
  teamName: string;
  teamLogoUrl?: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalDiff: number;
  points: number;
};

export type Match = {
  id: string;
  sport: SportType;
  homeTeam: string;
  homeLogoUrl?: string;
  awayTeam: string;
  awayLogoUrl?: string;
  dateTime?: string;
  venue?: string;
  status?: string;
  score?: string;
};

export type HomeAcsPayload = {
  heroSlides: Article[];
  latestNews: Article[];
  liveEvents: LiveEvent[];
  fetchedAt: string;
  source: "live" | "cache" | "fallback";
};

export type StandingsPayload = {
  rows: StandingsRow[];
  sport: SportType;
  fetchedAt: string;
  season?: string;
  week?: string;
  source: "live" | "cache" | "fallback";
};

export type MatchesPayload = {
  sport: SportType;
  matches: Match[];
  fetchedAt: string;
  season?: string;
  week?: string;
  source: "live" | "cache" | "fallback";
};
