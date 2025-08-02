// src/types/spacex.ts

export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  success: boolean | null;
  launchpad: string;
}

export interface Launchpad {
  id: string;
  name: string;
  locality: string;
}
