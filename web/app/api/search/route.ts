import { NextRequest, NextResponse } from "next/server";
import { search, initializeIndex } from "@/lib/search";
import type { SearchFilters } from "@/lib/search/types";

// Initialize index on first request
let initialized = false;

export async function GET(request: NextRequest) {
  if (!initialized) {
    initializeIndex();
    initialized = true;
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || undefined;
  const dateRange = (searchParams.get("dateRange") as SearchFilters["dateRange"]) || "all";
  const sort = (searchParams.get("sort") as SearchFilters["sort"]) || "relevance";
  const type = (searchParams.get("type") as SearchFilters["type"]) || undefined;
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const filters: SearchFilters = {
    category,
    dateRange,
    sort,
    type,
  };

  const results = search(query, filters, limit);

  return NextResponse.json({
    results,
    total: results.length,
    query,
    filters,
  });
}

