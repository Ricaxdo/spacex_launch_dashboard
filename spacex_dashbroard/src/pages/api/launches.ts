import type { Launch, Launchpad } from "@/types/spacex";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Pedimos los datos de lanzamientos y launchpads en paralelto
    const [launchesRes, padsRes] = await Promise.all([
      fetch("https://api.spacexdata.com/v4/launches"),
      fetch("https://api.spacexdata.com/v4/launchpads"),
    ]);

    const launches: Launch[] = await launchesRes.json();
    const launchpads: Launchpad[] = await padsRes.json();

    // Mapeamos para traducir el ID del launchpad a su nombre
    const padsMap: Record<string, string> = {};
    launchpads.forEach((pad) => {
      padsMap[pad.id] = pad.name;
    });

    // Transformamos la data en una versión simplificada
    const simplifiedLaunches = launches.map((launch) => ({
      id: launch.id,
      name: launch.name,
      date: launch.date_utc,
      success: launch.success,
      launchpad: padsMap[launch.launchpad] || "Desconocido", // Buscamos el nombre del launchpad
    }));

    res.status(200).json(simplifiedLaunches);
  } catch (error) {
    console.error(error, "> Error al obtener datos");
    res.status(500).json({ error: "Error al obtener datos de SpaceX" });
  }
}
