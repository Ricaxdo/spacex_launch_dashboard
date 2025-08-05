import { SimplifiedLaunch } from "@/types/spacex";
import { LaunchCard } from "./LauchCard";

export function LaunchList({ launches }: { launches: SimplifiedLaunch[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 xl:auto-rows-[260px] overflow-y-auto">
      {launches.map((launch) => (
        <LaunchCard key={launch.id} launch={launch} />
      ))}
    </div>
  );
}
