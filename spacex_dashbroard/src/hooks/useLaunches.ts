import { FiltersData, LaunchFilters, SimplifiedLaunch } from "@/types/spacex";
import { useEffect, useRef, useState } from "react";

export function useLaunches(
  filters: LaunchFilters,
  page: number = 1,
  limit: number = 9,
  requireFilters: boolean = false,
  disablePagination: boolean = false // <-- Nuevo parámetro
) {
  const [launches, setLaunches] = useState<SimplifiedLaunch[]>([]);
  const [filtersData, setFiltersData] = useState<FiltersData>({
    rockets: [],
    years: [],
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevFiltersRef = useRef(filters);

  useEffect(() => {
    const hasFilters =
      filters.rocket ||
      filters.success !== undefined ||
      (filters.search && filters.search.trim() !== "") ||
      filters.startDate ||
      filters.endDate;

    if (requireFilters && !hasFilters) {
      setLaunches([]);
      setTotalPages(1);
      setTotalDocs(0);
      return;
    }

    if (JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters)) {
      setLaunches([]);
      prevFiltersRef.current = filters;
    }

    const controller = new AbortController();
    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters.rocket) params.append("rocket", filters.rocket);
        if (filters.success !== undefined)
          params.append("success", String(filters.success));
        if (filters.search) params.append("search", filters.search);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);

        if (!disablePagination) {
          params.append("page", page.toString());
          params.append("limit", limit.toString());
        } else {
          params.append("pagination", "false"); // SIN PAGINACIÓN
        }

        const url = `/api/launches?${params.toString()}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("Error al cargar datos");

        const data: {
          launches: SimplifiedLaunch[];
          filtersData: FiltersData;
          pagination: { totalPages: number; totalDocs: number };
        } = await res.json();

        console.log(
          "Hook useLaunches > launches recibidos:",
          data.launches.map((l) => ({
            id: l.id,
            name: l.name,
            lat: l.launchpad.latitude,
            lng: l.launchpad.longitude,
          }))
        );

        setFiltersData(data.filtersData);
        setTotalPages(data.pagination.totalPages);
        setTotalDocs(data.pagination.totalDocs);

        setLaunches((prev) =>
          page === 1 || disablePagination
            ? data.launches
            : [...prev, ...data.launches]
        );
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error(err);
          setError("Error al cargar los lanzamientos");
        }
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(delayDebounce);
    };
  }, [filters, page, limit, requireFilters, disablePagination]);

  return { launches, filtersData, totalPages, totalDocs, loading, error };
}
