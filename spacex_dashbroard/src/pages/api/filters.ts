import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const [rocketsRes, launchesRes] = await Promise.all([
      fetch("https://api.spacexdata.com/v4/rockets/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: {},
          options: { select: ["id", "name"] },
        }),
      }),
      fetch("https://api.spacexdata.com/v4/launches/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: {},
          options: { select: ["rocket", "date_utc"], pagination: false },
        }),
      }),
    ]);

    if (!rocketsRes.ok || !launchesRes.ok)
      throw new Error("Error al cargar filtros");

    const rocketsData: { docs: { id: string; name: string }[] } =
      await rocketsRes.json();
    const launchesData: { docs: { rocket: string; date_utc: string }[] } =
      await launchesRes.json();

    // Crear set con IDs de cohetes que tienen lanzamientos
    const usedRocketIds = new Set(launchesData.docs.map((l) => l.rocket));

    // Filtrar solo cohetes que están en lanzamientos
    const filteredRockets = rocketsData.docs.filter((rocket) =>
      usedRocketIds.has(rocket.id)
    );

    // Obtener años únicos
    const yearsSet = new Set<number>();
    launchesData.docs.forEach((l) => {
      yearsSet.add(new Date(l.date_utc).getFullYear());
    });

    res.status(200).json({
      rockets: filteredRockets,
      years: Array.from(yearsSet).sort((a, b) => b - a),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar filtros" });
  }
}
