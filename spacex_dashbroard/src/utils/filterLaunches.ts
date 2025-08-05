import { Filters, SimplifiedLaunch } from "@/types/spacex";

export function filterLaunches(launches: SimplifiedLaunch[], filters: Filters) {
  return launches.filter((launch) => {
    const f = filters;

    // Si es null o undefined, lo tratamos como false
    const launchSuccess = launch.success === true;

    const matchRocket = f.rocket ? launch.rocket.id === f.rocket : true;
    const matchSuccess =
      f.success !== undefined ? launchSuccess === f.success : true;
    const matchSearch = f.search
      ? launch.name.toLowerCase().includes(f.search.toLowerCase())
      : true;
    const matchDate =
      f.startDate || f.endDate
        ? new Date(launch.date) >= new Date(f.startDate || "1900-01-01") &&
          new Date(launch.date) <= new Date(f.endDate || "2100-12-31")
        : true;

    return matchRocket && matchSuccess && matchSearch && matchDate;
  });
}
