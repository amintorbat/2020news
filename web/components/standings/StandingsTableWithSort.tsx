"use client";

import { useMemo } from "react";
import { StandingsTable } from "./StandingsTable";
import type { LeagueRow } from "@/lib/data";

export type SortField = "points" | "wins" | "draws" | "losses" | "goalsFor" | "goalsAgainst" | "goalDifference";

export const sortOptions = [
  { id: "points" as const, label: "امتیاز" },
  { id: "wins" as const, label: "برد" },
  { id: "draws" as const, label: "مساوی" },
  { id: "losses" as const, label: "باخت" },
  { id: "goalsFor" as const, label: "گل زده" },
  { id: "goalsAgainst" as const, label: "گل خورده" },
  { id: "goalDifference" as const, label: "تفاضل گل" },
];

type StandingsTableWithSortProps = {
  rows: LeagueRow[];
  sortBy: SortField;
  liveTeamNames?: string[];
};

export function StandingsTableWithSort({ rows, sortBy, liveTeamNames }: StandingsTableWithSortProps) {
  const sortedRows = useMemo(() => {
    const rowsCopy = [...rows];
    
    return rowsCopy.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortBy) {
        case "points":
          aValue = a.points;
          bValue = b.points;
          break;
        case "wins":
          aValue = a.wins;
          bValue = b.wins;
          break;
        case "draws":
          aValue = a.draws;
          bValue = b.draws;
          break;
        case "losses":
          aValue = a.losses;
          bValue = b.losses;
          break;
        case "goalsFor":
          // Goals for not available in data, treat as 0
          aValue = 0;
          bValue = 0;
          break;
        case "goalsAgainst":
          // Goals against not available in data, treat as 0
          aValue = 0;
          bValue = 0;
          break;
        case "goalDifference":
          aValue = a.goalDifference ?? 0;
          bValue = b.goalDifference ?? 0;
          break;
        default:
          aValue = a.points;
          bValue = b.points;
      }

      // Descending sort
      return bValue - aValue;
    });
  }, [rows, sortBy]);

  return <StandingsTable rows={sortedRows} liveTeamNames={liveTeamNames} />;
}
