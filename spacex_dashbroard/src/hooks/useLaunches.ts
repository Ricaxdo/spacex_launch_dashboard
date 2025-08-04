import { SimplifiedLaunch } from "@/types/spacex";
import { useEffect, useState } from "react";

export function useLaunches() {
  const [launches, setLaunches] = useState<SimplifiedLaunch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/launches");
        if (!res.ok) throw new Error("Error al cargar datos");
        const data = await res.json();
        // Ordenar lanzamientos por fecha descendente
        const sorted = data.sort(
          (a: SimplifiedLaunch, b: SimplifiedLaunch) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setLaunches(sorted);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los lanzamientos");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { launches, loading, error };
}
