import type {
  LaunchQuery,
  LaunchResponse,
  LaunchpadResponse,
  SimplifiedLaunch,
} from "@/types/spacex";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { rocket, success, search, startDate, endDate, page, limit } =
      req.query;

    // Construcción dinámica del query
    const query: LaunchQuery = {};
    if (rocket) query.rocket = rocket as string;
    if (success !== undefined) {
      query.success = success === "true" ? true : { $ne: true };
    }
    // Busqueda de texto con regex
    if (search) query.name = { $regex: search as string, $options: "i" };

    if (startDate || endDate) {
      query.date_utc = {};
      if (startDate) query.date_utc.$gte = startDate as string;
      if (endDate) query.date_utc.$lte = endDate as string;
    }
    // Opciones con paginación activada
    const options = {
      sort: { date_utc: "desc" },
      select: ["id", "name", "date_utc", "success", "launchpad", "rocket"],
      pagination: true,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 9,
    };

    const [launchesRes, padsRes, rocketsRes, allLaunchesRes] =
      await Promise.all([
        fetch("https://api.spacexdata.com/v4/launches/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, options }),
        }),
        fetch("https://api.spacexdata.com/v4/launchpads/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: {},
            options: {
              select: [
                "id",
                "name",
                "locality",
                "region",
                "latitude",
                "longitude",
              ],
            },
          }),
        }),
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
            options: { select: ["date_utc"], pagination: false },
          }),
        }),
      ]);

    if (!launchesRes.ok || !padsRes.ok || !rocketsRes.ok || !allLaunchesRes.ok)
      throw new Error("Error al consultar SpaceX API");

    const launchesData: {
      docs: LaunchResponse[];
      totalPages: number;
      page: number;
      totalDocs?: number;
    } = await launchesRes.json();

    const launchpadsData: { docs: LaunchpadResponse[] } = await padsRes.json();
    const rocketsData: { docs: { id: string; name: string }[] } =
      await rocketsRes.json();
    const allLaunchesData: { docs: { date_utc: string }[] } =
      await allLaunchesRes.json();
    // Mapeo de launchpads
    const padsMap: Record<
      string,
      {
        name: string;
        locality: string;
        region: string;
        latitude: number;
        longitude: number;
      }
    > = {};
    launchpadsData.docs.forEach((pad) => {
      padsMap[pad.id] = {
        name: pad.name,
        locality: pad.locality,
        region: pad.region,
        latitude: pad.latitude,
        longitude: pad.longitude,
      };
    });

    const rocketsMap: Record<string, { id: string; name: string }> = {};
    rocketsData.docs.forEach((rocket) => {
      rocketsMap[rocket.id] = { id: rocket.id, name: rocket.name };
    });
    // Simplificamos los lanzamientos filtrados
    const simplifiedLaunches: SimplifiedLaunch[] = launchesData.docs.map(
      (launch) => ({
        id: launch.id,
        name: launch.name,
        date: launch.date_utc,
        success: launch.success,
        rocket: rocketsMap[launch.rocket] || {
          id: launch.rocket,
          name: "Desconocido",
        },
        launchpad: padsMap[launch.launchpad] || {
          name: "Desconocido",
          locality: "",
          region: "",
          latitude: 0,
          longitude: 0,
        },
      })
    );
    // Filtros para selects
    const allRockets = rocketsData.docs.map((rocket) => ({
      id: rocket.id,
      name: rocket.name,
    }));
    const allYears = new Set<number>();
    allLaunchesData.docs.forEach((l) => {
      const year = new Date(l.date_utc).getFullYear();
      allYears.add(year);
    });

    const filtersData = {
      rockets: allRockets,
      years: Array.from(allYears).sort((a, b) => b - a),
    };
    // Incluimos info de paginación
    res.status(200).json({
      launches: simplifiedLaunches,
      filtersData,
      pagination: {
        totalPages: launchesData.totalPages,
        totalDocs: launchesData.totalDocs,
        currentPage: launchesData.page,
      },
    });
  } catch (error) {
    console.error(error, "> Error al obtener datos");
    res.status(500).json({ error: "Error al obtener datos de SpaceX" });
  }
}
