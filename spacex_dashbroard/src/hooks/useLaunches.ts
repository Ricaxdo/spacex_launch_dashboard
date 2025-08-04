import { FiltersData, LaunchFilters, SimplifiedLaunch } from "@/types/spacex";
import { useEffect, useState } from "react";

export function useLaunches(
  filters: LaunchFilters,
  page: number = 1,
  limit: number = 9
) {
  const [launches, setLaunches] = useState<SimplifiedLaunch[]>([]);
  const [filtersData, setFiltersData] = useState<FiltersData>({
    rockets: [],
    years: [],
  });
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Para saber si los filtros cambiaron
  const [prevFilters, setPrevFilters] = useState(filters);

  useEffect(() => {
    // Si los filtros cambiaron, limpiamos el listado y actualizamos el estado previo
    if (JSON.stringify(prevFilters) !== JSON.stringify(filters)) {
      setLaunches([]); // vacía los resultados antes de cargar nuevos
      setPrevFilters(filters);
    }

    const controller = new AbortController();
    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        // Construir URL
        const params = new URLSearchParams();
        if (filters.rocket) params.append("rocket", filters.rocket);
        if (filters.success !== undefined)
          params.append("success", String(filters.success));
        if (filters.search) params.append("search", filters.search);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        const url = `/api/launches?${params.toString()}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("Error al cargar datos");

        const data: {
          launches: SimplifiedLaunch[];
          filtersData: FiltersData;
          pagination: { totalPages: number };
        } = await res.json();

        setFiltersData(data.filtersData);
        setTotalPages(data.pagination.totalPages);

        // Si page = 1 reiniciamos, si no acumulamos
        setLaunches((prev) =>
          page === 1 ? data.launches : [...prev, ...data.launches]
        );
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error(err);
          setError("Error al cargar los lanzamientos");
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(delayDebounce);
    };
  }, [filters, page, limit]);

  return { launches, filtersData, totalPages, loading, error };
}
