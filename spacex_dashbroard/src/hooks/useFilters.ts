import { FiltersData } from "@/types/spacex";
import { useEffect, useState } from "react";

export function useFilters() {
  const [filtersData, setFiltersData] = useState<FiltersData>({
    rockets: [],
    years: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/filters");
        if (!res.ok) throw new Error("Error al cargar filtros");
        const data: FiltersData = await res.json();
        setFiltersData(data);
      } catch (error) {
        console.error(error);
        setError("Error al cargar filtros");
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  return { filtersData, loading, error };
}
