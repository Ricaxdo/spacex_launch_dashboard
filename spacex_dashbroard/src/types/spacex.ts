import { Dispatch, SetStateAction } from "react";

export interface LaunchQuery {
  rocket?: string;
  success?: boolean | { $ne: boolean };
  $text?: { $search: string };
  name?: { $regex: string; $options?: string };
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

export interface LaunchFilters {
  rocket?: string;
  success: boolean | null | undefined;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface FiltersData {
  rockets: { id: string; name: string }[];
  years: number[];
}

export interface MainContentProps {
  filters: {
    rocket: string;
    success: boolean | undefined;
    search: string;
    startDate: string;
    endDate: string;
  };
  setFilters: Dispatch<
    SetStateAction<{
      rocket: string;
      success: boolean | undefined;
      search: string;
      startDate: string;
      endDate: string;
    }>
  >;
  filtersData: { rockets: { id: string; name: string }[]; years: number[] };
  launches: SimplifiedLaunch[];
  hasFilters: boolean;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  totalDocs: number;
  onFeedback?: (msg: string) => void;
}

export interface HeaderProps {
  filters: {
    rocket: string;
    success: boolean | undefined;
    search: string;
    startDate: string;
    endDate: string;
  };
  setFilters: Dispatch<
    SetStateAction<{
      rocket: string;
      success: boolean | undefined;
      search: string;
      startDate: string;
      endDate: string;
    }>
  >;
  filtersData: { rockets: { id: string; name: string }[]; years: number[] };
  hasFilters: boolean;
  alwaysShowFilters?: boolean;
}

export interface Filters {
  rocket: string;
  success: boolean | undefined;
  search: string;
  startDate: string;
  endDate: string;
}

export interface SidebarProps {
  activeView: "launches" | "favorites";
  setActiveView: (view: "launches" | "favorites") => void;
}
