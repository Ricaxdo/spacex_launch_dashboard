export interface LaunchQuery {
  rocket?: string;
  success?: boolean;
  $text?: { $search: string };
  date_utc?: { $gte?: string; $lte?: string };
}

export interface LaunchResponse {
  id: string;
  name: string;
  date_utc: string;
  success: boolean;
  rocket: string;
  launchpad: string;
}

export interface LaunchpadResponse {
  id: string;
  name: string;
  locality: string;
  region: string;
}

export interface SimplifiedLaunch {
  id: string;
  name: string;
  date: string;
  success: boolean;
  rocket: {
    id: string;
    name: string;
  };
  launchpad: {
    name: string;
    locality: string;
    region: string;
  };
}
