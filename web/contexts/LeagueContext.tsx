"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { League } from "@/types/leagues";
import { mockLeagues } from "@/lib/admin/leaguesData";

interface LeagueContextType {
  selectedLeague: League | null;
  setSelectedLeague: (league: League | null) => void;
  availableLeagues: League[];
}

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export function LeagueProvider({ children }: { children: ReactNode }) {
  // Get active leagues only
  const availableLeagues = mockLeagues.filter((l) => l.status === "active");
  
  const [selectedLeague, setSelectedLeague] = useState<League | null>(() => {
    // Auto-select first active league
    return availableLeagues.length > 0 ? availableLeagues[0] : null;
  });

  return (
    <LeagueContext.Provider
      value={{
        selectedLeague,
        setSelectedLeague,
        availableLeagues,
      }}
    >
      {children}
    </LeagueContext.Provider>
  );
}

export function useLeagueContext() {
  const context = useContext(LeagueContext);
  if (context === undefined) {
    throw new Error("useLeagueContext must be used within a LeagueProvider");
  }
  return context;
}
