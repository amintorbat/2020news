import { load } from "cheerio";
import { getFallbackMatchesPayload } from "./fallback";
import { Match, MatchesPayload, type SportType } from "./types";
import { cleanText, fetchWithRetry, inferSport, normalizeTeamName } from "./utils";
import { logWarnOnce } from "./logger";
import { readCache, writeCache } from "./cache";

type MatchesCache = { expiresAt: number; matchesBySport: Record<SportType, Match[]> };
let matchesCache: MatchesCache | null = null;
let matchesLoading: Promise<Record<SportType, Match[]>> | null = null;
type CheerioRoot = ReturnType<typeof load>;

export async function getMatchesContent(sport: SportType, season?: string, week?: string): Promise<MatchesPayload> {
  try {
    const matchesBySport = await loadMatches();
    const matches = matchesBySport[sport] ?? [];
    if (!matches.length) {
      throw new Error("No matches parsed");
    }

    return {
      sport,
      matches,
      fetchedAt: new Date().toISOString(),
      season,
      week,
      source: "live",
    };
  } catch (error) {
    logWarnOnce(`matches-${sport}`, "Falling back to local schedule", error);
    const cachedMatches = await readCache<Match[]>(`matches-${sport}`);
    if (cachedMatches?.length) {
      return {
        sport,
        matches: cachedMatches,
        fetchedAt: new Date().toISOString(),
        season,
        week,
        source: "cache",
      };
    }
    return getFallbackMatchesPayload(sport);
  }
}

async function loadMatches() {
  if (matchesCache && matchesCache.expiresAt > Date.now()) {
    return matchesCache.matchesBySport;
  }
  if (matchesLoading) {
    return matchesLoading;
  }

  matchesLoading = (async () => {
    const response = await fetchWithRetry("/Live-Score");
    const html = await response.text();
    const $ = load(html);
    const matchesBySport = parseMatchesBySport($);
    await Promise.all(
      Object.entries(matchesBySport).map(([sport, list]) => writeCache(`matches-${sport}`, list))
    );
    matchesCache = {
      matchesBySport,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };
    return matchesBySport;
  })();

  try {
    return await matchesLoading;
  } finally {
    matchesLoading = null;
  }
}

function parseMatchesBySport($: CheerioRoot) {
  const result: Record<SportType, Match[]> = { futsal: [], beach: [] };

  $(".match, .fixture-item, .schedule-row, .results-row, .match-row").each((_, element) => {
    const node = $(element);
    const sportLabel =
      cleanText(node.closest(".da-header-text, h3, h2").text()) ||
      cleanText(node.parentsUntil("body").find(".da-header-text, h3, h2").first().text());
    const sport = inferSport(sportLabel);

    const homeTeam = normalizeTeamName(cleanText(node.find(".home, .team-home, .teamA, .team").first().text()));
    const awayTeam =
      normalizeTeamName(
        cleanText(node.find(".away, .team-away, .teamB").first().text()) || cleanText(node.find(".team").last().text())
      );
    if (!homeTeam || !awayTeam) return;

    const dateTime = cleanText(node.find(".date, .time, .match-time").first().text());
    const venue = cleanText(node.find(".venue").first().text());
    const status = cleanText(node.find(".status, .match-status").first().text());
    const score = cleanText(node.find(".score, .match-score").first().text());

    const id = `${homeTeam}-${awayTeam}-${dateTime || status}`.replace(/\s+/g, "-");
    const match: Match = {
      id,
      sport,
      homeTeam,
      awayTeam,
      dateTime,
      venue,
      status,
      score,
    };

    result[sport]?.push(match);
  });

  return result;
}
