import { SimplifiedLaunch } from "@/types/spacex";
import { useEffect, useState } from "react";

interface LaunchFilters {
  rocket?: string;
  success?: boolean;
  search?: string;
  startDate?: string;
  endDate?: string;
}

interface FiltersData {
  rockets: { id: string; name: string }[];
  years: number[];
}

export function useLaunches(filters: LaunchFilters) {
  const [launches, setLaunches] = useState<SimplifiedLaunch[]>([]);
  const [filtersData, setFiltersData] = useState<FiltersData>({
    rockets: [],
    years: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hasFilters =
      filters.rocket ||
      filters.success === true ||
      filters.success === false ||
      (filters.search && filters.search.trim() !== "") ||
      filters.startDate ||
      filters.endDate;

    const controller = new AbortController();
    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        // Construir la URL con los filtros
        const params = new URLSearchParams();
        if (filters.rocket) params.append("rocket", filters.rocket);
        if (filters.success !== undefined)
          params.append("success", String(filters.success));
        if (filters.search) params.append("search", filters.search);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);

        const url = `/api/launches?${params.toString()}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("Error al cargar datos");

        const data: { launches: SimplifiedLaunch[]; filtersData: FiltersData } =
          await res.json();

        // Guardamos lanzamientos y data para los selects
        setLaunches(hasFilters ? data.launches : []);
        setFiltersData(data.filtersData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error(err);
          setError("Error al cargar los lanzamientos");
        }
      } finally {
        setLoading(false);
      }
    }, 500); // Debounce: 500ms

    return () => {
      controller.abort();
      clearTimeout(delayDebounce);
    };
  }, [filters]);

  return { launches, filtersData, loading, error };
}
