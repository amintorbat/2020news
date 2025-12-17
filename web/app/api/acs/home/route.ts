import { NextResponse } from "next/server";
import { getHomeContent } from "@/lib/acs/home";
import { ACS_REVALIDATE_SECONDS } from "@/lib/acs/constants";

export async function GET() {
  const payload = await getHomeContent();
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": `s-maxage=${ACS_REVALIDATE_SECONDS}`,
    },
  });
}
