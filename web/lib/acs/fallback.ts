import { latestNews, standings, weeklyMatches } from "@/lib/data";
import { Article, HomeAcsPayload, MatchesPayload, StandingsPayload, type Match, type SportType } from "./types";
import { cleanText, normalizeTeamName } from "./utils";

type SupportedLeague = SportType;

export function getFallbackHomePayload(): HomeAcsPayload {
  const articles: Article[] = latestNews.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.summary ?? "",
    publishedAt: item.publishDate,
    category: item.category,
    sport: inferSportFromCategory(item.category),
    imageUrl: item.image,
  }));

  return {
    heroSlides: articles.slice(0, 5),
    latestNews: articles,
    liveEvents: [],
    fetchedAt: new Date().toISOString(),
    source: "fallback",
  };
}

export function getFallbackStandingsPayload(league: SupportedLeague): StandingsPayload {
  const rows = (standings[league] ?? []).map((row) => ({
    position: row.rank,
    teamName: normalizeTeamName(row.team),
    played: row.played,
    wins: row.wins,
    draws: row.draws,
    losses: row.losses,
    goalDiff: row.goalDifference,
    points: row.points,
  }));

  return {
    sport: league,
    rows,
    fetchedAt: new Date().toISOString(),
    source: "fallback",
  };
}

export function getFallbackMatchesPayload(league: SupportedLeague): MatchesPayload {
  const matches: Match[] = (weeklyMatches[league] ?? []).map((match) => ({
    id: match.id,
    sport: league,
    homeTeam: normalizeTeamName(cleanText(match.opponent.split("-")[0] ?? match.opponent)),
    awayTeam: normalizeTeamName(cleanText(match.opponent.split("-")[1] ?? match.opponent)),
    dateTime: match.date,
    venue: match.venue,
    status: match.time,
  }));

  return {
    sport: league,
    matches,
    fetchedAt: new Date().toISOString(),
    source: "fallback",
  };
}

function inferSportFromCategory(category: string) {
  if (/ساحلی/.test(category)) return "beach";
  return "futsal";
}
