import { SportType } from "./matches";

// Team status
export type TeamStatus = "active" | "inactive";

// Team model - Core entity for matches, standings, players
export interface Team {
  id: string;
  name: string;
  sport: SportType;
  city?: string;
  logo?: string; // URL or base64 for local images
  primaryColor?: string; // Hex color code
  status: TeamStatus;
  
  // Future features support
  temporaryReporters?: string[]; // User IDs with limited access during matches
  createdAt: string;
  updatedAt: string;
}

// Team form values
export interface TeamFormValues {
  name: string;
  sport: SportType;
  city?: string;
  logo?: string;
  primaryColor?: string;
  status: TeamStatus;
}
