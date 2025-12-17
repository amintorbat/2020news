import { NextResponse } from "next/server";
import { getMatchesContent } from "@/lib/acs/matches";
import { ACS_REVALIDATE_SECONDS } from "@/lib/acs/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const season = searchParams.get("season") ?? undefined;
  const week = searchParams.get("week") ?? undefined;
  const payload = await getMatchesContent("futsal", season, week);

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": `s-maxage=${ACS_REVALIDATE_SECONDS}`,
    },
  });
}
