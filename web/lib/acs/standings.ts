import { load } from "cheerio";
import { getFallbackStandingsPayload } from "./fallback";
import { StandingsPayload, StandingsRow, type SportType } from "./types";
import { cleanText, fetchWithRetry, inferSport, normalizeTeamName } from "./utils";
import { logWarnOnce } from "./logger";
import { readCache, writeCache } from "./cache";

type StandingsCache = { expiresAt: number; rowsBySport: Record<SportType, StandingsRow[]> };
let standingsCache: StandingsCache | null = null;
let standingsLoading: Promise<Record<SportType, StandingsRow[]>> | null = null;
type CheerioRoot = ReturnType<typeof load>;

export async function getStandingsContent(sport: SportType, season?: string, week?: string): Promise<StandingsPayload> {
  try {
    const rowsBySport = await loadStandingsRows();
    const rows = rowsBySport[sport] ?? [];
    if (!rows.length) {
      throw new Error(`No standings rows for ${sport}`);
    }

    return {
      sport,
      rows,
      fetchedAt: new Date().toISOString(),
      season,
      week,
      source: "live",
    };
  } catch (error) {
    logWarnOnce(`standings-${sport}`, "Serving fallback standings data", error);
    const cachedRows = await readCache<StandingsRow[]>(`standings-${sport}`);
    if (cachedRows?.length) {
      return {
        sport,
        rows: cachedRows,
        fetchedAt: new Date().toISOString(),
        season,
        week,
        source: "cache",
      };
    }
    return getFallbackStandingsPayload(sport);
  }
}

async function loadStandingsRows() {
  if (standingsCache && standingsCache.expiresAt > Date.now()) {
    return standingsCache.rowsBySport;
  }
  if (standingsLoading) {
    return standingsLoading;
  }

  standingsLoading = (async () => {
    const response = await fetchWithRetry("/");
    if (!response) throw new Error("ACS_SKIP");
    const html = await response.text();
    const $ = load(html);
    const rowsBySport = extractStandingsBySport($);
    await Promise.all(
      Object.entries(rowsBySport).map(([sport, rows]) => writeCache(`standings-${sport}`, rows))
    );
    standingsCache = {
      rowsBySport,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };
    return rowsBySport;
  })();

  try {
    return await standingsLoading;
  } finally {
    standingsLoading = null;
  }
}

function extractStandingsBySport($: CheerioRoot) {
  const result: Record<SportType, StandingsRow[]> = { futsal: [], beach: [] };

  $("table").each((_, table) => {
    const headers = $(table)
      .find("thead th")
      .map((__, th) => cleanText($(th).text()))
      .get();
    if (!headers.length || !headers.some((header) => /تیم|Team/i.test(header))) {
      return;
    }

    const contextTitle =
      cleanText($(table).closest(".da-box1, .da-box, .tbl-container").find(".da-header-text, h3, h2").first().text()) ||
      cleanText($(table).prevAll("h3, h2").first().text());
    const sport = inferSport(contextTitle);
    const rows: StandingsRow[] = [];

    $(table)
      .find("tbody tr")
      .each((__, row) => {
        const cells = $(row)
          .find("td")
          .map((___, td) => cleanText($(td).text()))
          .get();
        if (!cells.length) return;

        const getIndex = (label: string) => headers.findIndex((header) => header.includes(label));
        const positionIdx = getIndex("رتبه");
        const teamIdx = getIndex("تیم");
        const playedIdx = getIndex("بازی");
        const winsIdx = getIndex("برد");
        const drawsIdx = getIndex("مساوی");
        const lossesIdx = getIndex("باخت");
        const diffIdx = getIndex("تفاضل");
        const pointsIdx = getIndex("امتیاز");

        const rawTeamName = teamIdx >= 0 ? cells[teamIdx] : cells[1];
        const teamName = normalizeTeamName(rawTeamName);
        if (!teamName) return;

        rows.push({
          position: positionIdx >= 0 ? parseInt(cells[positionIdx] ?? "0", 10) || rows.length + 1 : rows.length + 1,
          teamName,
          played: playedIdx >= 0 ? parseInt(cells[playedIdx] ?? "0", 10) || 0 : 0,
          wins: winsIdx >= 0 ? parseInt(cells[winsIdx] ?? "0", 10) || 0 : 0,
          draws: drawsIdx >= 0 ? parseInt(cells[drawsIdx] ?? "0", 10) || 0 : 0,
          losses: lossesIdx >= 0 ? parseInt(cells[lossesIdx] ?? "0", 10) || 0 : 0,
          goalDiff: diffIdx >= 0 ? parseInt(cells[diffIdx] ?? "0", 10) || 0 : 0,
          points: pointsIdx >= 0 ? parseInt(cells[pointsIdx] ?? "0", 10) || 0 : 0,
        });
      });

    if (rows.length && result[sport]) {
      result[sport] = rows;
    }
  });

  return result;
}
